import {
    LayoutDashboard, Trophy, Upload, User, BarChart3,
    CheckCircle, Users, Settings, LogOut, GraduationCap,
    FileText, X, Shield, Star, Calendar, ChevronLeft, ChevronRight, BookOpen, Activity, Terminal, Briefcase, Layers
} from 'lucide-react';

export const studentLinks = [
    {
        title: 'Main Menu',
        links: [
            { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
            { to: '/events', icon: Calendar, label: 'Campus Events' },
        ]
    },
    {
        title: 'Achievements',
        links: [
            { to: '/achievements', icon: Trophy, label: 'My Achievements' },
            { to: '/achievements/upload', icon: Upload, label: 'Upload Achievement' },
        ]
    },
    {
        title: 'Academic',
        links: [
            { to: '/courses', icon: BookOpen, label: 'Course Registry' },
            { to: '/projects', icon: Layers, label: 'My Projects' },
        ]
    },
    {
        title: 'Career & Talent',
        links: [
            { to: '/internships', icon: Briefcase, label: 'My Internships' },
            { to: '/internship-opportunities', icon: Star, label: 'Internship Opportunities' },
            { to: '/hackathons', icon: Terminal, label: 'Live Hackathons' },
        ]
    },
    {
        title: 'Account',
        links: [
            { to: '/profile', icon: User, label: 'My Profile' },
        ]
    }
];

export const adminLinks = [
    {
        title: 'Main Menu',
        links: [
            { to: '/admin/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
            { to: '/events', icon: Calendar, label: 'Campus Events' },
        ]
    },
    {
        title: 'Achievements',
        links: [
            { to: '/admin/verify', icon: CheckCircle, label: 'Verify Achievements' },
            { to: '/admin/achievements', icon: Trophy, label: 'All Achievements' },
        ]
    },
    {
        title: 'Academic',
        links: [
            { to: '/admin/students', icon: Users, label: 'Students' },
            { to: '/admin/faculty', icon: Shield, label: 'Faculty' },
            { to: '/admin/courses', icon: BookOpen, label: 'Course Monitoring' },
            { to: '/admin/projects', icon: Layers, label: 'Project Monitoring' },
        ]
    },
    {
        title: 'Resources',
        links: [
            { to: '/admin/manage-internships', icon: Upload, label: 'Internship Postings' },
            { to: '/admin/internships', icon: Briefcase, label: 'Internship Monitoring' },
            { to: '/admin/hackathons', icon: Activity, label: 'Hackathon Control' },
        ]
    },
    {
        title: 'Analytics',
        links: [
            { to: '/admin/reports', icon: BarChart3, label: 'Reports & Analytics' },
        ]
    }

];
