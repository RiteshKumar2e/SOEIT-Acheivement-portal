# 🎓 SOEIT Student Achievement & Management Portal
### *Unified Digital Registry for Arka Jain University*

[![Node.js](https://img.shields.io/badge/Node.js-v18.x-002147?style=for-the-badge&logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-v5.2-90c53f?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)
[![React](https://img.shields.io/badge/React-19.2-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-v5.0-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![React Native](https://img.shields.io/badge/React%20Native-0.81-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://reactnative.dev/)
[![Turso](https://img.shields.io/badge/Database-LibSQL%2FTurso-003B57?style=for-the-badge&logo=sqlite&logoColor=white)](https://turso.tech/)
[![License](https://img.shields.io/badge/License-ISC-green?style=for-the-badge)](LICENSE)

---


## 🏛️ Project Overview

The **SOEIT Achievement Portal** is a specialized management system designed for the **School of Engineering & IT (SOEIT)** at Arka Jain University. It streamlines the tracking of student milestones, professional achievements, and academic progress while providing faculty and administrators with tools for verification and analytics.

The system uses a **Bespoke Academic Design System** and is built to be resilient, storing all critical media (certificates/avatars) directly in the database to ensure zero data loss in cloud-hosted (ephemeral) environments.

---

## 🏗️ Technical Architecture

The portal is built on a **full-stack modern architecture** (REVN Stack + React Native) with **Turso/LibSQL** as the robust persistence layer.

### Core Stack Components:

| Component | Technology | Purpose |
| :--- | :--- | :--- |
| **Frontend Web** | React 18 + Vite | High-performance student/faculty/admin dashboard |
| **Backend API** | Node.js + Express 5.2 | RESTful API with JWT authentication & RBAC |
| **Mobile App** | React Native + Expo | Cross-platform mobile companion app (iOS/Android) |
| **Database** | Turso/LibSQL | Cloud SQLite with BLOB support for binary media storage |
| **Security** | JWT + Bcrypt | Token-based auth with password hashing |
| **Email** | Brevo API | REST-based email service (no SMTP needed) |
| **File Handling** | Multer + Compression | Memory-efficient file uploads & BLOB database storage |

### Architecture Highlights:
- ✅ **Stateless Backend** — Scales horizontally with JWT authentication
- ✅ **Binary Storage** — All certificates/avatars stored as BLOBs in database (no filesystem dependencies)
- ✅ **Zero Data Loss** — Cloud-safe for ephemeral environments (Vercel, Railway, Heroku)
- ✅ **Multi-Platform** — Web dashboard + native mobile experience
- ✅ **Real-time Updates** — Session-based auth with automatic logout 

---



## 👥 Roles & Access Control

| Role | Access Level | Responsibilities |
| :-- | :-- | :-- |
| **Student** | Learner | Submit achievements, manage internships/projects, track courses, view public portfolios. |
| **Faculty** | Overseer | Verify department achievements, browse scholar directory, broadcast notices. |
| **Admin** | Manager | User management (Student/Faculty), platform-wide analytics, bulk purging, data verification. |

---

## ✨ Platform Features

### 🌐 Web Dashboard (React Frontend)
#### For Students
- 📜 **Achievement Registry** — Submit, track, and manage verified achievements
- 📄 **Resume Generator** — Auto-generate professional DOCX/PDF resumes with single click
- 🎯 **Portfolio Builder** — Create public shareable portfolios with achievement showcase
- 🏆 **Leaderboard** — Track ranking based on verified achievements
- 📚 **Course Tracker** — Log courses, certificates, and learning activities
- 💼 **Internship Management** — Browse postings, apply, and log internship progress
- 🚀 **Hackathon Hub** — Browse 90+ upcoming hackathons & log participation
- 📱 **Responsive Design** — Mobile-optimized dashboard experience

#### For Faculty
- ✅ **Verification Engine** — Review & approve/reject student submissions
- 📊 **Scholar Directory** — Search students by department, semester, and section
- 📢 **Notice Broadcasting** — Send institutional announcements to student dashboards
- 📦 **Evidence Export** — Download verified achievement bundles as ZIP files
- 📈 **Departmental Analytics** — View performance trends and statistics

#### For Administrators
- 👥 **User Management** — Create, edit, delete student/faculty accounts with bulk operations
- 🗑️ **Data Cleanup** — Cascade-delete user records with all associated data
- 📊 **Institutional Dashboard** — System-wide analytics and audit trails
- 🔐 **Audit Logs** — Track all user actions and data modifications
- 🏗️ **System Config** — Manage platform settings and institutional parameters

---

### 📱 Mobile App (React Native + Expo)
#### Cross-Platform Availability
- 🍎 **iOS Support** — Native app experience on Apple devices
- 🤖 **Android Support** — Optimized performance on Android
- 🌐 **Web Support** — Responsive web view for testing and fallback

#### Key Capabilities
- 🔐 **Secure Authentication** — JWT-based login with Expo SecureStore
- 📤 **Achievement Upload** — Camera/gallery integration for certificate submission
- 📋 **Dashboard Overview** — Real-time achievement statistics & notifications
- 📊 **Profile Management** — Edit personal info, upload profile pictures
- 🔔 **Push Notifications** — Get notified about verification updates
- 📄 **Export Resume** — Download resume in multiple formats
- ⚡ **Offline Fallback** — Limited functionality when offline
- 🎨 **Material Design** — Modern, intuitive navigation stack

---

## 🆕 Recent Updates (March 19, 2026)

| Update | Description |
| :--- | :--- |
| 📄 **Professional Resume Engine** | Launched high-density automated resume generator matching top-tier technical industry standards. |
| 🆔 **Comprehensive Profiles** | Expanded user profiles to include 10th/12th academic markers, Enrollment IDs, and University CGPA. |
| 🛡️ **Session-Based Auth** | Enhanced security by migrating to `sessionStorage`, ensuring automatic logout when the browser tab is closed. |
| 🚀 **Direct Verification** | Updated email verification flow to land users directly on the dashboard for a smoother onboarding experience. |
| 🏥 **DB Reliability** | Optimized Turso schema with indexes for high-speed lookups across all management modules. |

---

## 📂 Complete Project Structure

```
SOEIT-Achievement-Portal/
│
├── 📁 backend/                          # Express.js API Server
│   ├── src/
│   │   ├── config/
│   │   │   └── db.js                    # Turso/LibSQL connection & initialization
│   │   ├── middleware/
│   │   │   ├── auth.js                  # JWT verification & RBAC guards
│   │   │   ├── errorHandler.js          # Global error handling
│   │   │   └── upload.js                # Multer configuration for file uploads
│   │   ├── modules/
│   │   │   ├── achievement/             # Achievement CRUD operations
│   │   │   ├── admin/                   # Admin analytics & user management
│   │   │   ├── auth/                    # Login, registration, JWT issuance
│   │   │   ├── course/                  # Course tracking & assignments
│   │   │   ├── event/                   # Event management
│   │   │   ├── hackathon/               # Hackathon listings & activities
│   │   │   ├── internship/              # Internship postings & applications
│   │   │   ├── notification/            # Notice & alert broadcasts
│   │   │   ├── project/                 # Student projects
│   │   │   ├── user/                    # Profile & user data
│   │   │   └── verification/            # Achievement verification workflow
│   │   └── utils/
│   │       ├── cache.js                 # In-memory caching (node-cache)
│   │       ├── emailTemplates.js        # Nodemailer templates
│   │       ├── scoring.js               # Achievement scoring algorithm
│   │       ├── sendEmail.js             # Email dispatch service
│   │       └── syncEngine.js            # Data synchronization logic
│   ├── uploads/                         # Temporary storage (local dev only)
│   ├── server.js                        # Express app entry point
│   ├── package.json
│   └── .env.example
│
├── 📁 frontend/                         # React 18 + Vite Web Dashboard
│   ├── src/
│   │   ├── components/
│   │   │   ├── common/                  # Navbar, Sidebar, Footers
│   │   │   └── [Feature Components]
│   │   ├── pages/
│   │   │   ├── auth/                    # Login, Register, ForgotPassword
│   │   │   ├── student/                 # Student dashboard & achievement pages
│   │   │   ├── admin/                   # Admin dashboard & management
│   │   │   ├── faculty/                 # Faculty verification dashboard
│   │   │   ├── public/                  # Public portfolio views
│   │   │   └── shared/                  # Shared pages (notfound, etc.)
│   │   ├── services/
│   │   │   └── api.js                   # Axios instance & API configuration
│   │   ├── context/
│   │   │   └── AuthContext.jsx          # Global auth state & JWT handling
│   │   ├── styles/                      # Vanilla CSS design system
│   │   │   ├── mobile.css               # Mobile responsiveness
│   │   │   ├── pages/                   # Page-specific styles
│   │   │   └── layout/                  # Layout component styles
│   │   ├── utils/
│   │   │   ├── generateResumeDocx.js    # DOCX resume generation
│   │   │   └── generateResumePdf.js     # PDF resume generation
│   │   ├── App.jsx                      # Root component with routing
│   │   └── main.jsx                     # Vite entry point
│   ├── public/
│   │   └── images/                      # Static brand assets
│   ├── package.json
│   ├── vite.config.js
│   └── .env.example
│
├── 📱 soeit-app/                        # React Native Mobile App (Expo)
│   ├── src/
│   │   ├── screens/
│   │   │   ├── auth/                    # Login, registration screens
│   │   │   ├── student/                 # Achievement submission, dashboard
│   │   │   ├── admin/                   # Admin verification screens
│   │   │   ├── faculty/                 # Faculty dashboard (mobile)
│   │   │   └── shared/                  # Splash, profile, notification screens
│   │   ├── navigation/
│   │   │   └── AppNavigator.js          # React Navigation configuration
│   │   ├── components/
│   │   │   └── common/                  # Reusable UI components
│   │   ├── context/
│   │   │   └── AuthContext.js           # Mobile auth state (SecureStore)
│   │   ├── services/
│   │   │   └── api.js                   # Axios + error handling
│   │   ├── styles/
│   │   │   ├── colors.js                # App color palette
│   │   │   ├── [Feature Styles]         # Feature-specific stylesheets
│   │   │   └── index.js                 # Global style export
│   │   ├── constants/
│   │   │   ├── api.js                   # API endpoints
│   │   │   ├── colors.js                # Color constants
│   │   │   └── hackathons.js            # Hackathon data
│   │   └── utils/
│   │       └── responsive.js            # Responsive scaling utilities
│   ├── app.json                         # Expo config & app metadata
│   ├── package.json
│   └── index.js
│
├── README.md                            # This file - Complete project documentation
└── LICENSE                              # Project license
```

---

## 🚀 Quick Start Guide

### Prerequisites
- **Node.js** v18+ ([Download](https://nodejs.org/))
- **npm** v9+ or **yarn** (comes with Node.js)
- **Turso Account** (Free tier available) — [Sign up here](https://turso.tech/)
- **Git** for version control
- **Expo CLI** (for mobile app) — `npm install -g expo-cli`

---

### 1️⃣ Backend Setup (Express API)

```bash
# Clone the repository
git clone https://github.com/yourusername/SOEIT-portal.git
cd SOEIT-portal/backend

# Install dependencies
npm install

# Create .env configuration
cp .env.example .env
```

**Detailed `backend/.env` Configuration:**
```env
# ============================================
# Server Configuration
# ============================================
PORT=5000
NODE_ENV=development
# Options: development, production, test

# ============================================
# Database (Turso/LibSQL)
# ============================================
TURSO_URL=libsql://your-database-name-token.turso.io
TURSO_AUTH_TOKEN=your_turso_authentication_token_here
# Note: Keep TURSO_AUTH_TOKEN secret. Never commit to git.
# Get from: https://turso.tech/console

# ============================================
# JWT Authentication
# ============================================
JWT_SECRET=your_super_secret_key_minimum_32_characters_long_do_not_share
JWT_EXPIRE=30d
# JWT_SECRET must be at least 32 chars for security

# ============================================
# Email Service (Brevo/Sendinblue API)
# ============================================
BREVO_API_KEY=your_brevo_api_key_here
# Get from: https://app.brevo.com/settings/account/api
# Free tier available - no SMTP configuration needed
FROM_NAME=SOEIT Portal
FROM_EMAIL=noreply@soeit.edu.in
# Email address must be verified in Brevo account

# ============================================
# Frontend URLs
# ============================================
CLIENT_URL=http://localhost:5173
# Production: https://your-frontend-domain.vercel.app
MOBILE_APP_URL=exp://your-expo-project
# For Expo published projects

# ============================================
# File Upload Configuration
# ============================================
MAX_FILE_SIZE=5242880
# 5242880 bytes = 5 MB
ALLOWED_EXTENSIONS=pdf,jpg,jpeg,png,docx
# Comma-separated file extensions

# ============================================
# CORS Origins (Hardcoded + env variable)
# ============================================
# Allowed in code:
# - http://localhost:5173 (Frontend dev)
# - http://localhost:3000 (Alt dev)
# - *.vercel.app (Vercel deployments)
# - *.onrender.com (Render deployments)
# - ${CLIENT_URL} (from env above)

# ============================================
# Request Limits
# ============================================
# In code (not env): 
# - JSON limit: 100mb
# - URL-encoded limit: 100mb
# - Compression level: 6 (max compression)
```

**Backend Features:**
- ✅ Helmet security headers enabled
- ✅ CORS with credential support
- ✅ Morgan logging (dev mode only)
- ✅ Compression middleware (gzip, level 6)
- ✅ Cookie parser for session management
- ✅ Request size limit: 100MB
- ✅ Health check: `GET /api/health`
- ✅ Email via Brevo API (REST-based, not SMTP)

**Start the backend:**
```bash
npm run dev
# Backend running at http://localhost:5000
# API docs: http://localhost:5000/api/health
```

**Verify Backend is Working:**
```bash
curl http://localhost:5000/api/health
# Expected response: { "success": true, "message": "SOEIT Achievements Portal API is running", "database": "Turso (LibSQL)" }
```

---

### 2️⃣ Frontend Setup (React Dashboard)

```bash
cd ../frontend

# Install dependencies  
npm install

# Create .env configuration
cp .env.example .env
```

**Comprehensive `frontend/.env` Configuration:**
```env
# ============================================
# Vite Configuration
# ============================================
VITE_API_URL=http://localhost:5000/api
# Development: http://localhost:5000/api
# Production: https://your-api-domain.com/api or onrender.com URL
# Note: This is used in frontend/src/services/api.js

VITE_APP_NAME=SOEIT Achievement Portal
VITE_VERSION=2.0.0
```

**Vite Configuration Details (`vite.config.js`):**
```javascript
// Development Server
- Port: 5173
- Proxy for /api → Render backend
- Proxy for /uploads → Backend static files

// Build Optimization
- Code splitting: vendor, utils chunks
- Chunk size limit: 1000kb warning threshold
- CSS code splitting: Enabled
- Minification: Enabled (esbuild)
- Drop console & debugger in production

// Performance Optimizations
- jquery optimization (jspdf, xlsx)
- Lazy loading enabled
- Tree shaking enabled
```

**Start the development server:**
```bash
npm run dev
# Frontend running at http://localhost:5173
# Auto-opens in browser
```

**Build for production:**
```bash
npm run build
# Output: dist/ directory
# Run: npm run preview (to test production build locally)
```

**Lint code:**
```bash
npm run lint
# Checks for code quality issues
```

**Production Build Details:**
- **Output folder:** `dist/`
- **Buildtime:** ~30-60 seconds
- **Bundle size:** ~500KB (gzipped with optimizations)
- **Chrome DevTools:** Console logs stripped in production

---

### 3️⃣ Mobile App Setup (React Native + Expo)

```bash
cd ../soeit-app

# Install dependencies
npm install

# Create .env configuration (if needed)
cp .env.example .env 2>/dev/null || echo "Using defaults"
```

**Mobile App Configuration (`soeit-app/src/constants/api.js`):**

The mobile app uses hardcoded API configuration for different environments:

```javascript
// ============================================
// Local Development (Physical Device on LAN)
// ============================================
API_BASE_URL = 'http://192.168.1.100:5000/api'
// Replace 192.168.1.100 with your computer's local IP
// Find your IP: 
// - Windows: ipconfig | findstr "IPv4"
// - Mac/Linux: ifconfig | grep inet

// ============================================
// Android Emulator
// ============================================
API_BASE_URL = 'http://10.0.2.2:5000/api'
// 10.0.2.2 is special alias for host machine in Android emulator

// ============================================
// iOS Simulator
// ============================================
API_BASE_URL = 'http://localhost:5000/api'
// Or your machine's IP address

// ============================================
// Production
// ============================================
API_BASE_URL = 'https://soeit-acheivement-portal.onrender.com/api'
// Use deployed backend URL
```

**How to Find Your Local IP (for device testing):**
```powershell
# Windows
ipconfig | findstr "IPv4"

# Output example: IPv4 Address . . . . . . . . . : 192.168.1.100
# Then use: http://192.168.1.100:5000/api
```

**Expo Configuration (`soeit-app/app.json`):**
```json
{
  "expo": {
    "name": "soeit-app",
    "version": "1.0.0",
    "orientation": "portrait",
    "plugins": [
      "expo-secure-store"  // For secure credential storage
    ],
    "ios": {
      "supportsTablet": true
    },
    "android": {
      "adaptiveIcon": {
        // Icon configuration for Android
      }
    },
    "splash": {
      "image": "./assets/splash-icon.png",
      "resizeMode": "contain",
      "backgroundColor": "#ffffff"
    }
  }
}
```

**Required Assets:**
- `assets/icon.png` — App icon (192x192)
- `assets/splash-icon.png` — Splash screen (512x512)
- `assets/android-icon-foreground.png` — Android adaptive icon
- `assets/favicon.png` — Web favicon

**Start Expo development server:**
```bash
npm start
# Outputs QR code for scanning with Expo Go app
# Make sure backend is running before scanning!
```

**Run on specific platform:**
```bash
# Android Emulator/Device
npm run android
# Requires: Android SDK, emulator running, or device connected via USB

# iOS Simulator (Mac only)
npm run ios
# Requires: Xcode, iOS SDK, Mac computer

# Web Browser
npm run web
# Runs in browser on http://localhost:19006
```

**Build for App Stores (EAS):**
```bash
npm install -g eas-cli
eas login  # Sign in with Expo account

# Build binaries
eas build --platform ios
eas build --platform android
eas build --platform all  # Both platforms

# Submit to stores
eas submit --platform ios --latest
eas submit --platform android --latest

# Check build status
eas build:list
```

**Local Development Workflow:**
```powershell
# Terminal 1: Backend
cd backend && npm run dev

# Terminal 2: Frontend
cd frontend && npm run dev

# Terminal 3: Mobile App
cd soeit-app && npm start

# Scanner QR code with:
# - Expo Go app (iOS/Android)
# - Or press 'a' for Android, 'i' for iOS
```

**Testing URLs:**
- 🌐 **Frontend:** http://localhost:5173
- 📡 **API:** http://localhost:5000/api
- 📱 **Mobile:** Scan QR from Terminal 3 with Expo Go
- 🔍 **API Health Check:** http://localhost:5000/api/health

---

### 🔗 Full Stack Development Checklist

Before starting development:

- [ ] **Backend Running?** `curl http://localhost:5000/api/health` (expect success)
- [ ] **Frontend Accessible?** http://localhost:5173 (no CSS errors)
- [ ] **Mobile QR Scanned?** Expo app connects to backend
- [ ] **Database Connected?** Check backend logs for "Database connected"
- [ ] **Env Variables Set?** All three .env files configured
- [ ] **No Port Conflicts?** Ports 5000, 5173, 19000+ are free

---

## 📡 API Documentation

### Authentication Endpoints

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/api/auth/register` | User registration (student/faculty) |
| `POST` | `/api/auth/login` | JWT token issuance |
| `POST` | `/api/auth/logout` | Session termination |
| `POST` | `/api/auth/verify-email` | Email verification |
| `POST` | `/api/auth/forgot-password` | Password reset request |
| `POST` | `/api/auth/reset-password` | Password reset completion |

### Achievement Endpoints

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/api/achievement/submit` | Submit new achievement (with certificate) |
| `GET` | `/api/achievement/my-achievements` | Fetch user's achievements |
| `GET` | `/api/achievement/:id` | Get achievement details |
| `PUT` | `/api/achievement/:id` | Update achievement |
| `DELETE` | `/api/achievement/:id` | Delete achievement |
| `GET` | `/api/achievement/pending-verification` | Admin/Faculty: Get pending items |
| `POST` | `/api/achievement/:id/verify` | Approve achievement |
| `POST` | `/api/achievement/:id/reject` | Reject achievement |

### Course Endpoints

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/api/course/enroll` | Enroll in course |
| `GET` | `/api/course/my-courses` | Fetch enrolled courses |
| `GET` | `/api/course/available` | List available courses |
| `POST` | `/api/course/:id/complete` | Mark course as complete |

### Hackathon Endpoints

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/hackathon/list` | Fetch all hackathons (90+) |
| `POST` | `/api/hackathon/:id/participate` | Register for hackathon |
| `GET` | `/api/hackathon/my-participations` | User's hackathon history |
| `POST` | `/api/hackathon/:id/log-activity` | Log hackathon activity |

### User Profile Endpoints

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/user/profile` | Get user profile |
| `PUT` | `/api/user/profile` | Update profile |
| `GET` | `/api/user/portfolio/:userId` | Public portfolio view |
| `POST` | `/api/user/upload-avatar` | Upload profile picture |

### Admin Endpoints

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/admin/users` | List all users (paginated) |
| `POST` | `/api/admin/create-user` | Create user (bulk) |
| `DELETE` | `/api/admin/user/:id` | Delete user & cascade data |
| `GET` | `/api/admin/analytics` | Dashboard analytics |
| `GET` | `/api/admin/audit-logs` | View audit trails |
| `POST` | `/api/admin/export-evidence/:userId` | Export user evidence as ZIP |

### Faculty Endpoints

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/faculty/scholars` | Search students (dept/semester/section) |
| `GET` | `/api/faculty/pending-approvals` | Achievements awaiting verification |
| `POST` | `/api/faculty/broadcast-notice` | Send notice to students |

**Full API Documentation:** See [API_DOCS.md](docs/API_DOCS.md) for detailed request/response examples.

---

## 🌐 Deployment Guide

### Deploy Backend (Node.js + Turso)

**Option 1: Vercel**
```bash
cd backend
npm install -g vercel
vercel
# Follow prompts, ensure TURSO_URL and JWT_SECRET are added as secrets
```

**Option 2: Railway**
```bash
# Connect GitHub repo to railway.app
# Add environment variables in Railway dashboard
# Auto-deploy on push
```

**Option 3: Render**
```bash
# Create new Web Service on render.com
# Connect GitHub repo
# Set environment variables
# Service deploys automatically
```

### Deploy Frontend (Vite + React)

**Option 1: Vercel (Recommended)**
```bash
cd frontend
npm install -g vercel
vercel
# Automatically detects Vite and deploys
```

**Option 2: Netlify**
```bash
# Push to GitHub, connect via netlify.com
# Build command: npm install && npm run build
# Publish directory: dist
```

**Option 3: GitHub Pages**
```bash
# Add to vite.config.js
# export default { base: '/repo-name/' }
npm run build
# Deploy dist/ to GitHub Pages
```

### Deploy Mobile App (Expo)

**Option 1: Expo Application Services (EAS)**
```bash
npm install -g eas-cli
eas login
eas build --platform all
eas submit --platform ios --latest   # Submit to App Store
eas submit --platform android        # Submit to Play Store
```

**Option 2: Self-Hosted**
```bash
expo build:ios
expo build:android
# Download binaries and distribute manually
```

---

## 🛠️ Technology Overview

### Backend Stack
- **Runtime:** Node.js v18+
- **Framework:** Express.js 5.2
- **Database:** Turso (LibSQL) - Cloud SQLite
- **Authentication:** JWT (jsonwebtoken)
- **Encryption:** Bcrypt for password hashing
- **Email Service:** Brevo API (REST-based, replaces SMTP/Nodemailer)
- **File Upload:** Multer with compression
- **Caching:** node-cache for in-memory storage
- **Utilities:** Cheerio for HTML parsing, Axios for HTTP requests

**Note:** Nodemailer is listed in `package.json` but not actively used. Email functionality uses Brevo API instead.

### Frontend Stack
- **Framework:** React 19.2
- **Build Tool:** Vite 5.0
- **Routing:** React Router v7
- **State Management:** Context API + React Hooks
- **Form Handling:** React Hook Form + Yup validation
- **Charts:** Chart.js + React Chart.js 2
- **Document Export:** docx, jsPDF, XLSX, FileSaver
- **UI Icons:** Lucide React
- **Notifications:** react-hot-toast
- **Styling:** Vanilla CSS (Custom Design System)

### Mobile Stack
- **Framework:** React Native v0.81
- **Dev Platform:** Expo v54
- **Navigation:** React Navigation v6
- **State Management:** Context API + AsyncStorage/SecureStore
- **HTTP Client:** Axios
- **Form Handling:** React Hook Form
- **Date Utility:** date-fns
- **File Operations:** Expo (DocumentPicker, ImagePicker, FileSystem, Sharing)
- **Icons:** Expo Vector Icons
- **Gradient UI:** expo-linear-gradient

---

## 🎯 Roadmap & Future Enhancements

### Q2 2026 (In Progress)
- [ ] **AI-Powered Certificate Validation** — OCR-based certificate verification & fraud detection
- [ ] **Advanced Search** — Full-text search with filters across achievements
- [ ] **Real-time Notifications** — WebSocket integration for instant updates
- [ ] **Dark Mode Support** — Theme toggle for all platforms

### Q3 2026
- [ ] **Alumni Integration** — Extended profiles for post-graduates
- [ ] **Achievement Badges** — Gamification with earned badges
- [ ] **Social Features** — Follow students, share achievements
- [ ] **Analytics Dashboard** — Advanced reporting for institutions

### Q4 2026 & Beyond
- [ ] **API Rate Limiting** — Prevent abuse and ensure stability
- [ ] **Batch Import** — Bulk upload achievements from CSV
- [ ] **Blockchain Certificates** — Immutable achievement records
- [ ] **Multi-Language Support** — Hindi, Regional languages
- [ ] **Progressive Web App** — Installable web app experience
- [ ] **Video Submissions** — Support for achievement videos

---

## � Email Service Configuration (Brevo API)

The project uses **Brevo (Sendinblue)** API for sending emails instead of traditional SMTP/Nodemailer approach. This provides better reliability, better deliverability, and scalability.

### Brevo Setup Steps

1. **Create Brevo Account**
   - Go to [https://www.brevo.com/](https://www.brevo.com/)
   - Sign up for free account (no credit card required for free tier)
   - Get **10 free emails per day** on free plan

2. **Get API Key**
   - Login to Brevo Dashboard
   - Go to **Settings → Account → API**
   - Create new API key (token)
   - Copy and add to `backend/.env` as `BREVO_API_KEY`

3. **Verify Sender Email**
   - Go to **Senders & IP**
   - Add verified sender email address
   - Brevo will send verification email
   - Confirm to whitelist the email
   - Use this email in `FROM_EMAIL` env variable

4. **Configure Environment Variables**
   ```env
   BREVO_API_KEY=your_api_key_from_step_2
   FROM_NAME=SOEIT Portal
   FROM_EMAIL=your_verified_email@domain.com
   ```

### How Emails Work

**Email Service Location:** `backend/src/utils/sendEmail.js`

**Features:**
- ✅ Automatic fallback to console logging if API key missing
- ✅ Supports single recipient emails
- ✅ Supports bulk emails (BCC mode for privacy)
- ✅ HTML & text content
- ✅ Error handling with Brevo error codes
- ✅ Message ID tracking

**Triggers for Emails:**
- User registration & verification
- Password reset requests
- Achievement verification notifications
- Faculty notices to students
- Admin alerts

### Email Template

**Template Location:** `backend/src/utils/emailTemplates.js`

**Features:**
- Professional corporate design
- Responsive HTML email format
- Status badges (success, error, info)
- CTA button support
- Branding with AJU logo
- Dark header (#002147) matching brand

### Testing Emails in Development

```bash
# Without API key - emails print to console
❌ [BREVO] API Key missing. Skipping email send.
--- MAIL SIMULATION ---
To: student@example.com
Subject: Your Email Subject

# With API key - real emails sent to Brevo
✅ [BREVO] Successfully sent. Message ID: <12345-67890>
```

### Free Plan Limitations

- **Free Tier:** 10 emails/day
- **Paid Plans:** Starting from €20/month with unlimited emails
- **Recommended:** Upgrade when at ~5+ emails/day

### Migration from Nodemailer

If you need to switch back to Nodemailer/SMTP:
1. Update `sendEmail.js` to use Nodemailer instead of Brevo fetch
2. Change env variables back to SMTP_USER, SMTP_PASS
3. Remove BREVO_API_KEY

---



✅ **JWT Authentication** — Secure token-based access control
✅ **Role-Based Access Control (RBAC)** — Student/Faculty/Admin permissions
✅ **Password Hashing** — Bcrypt with salt rounds
✅ **HTTPS Only** — All production traffic encrypted
✅ **CORS Protection** — Restricted cross-origin requests
✅ **Input Validation** — Express Validator on all inputs
✅ **Environment Secrets** — Sensitive data in .env files
✅ **Database Encryption** — Turso's built-in encryption
✅ **Session Management** — SessionStorage with auto-logout
✅ **Helmet Security Headers** — HTTP security hardening

---

## 👨‍💻 Development Guidelines

### Code Structure
- **Modules:** Feature-based organization (achievement, course, user, etc.)
- **Controllers:** Business logic and route handlers
- **Models:** Database schema and queries
- **Services:** Reusable business logic and external integrations
- **Middleware:** Authentication, error handling, file uploads
- **Utils:** Helper functions and utilities

### Database Schema
- **Relational Design:** Tables for users, achievements, courses, hackathons
- **BLOB Storage:** Binary media (certificates) stored as large objects
- **Indexes:** Strategic indexes on frequently queried columns
- **Constraints:** Foreign keys for data integrity

### API Design
- **RESTful Architecture:** Standard HTTP methods (GET, POST, PUT, DELETE)
- **Status Codes:** Proper HTTP status code usage
- **Error Handling:** Standardized error response format
- **Pagination:** Limit/offset for list endpoints
- **Authentication:** JWT in Authorization header

### Frontend Best Practices
- **Component Reusability:** DRY principle for components
- **State Management:** Context API for auth and user data
- **Responsive Design:** Mobile-first CSS approach
- **Performance:** Lazy loading, code splitting
- **Accessibility:** ARIA labels and semantic HTML

---

## 📝 Contributing

We welcome contributions! Please follow these guidelines:

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. **Commit** with clear messages (`git commit -m 'Add amazing feature'`)
4. **Push** to your fork (`git push origin feature/amazing-feature`)
5. **Open** a Pull Request with description

### Code Review Checklist
- [ ] Code follows the project structure
- [ ] Functions are documented with JSDoc comments
- [ ] No console.logs in production code
- [ ] All API endpoints have proper error handling
- [ ] Mobile-responsive CSS is included
- [ ] Database queries are optimized
- [ ] Security best practices are followed

---

## 📞 Support & Contact

- **Issues:** [GitHub Issues](https://github.com/yourusername/SOEIT-portal/issues)
- **Email:** support@soeit.edu.in
- **Documentation:** [Full Docs](docs/)
- **API Reference:** [API Docs](docs/API_DOCS.md)
- **Database Schema:** [Schema Diagram](docs/SCHEMA.md)

---

## 📄 License

This project is licensed under the **ISC License** - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- **Arka Jain University** — For supporting this initiative
- **School of Engineering & IT** — For providing requirements and feedback
- **Open Source Community** — For incredible libraries and tools

---

## 👥 Authors & Contributors

- **Lead Developer:** Your Name (@yourusername)
- **Contributors:** 
  - Team Member 1
  - Team Member 2
  - Team Member 3

---

## 📌 Quick Links

| Resource | Link |
| :--- | :--- |
| GitHub Repo | [SOEIT Portal](https://github.com/yourusername/SOEIT-portal) |
| Turso Database | [Turso Docs](https://docs.turso.tech/) |
| React Docs | [React 19](https://react.dev/) |
| React Native Docs | [React Native](https://reactnative.dev/) |
| Expo Docs | [Expo](https://docs.expo.dev/) |
| Express.js | [Express](https://expressjs.com/) |
| Vite | [Vite](https://vitejs.dev/) |

---

**🎓 Designed & Engineered for the School of Engineering & IT**

*Arka Jain University — Pioneering Technical Education & Student Success*

**Last Updated:** April 3, 2026 | **Version:** 2.0.0
