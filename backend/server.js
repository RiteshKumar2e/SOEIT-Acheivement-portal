const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

if (!process.env.JWT_SECRET) {
    process.env.JWT_SECRET = 'soeit_dev_fallback_secret_do_not_use_in_production';
    console.warn('⚠️  JWT_SECRET not set in .env — using fallback (dev only)');
}
if (!process.env.JWT_EXPIRE) process.env.JWT_EXPIRE = '30d';
if (!process.env.PORT) process.env.PORT = '5000';
if (!process.env.NODE_ENV) process.env.NODE_ENV = 'development';

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const { connectDB, getDb } = require('./src/config/db');
const compression = require('compression');
const errorHandler = require('./src/middleware/errorHandler');

// Route imports
const authRoutes = require('./src/modules/auth/auth.routes');
const achievementRoutes = require('./src/modules/achievement/achievement.routes');
const adminRoutes = require('./src/modules/admin/admin.routes');
const eventRoutes = require('./src/modules/event/event.routes');
const noticeRoutes = require('./src/modules/notice/notice.routes');
const courseRoutes = require('./src/modules/course/course.routes');
const hackathonRoutes = require('./src/modules/hackathon/hackathon.routes');
const internshipRoutes = require('./src/modules/internship/internship.routes');
const internshipPostingRoutes = require('./src/modules/internship/internship-posting.routes');
const projectRoutes = require('./src/modules/project/project.routes');
const notificationRoutes = require('./src/modules/notification/notification.routes');
const badgeRoutes = require('./src/modules/badge/badge.routes');

// Connect to Turso Database (called in startServer)
// connectDB();

const app = express();

// High Performance Middleware
app.use(compression({ level: 6, threshold: 1024 })); // O(1) Compression for faster payloads
app.set('etag', 'strong'); // Leverage browser caching

// Security middleware
app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));

// CORS configuration
const allowedOrigins = [
    'http://localhost:3000',
    'http://localhost:5173',
    'http://localhost:8081',   // Expo web dev server
    'http://localhost:8082',
    'http://localhost:19006',  // Expo Go web
    'https://soeit-acheivement-portal.vercel.app',
    'https://soeit-acheivement-portal-5ojpz1d9b.vercel.app',
    'https://soeit-achievement-portal.onrender.com',
    'https://soeit-acheivement-portal.onrender.com',
    process.env.CLIENT_URL
].filter(Boolean);

// Matches any Vercel preview deployment for this project:
// e.g. soeit-acheivement-portal-<hash>-<team>.vercel.app
const vercelPreviewPattern = /^https:\/\/soeit-acheivement-portal(-[a-z0-9]+)*\.vercel\.app$/;

app.use(cors({
    origin: function (origin, callback) {
        // allow requests with no origin (like mobile apps or curl requests)
        if (!origin) return callback(null, true);
        if (
            allowedOrigins.indexOf(origin) !== -1 ||
            vercelPreviewPattern.test(origin) ||
            process.env.NODE_ENV === 'development'
        ) {
            callback(null, true);
        } else {
            console.log('CORS blocked origin:', origin);
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin'],
    exposedHeaders: ['Set-Cookie'],
    optionsSuccessStatus: 200 // Some legacy browsers crash on 204
}));

// Body parsers
app.use(express.json({ limit: '100mb' }));
app.use(express.urlencoded({ extended: true, limit: '100mb' }));
app.use(cookieParser());

// Logging (development only)
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

// Serve static uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const { getStats } = require('./src/utils/cache');

// Health check
app.get('/api/health', async (req, res) => {
    try {
        let dbStatus = 'Disconnected';
        try {
            const db = getDb();
            if (db) {
                await db.execute('SELECT 1');
                dbStatus = 'Connected';
            }
        } catch (dbErr) {
            dbStatus = `Uninitialized: ${dbErr.message}`;
        }

        res.status(200).json({
            success: true,
            message: 'SOEIT Achievements Portal API is running',
            database: `Turso (LibSQL) - ${dbStatus}`,
            cache: typeof getStats === 'function' ? getStats() : 'N/A',
            version: '2.0.1',
            timestamp: new Date().toISOString(),
        });
    } catch (err) {
        res.status(503).json({
            success: false,
            message: 'API is running but encountered a critical error',
            error: err.message,
            timestamp: new Date().toISOString(),
        });
    }
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/achievements', achievementRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/notices', noticeRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/hackathons', hackathonRoutes);
app.use('/api/internships', internshipRoutes);
app.use('/api/internship-postings', internshipPostingRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/badges', badgeRoutes);

// 404 handler
app.use((req, res) => {
    res.status(404).json({ success: false, message: `Route ${req.originalUrl} not found` });
});

// Error handler (must be last)
app.use(errorHandler);

const { initCronJobs } = require('./src/utils/cron');

// Start Server
const startServer = async () => {
    try {
        await connectDB();
        const PORT = process.env.PORT || 5000;
        const server = app.listen(PORT, () => {
            console.log(`\n🚀 SOEIT Achievements Portal API`);
            console.log(`📡 Server running on: http://localhost:${PORT}`);
            console.log(`🗄️  Database: Turso (LibSQL)`);
            console.log(`🌍 Environment: ${process.env.NODE_ENV}`);
            console.log(`📁 Uploads: http://localhost:${PORT}/uploads\n`);
        });

        // Initialize cron jobs
        initCronJobs();

        process.on('unhandledRejection', (err) => {
            console.error('Unhandled Rejection:', err.message);
            // In production, you might not want to exit immediately
            // server.close(() => process.exit(1));
        });
    } catch (err) {
        console.error('Failed to start server:', err.message);
        process.exit(1);
    }
};

startServer();

module.exports = app;
