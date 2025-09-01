import os

class Settings:
    DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./face_auth.db")
    JWT_SECRET = os.getenv("JWT_SECRET", "change_this_secret")
    JWT_ALGO = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES = 60

    # Liveness & recognition params
    FRAME_BATCH = 20             # number of frames to send for liveness/embedding
    MIN_BLINKS = 1               # minimal blinks for liveness
    MATCH_TOLERANCE = 0.5        # face-recognition tolerance (lower = strict)

settings = Settings()

