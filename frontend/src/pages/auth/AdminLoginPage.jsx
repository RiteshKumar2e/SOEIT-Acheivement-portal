import '../../styles/LoginPage.css';
import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { ShieldAlert, Lock, Eye, EyeOff, RefreshCw, ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';

const UniversityHeader = () => (
    <div className="auth-header">
        <div className="auth-logo-group">
            <div className="auth-logo" style={{ background: '#8B1E1E' }}>JGi</div>
            <div className="auth-divider" style={{ background: '#303657' }} />
            <div className="auth-title-column">
                <div className="auth-university-name">
                    <span className="auth-name-primary">ARKA JAIN</span><br />
                    <span className="auth-name-secondary">UNIVERSITY</span>
                </div>
                <div className="auth-location">Jharkhand</div>
            </div>
        </div>
        <div className="auth-naac-badge" style={{ background: '#303657' }}>ADMIN PORTAL</div>
    </div>
);

const AdminLoginPage = () => {
    const { login } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from?.pathname || null;

    const [form, setForm] = useState({ email: '', password: '', captchaInput: '' });
    const [captcha, setCaptcha] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});

    const generateCaptcha = () => {
        const char = '1234567890';
        let res = '';
        for (let i = 0; i < 4; i++) res += char.charAt(Math.floor(Math.random() * char.length));
        setCaptcha(res);
    };

    useEffect(() => {
        generateCaptcha();
    }, []);

    const validate = () => {
        const e = {};
        if (!form.email) e.email = 'Admin ID is required';
        if (!form.password) e.password = 'Password is required';
        if (form.captchaInput !== captcha) e.captchaInput = 'Invalid Captcha';
        setErrors(e);
        return Object.keys(e).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) return;
        setLoading(true);
        try {
            const data = await login({ email: form.email, password: form.password });
            if (data.user.role !== 'admin' && data.user.role !== 'faculty') {
                toast.error('Unauthorized access. Only admins/faculty can enter here.');
                return;
            }
            toast.success('Admin access granted');
            const redirect = from || '/admin/dashboard';
            navigate(redirect, { replace: true });
        } catch (err) {
            toast.error(err.response?.data?.message || 'Login failed');
            generateCaptcha();
            setForm(p => ({ ...p, captchaInput: '' }));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="admin-login-page">
            {/* Top Left Back Button */}
            <div style={{ position: 'absolute', top: '2rem', left: '2rem' }}>
                <Link to="/" className="btn btn-secondary btn-sm" style={{ fontWeight: 600, boxShadow: 'var(--shadow-sm)' }}>
                    <ArrowLeft size={14} /> Back to Home
                </Link>
            </div>

            <div style={{ width: '100%', maxWidth: '440px' }}>
                <UniversityHeader />

                <div className="card card-body" style={{ boxShadow: '0 10px 40px rgba(0,0,0,0.06)', border: '1px solid rgba(139,30,30,0.1)', borderRadius: 'var(--radius-xl)' }}>
                    <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                        <div style={{ display: 'inline-flex', padding: '1rem', background: 'rgba(139,30,30,0.05)', borderRadius: '50%', color: '#8B1E1E', marginBottom: '1rem' }}>
                            <ShieldAlert size={32} />
                        </div>
                        <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#303657' }}>Administrative Sign In</h2>
                        <p style={{ color: '#64748b', fontSize: '0.9rem' }}>Secure access for faculty and administrators</p>
                    </div>

                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                        <div className="form-group" style={{ marginBottom: 0 }}>
                            <div style={{ position: 'relative' }}>
                                <input
                                    type="text"
                                    className={`form-control ${errors.email ? 'error' : ''}`}
                                    style={{ padding: '1rem 1.25rem', height: 'auto', background: '#fff', border: '1px solid #e2e8f0' }}
                                    placeholder="Admin/Faculty ID"
                                    value={form.email}
                                    onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
                                />
                            </div>
                            {errors.email && <div className="input-error">{errors.email}</div>}
                        </div>

                        <div className="form-group" style={{ marginBottom: 0 }}>
                            <div style={{ position: 'relative' }}>
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    className={`form-control ${errors.password ? 'error' : ''}`}
                                    style={{ padding: '1rem 3rem 1rem 1.25rem', height: 'auto', background: '#fff', border: '1px solid #e2e8f0' }}
                                    placeholder="Password"
                                    value={form.password}
                                    onChange={e => setForm(p => ({ ...p, password: e.target.value }))}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    style={{
                                        position: 'absolute',
                                        right: '1rem',
                                        top: '50%',
                                        transform: 'translateY(-50%)',
                                        background: 'none',
                                        border: 'none',
                                        color: '#64748b',
                                        cursor: 'pointer',
                                        display: 'flex'
                                    }}
                                >
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                            {errors.password && <div className="input-error">{errors.password}</div>}
                        </div>

                        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                            <div style={{ flex: 1 }}>
                                <input
                                    type="text"
                                    className={`form-control ${errors.captchaInput ? 'error' : ''}`}
                                    style={{ padding: '1rem 1.25rem', height: 'auto', background: '#fff', border: '1px solid #e2e8f0' }}
                                    placeholder="Captcha"
                                    value={form.captchaInput}
                                    onChange={e => setForm(p => ({ ...p, captchaInput: e.target.value }))}
                                />
                                {errors.captchaInput && <div className="input-error">{errors.captchaInput}</div>}
                            </div>
                            <div className="captcha-box" style={{ background: '#f1f5f9', border: '1px solid #e2e8f0' }}>
                                {captcha}
                            </div>
                            <button type="button" onClick={generateCaptcha} className="btn-icon btn-secondary" style={{ padding: '0.9rem', borderRadius: 'var(--radius-sm)' }}>
                                <RefreshCw size={18} />
                            </button>
                        </div>

                        <button type="submit" className="btn btn-arka-jain" disabled={loading} style={{ marginTop: '0.5rem', background: '#303657' }}>
                            {loading ? 'Authorizing...' : 'SECURE LOGIN'}
                        </button>
                    </form>
                </div>

                <div className="alert alert-info" style={{ marginTop: '1.5rem', fontSize: '0.8rem', background: '#f1f5f9', border: 'none', color: '#475569' }}>
                    <strong>Access Only:</strong> Institutional ID starting with AJU/ required for administrative login.
                </div>
            </div>
        </div>
    );
};

export default AdminLoginPage;

