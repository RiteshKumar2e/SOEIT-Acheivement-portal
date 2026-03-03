import { Bell, Menu, Search, GraduationCap } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const Topbar = ({ onMenuClick, title }) => {
    const { user } = useAuth();
    const getInitials = (name) => name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || 'U';

    return (
        <header className="topbar" style={{ background: 'rgba(255, 255, 255, 0.8)', backdropFilter: 'blur(12px)', borderBottom: '1px solid var(--border-primary)', padding: '0 2rem', height: '72px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 90 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                <button onClick={onMenuClick} className="mobile-only btn-ghost" style={{ padding: '0.625rem', borderRadius: '12px', background: 'var(--slate-50)', color: 'var(--slate-600)', display: 'none' }}>
                    <Menu size={22} />
                </button>
                <div>
                    <h1 style={{ fontSize: '1.25rem', fontWeight: 900, color: 'var(--text-primary)', letterSpacing: '-0.03em', margin: 0 }}>{title}</h1>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '2px' }}>
                        <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--brand-500)' }}></div>
                        <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 700, margin: 0, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                            {new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                        </p>
                    </div>
                </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
                {/* Search / Global Action could go here */}

                <button className="btn-ghost" style={{ width: 44, height: 44, padding: 0, borderRadius: '12px', position: 'relative', background: 'var(--slate-50)', color: 'var(--slate-600)', border: '1px solid var(--border-primary)' }}>
                    <Bell size={20} strokeWidth={2.5} />
                    <span style={{ position: 'absolute', top: '10px', right: '10px', width: '10px', height: '10px', background: 'var(--error-500)', borderRadius: '50%', border: '2px solid white', boxShadow: '0 0 0 2px rgba(239, 68, 68, 0.1)' }}></span>
                </button>

                <div style={{ height: '32px', width: '1px', background: 'var(--border-primary)', margin: '0 0.25rem' }}></div>

                {/* Refined User Profile Pill */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem', padding: '0.5rem', paddingRight: '1rem', borderRadius: '16px', background: 'white', border: '1px solid var(--border-primary)', boxShadow: 'var(--shadow-sm)' }}>
                    {user?.profileImage ? (
                        <img src={`${import.meta.env.VITE_UPLOADS_URL || ''}${user.profileImage}`} alt={user.name} style={{ width: 36, height: 36, borderRadius: '10px', objectFit: 'cover', border: '2px solid var(--slate-100)' }} />
                    ) : (
                        <div style={{ width: 36, height: 36, borderRadius: '10px', background: 'linear-gradient(135deg, var(--brand-600), var(--brand-800))', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: '0.75rem', border: '2px solid var(--slate-100)' }}>{getInitials(user?.name)}</div>
                    )}
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <span style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--text-primary)', lineHeight: 1.1 }}>{user?.name?.split(' ')[0]}</span>
                        <span style={{ fontSize: '0.65rem', color: 'var(--brand-600)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.02em', marginTop: '2px' }}>{user?.role}</span>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Topbar;
