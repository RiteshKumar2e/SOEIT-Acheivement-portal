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
| **Email** | Nodemailer | Transactional emails & notifications |
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

**Configure `backend/.env`:**
```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database
TURSO_URL=libsql://your-db-name-token.turso.io
TURSO_AUTH_TOKEN=your_auth_token

# Security & JWT
JWT_SECRET=your_super_secret_key_minimum_32_chars_long
JWT_EXPIRE=30d

# Email Service (Gmail/SendGrid)
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password
SMTP_FROM=noreply@soeit.edu.in

# Frontend URL
CLIENT_URL=http://localhost:5173
MOBILE_APP_URL=exp://your-expo-project

# File Upload
MAX_FILE_SIZE=5242880
ALLOWED_EXTENSIONS=pdf,jpg,jpeg,png,docx
```

**Start the backend:**
```bash
npm run dev
# Backend running at http://localhost:5000
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

**Configure `frontend/.env`:**
```env
VITE_API_URL=http://localhost:5000/api
VITE_APP_NAME=SOEIT Achievement Portal
VITE_VERSION=2.0.0
```

**Start the development server:**
```bash
npm run dev
# Frontend running at http://localhost:5173
```

**Build for production:**
```bash
npm run build
# Output in dist/ directory
```

---

### 3️⃣ Mobile App Setup (React Native + Expo)

```bash
cd ../soeit-app

# Install dependencies
npm install

# Create .env configuration
cp .env.example .env
```

**Configure `soeit-app/.env`:**
```env
EXPO_PUBLIC_API_URL=http://your-backend-url/api
EXPO_PUBLIC_APP_VERSION=1.0.0
```

**Start Expo development server:**
```bash
npm start
# Scan QR code with Expo Go app (iOS/Android)
```

**Run on specific platform:**
```bash
npm run android    # Android emulator/device
npm run ios        # iOS simulator
npm run web        # Web browser
```

**Build for app stores:**
```bash
# iOS
expo build:ios

# Android
expo build:android

# Web
expo export:web
```

---

### 🔗 Full Stack Development (All Services)

```bash
# Terminal 1: Backend
cd backend && npm run dev

# Terminal 2: Frontend  
cd frontend && npm run dev

# Terminal 3: Mobile App
cd soeit-app && npm start
```

Visit:
- 🌐 **Frontend:** http://localhost:5173
- 📡 **API:** http://localhost:5000/api
- 📱 **Mobile:** Expo QR code in Terminal 3

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
- **Email:** Nodemailer for transactional emails
- **File Upload:** Multer with compression
- **Caching:** node-cache for in-memory storage
- **Utilities:** Cheerio for HTML parsing, Axios for HTTP requests

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

## 🔒 Security Features

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
