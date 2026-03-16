# 🎓 SOEIT Student Achievement & Management Portal
### *Unified Digital Registry for Arka Jain University*

[![Node.js](https://img.shields.io/badge/Node.js-v18.x-002147?style=for-the-badge&logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![Vite](https://img.shields.io/badge/Vite-v5.0-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![React](https://img.shields.io/badge/React-18.2-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://reactjs.org/)
[![Turso](https://img.shields.io/badge/Database-LibSQL%2FTurso-003B57?style=for-the-badge&logo=sqlite&logoColor=white)](https://turso.tech/)

---

## 🏛️ Project Overview

The **SOEIT Achievement Portal** is a specialized management system designed for the **School of Engineering & IT (SOEIT)** at Arka Jain University. It streamlines the tracking of student milestones, professional achievements, and academic progress while providing faculty and administrators with tools for verification and analytics.

The system uses a **Bespoke Academic Design System** and is built to be resilient, storing all critical media (certificates/avatars) directly in the database to ensure zero data loss in cloud-hosted (ephemeral) environments.

---

## 🏗️ Technical Architecture

The portal is built on the **REVN** stack (React, Express, Vite, Node) with **LibSQL/Turso** as the robust persistence layer.

### Core Architecture Components:
- **Frontend**: Vite + React 18 with a custom CSS design system.
- **Backend**: Node.js & Express with RESTful architecture.
- **Database**: Turso (LibSQL) - handles both relational metadata and binary (BLOB) file storage.
- **Security**: JWT-based Authentication with Role-Based Access Control (RBAC).

---

## 👥 Roles & Access Control

| Role | Access Level | Responsibilities |
| :-- | :-- | :-- |
| **Student** | Learner | Submit achievements, manage internships/projects, track courses, view public portfolios. |
| **Faculty** | Overseer | Verify department achievements, browse scholar directory, broadcast notices. |
| **Admin** | Manager | User management (Student/Faculty), platform-wide analytics, bulk purging, data verification. |

---

## ✨ System Features

### 🎓 For Students
- **Milestone Registry** — Submit achievements (Certificate, Title, Level, Category).
- **Persistent Storage** — All certificates are stored as BLOBs in the database (No 404s on server restart).
- **Public Portfolio** — A professional shareable link showcasing stats, verified achievements, and projects.
- **Course & Internship Tracker** — Log ongoing learning activities and internship details.
- **Hackathon Hub** — Live listing of 90+ real upcoming hackathons with integrated activity logging.

### 🏫 For Faculty
- **Verification Engine** — Review student submissions with high-res document previews directly from the DB.
- **Scholar Directory** — Filter students by Department, Semester (1–8), and Section (A–G).
- **Notification Center** — Broadcast official notices to student dashboards.
- **Ledger Export** — Download any student's verified achievement evidence as a synchronized ZIP bundle.

### 🔐 For Administrators
- **User Lifecycle Management** — Bulk account management with automated cleanup of all related records (projects, achievements, etc.).
- **Institutional Analytics** — Statistical reports on department-wide performance and achievement trends.
- **Audit Trails** — Automated ZIP exports of evidence ledgers named by Student Enrollment Number for university audits.

---

## 🆕 Recent Updates (March 16, 2026)

| Update | Description |
| :--- | :--- |
| 🛡️ **Robust User Deletion** | Fixed critical 500 errors by implementing exhaustive batch deletion for all related user data (FK constraints). |
| 🔄 **Unified Registration** | Implemented a single registration portal with a role-switcher for **Student** and **Faculty**. |
| 🏷️ **Strict Prefix Validation** | Enforced enrollment number formats: `AJU/` for students and `ARKA/AJU/` for faculty. |
| 🏥 **DB Reliability** | Optimized Turso schema with indexes for high-speed lookups across all management modules. |

---

## 📂 Project Structure

```text
SOEIT-Portal/
├── frontend/                     # Client Interface (React 18 + Vite)
│   ├── src/
│   │   ├── components/
│   │   │   ├── common/           # Sidebar, Navbar, ScrollToTopButton, etc.
│   │   │   └── layout/           # AppLayout, PublicLayout
│   │   ├── context/              # AuthContext (JWT, login, logout, RBAC)
│   │   ├── pages/
│   │   │   ├── auth/             # LoginPage, RegisterPage, ForgotPassword
│   │   │   ├── student/          # Dashboard, MyAchievements (Resilient Export)
│   │   │   ├── admin/            # Dashboard, HackathonMonitoring
│   │   │   ├── faculty/          # FacultyDashboard
│   │   │   └── public/           # PublicPortfolio (Role-Protected Download)
│   │   ├── services/             # api.js — Centralized API & Resource URL configuration
│   │   └── styles/               # Vanilla CSS Design System
│   └── public/                   # Brand assets
│
├── backend/                      # Core API (Express + Turso/LibSQL)
│   ├── controllers/              # achievementController (Binary Upload/Serve Logic)
│   ├── models/                   # File.js (BLOB Model), User, Achievement, HackathonActivity, Course, etc.
│   ├── routes/                   # Protected REST endpoints
│   ├── middleware/               # Auth Guards & Memory-resident Upload (Multer)
│   ├── config/                   # db.js (Turso Connection & Schema Init)
│
└── demo_credentials.txt          # 🔐 Dev-only login credentials (not shown in UI)
```

---

## 🚀 Setup & Running

### 1. Environment Variables

**`backend/.env`**
```env
PORT=5000
TURSO_URL=your_turso_db_url
JWT_SECRET=your_high_entropy_secret
JWT_EXPIRE=30d
SMTP_USER=your_email@domain.com
SMTP_PASS=your_app_password
CLIENT_URL=https://your-vercel-frontend.vercel.app
```

**`frontend/.env`**
```env
VITE_API_URL=http://localhost:5000/api
```

### 2. Install & Run

```bash
# Install all dependencies
cd backend && npm install
cd ../frontend && npm install

# Start backend (port 5000)
cd backend && npm run dev

# Start frontend (port 5173)
cd frontend && npm run dev
```

---

## 📈 Strategic Roadmap
- [ ] **AI-driven Validation** — Automated certificate parsing and fraud detection via OCR.
- [ ] **Alumni Integration** — Extending achievement lifecycles to SOEIT post-graduates.
- [ ] **Institutional Dashboard** — High-level dean's view for department-wide comparisons.
- [ ] **Mobile App** — React Native companion for on-the-go achievement submission.

---

**Designed & Engineered for the School of Engineering & IT**
*Arka Jain University — Pioneering Technical Education & Student Success*
