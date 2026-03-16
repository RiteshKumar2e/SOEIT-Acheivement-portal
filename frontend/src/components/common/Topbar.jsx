import React, { useState, useEffect, useRef } from 'react';
import { Bell, Menu, Search, GraduationCap, X, Check, Info, Calendar, Trophy, ChevronDown, LogOut, User, Star } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate, NavLink } from 'react-router-dom';
import { notificationAPI } from '../../services/api';
import { studentLinks, adminLinks } from '../../constants/navigation';

const NotificationItem = ({ notification, onRead }) => {
    const getIcon = (type) => {
        switch (type) {
            case 'notice': return <Info size={16} className="text-secondary" />;
            case 'event': return <Calendar size={16} className="text-brand" />;
            case 'achievement': return <Trophy size={16} className="text-warning" />;
            default: return <Bell size={16} />;
        }
    };

    return (
        <div 
            onClick={() => onRead(notification.id)}
            style={{
                padding: '1rem',
                borderBottom: '1px solid var(--border-primary)',
                cursor: 'pointer',
                background: notification.isRead ? 'transparent' : 'var(--primary-50)',
                transition: 'all 0.2s',
                display: 'flex',
                gap: '0.75rem'
            }}
            className="hover-slate"
        >
            <div style={{
                width: 32, height: 32, borderRadius: '8px', 
                background: 'white', display: 'flex', alignItems: 'center', 
                justifyContent: 'center', flexShrink: 0, border: '1px solid var(--border-primary)'
            }}>
                {getIcon(notification.type)}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '2px' }}>{notification.title}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{notification.message}</div>
                <div style={{ fontSize: '0.65rem', color: 'var(--slate-400)', marginTop: '4px', fontWeight: 600 }}>
                    {new Date(notification.createdAt).toLocaleDateString()}
                </div>
            </div>
            {!notification.isRead && (
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--brand-500)', marginTop: '4px' }}></div>
            )}
        </div>
    );
};

const NavDropdown = ({ category }) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const isMainMenu = category.title === 'Main Menu';

    if (isMainMenu) {
        return (
            <div style={{ display: 'flex', gap: '0.5rem' }}>
                {category.links.map(link => (
                    <NavLink 
                        key={link.to} 
                        to={link.to} 
                        className={({ isActive }) => `desktop-nav-link ${isActive ? 'active' : ''}`}
                        style={({ isActive }) => ({
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.625rem',
                            padding: '0.625rem 1rem',
                            borderRadius: '12px',
                            fontSize: '0.9rem',
                            fontWeight: 700,
                            color: isActive ? 'var(--brand-700)' : 'var(--slate-600)',
                            background: isActive ? 'var(--primary-50)' : 'transparent',
                            transition: 'all 0.2s ease',
                            whiteSpace: 'nowrap',
                            border: isActive ? '1px solid var(--brand-200)' : '1px solid transparent'
                        })}
                    >
                        {({ isActive }) => (
                            <>
                                <link.icon size={18} strokeWidth={isActive ? 2.5 : 2} style={{ color: isActive ? 'var(--brand-600)' : 'var(--slate-500)' }} />
                                {link.label}
                            </>
                        )}
                    </NavLink>
                ))}

            </div>
        );
    }

    return (
        <div style={{ position: 'relative' }} ref={dropdownRef}>
            <button 
                onClick={() => setIsOpen(!isOpen)}
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    padding: '0.625rem 1.125rem',
                    borderRadius: '12px',
                    fontSize: '0.9rem',
                    fontWeight: 700,
                    color: isOpen ? 'var(--brand-700)' : 'var(--slate-600)',
                    background: isOpen ? 'var(--primary-50)' : 'transparent',
                    transition: 'all 0.2s ease',
                    whiteSpace: 'nowrap',
                    border: isOpen ? '1px solid var(--brand-200)' : '1px solid transparent',
                    cursor: 'pointer'
                }}
                className="desktop-nav-dropdown-trigger"
            >
                {category.title}
                <ChevronDown size={14} style={{ 
                    opacity: 0.7,
                    transform: isOpen ? 'rotate(180deg)' : 'none', 
                    transition: 'transform 0.2s',
                    color: isOpen ? 'var(--brand-600)' : 'inherit'
                }} />
            </button>

            {isOpen && (
                <div style={{
                    position: 'absolute',
                    top: 'calc(100% + 8px)',
                    left: 0,
                    minWidth: '220px',
                    background: 'white',
                    borderRadius: '14px',
                    border: '1px solid var(--border-primary)',
                    boxShadow: 'var(--shadow-lg)',
                    padding: '0.5rem',
                    zIndex: 1000,
                    animation: 'slideUp 0.2s ease-out'
                }}>
                    {category.links.map(link => (
                        <NavLink 
                            key={link.to} 
                            to={link.to} 
                            onClick={() => setIsOpen(false)}
                            className={({ isActive }) => `dropdown-item ${isActive ? 'active' : ''}`}
                            style={({ isActive }) => ({
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.75rem',
                                padding: '0.75rem 0.875rem',
                                borderRadius: '10px',
                                fontSize: '0.85rem',
                                fontWeight: 600,
                                color: isActive ? 'var(--brand-700)' : 'var(--text-secondary)',
                                background: isActive ? 'var(--primary-50)' : 'transparent',
                                transition: 'all 0.2s',
                                textDecoration: 'none'
                            })}
                        >
                            {({ isActive }) => (
                                <>
                                    <link.icon size={18} strokeWidth={isActive ? 2.5 : 2} />
                                    {link.label}
                                </>
                            )}
                        </NavLink>
                    ))}
                </div>
            )}
        </div>
    );
};

