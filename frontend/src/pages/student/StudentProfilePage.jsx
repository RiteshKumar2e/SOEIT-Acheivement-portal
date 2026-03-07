import '../../styles/StudentProfilePage.css';
import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { authAPI } from '../../services/api';
import { User, Mail, Phone, BookOpen, Linkedin, Github, Globe, Camera, Save, Key, Eye, EyeOff } from 'lucide-react';
import toast from 'react-hot-toast';

const DEPARTMENTS = ['CSE', 'AIDS (IBM)', 'AIML', 'ME', 'EEE', 'BCA', 'AIDL', 'Cybersecurity', 'DCSE', 'DME', 'DEEE'];

const StudentProfilePage = () => {
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
        if (file.size > 2 * 1024 * 1024) { toast.error('Image must be under 2MB'); return; }
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
            toast.success('Profile updated successfully!');
        } catch (err) {
            toast.error(err.response?.data?.message || 'Update failed');
        } finally {
            setLoading(false);
        }
    };

    const handlePasswordChange = async (e) => {
        e.preventDefault();
        if (pwForm.newPassword !== pwForm.confirmPassword) { toast.error('Passwords do not match'); return; }
        setPwLoading(true);
        try {
            await authAPI.changePassword({ currentPassword: pwForm.currentPassword, newPassword: pwForm.newPassword });
            toast.success('Password changed successfully!');
            setPwForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to change password');
        } finally {
            setPwLoading(false);
        }
    };

    const getInitials = (name) => name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || 'U';

    return (
        <div style={{ maxWidth: 800, margin: '0 auto', animation: 'fadeIn 0.5s ease' }}>
            {/* Profile Header */}
            <div className="card card-body" style={{ marginBottom: '1.5rem', background: 'linear-gradient(135deg, rgba(59,130,246,0.08), rgba(99,102,241,0.08))' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', flexWrap: 'wrap' }}>
                    <div style={{ position: 'relative' }}>
                        {imagePreview ? (
                            <img src={imagePreview} alt="Profile" style={{ width: 100, height: 100, borderRadius: '50%', objectFit: 'cover', border: '3px solid rgba(59,130,246,0.4)' }} />
                        ) : (
                            <div className="avatar avatar-xl" style={{ border: '3px solid rgba(59,130,246,0.4)' }}>{getInitials(user?.name)}</div>
                        )}
                        <label htmlFor="profileImg" style={{ position: 'absolute', bottom: 0, right: 0, width: 32, height: 32, background: 'var(--primary-600)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', border: '2px solid var(--bg-secondary)' }}>
                            <Camera size={14} color="#fff" />
                        </label>
                        <input id="profileImg" type="file" accept="image/*" style={{ display: 'none' }} onChange={handleImageChange} />
                    </div>
                    <div>
                        <h2 style={{ marginBottom: '0.25rem' }}>{user?.name}</h2>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{user?.email}</p>
                        <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem', flexWrap: 'wrap' }}>
                            <span className="badge badge-primary">{user?.department}</span>
                            <span className="badge badge-purple" style={{ textTransform: 'capitalize' }}>{user?.role}</span>
                            {user?.batch && <span className="badge" style={{ background: 'rgba(255,255,255,0.08)', color: 'var(--text-muted)', border: '1px solid var(--border-primary)', fontSize: '0.7rem', padding: '0.2rem 0.6rem' }}>Batch {user.batch}</span>}
                        </div>
                    </div>
                </div>
            </div>

            {/* Tabs */}
            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-primary)', paddingBottom: '0' }}>
                {[['profile', 'Personal Info'], ['password', 'Change Password']].map(([key, label]) => (
                    <button key={key} onClick={() => setTab(key)} style={{ padding: '0.625rem 1.25rem', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600, fontSize: '0.9rem', borderBottom: `2px solid ${tab === key ? 'var(--primary-500)' : 'transparent'}`, color: tab === key ? 'var(--primary-400)' : 'var(--text-muted)', marginBottom: '-1px', transition: 'all var(--transition-fast)' }}>
                        {label}
                    </button>
                ))}
            </div>

            {tab === 'profile' ? (
                <form onSubmit={handleSubmit} className="card card-body">
                    <h4 style={{ marginBottom: '1.25rem', color: 'var(--primary-400)' }}>Personal Information</h4>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 1rem' }}>
                        <div className="form-group">
                            <label className="form-label">Full Name</label>
                            <div style={{ position: 'relative' }}>
                                <User size={15} style={{ position: 'absolute', left: '0.875rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                                <input className="form-control" style={{ paddingLeft: '2.25rem' }} value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} />
                            </div>
                        </div>
                        <div className="form-group">
                            <label className="form-label">Email (Read-only)</label>
                            <div style={{ position: 'relative' }}>
                                <Mail size={15} style={{ position: 'absolute', left: '0.875rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                                <input className="form-control" style={{ paddingLeft: '2.25rem' }} value={user?.email || ''} disabled />
                            </div>
                        </div>
                        <div className="form-group">
                            <label className="form-label">Phone Number</label>
                            <div style={{ position: 'relative' }}>
                                <Phone size={15} style={{ position: 'absolute', left: '0.875rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                                <input className="form-control" style={{ paddingLeft: '2.25rem' }} placeholder="+91 98765 43210" value={form.phone} onChange={e => setForm(p => ({ ...p, phone: e.target.value }))} />
                            </div>
                        </div>
                        <div className="form-group">
                            <label className="form-label">Student ID</label>
                            <div style={{ position: 'relative' }}>
                                <BookOpen size={15} style={{ position: 'absolute', left: '0.875rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                                <input className="form-control" style={{ paddingLeft: '2.25rem' }} value={user?.studentId || ''} disabled />
                            </div>
                        </div>
                        <div className="form-group">
                            <label className="form-label">Batch *</label>
                            <input className="form-control" placeholder="e.g. 2022-26" value={form.batch} onChange={e => setForm(p => ({ ...p, batch: e.target.value }))} />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Semester</label>
                            <select className="form-control" value={form.semester} onChange={e => setForm(p => ({ ...p, semester: e.target.value }))}>
                                <option value="">Select Semester</option>
                                {[1, 2, 3, 4, 5, 6, 7, 8].map(s => <option key={s} value={s}>Semester {s}</option>)}
                            </select>
                        </div>
                        <div className="form-group">
                            <label className="form-label">Section</label>
                            <select className="form-control" value={form.section} onChange={e => setForm(p => ({ ...p, section: e.target.value }))}>
                                <option value="">Select Section</option>
                                {['A', 'B', 'C', 'D', 'E', 'F', 'G'].map(s => <option key={s} value={s}>Section {s}</option>)}
                            </select>
                        </div>
                    </div>

                    <div className="form-group">
                        <label className="form-label">Bio</label>
                        <textarea className="form-control" rows={3} placeholder="Tell us about yourself, your interests, and goals..." value={form.bio} onChange={e => setForm(p => ({ ...p, bio: e.target.value }))} maxLength={500} />
                        <div className="input-hint">{form.bio.length}/500</div>
                    </div>

                    <div className="divider" />
                    <h4 style={{ marginBottom: '1.25rem', color: 'var(--primary-400)' }}>Social & Portfolio Links</h4>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 1rem' }}>
                        <div className="form-group">
                            <label className="form-label">LinkedIn</label>
                            <div style={{ position: 'relative' }}>
                                <Linkedin size={15} style={{ position: 'absolute', left: '0.875rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                                <input className="form-control" style={{ paddingLeft: '2.25rem' }} placeholder="linkedin.com/in/yourname" value={form.linkedIn} onChange={e => setForm(p => ({ ...p, linkedIn: e.target.value }))} />
                            </div>
                        </div>
                        <div className="form-group">
                            <label className="form-label">GitHub</label>
                            <div style={{ position: 'relative' }}>
                                <Github size={15} style={{ position: 'absolute', left: '0.875rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                                <input className="form-control" style={{ paddingLeft: '2.25rem' }} placeholder="github.com/username" value={form.github} onChange={e => setForm(p => ({ ...p, github: e.target.value }))} />
                            </div>
                        </div>
                        <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                            <label className="form-label">Portfolio Website</label>
                            <div style={{ position: 'relative' }}>
                                <Globe size={15} style={{ position: 'absolute', left: '0.875rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                                <input className="form-control" style={{ paddingLeft: '2.25rem' }} placeholder="yourportfolio.com" value={form.portfolio} onChange={e => setForm(p => ({ ...p, portfolio: e.target.value }))} />
                            </div>
                        </div>
                    </div>

                    <button type="submit" className="btn btn-primary" disabled={loading}>
                        {loading ? <><div className="spinner spinner-sm" style={{ borderColor: 'rgba(255,255,255,0.3)', borderTopColor: '#fff' }} /> Saving...</> : <><Save size={16} /> Save Changes</>}
                    </button>
                </form>
            ) : (
                <form onSubmit={handlePasswordChange} className="card card-body">
                    <h4 style={{ marginBottom: '1.25rem', color: 'var(--primary-400)' }}>
                        <Key size={18} style={{ marginRight: '0.5rem', verticalAlign: 'middle' }} />
                        Change Password
                    </h4>
                    {['currentPassword', 'newPassword', 'confirmPassword'].map((field, i) => (
                        <div key={field} className="form-group">
                            <label className="form-label">{['Current Password', 'New Password', 'Confirm New Password'][i]}</label>
                            <div style={{ position: 'relative' }}>
                                <input
                                    type={showPw[field === 'currentPassword' ? 'current' : field === 'newPassword' ? 'new' : 'confirm'] ? 'text' : 'password'}
                                    className="form-control"
                                    style={{ paddingRight: '2.75rem' }}
                                    placeholder="••••••••"
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
                                    style={{
                                        position: 'absolute',
                                        right: '0.875rem',
                                        top: '50%',
                                        transform: 'translateY(-50%)',
                                        background: 'none',
                                        border: 'none',
                                        cursor: 'pointer',
                                        color: 'var(--text-muted)',
                                        display: 'flex',
                                        zIndex: 10
                                    }}
                                >
                                    {showPw[field === 'currentPassword' ? 'current' : field === 'newPassword' ? 'new' : 'confirm'] ? <EyeOff size={16} /> : <Eye size={16} />}
                                </button>
                            </div>
                        </div>
                    ))}
                    <button type="submit" className="btn btn-primary" disabled={pwLoading}>
                        {pwLoading ? <><div className="spinner spinner-sm" style={{ borderColor: 'rgba(255,255,255,0.3)', borderTopColor: '#fff' }} /> Changing...</> : <><Key size={16} /> Change Password</>}
                    </button>
                </form>
            )}
        </div>
    );
};

export default StudentProfilePage;
