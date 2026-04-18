import '../../styles/pages/auth/LoginPage.css';
import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { authAPI } from '../../services/api';
import { Eye, EyeOff, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';

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

const ResetPasswordPage = () => {
    const { token } = useParams();
    const navigate = useNavigate();
    
    const [form, setForm] = useState({ password: '', confirmPassword: '' });
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [errors, setErrors] = useState({});

    const validateList = {
        length: form.password.length >= 8,
        upper: /[A-Z]/.test(form.password),
        lower: /[a-z]/.test(form.password),
        number: /\d/.test(form.password),
        special: /[@$!%*?&]/.test(form.password)
    };

    const validate = () => {
        const e = {};
        if (!Object.values(validateList).every(Boolean)) {
            e.password = 'Password does not meet the security requirements.';
        }
        if (form.password !== form.confirmPassword) {
            e.confirmPassword = 'Passwords do not match.';
        }
        setErrors(e);
        return Object.keys(e).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) return;
        setLoading(true);
        try {
            await authAPI.resetPassword(token, form.password);
            setSuccess(true);
            toast.success('Password successfully reset.');
            setTimeout(() => {
                navigate('/login');
            }, 3000);
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to reset password. Link may be invalid or expired.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-page">
            <div className="animate-slide-up" style={{ width: '100%', maxWidth: '440px' }}>
                <UniversityHeader />

                <div className="login-card">
                    {success ? (
                        <div style={{ textAlign: 'center', padding: '1rem 0' }}>
                            <div style={{ width: 64, height: 64, background: 'rgba(34,197,94,0.15)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
                                <CheckCircle size={32} color="var(--success-500)" />
                            </div>
                            <h3 style={{ color: 'var(--success-500)', marginBottom: '0.75rem', fontWeight: 800 }}>Password Changed!</h3>
                            <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem', lineHeight: 1.7, fontSize: '0.9rem' }}>
                                Your password has been successfully reset. You will be redirected to the login page momentarily so you can sign in.
                            </p>
                            <Link to="/login" className="btn-arka-jain" style={{ display: 'flex', justifyContent: 'center', textDecoration: 'none' }}>
                                Proceed to Login
                            </Link>
                        </div>
                    ) : (
                        <>
                            <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                                <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>Create New Password</h2>
                                <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', margin: 0 }}>Please enter your new strong password below.</p>
                            </div>
                            
                            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                                <div className="form-group" style={{ marginBottom: 0 }}>
                                    <label className="form-label" style={{ fontWeight: 600, color: '#303657', marginBottom: '0.4rem', display: 'block', fontSize: '0.85rem' }}>New Password</label>
                                    <div style={{ position: 'relative' }}>
                                        <input
                                            type={showPassword ? 'text' : 'password'}
                                            className={`form-control ${errors.password ? 'error' : ''}`}
                                            placeholder="Enter strong password"
                                            value={form.password}
                                            onChange={e => { setForm(p => ({ ...p, password: e.target.value })); setErrors({}); }}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            style={{ position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', display: 'flex' }}
                                        >
                                            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                        </button>
                                    </div>
                                    {errors.password && <div className="input-error" style={{ color: '#dc2626', fontSize: '0.75rem', marginTop: '0.25rem' }}>{errors.password}</div>}
                                    
                                    {/* Password Strength Requirement Checklist */}
                                    <div style={{ marginTop: '0.75rem', fontSize: '0.75rem', padding: '0.75rem', background: 'var(--slate-50)', borderRadius: '8px', border: '1px solid var(--border-primary)' }}>
                                        <div style={{ fontWeight: 600, color: '#303657', marginBottom: '0.5rem' }}>Password must contain:</div>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                                            <div style={{ color: validateList.length ? '#16a34a' : '#64748b', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                                                {validateList.length ? '✓' : '•'} At least 8 characters
                                            </div>
                                            <div style={{ color: validateList.upper && validateList.lower ? '#16a34a' : '#64748b', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                                                {validateList.upper && validateList.lower ? '✓' : '•'} Upper & lowercase letters
                                            </div>
                                            <div style={{ color: validateList.number && validateList.special ? '#16a34a' : '#64748b', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                                                {validateList.number && validateList.special ? '✓' : '•'} At least 1 number and 1 symbol (@$!%*?&)
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="form-group" style={{ marginBottom: 0 }}>
                                    <label className="form-label" style={{ fontWeight: 600, color: '#303657', marginBottom: '0.4rem', display: 'block', fontSize: '0.85rem' }}>Confirm New Password</label>
                                    <div style={{ position: 'relative' }}>
                                        <input
                                            type={showConfirmPassword ? 'text' : 'password'}
                                            className={`form-control ${errors.confirmPassword ? 'error' : ''}`}
                                            placeholder="Confirm strong password"
                                            value={form.confirmPassword}
                                            onChange={e => { setForm(p => ({ ...p, confirmPassword: e.target.value })); setErrors({}); }}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                            style={{ position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', display: 'flex' }}
                                        >
                                            {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                        </button>
                                    </div>
                                    {errors.confirmPassword && <div className="input-error" style={{ color: '#dc2626', fontSize: '0.75rem', marginTop: '0.25rem' }}>{errors.confirmPassword}</div>}
                                </div>

                                <button type="submit" className="btn-arka-jain" disabled={loading} style={{ marginTop: '0.5rem' }}>
                                    {loading ? 'Processing...' : 'RESET PASSWORD'}
                                </button>
                            </form>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ResetPasswordPage;
