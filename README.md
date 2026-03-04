# ☕ Catsy Coffee — Full Stack Project

Welcome to the Catsy Coffee project! This repository contains three apps working together:
- **`catsy-backend`** — FastAPI server (connects to Supabase)
- **`catsy-web`** — React + Vite web storefront & admin panel
- **`catsy-mobile`** — Flutter POS app for staff

> ⚠️ **IMPORTANT: Always run the backend BEFORE starting the web or mobile apps!**
> 📖 **Also read `MUSTREAD.md` for the team workflow guide.**

---

## � Prerequisites

Make sure you have these installed before you start:

| Tool | Required For | Check your version |
|---|---|---|
| Python 3.10+ | Backend | `python3 --version` |
| Node.js 18+ | Web app | `node --version` |
| Flutter 3+ | Mobile app | `flutter --version` |
| Git | Everything | `git --version` |

---

## 🚀 Setup Guide (Step by Step)

### Step 1: Clone the Repository

```bash
git clone https://github.com/Domincee/CATSY.git
cd CATSY
```

---

### Step 2: Backend Setup (FastAPI)

```bash
cd catsy-backend

# Create and activate a virtual environment
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Start the API server
uvicorn app.main:app --reload
```

✅ The API will be available at: **`http://localhost:8000`**

---

### Step 3: Web App Setup (React + Vite)

#### 3a. Create your `.env` file
The web app needs to know where the backend is running. Create a `.env` file inside the `catsy-web` folder:

```bash
# Inside catsy-web/.env
VITE_API_URL=http://127.0.0.1:8000
```

> **Note:** A `.env.example` may be provided for reference. Never commit your `.env` file to Git.

#### 3b. Install and run

```bash
cd catsy-web

npm install
npm run dev
```

✅ The web app will be available at: **`http://localhost:5173`**

---

### Step 4: Mobile App Setup (Flutter)

```bash
cd catsy-mobile

# Install Flutter packages
flutter pub get

# Run on an emulator or connected device
flutter run
```

> ⚠️ **Device Note:**
> - **Android Emulator** → API connects to `http://10.0.2.2:8000` *(automatically)*
> - **Physical Android/iOS Device** → You must edit `lib/services/api_service.dart` and replace `10.0.2.2` with your **computer's local IP address** (e.g., `192.168.1.x`). Find your IP with `ip addr` (Linux/Mac) or `ipconfig` (Windows).

✅ The app will launch on your connected device or emulator.

---

## 🔑 Running All Three (Normal Dev Session)

Open **3 separate terminals** and run each command:

```bash
# Terminal 1 — Backend
cd catsy-backend && source venv/bin/activate && uvicorn app.main:app --reload

# Terminal 2 — Web
cd catsy-web && npm run dev

# Terminal 3 — Mobile
cd catsy-mobile && flutter run
```
