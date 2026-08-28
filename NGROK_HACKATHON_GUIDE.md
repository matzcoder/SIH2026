# 🚀 Hackathon Ngrok Deployment & Live Demo Guide

This guide explains how to deploy and share your **Legal Metrology Packaged Commodities Compliance System** over the internet using **Ngrok** for hackathon presentations, mobile phone camera testing, and remote judge evaluation.

---

## 📋 Architecture Overview

When using Ngrok during a hackathon:
1. **Backend (Port 5000)** runs FastAPI (OCR scanning, rule verification, SQLite database).
2. **Frontend (Port 3000)** runs React (Inspector UI, Authority UI, real-time checklist).
3. **Ngrok Tunnel** creates secure public HTTPS URLs (e.g. `https://xxxx.ngrok-free.app`) that can be opened on any phone, tablet, or external laptop anywhere in the world.

---

## ⚡ Quickstart (3 Simple Steps)

### Step 1: Start Backend & Frontend
Double-click `start_services.bat` or run in two terminal tabs:

**Tab 1 — Backend**:
```bash
cd Backend
py -m uvicorn main:app --reload --host 0.0.0.0 --port 5000
```

**Tab 2 — Frontend**:
```bash
cd sih-project
npm start
```

---

### Step 2: Launch Ngrok Tunnels

You can use either the **Ngrok CLI** or run it directly using **`npx ngrok`** (no installation required).

#### Option A: Using `npx ngrok` (Zero-install method)

Open two terminal windows:

**Terminal 1 — Backend Tunnel (Port 5000)**:
```bash
npx -y ngrok http 5000
```
> 📌 *Copy the generated HTTPS URL, e.g.:* `https://abc-123.ngrok-free.app`

**Terminal 2 — Frontend Tunnel (Port 3000)**:
```bash
npx -y ngrok http 3000
```
> 📌 *Copy the generated HTTPS URL, e.g.:* `https://xyz-456.ngrok-free.app`

---

#### Option B: Using `ngrok.yml` (Single command for both ports)

If you have downloaded `ngrok.exe`:
```bash
ngrok start --all --config ngrok.yml
```

---

### Step 3: Link Frontend to the Ngrok Backend

Open `sih-project/.env` and update `REACT_APP_API_URL` to your backend's ngrok URL:
```env
REACT_APP_API_URL=https://abc-123.ngrok-free.app/api
```
Restart the React frontend (`npm start`).

> 💡 **Hackathon Pro-Tip (Dynamic Runtime URL Switching)**:  
> You can also change the backend URL directly in the browser console on any device without rebuilding:
> ```js
> localStorage.setItem("API_BASE_URL", "https://abc-123.ngrok-free.app/api");
> location.reload();
> ```

---

## 🛡️ Built-in Ngrok Optimizations & Compatibility

We have already baked in all necessary ngrok production compatibility features:

1. **Ngrok Interstitial Warning Bypass**:  
   All Axios requests in [`sih-project/src/services/api.js`](file:///d:/SIH2026/SIH2026/sih-project/src/services/api.js) automatically send `ngrok-skip-browser-warning: "true"`, preventing the free-tier warning page from breaking API requests.

2. **Full Dynamic CORS Support**:  
   [`Backend/main.py`](file:///d:/SIH2026/SIH2026/Backend/main.py) uses regex CORS matching (`allow_origin_regex=r"https?://.*"`) to seamlessly accept requests from any `*.ngrok-free.app`, `*.ngrok.app`, and local IP addresses with credentials allowed.

3. **Disabled Webpack Host Checking**:  
   [`sih-project/.env`](file:///d:/SIH2026/SIH2026/sih-project/.env) includes `DANGEROUSLY_DISABLE_HOST_CHECK=true` and `HOST=0.0.0.0`, preventing `Invalid Host Header` errors when React is viewed over Ngrok.

4. **Media & Image URL Resolvers**:  
   The `getMediaUrl()` utility automatically translates relative `/uploads/...` paths to the active backend tunnel domain.

---

## 👥 Demo Logins for Hackathon Evaluators

| Role | Email | Password | Recommended Demo Path |
| :--- | :--- | :--- | :--- |
| **Field Inspector** | `inspector@example.com` | `Inspector@123` | Scan Product ➔ Upload Evidence ➔ Check Rules ➔ Submit Report |
| **Regulatory Authority** | `admin@example.com` | `Admin@123` | Rules Manager ➔ Amendments Approval ➔ Analytics Dashboard |

---

## 📱 Mobile Camera / Field Testing

When opening the React frontend on a smartphone via the Ngrok URL:
1. Navigate to **Inspector ➔ Scan Product** or **Upload Evidence**.
2. Tap the upload area — smartphones will automatically trigger the native camera app so you can take real-time photos of actual consumer goods packages (biscuits, oil packets, milk cartons).
3. The photo will upload directly through the tunnel to the OCR pipeline for instant compliance verification.
