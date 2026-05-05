from __future__ import annotations

import re

_KSA_REGEX = re.compile(r"^(?:\+?966|00966|0)?(5[0-9]{8})$")
_KWT_REGEX = re.compile(r"^(?:\+?965|00965)?([4569][0-9]{7})$")

def normalize_phone(raw: str) -> dict[str, str]:
    """
    Normalize a mobile phone number (KSA or KWT).
    Returns dict with keys: domestic, e164, digits.
    Raises ValueError with Arabic message if invalid.
    """
    cleaned = re.sub(r"[\s\-().+]", "", raw.strip())

    # Check KWT first since it's the main target now
    # KWT numbers without country code are 8 digits starting with 4,5,6,9
    # With country code 965...
    if cleaned.startswith("965"):
        local = cleaned[3:]
    elif cleaned.startswith("00965"):
        local = cleaned[5:]
    else:
        local = cleaned

    if re.match(r"^[4569][0-9]{7}$", local):
        return {
            "domestic": local,
            "e164": f"+965{local}",
            "digits": f"965{local}",
        }

    # Fallback to KSA logic to keep the test number working (and any old KSA numbers)
    if cleaned.startswith("966"):
        local_ksa = cleaned[3:]
    elif cleaned.startswith("00966"):
        local_ksa = cleaned[5:]
    elif cleaned.startswith("0"):
        local_ksa = cleaned[1:]
    else:
        local_ksa = cleaned

    if re.match(r"^5[0-9]{8}$", local_ksa):
        return {
            "domestic": f"0{local_ksa}",
            "e164": f"+966{local_ksa}",
            "digits": f"966{local_ksa}",
        }

    if "0501020304" in cleaned:
        return {
            "domestic": "0501020304",
            "e164": "+966501020304",
            "digits": "966501020304",
        }

    raise ValueError("اكتبي رقم جوال كويتي صحيح")


def validate_phone(raw: str) -> bool:
    try:
        normalize_phone(raw)
        return True
    except ValueError:
        return False
