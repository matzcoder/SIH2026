# ⚛️ LM-Vision Frontend — React Application

> Modern, responsive web interface for the **LM-Vision Legal Metrology Compliance System** (SIH 2026).  
> Built with **React 19**, **Lucide Icons**, and **Axios**.

---

## 📖 Overview

The `sih-project` folder contains the frontend Single Page Application (SPA). It provides dual role-based dashboards:
1. **👑 Authority Portal**: High-level market compliance analytics, inspector task assignment, consumer grievances tracking, and dynamic rule management.
2. **🕵️ Inspector Portal**: Real-time product label scanning, camera capture, live OCR field detection with bounding boxes, inspection checklists, and PDF report downloads.

---

## 🚀 Quick Start for Beginners

### 1. Prerequisites
- **Node.js** (v18.0.0 or higher recommended): [Download Node.js](https://nodejs.org/)
- Running **FastAPI Backend** on `http://localhost:5000` (See [Root README](../README.md#step-2-start-the-backend-terminal-1))

### 2. Install Dependencies
Open your terminal in this directory (`sih-project`):
```bash
npm install
```

### 3. Start the Development Server
```bash
npm start
```
The app will automatically open in your default browser at **`http://localhost:3000`**.

---

## 🛠️ Available Scripts

In this directory, you can run:

### `npm start`
Runs the app in development mode at [http://localhost:3000](http://localhost:3000).  
The page will automatically reload whenever you edit and save any code file.

### `npm run build`
Builds the app for production to the `build` folder.  
It correctly bundles React in production mode and optimizes the build for the best performance and smallest bundle size.

### `npm test`
Launches the test runner in interactive watch mode.

---

## 📁 Frontend Directory Structure

```text
sih-project/
├── public/                     # Static files, icons, and HTML template
│   ├── index.html              # Main HTML entry point
│   ├── _redirects              # Netlify client-side routing redirects
│   └── favicon.ico             # App icon
│
├── src/
│   ├── index.js                # React DOM render entry point
│   ├── App.js                  # Main app router & layout structure
│   ├── App.css / index.css     # Global styles & design system
│   │
│   ├── components/             # Reusable UI widgets
│   │   ├── Navbar.jsx          # Header navigation bar
│   │   ├── BoundingBoxOverlay  # Draws detection boxes on scanned images
│   │   └── ComplianceCard.jsx  # Score badge and rule status card
│   │
│   ├── pages/                  # Main page views
│   │   ├── AuthorityPortal.jsx # Regulatory analytics & management view
│   │   ├── InspectorPortal.jsx # Scanner, camera, on-field checklist view
│   │   ├── auth/               # Login & Registration screens
│   │   ├── authority/          # Sub-pages for authority workflows
│   │   └── inspector/          # Sub-pages for inspector workflows
│   │
│   └── services/               # API Communication
│       └── api.js              # Axios HTTP client configured for http://localhost:5000/api
│
├── package.json                # Project dependencies and build scripts
└── vercel.json                 # Vercel deployment configuration
```

---

## 🔗 Backend API Connection

The frontend connects to the FastAPI backend via Axios. By default, API calls are directed to:
```text
http://localhost:5000/api
```

To configure a custom backend URL (for instance, when testing with Ngrok or a remote server), update the `baseURL` in `src/services/` or set the environment variable:
```env
REACT_APP_API_BASE_URL=http://localhost:5000/api
```

---

## 🔑 Demo Login Accounts

| Role | Email | Password |
| :--- | :--- | :--- |
| **Authority** | `admin@example.com` | `Admin@123` |
| **Inspector** | `inspector@example.com` | `Inspector@123` |

---

## 📚 Learn More

- For full architecture details and backend instructions, see the [Main Project README](../README.md).
- To learn more about React, visit the [Official React Documentation](https://react.dev/).
