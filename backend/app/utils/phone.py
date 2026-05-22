"""Phone formatting utilities."""


def mask_phone_for_display(phone: str) -> str:
    """
    Mask phone number for display on public thank-you page.
    Example: +965 51234567 -> +965 51•• ••67
    """
    if not phone:
        return ""
    
    # Clean: remove spaces, dashes, etc.
    clean = phone.replace(" ", "").replace("-", "").replace("+", "")
    
    # If less than 8 digits, just return as-is (safety fallback)
    if len(clean) < 8:
        return phone
    
    # Keep first 3 digits, last 2; mask the middle
    first_part = clean[:3]
    last_part = clean[-2:]
    masked = f"+{first_part}•• ••{last_part}"
    
    return masked


def format_phone_for_api(phone: str) -> str:
    """Format phone with +965 country code and spaces for readability."""
    if not phone:
        return ""
    
    clean = phone.replace(" ", "").replace("-", "").replace("+", "")
    
    # Kuwait is +965
    if not clean.startswith("965"):
        # If it starts with 0, assume Kuwait domestic format
        if clean.startswith("0"):
            clean = "965" + clean[1:]
        else:
            clean = "965" + clean
    
    # Format: +965 5XXXX XXXX (phone is usually 8 digits after 965)
    if len(clean) == 11 and clean.startswith("965"):
        formatted = f"+{clean[:3]} {clean[3:5]}{clean[5:9]} {clean[9:11]}"
        return formatted
    
    return f"+{clean}"
