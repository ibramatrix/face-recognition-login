import json
from fastapi import FastAPI, HTTPException, Body, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
import numpy as np

from .config import settings
from .db import engine, Base, get_db
from .models import User
from .auth import create_access_token, decode_token
from . import face_utils

Base.metadata.create_all(bind=engine)

app = FastAPI(title="FaceAuth API (Liveness+SQL)")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # for dev only — restrict in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ---- Schemas expected:
# POST /register
# { "username": "user1", "frames_b64": ["data:...,", ...] }
#
# POST /login
# { "username": "user1", "frames_b64": ["...", ...] }
#
# GET /me?token=...


@app.post("/register")
def register(payload: dict = Body(...), db: Session = Depends(get_db)):
    username = payload.get("username")
    frames_b64 = payload.get("frames_b64", [])
    if not username or not frames_b64:
        raise HTTPException(status_code=400, detail="username and frames_b64 required")

    # check existing username
    if db.query(User).filter(User.username == username).first():
        raise HTTPException(status_code=409, detail="username exists")

    # convert frames to images
    frames = []
    for b in frames_b64[:settings.FRAME_BATCH]:
        img = face_utils.b64_to_bgr(b)
        if img is not None:
            frames.append(img)
    if not frames:
        raise HTTPException(status_code=400, detail="no valid frames")

    # liveness
    if not face_utils.check_liveness(frames):
        raise HTTPException(status_code=400, detail="liveness failed (please blink)")

    # compute embeddings for each frame and average
    embs = []
    for f in frames:
        e = face_utils.embedding_from_bgr(f)
        if e is not None:
            embs.append(e)
    if not embs:
        raise HTTPException(status_code=400, detail="could not extract face embedding")

    avg_embedding = face_utils.average_embeddings(embs)
    if avg_embedding is None:
        raise HTTPException(status_code=400, detail="embedding failed")

    # --- Check if face already exists ---
    existing_users = db.query(User).all()
    for u in existing_users:
        stored_emb = json.loads(u.embedding_json)
        if face_utils.is_match(stored_emb, avg_embedding, tol=settings.MATCH_TOLERANCE):
            raise HTTPException(status_code=409, detail="Face already registered")

    # store as JSON list (float)
    user = User(
        username=username,
        embedding_json=json.dumps(avg_embedding.astype(float).tolist())
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return {"status": "ok", "message": "registered", "username": username}


@app.post("/login")
def login(payload: dict = Body(...), db: Session = Depends(get_db)):
    username = payload.get("username")
    frames_b64 = payload.get("frames_b64", [])
    if not username or not frames_b64:
        raise HTTPException(status_code=400, detail="username and frames_b64 required")

    user = db.query(User).filter(User.username == username).first()
    if not user:
        raise HTTPException(status_code=404, detail="user not found")

    # convert frames
    frames = []
    for b in frames_b64[:settings.FRAME_BATCH]:
        img = face_utils.b64_to_bgr(b)
        if img is not None:
            frames.append(img)
    if not frames:
        raise HTTPException(status_code=400, detail="no valid frames")

    # liveness
    if not face_utils.check_liveness(frames):
        raise HTTPException(status_code=400, detail="liveness failed (please blink)")

    # embedding candidate
    embs = []
    for f in frames:
        e = face_utils.embedding_from_bgr(f)
        if e is not None:
            embs.append(e)
    if not embs:
        raise HTTPException(status_code=400, detail="could not extract face embedding")

    avg_candidate = face_utils.average_embeddings(embs)
    stored = json.loads(user.embedding_json)
    match = face_utils.is_match(stored, avg_candidate, tol=settings.MATCH_TOLERANCE)
    if not match:
        raise HTTPException(status_code=401, detail="face did not match")

    token = create_access_token(subject=user.username)
    return {"status": "ok", "token": token, "username": user.username}


@app.get("/me")
def me(token: str):
    try:
        payload = decode_token(token)
        return {"username": payload["sub"]}
    except Exception:
        raise HTTPException(status_code=401, detail="invalid token")

