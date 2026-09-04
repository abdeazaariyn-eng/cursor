import httpx
import re
import time
from typing import Optional

from app.core.config import settings
from app.core.logging import get_logger

logger = get_logger(__name__)

# Every order request blocks on this check, so repeated lookups for the same
# IP (common: retries, same customer, office/shared IPs) are cached briefly
# to avoid paying the MaxMind/ProxyCheck network round-trip every time.
_IP_CACHE_TTL = 300  # seconds
_IP_CACHE_MAX_ENTRIES = 2000
_ip_cache: dict[str, tuple[float, bool]] = {}


def _get_cached_ip_result(ip: str) -> Optional[bool]:
    cached = _ip_cache.get(ip)
    if cached and (time.monotonic() - cached[0]) < _IP_CACHE_TTL:
        return cached[1]
    return None


def _set_cached_ip_result(ip: str, allowed: bool) -> None:
    now = time.monotonic()
    if len(_ip_cache) >= _IP_CACHE_MAX_ENTRIES:
        expired = [k for k, (ts, _) in _ip_cache.items() if (now - ts) >= _IP_CACHE_TTL]
        for k in expired:
            _ip_cache.pop(k, None)
        if len(_ip_cache) >= _IP_CACHE_MAX_ENTRIES:
            # Still full after sweeping expired entries: drop oldest.
            for k in list(_ip_cache.keys())[: len(_ip_cache) - _IP_CACHE_MAX_ENTRIES + 1]:
                _ip_cache.pop(k, None)
    _ip_cache[ip] = (now, allowed)


async def check_ip_allowed(ip: Optional[str], phone: str) -> bool:
    """
    Check if the given IP is allowed to place an order.
    Allowed if:
      - phone is whitelisted
      - IP is from allowed country
      - IP is not a VPN/proxy/Tor
    """
    cleaned_phone = re.sub(r"[\s\-().+]", "", phone.strip())

    # Block specific IPs configured in environment (comma-separated)
    try:
        if settings.blocked_ips and ip and ip in settings.blocked_ips:
            logger.warning("blocked_ip", ip=ip)
            return False
    except Exception:
        pass

    # If no IP or local IP, block in production (strict policy)
    if not ip or ip in ("127.0.0.1", "::1", "localhost"):
        if settings.is_production:
            logger.warning("no_ip_blocked_in_prod", ip=ip)
            return False
        return True

    # Whitelisted phone bypass - checked early to allow test phone without geo checks
    if settings.WHITELISTED_PHONE and cleaned_phone.endswith(settings.WHITELISTED_PHONE):
        logger.info("whitelisted_phone_bypass", phone=cleaned_phone)
        return True

    # Allow specific IPs configured in environment (comma-separated)
    try:
        if settings.whitelisted_ips and ip and ip in settings.whitelisted_ips:
            logger.info("whitelisted_ip_allowed", ip=ip)
            return True
    except Exception:
        pass

    cached_result = _get_cached_ip_result(ip)
    if cached_result is not None:
        logger.info("maxmind_cache_hit", ip=ip, allowed=cached_result)
        return cached_result

    # Require MaxMind to be configured for geo-enforcement; block if missing
    if not settings.MAXMIND_ACCOUNT_ID or not settings.MAXMIND_LICENSE_KEY:
        logger.warning("maxmind_not_configured_blocking", ip=ip)
        return False

    try:
        # Use GeoLite2 Country API endpoint to support free tier accounts
        url = f"https://geolite.info/geoip/v2.1/country/{ip}"
        auth = httpx.BasicAuth(settings.MAXMIND_ACCOUNT_ID, settings.MAXMIND_LICENSE_KEY)

        async with httpx.AsyncClient() as client:
            response = await client.get(url, auth=auth, timeout=5.0)

            if response.status_code != 200:
                logger.error("maxmind_api_error", status=response.status_code, body=response.text)
                # Strict: block if MaxMind API fails
                _set_cached_ip_result(ip, False)
                return False

            data = response.json()

            # Check country
            country_iso = data.get("country", {}).get("iso_code")
            if settings.ALLOWED_COUNTRY and country_iso != settings.ALLOWED_COUNTRY:
                logger.warning(
                    "maxmind_rejected_country",
                    ip=ip,
                    country=country_iso,
                    expected=settings.ALLOWED_COUNTRY,
                )
                _set_cached_ip_result(ip, False)
                return False

            # Check VPN/proxy traits if available
            traits = data.get("traits", {})
            is_vpn = traits.get("is_anonymous_vpn", False)
            is_proxy = traits.get("is_anonymous_proxy", False)
            is_tor = traits.get("is_tor_exit_node", False)

            if is_vpn or is_proxy or is_tor:
                logger.warning(
                    "maxmind_rejected_suspicious",
                    ip=ip,
                    is_vpn=is_vpn,
                    is_proxy=is_proxy,
                    is_tor=is_tor,
                )
                _set_cached_ip_result(ip, False)
                return False

            # Additional platform check (ProxyCheck) if configured
            if settings.PROXYCHECK_API_KEY:
                proxycheck_url = (
                    f"https://proxycheck.io/v2/{ip}?key={settings.PROXYCHECK_API_KEY}&vpn=1"
                )
                try:
                    async with httpx.AsyncClient() as client_pc:
                        pc_response = await client_pc.get(proxycheck_url, timeout=5.0)
                        if pc_response.status_code == 200:
                            pc_data = pc_response.json()
                            if pc_data.get("status") == "ok":
                                ip_data = pc_data.get(ip, {})
                                if ip_data.get("proxy") == "yes":
                                    logger.warning("proxycheck_rejected_vpn", ip=ip)
                                    _set_cached_ip_result(ip, False)
                                    return False
                except Exception as e:
                    logger.error("proxycheck_api_exception", error=str(e))

            logger.info("maxmind_allowed", ip=ip, country=country_iso)
            _set_cached_ip_result(ip, True)
            return True

    except Exception as e:
        logger.error("maxmind_api_exception", error=str(e))
        return False
