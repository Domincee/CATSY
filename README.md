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

## 🗄️ API Data Structures

### Product Model
Both the Web and Mobile applications share a standardized `Product` model. The `GET /api/products` endpoint returns JSON arrays populated with objects matching this shape:

```json
{
  "id": 1,
  "product_name": "Espresso",
  "price": 3.50,
  "image_url": "https://example.com/espresso.png"
}
```

#### Flutter / Mobile Usage
The Flutter SDK includes a `Product.fromJson` factory that automatically parses `product_name` to `product.name` and `image_url` to `product.imageUrl` to guarantee type safety and idiomatic Dart syntax. Developers can access `product.name` directly instead of referencing `json['product_name']`.

#### React / Web Usage
Web developers using `api.js` will receive the raw JSON format above. Standardize components to use `.product_name` and `.image_url` or map them to camelCase at the query level if preferred.
