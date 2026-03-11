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
const { connectDB } = require('./config/db');
const errorHandler = require('./middleware/errorHandler');

// Route imports
const authRoutes = require('./routes/authRoutes');
const achievementRoutes = require('./routes/achievementRoutes');
const adminRoutes = require('./routes/adminRoutes');
const eventRoutes = require('./routes/eventRoutes');
const noticeRoutes = require('./routes/noticeRoutes');
const courseRoutes = require('./routes/courseRoutes');
const hackathonRoutes = require('./routes/hackathonRoutes');
const internshipRoutes = require('./routes/internshipRoutes');
const internshipPostingRoutes = require('./routes/internshipPostingRoutes');

// Connect to Turso Database
connectDB();

const app = express();

// Security middleware
app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));

// CORS configuration
const allowedOrigins = [
    'http://localhost:5173',
    'http://localhost:3000',
    'https://soeit-acheivement-portal.vercel.app',
    'https://soeit-acheivement-portal.onrender.com',
    process.env.CLIENT_URL
].filter(Boolean);

app.use(cors({
    origin: function (origin, callback) {
        // Log origin for debugging (check Render logs)
        if (origin) console.log(`Incoming request from origin: ${origin}`);

        if (!origin) return callback(null, true);

        const isAllowed = allowedOrigins.includes(origin) ||
            origin.includes('vercel.app') ||
            origin.includes('onrender.com') ||
            origin.includes('localhost:');

        if (isAllowed) {
            callback(null, true);
        } else {
            console.warn(`CORS blocked for: ${origin}`);
            callback(null, false);
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin'],
    exposedHeaders: ['Set-Cookie']
}));

// Body parsers
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

// Logging (development only)
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

// Serve static uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Health check
app.get('/api/health', (req, res) => {
    res.status(200).json({
        success: true,
        message: 'SOEIT Achievements Portal API is running',
        database: 'Turso (LibSQL)',
        version: '2.0.0',
        timestamp: new Date().toISOString(),
    });
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

// 404 handler
app.use((req, res) => {
    res.status(404).json({ success: false, message: `Route ${req.originalUrl} not found` });
});

// Error handler (must be last)
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
    console.log(`\n🚀 SOEIT Achievements Portal API`);
    console.log(`📡 Server running on: http://localhost:${PORT}`);
    console.log(`🗄️  Database: Turso (LibSQL)`);
    console.log(`🌍 Environment: ${process.env.NODE_ENV}`);
    console.log(`📁 Uploads: http://localhost:${PORT}/uploads\n`);
});

process.on('unhandledRejection', (err) => {
    console.error('Unhandled Rejection:', err.message);
    server.close(() => process.exit(1));
});

module.exports = app;
