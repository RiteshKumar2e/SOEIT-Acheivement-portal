# 🎓 SOEIT Achievement & Analytics Portal

[![Node.js Version](https://img.shields.io/badge/node-v18%2B-002147.svg?style=for-the-badge&logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![Vite](https://img.shields.io/badge/vite-v5.0+-646CFF.svg?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![React](https://img.shields.io/badge/React-18.x-61DAFB.svg?style=for-the-badge&logo=react&logoColor=black)](https://reactjs.org/)
[![MongoDB](https://img.shields.io/badge/mongodb-latest-47A248.svg?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/)

An enterprise-grade, institutional-first achievement management platform designed exclusively for the **School of Engineering & IT (SOEIT)** at **Arka Jain University**. This portal moves beyond simple tracking, offering a sophisticated ecosystem for student excellence, faculty oversight, and institutional auditing.

---

## 🏛️ Institutional Core

The portal is built on a **Premium Light Aesthetic**, moving away from generic AI-generated templates to a credible, academic design system that mirrors official university standards.

### 🌟 Key Functional Pillars

#### 👨‍🎓 Student Empowerment
- **Smart Milestone Submission**: High-fidelity workflow for uploading certificates with metadata tagging.
- **Dynamic Digital Portfolio**: Auto-generated public portfolios that students can share with recruiters.
- **Interactive Knowledge Base**: 3D Flip-book style user manuals (12-page interactive guides).
- **Gamified Analytics**: Real-time progress tracking across academic and co-curricular spheres.

#### 👩‍🏫 Faculty & Administrative Control
- **Multistage Verification**: Dedicated approval queues with audit trails and feedback cycles.
- **Notice & Event Engine**: Institutional broadcasting system with integrated email notifications.
- **Granular Oversight**: Deep-dive into student records filtered by Department, Semester, and Section.
- **Auditing Tools**: One-click generation of PDF/Excel reports for NAAC and institutional compliance.

---

## 🛠️ Technical Implementation

### Frontend Stack (Modern Web)
- **Engine**: React 18 powered by **Vite** for optimized build performance.
- **Design System**: Strict vanilla CSS architecture focusing on institutional branding (Navy & Academic Gold).
- **Interactions**: **AOS (Animate On Scroll)** for professional micro-transitions.
- **Icons**: Comprehensive **Lucide-React** integration for clear semantic navigation.
- **Navigation**: Premium, bounce-free fixed navbar with brand accent ribboning.

### Backend Stack (Scalable API)
- **Engine**: Node.js & Express.js with a modular controller-service architecture.
- **Database**: MongoDB with advanced aggregation pipelines for real-time stats.
- **Security**: 
  - JWT (JSON Web Token) for stateless authentication.
  - Role-Based Access Control (RBAC) enforced at both route and middleware levels.
  - Sanitized data layers to prevent injection and unauthorized access.
- **Services**: Nodemailer for automated institutional communication.

---

## 📂 Project Structure

```text
SOEIT-Portal/
├── frontend/                   # Client-side React Application
│   ├── src/
│   │   ├── components/         # Reusable UI (Navbar, Footer, Modals)
│   │   ├── pages/              # Role-based views (Student, Faculty, Admin, Public)
│   │   ├── styles/             # Modular Design System (Global & Component CSS)
│   │   ├── services/           # Axios-based API abstraction Layer
│   │   └── context/            # Global State Management (Auth, Theme)
│   └── public/                 # Static assets & brand media
│
└── backend/                    # Server-side RESTful API
    ├── controllers/            # Feature-specific business logic
    ├── models/                 # Mongoose Schemas (User, Achievement, Notice)
    ├── routes/                 # Protected API endpoints
    ├── middleware/             # Auth guards & error handlers
    ├── config/                 # Database & service configurations
    └── uploads/                # Managed storage for student certificates
```

---

## 🚀 Setup & Deployment

### 1. Requirements
- Node.js (v18 or higher)
- MongoDB Atlas or Local MongoDB instance
- SMTP server (Gmail/Outlook) for notification features

### 2. Backend Configuration
Create `.env` in `/backend`:
```env
PORT=5000
MONGODB_URI=your_uri_here
JWT_SECRET=your_secret_here
SMTP_USER=official_email
SMTP_PASS=app_password
```

### 3. Quick Start
```bash
# Install dependencies
cd backend && npm install
cd ../frontend && npm install

# Run Backend (Terminal 1)
cd backend && npm run dev

# Run Frontend (Terminal 2)
cd frontend && npm run dev
```

---

## 📊 Future Roadmap
- [ ] AI-assisted certificate fraud detection.
- [ ] Integrated Hackathon/Event registration workflow.
- [ ] Advanced Departmental comparison analytics.

---

*Engineered for SOEIT, Arka Jain University — Commitment to Technical Excellence*

