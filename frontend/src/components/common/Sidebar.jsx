import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
    LayoutDashboard, Trophy, Upload, User, BarChart3,
    CheckCircle, Users, Settings, LogOut, GraduationCap,
    FileText, X, Shield, Star, Calendar
} from 'lucide-react';

const studentLinks = [
    { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/events', icon: Calendar, label: 'Campus Events' },
    { to: '/achievements', icon: Trophy, label: 'My Achievements' },
    { to: '/achievements/upload', icon: Upload, label: 'Upload Achievement' },
    { to: '/profile', icon: User, label: 'My Profile' },
];

const adminLinks = [
    { to: '/admin/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/events', icon: Calendar, label: 'Campus Events' },
    { to: '/admin/verify', icon: CheckCircle, label: 'Verify Achievements' },
    { to: '/admin/achievements', icon: Trophy, label: 'All Achievements' },
    { to: '/admin/students', icon: Users, label: 'Students' },
    { to: '/admin/faculty', icon: Shield, label: 'Faculty' },
    { to: '/admin/reports', icon: BarChart3, label: 'Reports & Analytics' },
    { to: '/profile', icon: User, label: 'My Profile' },
];

const Sidebar = ({ mobileOpen, onClose }) => {
    const { user, logout, isStudent } = useAuth();
    const navigate = useNavigate();
    const links = isStudent ? studentLinks : adminLinks;

    const filteredLinks = links
        .filter(link => {
            if (user?.role === 'faculty' && link.to === '/admin/faculty') return false;
            return true;
        })
        .map(link => {
            if (user?.role === 'faculty' && link.to === '/admin/dashboard') return { ...link, to: '/faculty/dashboard' };
            return link;
        });

    const handleLogout = async () => {
        await logout();
        navigate('/');
    };

    const getInitials = (name) => name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || 'U';

    return (
        <>
            {mobileOpen && (
                <div className="mobile-overlay" onClick={onClose} style={{ position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.4)', zIndex: 99, backdropFilter: 'blur(4px)' }} />
            )}
            <aside className={`sidebar ${mobileOpen ? 'mobile-open' : ''}`} style={{ background: 'white', borderRight: '1px solid var(--border-primary)', display: 'flex', flexDirection: 'column' }}>
                {/* Institutional Branding */}
                <div className="sidebar-header" style={{ padding: '2rem 1.5rem', borderBottom: '1px solid var(--border-primary)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem' }}>
                        <div style={{ width: 44, height: 44, background: 'linear-gradient(135deg, var(--brand-700), var(--brand-900))', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, boxShadow: 'var(--shadow-sm)' }}>
                            <GraduationCap size={24} color="#fff" />
                        </div>
                        <div style={{ minWidth: 0 }}>
                            <div style={{ fontSize: '1rem', fontWeight: 900, color: 'var(--text-primary)', letterSpacing: '-0.03em', lineHeight: 1 }}>SOEIT</div>
                            <div style={{ fontSize: '0.65rem', fontWeight: 800, color: 'var(--text-muted)', marginTop: '4px', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Credential Portal</div>
                        </div>
                    </div>
                </div>

                {/* Identity Suite */}
                <div style={{ padding: '1.25rem 1rem', borderBottom: '1px solid var(--border-primary)', background: 'var(--slate-50)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem', background: 'white', borderRadius: '14px', border: '1px solid var(--border-primary)', boxShadow: 'var(--shadow-xs)' }}>
                        {user?.profileImage ? (
                            <img src={`${import.meta.env.VITE_UPLOADS_URL || ''}${user.profileImage}`} alt={user.name} style={{ width: 40, height: 40, borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--slate-100)' }} />
                        ) : (
                            <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'var(--primary-100)', color: 'var(--brand-700)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '0.8rem', border: '2px solid var(--slate-100)' }}>{getInitials(user?.name)}</div>
                        )}
                        <div style={{ minWidth: 0 }}>
                            <div style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user?.name}</div>
                            <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>{user?.role} RESOLUTION</div>
                        </div>
                    </div>
                </div>

                {/* Navigation Ecosystem */}
                <nav style={{ flex: 1, padding: '1.5rem 0.75rem', overflowY: 'auto' }}>
                    <div style={{ fontSize: '0.7rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.15em', color: 'var(--text-muted)', padding: '0 1rem 1rem', opacity: 0.6 }}>Operational Control</div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                        {filteredLinks.map(({ to, icon: Icon, label }) => (
                            <NavLink key={to} to={to} onClick={onClose}
                                className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
                                style={({ isActive }) => ({
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.875rem',
                                    padding: '0.875rem 1rem',
                                    borderRadius: '12px',
                                    fontWeight: isActive ? 800 : 600,
                                    fontSize: '0.9rem',
                                    color: isActive ? 'var(--brand-700)' : 'var(--text-secondary)',
                                    background: isActive ? 'var(--primary-50)' : 'transparent',
                                    transition: 'all 0.2s ease',
                                    textDecoration: 'none',
                                    border: isActive ? '1px solid var(--primary-100)' : '1px solid transparent'
                                })}>
                                {({ isActive }) => (
                                    <>
                                        <Icon size={20} strokeWidth={isActive ? 2.5 : 2} />
                                        <span>{label}</span>
                                    </>
                                )}
                            </NavLink>
                        ))}
                    </div>
                </nav>

                {/* Administrative Actions */}
                <div style={{ padding: '1rem 0.75rem', borderTop: '1px solid var(--border-primary)' }}>
                    {isStudent && (
                        <NavLink to={`/portfolio/${user?._id}`} onClick={onClose}
                            style={{ display: 'flex', alignItems: 'center', gap: '0.875rem', padding: '0.875rem 1rem', borderRadius: '12px', fontWeight: 700, fontSize: '0.9rem', color: 'var(--success-700)', background: 'var(--success-50)', textDecoration: 'none', marginBottom: '0.5rem', border: '1px solid var(--success-100)' }}>
                            <Star size={20} fill="var(--success-600)" />
                            <span>Public Portfolio</span>
                        </NavLink>
                    )}
                    <button onClick={handleLogout}
                        style={{ display: 'flex', alignItems: 'center', gap: '0.875rem', padding: '0.875rem 1rem', borderRadius: '12px', fontWeight: 700, fontSize: '0.9rem', color: 'var(--error-600)', background: 'rgba(239, 68, 68, 0.05)', border: '1px solid rgba(239, 68, 68, 0.1)', cursor: 'pointer', width: '100%', textAlign: 'left' }}>
                        <LogOut size={20} />
                        <span>Sign Out Portal</span>
                    </button>
                </div>
            </aside>
        </>
    );
};

export default Sidebar;
