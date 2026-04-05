import { Platform } from 'react-native';

const IP_ADDRESS = '192.168.1.100'; // Replace this with your current IPv4 from ipconfig

// API URL
export const API_BASE_URL = 'https://soeit-acheivement-portal.onrender.com/api';

// For Android/iOS local network: 'http://<YOUR_LOCAL_IP>:5000/api'
// For Android emulator: 'http://10.0.2.2:5000/api'

export const ROUTES = {
  // Auth
  LOGIN: '/auth/login',
  REGISTER: '/auth/register',
  ME: '/auth/me',
  LOGOUT: '/auth/logout',
  FORGOT_PASSWORD: '/auth/forgot-password',

  // Achievements
  ACHIEVEMENTS: '/achievements',
  MY_ACHIEVEMENTS: '/achievements/my',
  UPLOAD_ACHIEVEMENT: '/achievements',

  // Admin
  ADMIN_STATS: '/admin/dashboard',
  ADMIN_USERS: '/admin/users',
  ADMIN_STUDENTS: '/admin/students',
  ADMIN_FACULTY: '/admin/faculty',
  VERIFY_ACHIEVEMENTS: '/achievements/pending',

  // Events
  EVENTS: '/events',

  // Notices
  NOTICES: '/notices',

  // Courses
  COURSES: '/courses',

  // Hackathons
  HACKATHONS: '/hackathons',

  // Internships
  INTERNSHIPS: '/internships',
  INTERNSHIP_POSTINGS: '/internship-postings',

  // Projects
  PROJECTS: '/projects',

  // Notifications
  NOTIFICATIONS: '/notifications',
};