const Topbar = ({ onMenuClick, title }) => {
    const { user, isStudent, logout } = useAuth();
    const navigate = useNavigate();
    const [notifications, setNotifications] = useState([]);
    const [showNotifications, setShowNotifications] = useState(false);
    const [showUserMenu, setShowUserMenu] = useState(false);
    const dropdownRef = useRef(null);
    const userMenuRef = useRef(null);
    
    const categories = isStudent ? studentLinks : adminLinks;

    const getFilteredLinks = (categoryTitle) => {
        const category = categories.find(c => c.title === categoryTitle);
        if (!category) return [];
        return category.links
            .filter(link => {
                if (user?.role === 'faculty' && link.to === '/admin/faculty') return false;
                if (user?.role === 'faculty' && link.to === '/profile') return false;
                return true;
            })
            .map(link => {
                if (user?.role === 'faculty' && link.to === '/admin/dashboard') return { ...link, to: '/faculty/dashboard' };
                if (user?.role === 'faculty' && link.to === '/admin/manage-internships') return { ...link, to: '/faculty/manage-internships' };
                if (user?.role === 'faculty' && link.to === '/admin/projects') return { ...link, to: '/faculty/projects' };
                return link;
            });
    };

    const mainMenuLinks = getFilteredLinks('Main Menu');
    const topbarNavItems = [
        { title: 'Main Menu', links: mainMenuLinks, isStandalone: true },
        ...categories
            .filter(c => !['Main Menu', 'Account'].includes(c.title))
            .map(c => ({
                title: c.title,
                links: getFilteredLinks(c.title)
            }))
    ].filter(item => item.links.length > 0);


    const getInitials = (name) => name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || 'U';

    const fetchNotifications = async () => {
        try {
            const res = await notificationAPI.getAll();
            setNotifications(res.data.data);
        } catch (err) {
            console.error('Failed to fetch notifications:', err);
        }
    };

    useEffect(() => {
        if (user) {
            fetchNotifications();
            const interval = setInterval(fetchNotifications, 30000);
            return () => clearInterval(interval);
        }
    }, [user]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setShowNotifications(false);
            }
            if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
                setShowUserMenu(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const markAsRead = async (id) => {
        try {
            await notificationAPI.markAsRead(id);
            setNotifications(notifications.map(n => n.id === id ? { ...n, isRead: true } : n));
        } catch (err) {
            console.error('Failed to mark notification as read:', err);
        }
    };

    const markAllRead = async () => {
        try {
            await notificationAPI.markAllAsRead();
            setNotifications(notifications.map(n => ({ ...n, isRead: true })));
        } catch (err) {
            console.error('Failed to mark all as read:', err);
        }
    };

    const handleLogout = async () => {
        await logout();
    };

    const unreadCount = notifications.filter(n => !n.isRead).length;

    return (
        <header className="topbar" style={{ 
            background: 'rgba(255, 255, 255, 0.95)', 
            backdropFilter: 'blur(12px)', 
            borderBottom: '1px solid var(--border-primary)', 
            padding: '0 2rem', 
            height: '80px', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between', 
            position: 'sticky', 
            top: 0, 
            zIndex: 100 
        }}>
            <div className="topbar-left" style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', flex: '1 1 0', minWidth: 0 }}>
                {/* Branding shown on Desktop since Sidebar is hidden */}
                <div className="display-desktop" style={{ display: 'flex', alignItems: 'center', gap: '0.875rem' }}>
                    <div style={{ width: 40, height: 40, background: 'linear-gradient(135deg, var(--brand-700), var(--brand-900))', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <GraduationCap size={22} color="#fff" />
                    </div>
                    <div style={{ lineHeight: 1 }}>
                        <div style={{ fontSize: '1rem', fontWeight: 900, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>SOEIT</div>
                        <div style={{ fontSize: '0.6rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Achievement</div>
                    </div>
                </div>

                <button onClick={onMenuClick} className="display-mobile btn-ghost" style={{ padding: '0.625rem', borderRadius: '12px', background: 'var(--slate-50)', color: 'var(--slate-600)' }}>
                    <Menu size={22} />
                </button>
            </div>

            {/* Desktop Menu - Centered */}
            <div className="topbar-center display-desktop" style={{ flex: '2 1 0', display: 'flex', justifyContent: 'center' }}>
                <nav style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    {topbarNavItems.map((item, idx) => (
                        <NavDropdown key={idx} category={item} />
                    ))}
                </nav>
            </div>

            <div className="topbar-right" style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', flex: '1 1 0', justifyContent: 'flex-end' }}>

                <div style={{ position: 'relative' }} ref={dropdownRef}>
                    <button 
                        className="notification-btn btn-ghost" 
                        onClick={() => setShowNotifications(!showNotifications)}
                        style={{ width: 44, height: 44, padding: 0, borderRadius: '12px', position: 'relative', background: 'var(--slate-50)', color: 'var(--slate-600)', border: '1px solid var(--border-primary)' }}
                    >
                        <Bell size={20} strokeWidth={2.5} />
                        {unreadCount > 0 && (
                            <span className="notification-dot" style={{ position: 'absolute', top: '10px', right: '10px', width: '10px', height: '10px', background: 'var(--error-500)', borderRadius: '50%', border: '2px solid white', boxShadow: '0 0 0 2px rgba(239, 68, 68, 0.1)' }}></span>
                        )}
                    </button>

                    {showNotifications && (
                        <div style={{
                            position: 'absolute', top: '60px', right: 0, width: '320px', 
                            background: 'white', border: '1px solid var(--border-primary)', 
                            borderRadius: '16px', boxShadow: 'var(--shadow-xl)', overflow: 'hidden',
                            zIndex: 100
                        }}>
                            <div style={{ padding: '1rem', borderBottom: '1px solid var(--border-primary)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--slate-50)' }}>
                                <span style={{ fontWeight: 800, fontSize: '0.9rem' }}>Notifications</span>
                                {unreadCount > 0 && (
                                    <button onClick={markAllRead} style={{ fontSize: '0.7rem', color: 'var(--brand-600)', fontWeight: 700 }}>Mark all read</button>
                                )}
                            </div>
                            <div style={{ maxHeight: '360px', overflowY: 'auto' }}>
                                {notifications.length > 0 ? (
                                    notifications.map(n => (
                                        <NotificationItem key={n.id} notification={n} onRead={markAsRead} />
                                    ))
                                ) : (
                                    <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                                        <Bell size={32} style={{ marginBottom: '0.5rem', opacity: 0.2 }} />
                                        <p>No new notifications</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>

                <div className="topbar-divider" style={{ height: '32px', width: '1px', background: 'var(--border-primary)', margin: '0 0.25rem' }}></div>

                <div style={{ position: 'relative' }} ref={userMenuRef}>
                    <div 
                        className="user-profile-pill" 
                        onClick={() => setShowUserMenu(!showUserMenu)}
                        style={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            gap: '0.875rem', 
                            padding: '0.5rem', 
                            paddingRight: '1rem', 
                            borderRadius: '16px', 
                            background: 'white', 
                            border: '1px solid var(--border-primary)', 
                            boxShadow: 'var(--shadow-sm)',
                            cursor: 'pointer',
                            transition: 'all 0.2s ease'
                        }}>
                        {user?.profileImage ? (
                            <img className="user-avatar" src={`${import.meta.env.VITE_UPLOADS_URL || ''}${user.profileImage}`} alt={user.name} style={{ width: 36, height: 36, borderRadius: '10px', objectFit: 'cover', border: '2px solid var(--slate-100)' }} />
                        ) : (
                            <div className="user-avatar-initials" style={{ width: 36, height: 36, borderRadius: '10px', background: 'linear-gradient(135deg, var(--brand-600), var(--brand-800))', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: '0.75rem', border: '2px solid var(--slate-100)' }}>{getInitials(user?.name)}</div>
                        )}
                        <div className="user-info-text display-desktop" style={{ display: 'flex', flexDirection: 'column' }}>
                            <span className="user-name" style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--text-primary)', lineHeight: 1.1 }}>{user?.name?.split(' ')[0]}</span>
                            <span className="user-role" style={{ fontSize: '0.65rem', color: 'var(--brand-600)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.02em', marginTop: '2px' }}>{user?.role}</span>
                        </div>
                        <ChevronDown size={14} className="display-desktop" style={{ color: 'var(--text-muted)', transform: showUserMenu ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
                    </div>

                    {showUserMenu && (
                        <div style={{
                            position: 'absolute',
                            top: 'calc(100% + 8px)',
                            right: 0,
                            width: '240px',
                            background: 'white',
                            borderRadius: '16px',
                            border: '1px solid var(--border-primary)',
                            boxShadow: 'var(--shadow-xl)',
                            padding: '0.5rem',
                            zIndex: 1000,
                            animation: 'slideUp 0.2s ease-out'
                        }}>
                             <div style={{ padding: '0.75rem 0.875rem', borderBottom: '1px solid var(--border-primary)', marginBottom: '0.5rem' }}>
                                <div style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--text-primary)' }}>{user?.name}</div>
                                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{user?.email}</div>
                            </div>
                            
                            <NavLink to="/profile" onClick={() => setShowUserMenu(false)} className="dropdown-item" style={{ 
                                display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem 0.875rem', borderRadius: '10px', fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-secondary)', textDecoration: 'none'
                            }}>
                                <User size={18} />
                                My Profile
                            </NavLink>

                            {isStudent && (
                                <NavLink to={`/portfolio/${user?._id}`} onClick={() => setShowUserMenu(false)} className="dropdown-item" style={{ 
                                    display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem 0.875rem', borderRadius: '10px', fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-secondary)', textDecoration: 'none'
                                }}>
                                    <Star size={18} />
                                    Public Portfolio
                                </NavLink>
                            )}

                            <button onClick={handleLogout} className="dropdown-item" style={{ 
                                display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem 0.875rem', borderRadius: '10px', fontSize: '0.875rem', fontWeight: 600, color: 'var(--error-600)', width: '100%', textAlign: 'left'
                            }}>
                                <LogOut size={18} />
                                Logout
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
};

export default Topbar;

