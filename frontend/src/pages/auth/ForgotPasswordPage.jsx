import '../../styles/pages/auth/LoginPage.css'; // sharing login premium css
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { authAPI } from '../../services/api';
import { ArrowLeft, CheckCircle } from 'lucide-react';
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

const ForgotPasswordPage = () => {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [sent, setSent] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!email) { setError('Email is required'); return; }
        setLoading(true);
        try {
            await authAPI.forgotPassword(email);
            setSent(true);
            toast.success('Password reset instructions sent!');
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to send reset email');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-page">
            <div style={{ position: 'absolute', top: '2rem', left: '2rem', zIndex: 10 }}>
                <Link to="/login" className="btn btn-secondary btn-sm" style={{ fontWeight: 600, boxShadow: 'var(--shadow-sm)' }}>
                    <ArrowLeft size={14} /> Back to Login
                </Link>
            </div>

            <div className="animate-slide-up" style={{ width: '100%', maxWidth: '440px' }}>
                <UniversityHeader />

                <div className="login-card">
                    {sent ? (
                        <div style={{ textAlign: 'center', padding: '1rem 0' }}>
                            <div style={{ width: 64, height: 64, background: 'rgba(34,197,94,0.15)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
                                <CheckCircle size={32} color="var(--success-500)" />
                            </div>
                            <h3 style={{ color: 'var(--success-500)', marginBottom: '0.75rem', fontWeight: 800 }}>Check Your Email</h3>
                            <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem', lineHeight: 1.7, fontSize: '0.9rem' }}>
                                We've sent password reset instructions to <strong style={{ color: 'var(--text-primary)' }}>{email}</strong>
                            </p>
                            <Link to="/login" className="btn-arka-jain" style={{ display: 'flex', justifyContent: 'center', textDecoration: 'none' }}>
                                Back to Login
                            </Link>
                        </div>
                    ) : (
                        <>
                            <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                                <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>Forgot Password?</h2>
                                <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', margin: 0 }}>Enter your registration email address to receive password reset instructions.</p>
                            </div>
                            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                                <div className="form-group" style={{ marginBottom: 0 }}>
                                    <label className="form-label" style={{ fontWeight: 600, color: '#303657', marginBottom: '0.4rem', display: 'block', fontSize: '0.85rem' }}>Email Address</label>
                                    <div style={{ position: 'relative' }}>
                                        <input
                                            type="email"
                                            className={`form-control ${error ? 'error' : ''}`}
                                            placeholder="example@arkajainuniversity.ac.in"
                                            value={email}
                                            onChange={e => { setEmail(e.target.value); setError(''); }}
                                        />
                                    </div>
                                    {error && <div className="input-error" style={{ color: '#dc2626', fontSize: '0.75rem', marginTop: '0.25rem' }}>{error}</div>}
                                </div>

                                <button type="submit" className="btn-arka-jain" disabled={loading} style={{ marginTop: '0.5rem' }}>
                                    {loading ? 'Sending...' : 'SEND RESET LINK'}
                                </button>
                            </form>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ForgotPasswordPage;
