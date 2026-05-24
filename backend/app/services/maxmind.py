import httpx
import base64
from typing import Optional

from app.core.config import settings
from app.core.logging import get_logger

logger = get_logger(__name__)

import re

async def check_ip_allowed(ip: Optional[str], phone: str) -> bool:
    """
    Check if the given IP is allowed to place an order.
    Allowed if:
      - phone is whitelisted
      - IP is from allowed country
      - IP is not a VPN
      - IP is not suspicious (if we can detect it, MaxMind minFraud or City Insights gives some traits)
    """
    cleaned_phone = re.sub(r"[\s\-().+]", "", phone.strip())
    if settings.WHITELISTED_PHONE and cleaned_phone.endswith(settings.WHITELISTED_PHONE):
        return True

    # Allow specific IPs configured in environment (comma-separated)
    try:
        if settings.whitelisted_ips and ip and ip in settings.whitelisted_ips:
            return True
    except Exception:
        pass

    # If no IP, we might reject or allow. Let's reject to be safe, or allow? 
    # Usually if we can't get IP we might allow it, but let's be strict or let's allow if local
    if not ip or ip in ("127.0.0.1", "::1", "localhost"):
        if settings.is_production:
            # Maybe return False in production if no IP? But let's let it slide if no IP to avoid blocking valid traffic that somehow lost IP
            pass
        return True

    if not settings.MAXMIND_ACCOUNT_ID or not settings.MAXMIND_LICENSE_KEY:
        # If not configured, allow
        return True

    try:
        # Use GeoLite2 Country API endpoint to support free tier accounts
        url = f"https://geolite.info/geoip/v2.1/country/{ip}"
        auth = httpx.BasicAuth(settings.MAXMIND_ACCOUNT_ID, settings.MAXMIND_LICENSE_KEY)
        
        async with httpx.AsyncClient() as client:
            response = await client.get(url, auth=auth, timeout=5.0)
            
            if response.status_code != 200:
                logger.error("maxmind_api_error", status=response.status_code, body=response.text)
                # If MaxMind fails, fallback to allow to not block sales
                return True
                
            data = response.json()
            
            # Check country
            country_iso = data.get("country", {}).get("iso_code")
            if settings.ALLOWED_COUNTRY and country_iso != settings.ALLOWED_COUNTRY:
                logger.warning("maxmind_rejected_country", ip=ip, country=country_iso, expected=settings.ALLOWED_COUNTRY)
                return False
                
            # Check VPN/proxy traits if available
            traits = data.get("traits", {})
            is_vpn = traits.get("is_anonymous_vpn", False)
            is_proxy = traits.get("is_anonymous_proxy", False)
            is_tor = traits.get("is_tor_exit_node", False)
            
            if is_vpn or is_proxy or is_tor:
                logger.warning("maxmind_rejected_suspicious", ip=ip, traits=traits)
                return False
                
            # Additional platform check (ProxyCheck)
            if settings.PROXYCHECK_API_KEY:
                proxycheck_url = f"https://proxycheck.io/v2/{ip}?key={settings.PROXYCHECK_API_KEY}&vpn=1"
                try:
                    async with httpx.AsyncClient() as client_pc:
                        pc_response = await client_pc.get(proxycheck_url, timeout=5.0)
                        if pc_response.status_code == 200:
                            pc_data = pc_response.json()
                            if pc_data.get("status") == "ok":
                                ip_data = pc_data.get(ip, {})
                                if ip_data.get("proxy") == "yes":
                                    logger.warning("proxycheck_rejected_vpn", ip=ip)
                                    return False
                except Exception as e:
                    logger.error("proxycheck_api_exception", error=str(e))
                
            return True
            
    except Exception as e:
        logger.error("maxmind_api_exception", error=str(e))
        return True
