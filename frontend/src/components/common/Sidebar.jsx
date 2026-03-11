import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
    LayoutDashboard, Trophy, Upload, User, BarChart3,
    CheckCircle, Users, Settings, LogOut, GraduationCap,
    FileText, X, Shield, Star, Calendar, ChevronLeft, ChevronRight, BookOpen, Activity, Terminal, Briefcase
} from 'lucide-react';

const studentLinks = [
    { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/events', icon: Calendar, label: 'Campus Events' },
    { to: '/achievements', icon: Trophy, label: 'My Achievements' },
    { to: '/achievements/upload', icon: Upload, label: 'Upload Achievement' },
    { to: '/courses', icon: BookOpen, label: 'Course Registry' },
    { to: '/internships', icon: Briefcase, label: 'My Internships' },
    { to: '/internship-opportunities', icon: Star, label: 'Internship Opportunities' },
    { to: '/hackathons', icon: Terminal, label: 'Live Hackathons' },
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
    { to: '/admin/courses', icon: BookOpen, label: 'Course Monitoring' },
    { to: '/admin/internships', icon: Briefcase, label: 'Internship Monitoring' },
    { to: '/admin/manage-internships', icon: Upload, label: 'Internship Postings' },
    { to: '/admin/hackathons', icon: Activity, label: 'Hackathon Control' },
    { to: '/profile', icon: User, label: 'My Profile' },
];

const Sidebar = ({ mobileOpen, onClose, collapsed, onToggleCollapse }) => {
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
            if (user?.role === 'faculty' && link.to === '/admin/manage-internships') return { ...link, to: '/faculty/manage-internships' };
            return link;
        });

    const handleLogout = async () => {
        await logout();
        // redirect is handled inside AuthContext.logout()
    };

    const getInitials = (name) => name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || 'U';

    return (
        <>
            {mobileOpen && (
                <div className="mobile-overlay" onClick={onClose} style={{ position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.4)', zIndex: 99, backdropFilter: 'blur(4px)' }} />
            )}
            <aside className={`sidebar ${mobileOpen ? 'mobile-open' : ''} ${collapsed ? 'collapsed' : ''}`}
                style={{
                    background: 'white',
                    borderRight: '1px solid var(--border-primary)',
                    display: 'flex',
                    flexDirection: 'column',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                }}>

                <div className="sidebar-header" style={{
                    padding: '2rem 1.5rem',
                    borderBottom: '1px solid var(--border-primary)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    position: 'relative',
                    transition: 'all 0.3s'
                }}>
                    <div className="branding-content" style={{ display: 'flex', alignItems: 'center', gap: '0.875rem', overflow: 'hidden' }}>
                        <div style={{ width: 44, height: 44, background: 'linear-gradient(135deg, var(--brand-700), var(--brand-900))', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, boxShadow: 'var(--shadow-sm)' }}>
                            <GraduationCap size={24} color="#fff" />
                        </div>
                        <div className="sidebar-text-expand" style={{ minWidth: 0, opacity: 1, transition: 'opacity 0.2s' }}>
                            <div style={{ fontSize: '1rem', fontWeight: 900, color: 'var(--text-primary)', letterSpacing: '-0.03em', lineHeight: 1 }}>SOEIT</div>
                            <div style={{ fontSize: '0.65rem', fontWeight: 800, color: 'var(--text-muted)', marginTop: '4px', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Credential Portal</div>
                        </div>
                    </div>

                    <button
                        onClick={onToggleCollapse}
                        className="sidebar-toggle display-desktop"
                        style={{
                            position: 'absolute',
                            right: '-14px',
                            top: '50%',
                            transform: 'translateY(-50%)',
                            width: '28px',
                            height: '28px',
                            borderRadius: '50%',
                            background: '#fff',
                            border: '1px solid var(--border-primary)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                            cursor: 'pointer',
                            zIndex: 10,
                            color: 'var(--brand-700)'
                        }}
                    >
                        {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
                    </button>

                    {mobileOpen && (
                        <button onClick={onClose} className="display-mobile" style={{ padding: '0.5rem', borderRadius: '8px', color: 'var(--text-muted)' }}>
                            <X size={20} />
                        </button>
                    )}
                </div>

                <div style={{ padding: '1.25rem 1rem', borderBottom: '1px solid var(--border-primary)', background: 'var(--slate-50)', transition: 'all 0.3s' }}>
                    <div className="identity-card" style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.75rem',
                        padding: '0.75rem',
                        background: 'white',
                        borderRadius: '14px',
                        border: '1px solid var(--border-primary)',
                        boxShadow: 'var(--shadow-xs)',
                        transition: 'all 0.3s'
                    }}>
                        {user?.profileImage ? (
                            <img src={`${import.meta.env.VITE_UPLOADS_URL || ''}${user.profileImage}`} alt={user.name} style={{ width: 40, height: 40, borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--slate-100)' }} />
                        ) : (
                            <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'var(--primary-100)', color: 'var(--brand-700)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '0.8rem', border: '2px solid var(--slate-100)' }}>{getInitials(user?.name)}</div>
                        )}
                        <div className="sidebar-text-expand" style={{ minWidth: 0 }}>
                            <div style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user?.name}</div>
                            <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>{user?.role} RESOLUTION</div>
                        </div>
                    </div>
                </div>

                <nav className="sidebar-nav" style={{ flex: 1, padding: '1.5rem 0.75rem', overflowY: 'auto' }}>
                    <div className="sidebar-text-expand" style={{ fontSize: '0.7rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.15em', color: 'var(--text-muted)', padding: '0 1rem 1rem', opacity: 0.6 }}>Operational Control</div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                        {filteredLinks.map(({ to, icon: Icon, label }) => (
                            <NavLink key={to} to={to} onClick={mobileOpen ? onClose : undefined}
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
                                        <Icon size={20} strokeWidth={isActive ? 2.5 : 2} style={{ flexShrink: 0 }} />
                                        <span className="sidebar-text-expand" style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{label}</span>
                                    </>
                                )}
                            </NavLink>
                        ))}
                    </div>
                </nav>

                <div style={{ padding: '1rem 0.75rem', borderTop: '1px solid var(--border-primary)' }}>
                    {isStudent && (
                        <NavLink to={`/portfolio/${user?._id}`} onClick={mobileOpen ? onClose : undefined}
                            className="admin-link-btn"
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.875rem',
                                padding: '0.875rem 1rem',
                                borderRadius: '12px',
                                fontWeight: 700,
                                fontSize: '0.9rem',
                                color: 'var(--success-700)',
                                background: 'var(--success-50)',
                                textDecoration: 'none',
                                marginBottom: '0.5rem',
                                border: '1px solid var(--success-100)',
                                transition: 'all 0.3s'
                            }}>
                            <Star size={20} fill="var(--success-600)" style={{ flexShrink: 0 }} />
                            <span className="sidebar-text-expand">Public Portfolio</span>
                        </NavLink>
                    )}
                    <button onClick={handleLogout}
                        className="admin-link-btn"
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.875rem',
                            padding: '0.875rem 1rem',
                            borderRadius: '12px',
                            fontWeight: 700,
                            fontSize: '0.9rem',
                            color: 'var(--error-600)',
                            background: 'rgba(239, 68, 68, 0.05)',
                            border: '1px solid rgba(239, 68, 68, 0.1)',
                            cursor: 'pointer',
                            width: '100%',
                            textAlign: 'left',
                            transition: 'all 0.3s'
                        }}>
                        <LogOut size={20} style={{ flexShrink: 0 }} />
                        <span className="sidebar-text-expand">Sign Out Portal</span>
                    </button>
                </div>
            </aside>
        </>
    );
};

export default Sidebar;
