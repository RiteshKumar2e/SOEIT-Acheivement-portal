import React, { useState, useEffect, useRef } from 'react';
import { Bell, Menu, Search, GraduationCap, X, Check, Info, Calendar, Trophy } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { notificationAPI } from '../../services/api';

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

const Topbar = ({ onMenuClick, title }) => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [notifications, setNotifications] = useState([]);
    const [showNotifications, setShowNotifications] = useState(false);
    const dropdownRef = useRef(null);
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
            const interval = setInterval(fetchNotifications, 30000); // Poll every 30s
            return () => clearInterval(interval);
        }
    }, [user]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setShowNotifications(false);
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

    const unreadCount = notifications.filter(n => !n.isRead).length;

    return (
        <header className="topbar" style={{ background: 'rgba(255, 255, 255, 0.8)', backdropFilter: 'blur(12px)', borderBottom: '1px solid var(--border-primary)', padding: '0 2rem', height: '72px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 90 }}>
            <div className="topbar-left" style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                <button onClick={onMenuClick} className="mobile-only btn-ghost" style={{ padding: '0.625rem', borderRadius: '12px', background: 'var(--slate-50)', color: 'var(--slate-600)' }}>
                    <Menu size={22} />
                </button>
                <div className="topbar-title-wrapper">
                    <h1 className="topbar-title" style={{ fontSize: '1.25rem', fontWeight: 900, color: 'var(--text-primary)', letterSpacing: '-0.03em', margin: 0 }}>{title}</h1>
                    <div className="topbar-date-wrapper" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '2px' }}>
                        <div className="topbar-date-dot" style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--brand-500)' }}></div>
                        <p className="topbar-date" style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 700, margin: 0, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                            {new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                        </p>
                    </div>
                </div>
            </div>

            <div className="topbar-right" style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
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

                {/* Refined User Profile Pill */}
                <div 
                    className="user-profile-pill" 
                    onClick={() => navigate('/profile')}
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
                    <div className="user-info-text" style={{ display: 'flex', flexDirection: 'column' }}>
                        <span className="user-name" style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--text-primary)', lineHeight: 1.1 }}>{user?.name?.split(' ')[0]}</span>
                        <span className="user-role" style={{ fontSize: '0.65rem', color: 'var(--brand-600)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.02em', marginTop: '2px' }}>{user?.role}</span>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Topbar;
