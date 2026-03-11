import '../../styles/LoginPage.css';
import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Mail, Lock, Eye, EyeOff, RefreshCw, ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';
import CaptchaCanvas from '../../components/common/CaptchaCanvas';

const UniversityHeader = () => (
    <div className="auth-header">
        <div className="auth-logo-group">
            <div className="auth-logo">JGi</div>
            <div className="auth-divider" />
            <div className="auth-title-column">
                <div className="auth-university-name">
                    <span className="auth-name-primary">ARKA JAIN</span><br />
                    <span className="auth-name-secondary">UNIVERSITY</span>
                </div>
                <div className="auth-location">Jharkhand</div>
            </div>
        </div>
        <div className="auth-naac-badge">NAAC GRADE A</div>
    </div>
);

const LoginPage = () => {
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
        if (!form.email) e.email = 'Username is required';
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
            toast.success(data.message || 'Welcome back!');

            let redirect = from;
            if (!redirect) {
                if (data.user.role === 'admin') redirect = '/admin/dashboard';
                else if (data.user.role === 'faculty') redirect = '/faculty/dashboard';
                else redirect = '/dashboard';
            }

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
        <div className="login-page">
            <div style={{ position: 'absolute', top: '2rem', left: '2rem', zIndex: 10 }}>
                <Link to="/" className="btn btn-secondary btn-sm" style={{ fontWeight: 600, boxShadow: 'var(--shadow-sm)' }}>
                    <ArrowLeft size={14} /> Back to Home
                </Link>
            </div>

            <div className="animate-slide-up" style={{ width: '100%', maxWidth: '440px' }}>
                <UniversityHeader />

                <div className="login-card">
                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>

                        <div className="form-group" style={{ marginBottom: 0 }}>
                            <label className="form-label" style={{ fontWeight: 600, color: '#303657', marginBottom: '0.4rem', display: 'block', fontSize: '0.85rem' }}>Username / Enrollment No.</label>
                            <div style={{ position: 'relative' }}>
                                <input
                                    type="text"
                                    className={`form-control ${errors.email ? 'error' : ''}`}
                                    placeholder="e.g. AJU/221403"
                                    value={form.email}
                                    onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
                                />
                            </div>
                            {errors.email && <div className="input-error" style={{ color: '#dc2626', fontSize: '0.75rem', marginTop: '0.25rem' }}>{errors.email}</div>}
                        </div>

                        <div className="form-group" style={{ marginBottom: 0 }}>
                            <label className="form-label" style={{ fontWeight: 600, color: '#303657', marginBottom: '0.4rem', display: 'block', fontSize: '0.85rem' }}>Password</label>
                            <div style={{ position: 'relative' }}>
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    className={`form-control ${errors.password ? 'error' : ''}`}
                                    placeholder="Enter your password"
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
                            {errors.password && <div className="input-error" style={{ color: '#dc2626', fontSize: '0.75rem', marginTop: '0.25rem' }}>{errors.password}</div>}
                        </div>

                        <div className="form-group" style={{ marginBottom: 0 }}>
                            <label className="form-label">Security Check</label>
                            <div className="captcha-group" style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                                <div style={{ flex: 1 }}>
                                    <input
                                        type="text"
                                        className={`form-control ${errors.captchaInput ? 'error' : ''}`}
                                        placeholder="Captcha code"
                                        value={form.captchaInput}
                                        onChange={e => setForm(p => ({ ...p, captchaInput: e.target.value }))}
                                    />
                                </div>
                                <CaptchaCanvas captcha={captcha} />
                                <button type="button" onClick={generateCaptcha} className="btn-icon">
                                    <RefreshCw size={18} />
                                </button>
                            </div>
                            {errors.captchaInput && <div className="input-error" style={{ color: '#dc2626', fontSize: '0.75rem', marginTop: '0.25rem' }}>{errors.captchaInput}</div>}
                        </div>

                        <button type="submit" className="btn-arka-jain" disabled={loading}>
                            {loading ? 'Logging in...' : 'LOGIN'}
                        </button>
                    </form>

                    <p className="login-footer-text" style={{ textAlign: 'center', marginTop: '2.5rem' }}>
                        Don't have an account?{' '}
                        <Link to="/register" className="login-link">Sign Up</Link>
                    </p>
                </div>


            </div>
        </div>
    );
};

export default LoginPage;
