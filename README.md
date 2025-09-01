# face-recognition-login
A secure authentication system that allows users to register and log in using facial recognition. Built with a Linux backend (FastAPI + SQLite) and a Windows frontend, this project demonstrates a modern, passwordless authentication method.


# 🔐 Face Recognition Authentication System

[![License](https://img.shields.io/github/license/ibramatrix/face-auth)](LICENSE)  
[![Issues](https://img.shields.io/github/issues/ibramatrix/face-auth)](https://github.com/ibramatrix/face-auth/issues)  
[![Stars](https://img.shields.io/github/stars/ibramatrix/face-auth?style=social)](https://github.com/ibramatrix/face-auth/stargazers)  
[![Forks](https://img.shields.io/github/forks/ibramatrix/face-auth?style=social)](https://github.com/ibramatrix/face-auth/network/members)  
[![Contributions welcome](https://img.shields.io/badge/contributions-welcome-brightgreen.svg)](CONTRIBUTING.md)  

## 📌 Overview

This is a **Face Recognition Authentication System** that allows users to **register and login using their face**.  
- Backend: Python (FastAPI/Django/Flask) running on **Linux server**  
- Frontend: React running on **Windows**  
- Authentication is handled via **face embeddings** and stored securely in the database.  

## 🚀 Features

✅ Face-based **registration**  
✅ Face-based **login**  
✅ Cross-platform (Linux backend + Windows frontend)  
✅ Simple REST API integration  
✅ Secure & scalable design  

## 📂 Project Structure

face-auth/
│── backend/ # FastAPI/Django backend (face recognition + API endpoints)
│── frontend/ # React frontend
│── requirements.txt # Python dependencies
│── package.json # React dependencies
│── README.md # Project documentation

🛠️ Tech Stack

Backend: FastAPI (Python) + OpenCV + Face Recognition Library

Frontend: React (Vite)

Database: SQLite / PostgreSQL / MySQL (your choice)



## ⚙️ Installation

### 🔧 Backend (Linux)

```bash
# Clone repo
git clone https://github.com/ibramatrix/face-auth.git
cd face-auth/backend

# Create virtual environment
python3 -m venv venv
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Run server
uvicorn main:app --host 0.0.0.0 --port 8000 --reload

💻 Frontend (Windows)

cd face-auth/frontend

# Install dependencies
npm install

# Run React app
npm run dev




