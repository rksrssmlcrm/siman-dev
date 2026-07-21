import hashlib

from slowapi import Limiter
from slowapi.util import get_remote_address


def _rate_limit_key(request) -> str:
    ip = get_remote_address(request)
    return hashlib.sha256(f"lead:{ip}".encode()).hexdigest()


# Default limit; overridden in create_app() from settings.rate_limit_leads.
limiter = Limiter(key_func=_rate_limit_key, default_limits=["5/minute"])
