from datetime import datetime, timedelta
from jose import jwt
from .config import settings

def create_access_token(subject: str, expires_minutes: int = None):
    expires = datetime.utcnow() + timedelta(minutes=expires_minutes or settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode = {"sub": subject, "exp": expires}
    return jwt.encode(to_encode, settings.JWT_SECRET, algorithm=settings.JWT_ALGO)

def decode_token(token: str):
    return jwt.decode(token, settings.JWT_SECRET, algorithms=[settings.JWT_ALGO])
