import '../../styles/AdminSettingsPage.css';
import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { authAPI } from '../../services/api';
import { Settings, User, Key, Shield, Bell, Save, Eye, EyeOff } from 'lucide-react';
import toast from 'react-hot-toast';

const AdminSettingsPage = () => {
    const { user, updateUser } = useAuth();
    const [tab, setTab] = useState('profile');
    const [form, setForm] = useState({ name: user?.name || '', phone: user?.phone || '', bio: user?.bio || '' });
    const [pwForm, setPwForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
    const [showPw, setShowPw] = useState({ current: false, new: false, confirm: false });
    const [loading, setLoading] = useState(false);
    const [pwLoading, setPwLoading] = useState(false);

    const handleProfileSave = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const fd = new FormData();
            Object.entries(form).forEach(([k, v]) => v && fd.append(k, v));
            const { data } = await authAPI.updateProfile(fd);
            updateUser(data.user);
            toast.success('Administrative identity synchronized');
        } catch (err) {
            toast.error(err.response?.data?.message || 'Identity update failed');
        } finally {
            setLoading(false);
        }
    };

    const handlePasswordChange = async (e) => {
        e.preventDefault();
        if (pwForm.newPassword !== pwForm.confirmPassword) { toast.error('Security mismatch: Credentials not identical'); return; }
        if (pwForm.newPassword.length < 6) { toast.error('Security protocol: Password must exceed 6 characters'); return; }
        setPwLoading(true);
        try {
            await authAPI.changePassword({ currentPassword: pwForm.currentPassword, newPassword: pwForm.newPassword });
            toast.success('Security protocol updated: Password rotated');
            setPwForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
        } catch (err) {
            toast.error(err.response?.data?.message || 'Security rotation failed');
        } finally {
            setPwLoading(false);
        }
    };

    const tabs = [
        { key: 'profile', label: 'Identity Control', icon: User },
        { key: 'password', label: 'Security Protocols', icon: Shield },
        { key: 'notifications', label: 'Sync Preferences', icon: Bell }
    ];

    return (
        <div className="animate-fade-in" style={{ maxWidth: '900px', margin: '0 auto' }}>
            {/* Header Suite */}
            <div className="page-header" style={{ marginBottom: '2.5rem' }}>
                <h2 className="heading-display">Governance Settings</h2>
                <p className="page-subtitle">Administrative oversight for personal credentials, security integrity, and synchronization protocols.</p>
            </div>

            {/* Current Executive Context */}
            <div className="card" style={{ marginBottom: '2rem', padding: '2rem', background: 'linear-gradient(135deg, var(--brand-700), var(--brand-900))', position: 'relative', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', top: '-10%', right: '-5%', width: '200px', height: '200px', background: 'rgba(255,255,255,0.03)', borderRadius: '50%' }}></div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '2rem', position: 'relative', zIndex: 1 }}>
                    <div className="avatar avatar-xl" style={{ width: 100, height: 100, fontSize: '2rem', fontWeight: 900, background: 'rgba(255,255,255,0.15)', color: 'white', border: '4px solid rgba(255,255,255,0.2)' }}>
                        {user?.name?.charAt(0)?.toUpperCase()}
                    </div>
                    <div style={{ color: 'white' }}>
                        <h3 style={{ margin: 0, fontSize: '1.75rem', fontWeight: 900, letterSpacing: '-0.01em' }}>{user?.name}</h3>
                        <p style={{ margin: '0.25rem 0 1rem 0', opacity: 0.8, fontSize: '0.95rem', fontWeight: 600 }}>{user?.email}</p>
                        <div style={{ display: 'flex', gap: '0.75rem' }}>
                            <span className="badge" style={{ background: 'rgba(255,255,255,0.15)', color: 'white', border: 'none', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{user?.role} ACCESS</span>
                            <span className="badge" style={{ background: 'rgba(255,255,255,0.15)', color: 'white', border: 'none', fontWeight: 700 }}>{user?.department} DOMAIN</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Navigation Controls */}
            <div style={{ display: 'flex', gap: '1rem', marginBottom: '2.5rem' }}>
                {tabs.map(({ key, label, icon: Icon }) => (
                    <button key={key} onClick={() => setTab(key)}
                        className={`btn ${tab === key ? 'btn-primary' : 'btn-ghost'}`}
                        style={{ flex: 1, height: '48px', fontWeight: 800, border: tab !== key ? '1px solid var(--border-primary)' : 'none' }}>
                        <Icon size={18} />
                        <span>{label}</span>
                    </button>
                ))}
            </div>

            {tab === 'profile' && (
                <form onSubmit={handleProfileSave} className="animate-slide-up">
                    <div className="card" style={{ padding: '2.5rem' }}>
                        <div className="card-header" style={{ marginBottom: '2rem', padding: 0 }}>
                            <h4 style={{ margin: 0, fontWeight: 800, fontSize: '1.25rem' }}>Core Identity Management</h4>
                            <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 }}>Modify institutional record identifiers.</p>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
                            <div className="form-group">
                                <label className="form-label" style={{ fontWeight: 800 }}>Formal Nomenclature</label>
                                <input className="form-control" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} />
                            </div>
                            <div className="form-group">
                                <label className="form-label" style={{ fontWeight: 800 }}>Institutional Mail (Protected)</label>
                                <input className="form-control" value={user?.email || ''} disabled style={{ background: 'var(--slate-50)', color: 'var(--text-muted)' }} />
                            </div>
                            <div className="form-group">
                                <label className="form-label" style={{ fontWeight: 800 }}>Primary Telecom</label>
                                <input className="form-control" placeholder="+91 00000 00000" value={form.phone} onChange={e => setForm(p => ({ ...p, phone: e.target.value }))} />
                            </div>
                            <div className="form-group">
                                <label className="form-label" style={{ fontWeight: 800 }}>Executive Domain</label>
                                <input className="form-control" value={user?.role || ''} disabled style={{ textTransform: 'capitalize', background: 'var(--slate-50)', color: 'var(--text-muted)' }} />
                            </div>
                        </div>

                        <div className="form-group" style={{ marginBottom: '2rem' }}>
                            <label className="form-label" style={{ fontWeight: 800 }}>Professional Bio</label>
                            <textarea className="form-control" rows={4} value={form.bio} onChange={e => setForm(p => ({ ...p, bio: e.target.value }))} placeholder="Professional summary..." style={{ resize: 'none' }} />
                        </div>

                        <button type="submit" className="btn btn-primary" style={{ width: '100%', height: '52px', fontWeight: 900 }} disabled={loading}>
                            {loading ? <div className="spinner-sm" /> : <><Save size={20} /><span>Synchronize Identity Records</span></>}
                        </button>
                    </div>
                </form>
            )}

            {tab === 'password' && (
                <form onSubmit={handlePasswordChange} className="animate-slide-up" style={{ maxWidth: '600px', margin: '0 auto' }}>
                    <div className="card" style={{ padding: '2.5rem' }}>
                        <div className="card-header" style={{ marginBottom: '2.5rem', padding: 0, textAlign: 'center' }}>
                            <div style={{ width: 64, height: 64, background: 'var(--primary-50)', color: 'var(--brand-700)', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem auto' }}>
                                <Shield size={32} />
                            </div>
                            <h4 style={{ margin: 0, fontWeight: 900, fontSize: '1.5rem' }}>Security Protocol Update</h4>
                            <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.9rem', color: 'var(--text-muted)', fontWeight: 600 }}>Execute a password rotation to maintain account integrity.</p>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                            {[
                                { field: 'currentPassword', label: 'Current Password' },
                                { field: 'newPassword', label: 'New Password' },
                                { field: 'confirmPassword', label: 'Confirm New Password' }
                            ].map(({ field, label }) => (
                                <div key={field} className="form-group">
                                    <label className="form-label" style={{ fontWeight: 800 }}>{label}</label>
                                    <div style={{ position: 'relative' }}>
                                        <input
                                            type={showPw[field === 'currentPassword' ? 'current' : field === 'newPassword' ? 'new' : 'confirm'] ? 'text' : 'password'}
                                            className="form-control"
                                            style={{ paddingRight: '3.5rem', height: '52px' }}
                                            placeholder="••••••••••••"
                                            value={pwForm[field]}
                                            onChange={e => setPwForm(p => ({ ...p, [field]: e.target.value }))}
                                            required
                                        />
                                        <button
                                            type="button"
                                            onClick={() => {
                                                const type = field === 'currentPassword' ? 'current' : field === 'newPassword' ? 'new' : 'confirm';
                                                setShowPw(p => ({ ...p, [type]: !p[type] }));
                                            }}
                                            style={{ position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}
                                        >
                                            {showPw[field === 'currentPassword' ? 'current' : field === 'newPassword' ? 'new' : 'confirm'] ? <EyeOff size={20} /> : <Eye size={20} />}
                                        </button>
                                    </div>
                                </div>
                            ))}
                            <button type="submit" className="btn btn-primary" style={{ height: '56px', fontWeight: 900, marginTop: '1rem' }} disabled={pwLoading}>
                                {pwLoading ? <div className="spinner-sm" /> : <><Key size={20} /><span>Execute Security Rotation</span></>}
                            </button>
                        </div>
                    </div>
                </form>
            )}

            {tab === 'notifications' && (
                <div className="card animate-slide-up" style={{ padding: '2.5rem' }}>
                    <div className="card-header" style={{ marginBottom: '2.5rem', padding: 0 }}>
                        <h4 style={{ margin: 0, fontWeight: 800, fontSize: '1.25rem' }}>Synchronization Preferences</h4>
                        <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 }}>Configure institutional alert and reporting protocols.</p>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                        {[
                            ['Submission Alerts', 'Configure real-time notifications for achievement submissions.'],
                            ['Verification Reminders', 'Automated reminders for pending evaluation queues.'],
                            ['System Notifications', 'Alerts regarding institutional platform maintenance.'],
                            ['Analytical Intelligence', 'Weekly summaries of institutional growth metrics.'],
                        ].map(([title, desc], i) => (
                            <div key={title} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1.5rem 0', borderBottom: i === 3 ? 'none' : '1px solid var(--border-primary)' }}>
                                <div>
                                    <div style={{ fontWeight: 800, fontSize: '1rem', color: 'var(--text-primary)', marginBottom: '0.25rem' }}>{title}</div>
                                    <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 500 }}>{desc}</div>
                                </div>
                                <label className="toggle-switch">
                                    <input type="checkbox" defaultChecked />
                                    <span className="toggle-slider"></span>
                                </label>
                            </div>
                        ))}
                    </div>

                    <button className="btn btn-primary" style={{ marginTop: '2.5rem', width: '100%', height: '52px', fontWeight: 900 }} onClick={() => toast.success('Preference synchronization complete')}>
                        <Save size={20} />
                        <span>Synchronize Preferences</span>
                    </button>
                </div>
            )}
        </div>
    );
};

export default AdminSettingsPage;
