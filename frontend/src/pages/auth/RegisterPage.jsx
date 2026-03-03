import '../../styles/RegisterPage.css';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Eye, EyeOff, ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';

const UniversityHeader = () => (
    <div className="auth-header">
        <div className="auth-logo">JGi</div>
        <div className="auth-divider hidden md:block" />
        <div className="auth-title-column">
            <div className="auth-university-name">
                <span className="auth-name-primary">ARKA JAIN</span><br />
                <span className="auth-name-secondary">UNIVERSITY</span>
            </div>
            <div className="auth-location">Jharkhand</div>
        </div>
        <div className="auth-naac-badge">NAAC GRADE A</div>
    </div>
);

const DEPARTMENTS = ['CSE', 'IT', 'ECE', 'EEE', 'ME', 'CE', 'Other'];

// Define Field component OUTSIDE the main component to prevent focus loss during state updates
const Field = ({ name, label, type = 'text', placeholder, required, form, setForm, errors, children }) => (
    <div className="form-group" style={{ marginBottom: '1.25rem' }}>
        {label && (
            <label className="form-label">
                {label}{required && ' *'}
            </label>
        )}
        {children || (
            <div style={{ position: 'relative' }}>
                <input
                    type={type}
                    className={`form-control ${errors[name] ? 'error' : ''}`}
                    placeholder={placeholder}
                    value={form[name] || ''}
                    onChange={e => setForm(p => ({ ...p, [name]: e.target.value }))}
                />
            </div>
        )}
        {errors[name] && <div className="input-error" style={{ color: '#dc2626', fontSize: '0.75rem', marginTop: '0.25rem' }}>{errors[name]}</div>}
    </div>
);

const RegisterPage = () => {
    const { register } = useAuth();
    const navigate = useNavigate();
    const [form, setForm] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        department: '',
        enrollmentNo: '',
        batch: '',
        semester: ''
    });
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});

    const validate = () => {
        const e = {};
        if (!form.name.trim()) e.name = 'Name is required';
        if (!form.email) e.email = 'Email is required';
        else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Invalid email';
        if (!form.password) e.password = 'Password is required';
        else if (form.password.length < 6) e.password = 'Password must be at least 6 characters';
        if (form.password !== form.confirmPassword) e.confirmPassword = 'Passwords do not match';
        if (!form.department) e.department = 'Department is required';
        setErrors(e);
        return Object.keys(e).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) return;
        setLoading(true);
        try {
            const { confirmPassword, ...data } = form;
            await register(data);
            toast.success('Registration successful! Welcome aboard 🎉');
            navigate('/dashboard', { replace: true });
        } catch (err) {
            toast.error(err.response?.data?.message || 'Registration failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="register-page">
            <div style={{ position: 'absolute', top: '2rem', left: '2rem' }}>
                <Link to="/" className="btn btn-secondary btn-sm" style={{ fontWeight: 600 }}>
                    <ArrowLeft size={14} /> Back to Home
                </Link>
            </div>

            <div style={{ width: '100%', maxWidth: '650px' }}>
                <UniversityHeader />

                <h1 className="register-heading">
                    Student Registration
                </h1>

                <div className="register-card">
                    <form onSubmit={handleSubmit}>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 1.25rem' }}>
                            <Field name="name" label="Full Name" placeholder="Full name" required form={form} setForm={setForm} errors={errors} />
                            <Field name="enrollmentNo" label="Enrollment No." placeholder="AJU/221403" form={form} setForm={setForm} errors={errors} />
                        </div>

                        <Field name="email" label="Email Address" type="email" placeholder="example@arkajainuniversity.ac.in" required form={form} setForm={setForm} errors={errors} />

                        <div className="form-group" style={{ marginBottom: '1.25rem' }}>
                            <label className="form-label">Department *</label>
                            <select
                                className={`form-control ${errors.department ? 'error' : ''}`}
                                value={form.department}
                                onChange={e => setForm(p => ({ ...p, department: e.target.value }))}
                            >
                                <option value="">Select Department</option>
                                {DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
                            </select>
                            {errors.department && <div className="input-error" style={{ color: '#dc2626', fontSize: '0.75rem', marginTop: '0.25rem' }}>{errors.department}</div>}
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 1.25rem' }}>
                            <Field name="batch" label="Batch Year" placeholder="e.g. 2022-26" form={form} setForm={setForm} errors={errors} />
                            <Field name="semester" label="Current Semester" placeholder="1-8" form={form} setForm={setForm} errors={errors} />
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 1.25rem' }}>
                            <div className="form-group" style={{ marginBottom: '1.25rem' }}>
                                <label className="form-label">Password *</label>
                                <div style={{ position: 'relative' }}>
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        className={`form-control ${errors.password ? 'error' : ''}`}
                                        placeholder="Min 6 chars"
                                        value={form.password}
                                        onChange={e => setForm(p => ({ ...p, password: e.target.value }))}
                                    />
                                    <button type="button" onClick={() => setShowPassword(!showPassword)} style={{ position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#64748b', cursor: 'pointer' }}>
                                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                    </button>
                                </div>
                                {errors.password && <div className="input-error" style={{ color: '#dc2626', fontSize: '0.75rem', marginTop: '0.25rem' }}>{errors.password}</div>}
                            </div>

                            <div className="form-group" style={{ marginBottom: '1.25rem' }}>
                                <label className="form-label">Confirm Password *</label>
                                <div style={{ position: 'relative' }}>
                                    <input
                                        type={showConfirmPassword ? 'text' : 'password'}
                                        className={`form-control ${errors.confirmPassword ? 'error' : ''}`}
                                        placeholder="Repeat password"
                                        value={form.confirmPassword}
                                        onChange={e => setForm(p => ({ ...p, confirmPassword: e.target.value }))}
                                    />
                                    <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} style={{ position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#64748b', cursor: 'pointer' }}>
                                        {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                    </button>
                                </div>
                                {errors.confirmPassword && <div className="input-error" style={{ color: '#dc2626', fontSize: '0.75rem', marginTop: '0.25rem' }}>{errors.confirmPassword}</div>}
                            </div>
                        </div>

                        <button type="submit" className="btn-arka-jain w-full" disabled={loading} style={{ padding: '1.125rem' }}>
                            {loading ? 'Processing...' : 'CREATE ACCOUNT'}
                        </button>
                    </form>

                    <p className="register-footer-text">
                        Already have an account?{' '}
                        <Link to="/login" className="register-link">Sign in</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default RegisterPage;
