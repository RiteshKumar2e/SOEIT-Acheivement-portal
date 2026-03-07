import '../../styles/StudentProfilePage.css';
import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { authAPI } from '../../services/api';
import { User, Mail, Phone, BookOpen, Linkedin, Github, Globe, Camera, Save, Key, Eye, EyeOff, Shield } from 'lucide-react';
import toast from 'react-hot-toast';

const DEPARTMENTS = {
    'B.Tech': ['CSE', 'AIDS (IBM)', 'AIML', 'ME', 'EEE'],
    'BCA': ['BCA (Regular)', 'AIDL', 'Cybersecurity'],
    'Diploma': ['DCSE', 'DME', 'DEEE'],
};

const ProfilePage = () => {
    const { user, updateUser } = useAuth();
    const [tab, setTab] = useState('profile');
    const [form, setForm] = useState({ name: '', phone: '', bio: '', batch: '', semester: '', section: '', linkedIn: '', github: '', portfolio: '' });
    const [pwForm, setPwForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
    const [showPw, setShowPw] = useState({ current: false, new: false, confirm: false });
    const [profileImage, setProfileImage] = useState(null);
    const [imagePreview, setImagePreview] = useState('');
    const [loading, setLoading] = useState(false);
    const [pwLoading, setPwLoading] = useState(false);

    useEffect(() => {
        if (user) {
            setForm({
                name: user.name || '', phone: user.phone || '', bio: user.bio || '',
                batch: user.batch || '', semester: user.semester || '', section: user.section || '',
                linkedIn: user.linkedIn || '', github: user.github || '', portfolio: user.portfolio || '',
            });
            setImagePreview(user.profileImage ? `${import.meta.env.VITE_UPLOADS_URL || ''}${user.profileImage}` : '');
        }
    }, [user]);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        if (file.size > 2 * 1024 * 1024) { toast.error('Image dimensions or size exceeds theoretical limits (Max 2MB)'); return; }
        setProfileImage(file);
        setImagePreview(URL.createObjectURL(file));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const fd = new FormData();
            Object.entries(form).forEach(([k, v]) => v && fd.append(k, v));
            if (profileImage) fd.append('profileImage', profileImage);
            const { data } = await authAPI.updateProfile(fd);
            updateUser(data.user);
            toast.success('Institutional Personnel Identity synchronized successfully');
        } catch (err) {
            toast.error(err.response?.data?.message || 'Identity synchronization failed');
        } finally {
            setLoading(false);
        }
    };

    const handlePasswordChange = async (e) => {
        e.preventDefault();
        if (pwForm.newPassword !== pwForm.confirmPassword) { toast.error('Security mismatch: New passwords are not identical'); return; }
        setPwLoading(true);
        try {
            await authAPI.changePassword({ currentPassword: pwForm.currentPassword, newPassword: pwForm.newPassword });
            toast.success('Security protocol updated: Password rotated');
            setPwForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
        } catch (err) {
            toast.error(err.response?.data?.message || 'Security protocol execution failed');
        } finally {
            setPwLoading(false);
        }
    };

    const getInitials = (name) => name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || 'U';

    return (
        <div className="animate-fade-in" style={{ maxWidth: '1100px', margin: '0 auto' }}>
            {/* Profile Identity Banner — Light Theme */}
            <div className="card profile-identity-banner" style={{ marginBottom: '2.5rem', background: 'linear-gradient(135deg, #f0f7ff 0%, #e8f4fd 50%, #f0f3ff 100%)', border: '1px solid var(--brand-200)', position: 'relative', overflow: 'hidden', borderRadius: '20px', boxShadow: 'var(--shadow-md)' }}>
                {/* Subtle geometric motifs */}
                <div className="geometric-motif-1" style={{ position: 'absolute', top: '-20%', right: '-8%', width: '380px', height: '380px', background: 'rgba(0, 33, 71, 0.04)', borderRadius: '80px', transform: 'rotate(25deg)' }}></div>
                <div className="geometric-motif-2" style={{ position: 'absolute', bottom: '-30%', left: '-10%', width: '320px', height: '320px', background: 'rgba(0, 33, 71, 0.03)', borderRadius: '100px', transform: 'rotate(-15deg)' }}></div>

                <div className="profile-identity-inner">
                    <div className="profile-avatar-container" style={{ position: 'relative', flexShrink: 0 }}>
                        <div className="profile-avatar-frame" style={{ position: 'relative', width: 120, height: 120, borderRadius: '28px', overflow: 'hidden', padding: '5px', background: 'white', boxShadow: '0 8px 24px rgba(0, 33, 71, 0.18)', border: '1px solid var(--brand-200)' }}>
                            {imagePreview ? (
                                <img src={imagePreview} alt="Profile" style={{ width: '100%', height: '100%', borderRadius: '22px', objectFit: 'cover' }} />
                            ) : (
                                <div style={{ width: '100%', height: '100%', borderRadius: '22px', background: 'linear-gradient(135deg, var(--brand-600), var(--brand-800))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2.5rem', fontWeight: 900, color: 'white', letterSpacing: '-0.05em' }}>{getInitials(user?.name)}</div>
                            )}
                        </div>
                        <label htmlFor="profileImg" style={{ position: 'absolute', bottom: '-8px', right: '-8px', width: 40, height: 40, background: 'white', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: '0 4px 12px rgba(0,0,0,0.15)', border: '1px solid var(--border-primary)' }}>
                            <Camera size={18} style={{ color: 'var(--brand-600)' }} strokeWidth={2.5} />
                        </label>
                        <input id="profileImg" type="file" accept="image/*" style={{ display: 'none' }} onChange={handleImageChange} />
                    </div>

                    <div className="profile-info-main" style={{ flex: 1 }}>
                        <div className="name-badge-container" style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.625rem', flexWrap: 'wrap' }}>
                            <h2 className="profile-full-name" style={{ fontSize: '2.25rem', fontWeight: 900, margin: 0, letterSpacing: '-0.04em', lineHeight: 1.1, color: 'var(--brand-700)' }}>{user?.name}</h2>
                            <div className="verified-badge" style={{ padding: '0.35rem 0.85rem', background: 'white', border: '1px solid var(--brand-200)', borderRadius: '8px', fontSize: '0.72rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--brand-600)', boxShadow: 'var(--shadow-sm)' }}>VERIFIED OFFICIAL</div>
                        </div>

                        <div className="contact-info-grid" style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
                            <div className="contact-item" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <div style={{ width: 30, height: 30, background: 'white', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid var(--border-primary)', color: 'var(--brand-600)' }}><Mail size={15} /></div>
                                <span style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--text-secondary)' }}>{user?.email}</span>
                            </div>
                            <div className="contact-item" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <div style={{ width: 30, height: 30, background: 'white', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid var(--border-primary)', color: 'var(--brand-600)' }}><BookOpen size={15} /></div>
                                <span style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--text-secondary)' }}>{user?.enrollmentNo || user?.studentId || 'Admin'}</span>
                            </div>
                        </div>

                        <div className="metadata-badges-container" style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                            <div style={{ padding: '0.5rem 1rem', background: 'white', color: 'var(--brand-700)', borderRadius: '10px', fontWeight: 800, fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.04em', border: '1px solid var(--brand-200)', boxShadow: 'var(--shadow-sm)' }}>{user?.department}</div>
                            <div style={{ padding: '0.5rem 1rem', background: 'var(--primary-100)', color: 'var(--primary-700)', borderRadius: '10px', fontWeight: 800, fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.04em', border: '1px solid var(--primary-200)' }}>{user?.role}</div>
                            {user?.batch && <div style={{ padding: '0.5rem 1rem', background: 'var(--success-50)', color: 'var(--success-600)', borderRadius: '10px', fontWeight: 800, fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.04em', border: '1px solid var(--success-100)' }}>COHORT {user.batch}</div>}
                        </div>
                    </div>
                </div>
            </div>

            {/* Protocol Navigation Control */}
            <div className="protocol-nav-header" style={{ marginBottom: '3rem', background: 'var(--slate-50)', padding: '0.625rem', borderRadius: '20px', border: '1px solid var(--border-primary)' }}>
                {[
                    { key: 'profile', label: 'Edit Profile', icon: User },
                    { key: 'password', label: 'Security Settings', icon: Shield }
                ].map(({ key, label, icon: Icon }) => (
                    <button key={key} onClick={() => setTab(key)}
                        className={`btn protocol-nav-btn ${tab === key ? 'btn-primary active' : 'btn-ghost'}`}
                        style={{ height: '52px', fontWeight: 900, borderRadius: '14px', background: tab === key ? 'var(--brand-600)' : 'transparent', color: tab === key ? 'white' : 'var(--text-muted)', fontSize: '0.95rem' }}>
                        <Icon size={20} strokeWidth={2.5} />
                        <span className="btn-label">{label}</span>
                    </button>
                ))}
            </div>

            {tab === 'profile' ? (
                <form onSubmit={handleSubmit} className="animate-slide-up">
                    <div className="identity-form-layout" style={{ display: 'grid', gridTemplateColumns: '1.7fr 1fr', gap: '2rem' }}>
                        {/* Institutional Attribute Architecture */}
                        <div className="card profile-form-card" style={{ padding: '2.5rem', borderRadius: '24px', border: '1px solid var(--border-primary)', boxShadow: 'var(--shadow-sm)' }}>
                            <div style={{ marginBottom: '2.5rem' }}>
                                <h4 style={{ margin: 0, fontWeight: 950, fontSize: '1.5rem', color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>Profile Details</h4>
                                <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.95rem', color: 'var(--text-muted)', fontWeight: 600 }}>Update your public and institutional profile information.</p>
                            </div>

                            <div className="form-fields-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.75rem', marginBottom: '2rem' }}>
                                <div className="form-group">
                                    <label className="form-label field-label-res">Full Name</label>
                                    <input className="form-control" style={{ height: '52px', borderRadius: '12px', fontWeight: 700 }} value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} />
                                </div>
                                <div className="form-group">
                                    <label className="form-label field-label-res">Phone Number</label>
                                    <input className="form-control" style={{ height: '52px', borderRadius: '12px', fontWeight: 700 }} placeholder="+91 00000 00000" value={form.phone} onChange={e => setForm(p => ({ ...p, phone: e.target.value }))} />
                                </div>

                                {user?.role === 'student' && (
                                    <>
                                        <div className="form-group">
                                            <label className="form-label field-label-res">Institutional Batch *</label>
                                            <input className="form-control" style={{ height: '52px', borderRadius: '12px', fontWeight: 700 }} placeholder="XXXX-XX (e.g., 2022-26)" value={form.batch} onChange={e => setForm(p => ({ ...p, batch: e.target.value }))} />
                                        </div>
                                        <div className="form-group">
                                            <label className="form-label field-label-res">Semester Resolution</label>
                                            <select className="form-control" style={{ height: '52px', borderRadius: '12px', fontWeight: 700 }} value={form.semester} onChange={e => setForm(p => ({ ...p, semester: e.target.value }))}>
                                                <option value="">Resolution Sequence</option>
                                                {[1, 2, 3, 4, 5, 6, 7, 8].map(s => <option key={s} value={s}>Semester Matrix {s}</option>)}
                                            </select>
                                        </div>
                                        <div className="form-group span-full-res" style={{ gridColumn: 'span 2' }}>
                                            <label className="form-label field-label-res">Academic Section Marker</label>
                                            <input className="form-control" style={{ height: '52px', borderRadius: '12px', fontWeight: 700 }} placeholder="Section Indicator (e.g., Alpha-7)" value={form.section} onChange={e => setForm(p => ({ ...p, section: e.target.value }))} />
                                        </div>
                                    </>
                                )}
                            </div>

                            <div className="form-group">
                                <label className="form-label field-label-res">Professional Bio</label>
                                <textarea className="form-control" style={{ borderRadius: '14px', padding: '1.25rem', fontWeight: 600, lineHeight: 1.6, resize: 'none' }} rows={6} placeholder="Briefly describe your academic background and interests..." value={form.bio} onChange={e => setForm(p => ({ ...p, bio: e.target.value }))} maxLength={500} />
                                <div className="char-counter" style={{ textAlign: 'right', fontSize: '0.75rem', fontWeight: 900, color: 'var(--text-muted)', marginTop: '0.75rem', letterSpacing: '0.02em' }}>{form.bio.length} / 500 characters</div>
                            </div>
                        </div>

                        <div className="connectivity-sidebar-res" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                            <div className="card connectivity-card" style={{ padding: '2.5rem', borderRadius: '24px', border: '1px solid var(--border-primary)', boxShadow: 'var(--shadow-sm)' }}>
                                <div style={{ marginBottom: '2rem' }}>
                                    <h4 className="sidebar-section-title" style={{ margin: 0, fontWeight: 950, fontSize: '1.25rem', color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>Global Connectivity</h4>
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                                    {/* LinkedIn */}
                                    <div className="form-group" style={{ marginBottom: 0 }}>
                                        <label className="form-label" style={{ fontWeight: 700, fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>LinkedIn</label>
                                        <div style={{ display: 'flex', alignItems: 'center', border: '1px solid var(--border-primary)', borderRadius: '10px', overflow: 'hidden', background: 'var(--bg-secondary)' }}>
                                            <div style={{ width: '48px', height: '48px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#e8f0fe', borderRight: '1px solid var(--border-primary)', flexShrink: 0, color: '#0a66c2' }}>
                                                <Linkedin size={18} strokeWidth={2} />
                                            </div>
                                            <input className="form-control" style={{ border: 'none', background: 'transparent', height: '48px', borderRadius: 0, paddingLeft: '0.875rem', fontWeight: 600, outline: 'none', boxShadow: 'none', flex: 1 }} placeholder="linkedin.com/in/yourname" value={form.linkedIn} onChange={e => setForm(p => ({ ...p, linkedIn: e.target.value }))} />
                                        </div>
                                    </div>

                                    {/* GitHub */}
                                    <div className="form-group" style={{ marginBottom: 0 }}>
                                        <label className="form-label" style={{ fontWeight: 700, fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>GitHub</label>
                                        <div style={{ display: 'flex', alignItems: 'center', border: '1px solid var(--border-primary)', borderRadius: '10px', overflow: 'hidden', background: 'var(--bg-secondary)' }}>
                                            <div style={{ width: '48px', height: '48px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f0f0f0', borderRight: '1px solid var(--border-primary)', flexShrink: 0, color: '#24292f' }}>
                                                <Github size={18} strokeWidth={2} />
                                            </div>
                                            <input className="form-control" style={{ border: 'none', background: 'transparent', height: '48px', borderRadius: 0, paddingLeft: '0.875rem', fontWeight: 600, outline: 'none', boxShadow: 'none', flex: 1 }} placeholder="github.com/yourusername" value={form.github} onChange={e => setForm(p => ({ ...p, github: e.target.value }))} />
                                        </div>
                                    </div>

                                    {/* Portfolio */}
                                    <div className="form-group" style={{ marginBottom: 0 }}>
                                        <label className="form-label" style={{ fontWeight: 700, fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Portfolio</label>
                                        <div style={{ display: 'flex', alignItems: 'center', border: '1px solid var(--border-primary)', borderRadius: '10px', overflow: 'hidden', background: 'var(--bg-secondary)' }}>
                                            <div style={{ width: '48px', height: '48px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--success-50)', borderRight: '1px solid var(--border-primary)', flexShrink: 0, color: 'var(--success-600)' }}>
                                                <Globe size={18} strokeWidth={2} />
                                            </div>
                                            <input className="form-control" style={{ border: 'none', background: 'transparent', height: '48px', borderRadius: 0, paddingLeft: '0.875rem', fontWeight: 600, outline: 'none', boxShadow: 'none', flex: 1 }} placeholder="yourportfolio.com" value={form.portfolio} onChange={e => setForm(p => ({ ...p, portfolio: e.target.value }))} />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <button type="submit" className="btn btn-primary" style={{ height: '64px', fontWeight: 950, fontSize: '1.1rem', borderRadius: '20px', boxShadow: 'var(--shadow-lg)' }} disabled={loading}>
                                {loading ? <div className="spinner-sm" /> : <><Save size={22} strokeWidth={3} /><span>COMMIT IDENTITY UPDATES</span></>}
                            </button>
                        </div>
                    </div>
                </form>
            ) : (
                <form onSubmit={handlePasswordChange} className="animate-slide-up" style={{ maxWidth: '650px', margin: '0 auto' }}>
                    <div className="card password-security-card" style={{ padding: '3.5rem', borderRadius: '30px', border: '1px solid var(--border-primary)', boxShadow: 'var(--shadow-xl)' }}>
                        <div style={{ marginBottom: '3rem', textAlign: 'center' }}>
                            <div style={{ width: 80, height: 80, background: 'var(--primary-50)', color: 'var(--brand-700)', borderRadius: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 2rem auto', border: '1px solid var(--primary-100)' }}>
                                <Shield size={40} strokeWidth={1.5} />
                            </div>
                            <h4 style={{ margin: 0, fontWeight: 950, fontSize: '1.75rem', color: 'var(--text-primary)', letterSpacing: '-0.03em' }}>Security Protocol Rotation</h4>
                            <p style={{ fontSize: '1rem', color: 'var(--text-muted)', fontWeight: 600, maxWidth: '400px', margin: '0.75rem auto 0 auto', lineHeight: 1.5 }}>Execute periodic cryptographic rotation to maintain absolute integrity of your institutional credentials.</p>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
                            {[
                                { id: 'currentPassword', label: 'Current Password', type: 'current' },
                                { id: 'newPassword', label: 'New Password', type: 'new' },
                                { id: 'confirmPassword', label: 'Confirm New Password', type: 'confirm' }
                            ].map(({ id, label, type }) => (
                                <div key={id} className="form-group">
                                    <label className="form-label" style={{ fontWeight: 900, fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>{label}</label>
                                    <div style={{ position: 'relative' }}>
                                        <input
                                            type={showPw[type] ? 'text' : 'password'}
                                            className="form-control"
                                            style={{ paddingRight: '4rem', height: '60px', borderRadius: '14px', fontWeight: 800, fontSize: '1.1rem', letterSpacing: '0.1em' }}
                                            placeholder="••••••••••••"
                                            value={pwForm[id]}
                                            onChange={e => setPwForm(p => ({ ...p, [id]: e.target.value }))}
                                            required
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPw(p => ({ ...p, [type]: !p[type] }))}
                                            style={{ position: 'absolute', right: '1.25rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: '0.5rem' }}
                                        >
                                            {showPw[type] ? <EyeOff size={22} /> : <Eye size={22} />}
                                        </button>
                                    </div>
                                </div>
                            ))}

                            <div style={{ padding: '1.5rem', background: 'var(--warning-50)', borderRadius: '16px', border: '1px solid var(--warning-100)', marginTop: '0.5rem', display: 'flex', gap: '1rem' }}>
                                <div style={{ color: 'var(--warning-600)', flexShrink: 0 }}><Shield size={20} strokeWidth={3} /></div>
                                <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--warning-800)', fontWeight: 800, lineHeight: 1.5 }}>
                                    Warning: Successful execution of this protocol will invalidate all active session tokens across registered endpoints.
                                </p>
                            </div>

                            <button type="submit" className="btn btn-primary" style={{ height: '64px', fontWeight: 950, fontSize: '1.1rem', borderRadius: '20px', marginTop: '1rem', boxShadow: 'var(--shadow-lg)' }} disabled={pwLoading}>
                                {pwLoading ? <div className="spinner-sm" /> : <><Key size={22} strokeWidth={2.5} /><span>ENFORCE PROTOCOL UPDATE</span></>}
                            </button>
                        </div>
                    </div>
                </form>
            )}
        </div>
    );
};

export default ProfilePage;
