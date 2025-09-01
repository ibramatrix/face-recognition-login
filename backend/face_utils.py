"""
Utilities:
- compute embeddings using face_recognition (dlib)
- liveness via mediapipe FaceMesh -> Eye Aspect Ratio (EAR) blink detection
"""

import base64
import cv2
import numpy as np
import mediapipe as mp
import face_recognition
import json
from scipy.spatial.distance import cosine
from .config import settings

mp_face_mesh = mp.solutions.face_mesh

# Face embedding using face_recognition (dlib)
def embedding_from_bgr(image_bgr):
    rgb = cv2.cvtColor(image_bgr, cv2.COLOR_BGR2RGB)
    encs = face_recognition.face_encodings(rgb)
    if not encs:
        return None
    return encs[0]  # 128-d vector (face_recognition default)

def average_embeddings(list_embeddings):
    arrs = [np.array(e) for e in list_embeddings if e is not None]
    if len(arrs) == 0:
        return None
    avg = np.mean(np.stack(arrs, axis=0), axis=0)
    return avg

def is_match(known_emb, candidate_emb, tol=None):
    tol = tol if tol is not None else settings.MATCH_TOLERANCE
    # face_recognition.compare_faces uses euclidean dist threshold; use face_recognition.face_distance
    dist = np.linalg.norm(np.array(known_emb) - np.array(candidate_emb))
    return float(dist) <= float(tol)

# --- Liveness: blink detection via EAR on face mesh landmarks ---
LEFT_EYE_IDX = [33, 160, 158, 133, 153, 144]
RIGHT_EYE_IDX = [263, 387, 385, 362, 380, 373]

def ear_from_landmarks(pts):
    # pts: 6x2 np array
    def dist(a,b): return np.linalg.norm(a-b)
    p0,p1,p2,p3,p4,p5 = pts
    return (dist(p1,p5) + dist(p2,p4)) / (2.0 * (dist(p0,p3) + 1e-8))

def count_blinks(frames_bgr):
    blink_count = 0
    prev_closed = False
    EAR_THRESHOLD = 0.18  # tune if needed
    with mp_face_mesh.FaceMesh(static_image_mode=False, max_num_faces=1, refine_landmarks=True) as mesh:
        for f in frames_bgr:
            rgb = cv2.cvtColor(f, cv2.COLOR_BGR2RGB)
            res = mesh.process(rgb)
            if not res.multi_face_landmarks:
                continue
            lm = res.multi_face_landmarks[0].landmark
            h, w, _ = f.shape
            def pick(idx_list):
                return np.array([[lm[i].x * w, lm[i].y * h] for i in idx_list], dtype=np.float32)
            left_pts = pick(LEFT_EYE_IDX)
            right_pts = pick(RIGHT_EYE_IDX)
            left_ear = ear_from_landmarks(left_pts)
            right_ear = ear_from_landmarks(right_pts)
            ear = (left_ear + right_ear) / 2.0
            closed = ear < EAR_THRESHOLD
            if closed and not prev_closed:
                prev_closed = True
            elif (not closed) and prev_closed:
                blink_count += 1
                prev_closed = False
    return blink_count

def check_liveness(frames_bgr):
    blinks = count_blinks(frames_bgr)
    return blinks >= settings.MIN_BLINKS

# Helpers for frames in base64 strings
def b64_to_bgr(b64str):
    # b64 string may be "data:image/jpeg;base64,...."
    if "," in b64str:
        b64str = b64str.split(",",1)[1]
    data = base64.b64decode(b64str)
    arr = np.frombuffer(data, dtype=np.uint8)
    img = cv2.imdecode(arr, flags=cv2.IMREAD_COLOR)
    return img
