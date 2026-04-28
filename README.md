# 🎓 SOEIT Student Achievement & Management Portal
### *Unified Digital Registry for Arka Jain University*

[![Node.js](https://img.shields.io/badge/Node.js-v18.x-002147?style=for-the-badge&logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-v5.2-90c53f?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)
[![React](https://img.shields.io/badge/React-19.2-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-v7.3-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![React Native](https://img.shields.io/badge/React%20Native-0.81-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://reactnative.dev/)
[![Turso](https://img.shields.io/badge/Database-LibSQL%2FTurso-003B57?style=for-the-badge&logo=sqlite&logoColor=white)](https://turso.tech/)
[![License](https://img.shields.io/badge/License-ISC-green?style=for-the-badge)](LICENSE)

---

## 🏛️ Project Overview

The **SOEIT Achievement Portal** is a specialized management system designed for the **School of Engineering & IT (SOEIT)** at Arka Jain University. It streamlines the tracking of student milestones, professional achievements, and academic progress while providing faculty and administrators with tools for verification and analytics.

The system uses a **Bespoke Academic Design System** and is built to be resilient, storing all critical media (certificates/avatars) directly in the database to ensure zero data loss in cloud-hosted (ephemeral) environments.

---

## 📸 Platform Preview

### 🖥️ Web Interface
<p align="center">
  <img src="Screenshots/Home%20Pages/Landing%20Page%201.1.png" width="800" alt="Landing Page">
</p>

| ![Student Dashboard](Screenshots/Student%20Module/Student%20Dashboard%20Page.png) | ![Faculty Dashboard](Screenshots/Faculty%20Module/Faculty%20Dashboard.png) |
| :---: | :---: |
| **Student Achievement Dashboard** | **Faculty Oversight Panel** |

| ![Public Portfolio](Screenshots/Home%20Pages/Public%20Portfolio%20Page.png) | ![Admin Dashboard](Screenshots/Admin%20Module/Admin%20Dashboard%20Page.png) |
| :---: | :---: |
| **Shareable Student Portfolio** | **Administrative Control Center** |

<details>
<summary><b>🖼️ View More Screenshots</b></summary>

#### Home & Auth
- [Landing Page 1.2 SOEIT GAZETTE](Screenshots/Home%20Pages/Landing%20Page%201.2%20SOEIT%20GAZETTE.png)
- [Our Features](Screenshots/Home%20Pages/Our%20Features.png)
- [How Project Works](Screenshots/Home%20Pages/How%20%20Project%20Works.png)
- [Login Page](Screenshots/Home%20Pages/Login%20Page.png)

#### Student Features
- [Course Registry](Screenshots/Student%20Module/Course%20Registry%20Page.png)
- [Internship Opportunities](Screenshots/Student%20Module/Internship%20Opportunities%20Page.png)
- [Live Hackathons](Screenshots/Student%20Module/Live%20Hackathons%20Page.png)
- [Upload Achievement](Screenshots/Student%20Module/Upload%20Achievement%20Page.png)

#### Faculty & Admin
- [Reports & Analysis](Screenshots/Faculty%20Module/Reports%20%26%20Analayis%20Page.png)
- [Verify Achievements](Screenshots/Faculty%20Module/Verify%20Students%20Achievements%20Page.png)
- [Faculty Management](Screenshots/Admin%20Module/Faculty%20Management%20Page.png)
</details>

---

## 🏗️ Technical Architecture

The portal is built on a **full-stack modern architecture** (REVN Stack + React Native) with **Turso/LibSQL** as the robust persistence layer.

### Core Stack Components:

| Component | Technology | Purpose |
| :--- | :--- | :--- |
| **Frontend Web** | React 19.2 + Vite 7.3 | High-performance student/faculty/admin dashboard |
| **Backend API** | Node.js + Express 5.2 | RESTful API with JWT authentication & RBAC |
| **Mobile App** | React Native 0.81 + Expo 54 | Cross-platform mobile companion app (iOS/Android) |
| **Database** | Turso/LibSQL | Cloud SQLite with BLOB support for binary media storage |
| **Security** | JWT + Google OAuth | Hybrid auth (Token-based + Social login) |
| **Email** | Brevo API | REST-based email service (transactional & broadcasting) |
| **File Handling** | Multer + BLOB Storage | Memory-efficient file uploads & direct DB binary storage |

### Architecture Highlights:
- ✅ **Stateless Backend** — Scales horizontally with JWT authentication.
- ✅ **Binary Storage** — All certificates/avatars stored as BLOBs in Turso (no filesystem dependencies).
- ✅ **Zero Data Loss** — Cloud-safe for ephemeral environments (Vercel, Render, Railway).
- ✅ **Hybrid Auth** — Traditional login + Google OAuth integration for seamless access.
- ✅ **Automated Scoring** — Intelligent point assignment based on achievement categories.
- ✅ **Real-time Synchronization** — Session-based auth with automatic timeout/logout.

---

## 👥 Roles & Access Control

| Role | Access Level | Responsibilities |
| :-- | :-- | :-- |
| **Student** | Learner | Submit achievements, manage internships/projects, track courses, view public portfolios. |
| **Faculty** | Overseer | Verify department achievements, browse scholar directory, broadcast notices. |
| **Admin** | Manager | User management, platform-wide analytics, data verification, system configuration. |

---

## ✨ Platform Features

### 🌐 Web Dashboard (React Frontend)
#### For Students
- 📜 **Achievement Registry** — Submit certificates with direct DB BLOB storage.
- 📄 **Resume Generator** — One-click 100% ATS-compliant DOCX/PDF resume exports.
- 🎯 **Portfolio Builder** — Public, shareable professional profiles.
- 🏆 **Gamified Leaderboard** — Weekly rankings based on verified achievement points.
- 📚 **Course Tracker** — Log courses, track progress, and upload completion certificates.
- 💼 **Internship Hub** — Browse postings, log industry experiences, and track applications.
- 🚀 **Hackathon Center** — Curated list of 90+ global hackathons with activity logging.

#### For Faculty
- ✅ **Verification Engine** — Streamlined workflow for approving/rejecting submissions.
- 📊 **Scholar Directory** — Advanced search (dept/sem/section) for student performance.
- 📢 **Notice Broadcasting** — Send institutional alerts directly to student dashboards.
- 📦 **Evidence Export** — Bulk download of student certificates for audits.

#### For Administrators
- 👥 **User Management** — Bulk account creation, role management, and audit trails.
- 📈 **Institutional Analytics** — System-wide performance metrics and trends.
- 🛡️ **System Security** — Audit logs, data purging, and platform configuration.

---

### 📱 Mobile App (React Native + Expo)
- 🔐 **Secure Access** — JWT-based login with SecureStore encryption.
- 📤 **Instant Upload** — Native camera/gallery integration for certificates.
- 🔔 **Push Notifications** — Real-time alerts for verification status and notices.
- 🎨 **Premium UI** — Modern design system with smooth transitions and gradients.
- 📄 **Mobile Resume** — Generate and share professional resumes directly from the device.

---

## 🆕 Recent Updates (April 2026)

- 🏅 **Weekly Badge Engine** — Automated badge assignment (Platinum to Bronze) via `node-cron`.
- 📊 **Enhanced Analytics** — New faculty dashboard with real-time participation graphs.
- 📧 **Brevo Email Integration** — High-reliability transactional emails with custom brand templates.
- 🛡️ **Hybrid Authentication** — Integrated Google OAuth via Passport.js for faster student login.
- 🏥 **DB Performance** — Optimized SQL indexes for sub-100ms lookups across 10k+ records.

---

## 📂 Project Structure

```
SOEIT-Achievement-Portal/
│
├── 📁 backend/                          # Express.js API Server
│   ├── src/
│   │   ├── config/                      # DB (Turso) & Passport config
│   │   ├── middleware/                  # Auth, Error, Upload guards
│   │   ├── modules/                     # Feature-based logic (Achievement, Badge, etc.)
│   │   └── utils/                       # Email, Scoring, Sync engines
│   └── server.js                        # Entry point
│
├── 📁 frontend/                         # React 19 + Vite Web App
│   ├── src/
│   │   ├── components/                  # Design System & UI Components
│   │   ├── pages/                       # Student, Faculty, Admin, Public views
│   │   ├── context/                     # Global Auth & State
│   │   └── utils/                       # Resume & PDF generators
│   └── vite.config.js                   # Build & Proxy config
│
└── 📱 soeit-app/                        # React Native (Expo) Mobile App
    ├── src/
    │   ├── screens/                     # Feature-specific native screens
    │   ├── navigation/                  # App stack & drawer navigation
    │   └── services/                    # API integration
    └── app.json                         # Expo configuration
```

---

## 🚀 Quick Start

### Prerequisites
- **Node.js** v18+
- **Turso Account** ([Sign up](https://turso.tech/))
- **Brevo API Key** ([Get Key](https://app.brevo.com/))
- **Expo Go** (for mobile testing)

### Installation

1. **Clone & Install:**
   ```bash
   git clone https://github.com/yourusername/SOEIT-portal.git
   cd SOEIT-portal
   # Install in each directory
   cd backend && npm install
   cd ../frontend && npm install
   cd ../soeit-app && npm install
   ```

2. **Environment Setup:**
   Create `.env` files in `backend/` and `frontend/` using the provided `.env.example` templates.

3. **Run Locally:**
   ```bash
   # Terminal 1: Backend
   cd backend && npm run dev
   
   # Terminal 2: Frontend
   cd frontend && npm run dev
   
   # Terminal 3: Mobile
   cd soeit-app && npm start
   ```

---

## 📡 API Documentation

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/api/auth/login` | Secure JWT Login |
| `POST` | `/api/achievement/submit` | Submit achievement (Multipart) |
| `GET` | `/api/achievement/pending` | [Faculty] Get pending items |
| `GET` | `/api/user/portfolio/:id` | Public Portfolio View |
| `POST` | `/api/badge/generate` | Manual Badge Trigger (Admin) |

*Full documentation available at [docs/API_DOCS.md](docs/API_DOCS.md)*

---

## 🛡️ Security & Compliance
- **JWT + RBAC** — Fine-grained access control.
- **Bcrypt Hashing** — 12-round salt for passwords.
- **Helmet.js** — HTTP security headers.
- **SQL Injection Protection** — Prepared statements via LibSQL.
- **Input Sanitization** — Global middleware for request cleaning.

---

## 📄 License
This project is licensed under the **ISC License**.

---

**🎓 Designed & Engineered for the School of Engineering & IT**
*Arka Jain University — Pioneering Technical Education & Student Success*

**Last Updated:** April 24, 2026 | **Version:** 2.1.0
