import { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import Topbar from './Topbar';

const pageTitles = {
    '/dashboard': 'Dashboard',
    '/achievements': 'My Achievements',
    '/achievements/upload': 'Upload Achievement',
    '/profile': 'My Profile',
    '/events': 'Campus Events',
    '/admin/dashboard': 'Admin Dashboard',
    '/admin/verify': 'Verify Achievements',
    '/admin/achievements': 'All Achievements',
    '/admin/students': 'Student Management',
    '/admin/faculty': 'Faculty Management',
    '/admin/reports': 'Reports & Analytics',
};

const DashboardLayout = () => {
    const [mobileOpen, setMobileOpen] = useState(false);
    const [collapsed, setCollapsed] = useState(false);
    const { pathname } = useLocation();
    const title = pageTitles[pathname] || 'SOEIT Portal';

    return (
        <div className={`dashboard-layout ${collapsed ? 'sidebar-collapsed' : ''}`}>
            <Sidebar
                mobileOpen={mobileOpen}
                onClose={() => setMobileOpen(false)}
                collapsed={collapsed}
                onToggleCollapse={() => setCollapsed(!collapsed)}
            />
            <div className={`main-content ${collapsed ? 'collapsed' : ''}`}>
                <Topbar onMenuClick={() => setMobileOpen(true)} title={title} />
                <main className="page-content">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default DashboardLayout;
