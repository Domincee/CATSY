# Catsy Coffee

Welcome to the Catsy Coffee project! This repository contains a full-stack application featuring a FastAPI backend, a React web frontend, and a Flutter mobile app.

---

## 🚀 Quick Start / Installation Guide

### 1. Clone the Repository
```bash
git clone https://github.com/Domincee/CATSY.git
cd CATSY
```

### 2. Backend Setup (FastAPI)
The backend provides the API bridge and connects to Supabase.
```bash
cd catsy-backend

# Create and activate a virtual environment
python3 -m venv venv
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Run the server
uvicorn app.main:app --reload
```
*The API will be available at `http://localhost:8000`*

### 3. Web Frontend Setup (React/Vite)
The web application is built with React and Vite.
```bash
cd catsy-web

# Install dependencies
npm install

# Run the development server
npm run dev
```
*The web app will run at `http://localhost:5173`*

### 4. Mobile App Setup (Flutter)
The mobile application is built with Flutter and targets iOS and Android.
```bash
cd catsy-mobile

# Install packages
flutter pub get

# Run the app (ensure you have an emulator running or device connected)
flutter run
```

---


MAKE SURE TO RUN THE BACKEND WHEN RUNNING THE FRONTEND OR MOBILE APP
