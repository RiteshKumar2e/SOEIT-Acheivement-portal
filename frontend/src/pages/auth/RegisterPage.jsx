import '../../styles/pages/auth/RegisterPage.css';
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Eye, EyeOff, ArrowLeft, GraduationCap, User as UserIcon } from 'lucide-react';
import toast from 'react-hot-toast';
import { AJU23_IBM } from '../../data/aju23/aju23_ibm';
import { AJU23_C } from '../../data/aju23/aju23_c';
import { AJU23_D } from '../../data/aju23/aju23_d';
import { AJU23_EEE } from '../../data/aju23/aju23_eee';
import { AJU23_ME } from '../../data/aju23/aju23_me';
import { AJU24_AIML } from '../../data/aju24/aju24_aiml';
import { AJU24_D } from '../../data/aju24/aju24_d';
import { AJU24_E } from '../../data/aju24/aju24_e';
import { AJU24_IBM } from '../../data/aju24/aju24_ibm';
import { AJU24_EEE } from '../../data/aju24/aju24_eee';
import { AJU24_ME } from '../../data/aju24/aju24_me';
import { AJU22_C } from '../../data/aju22/aju22_c';
import { AJU22_D } from '../../data/aju22/aju22_d';
import { AJU22_E } from '../../data/aju22/aju22_e';
import { AJU22_F } from '../../data/aju22/aju22_f';
import { AJU22_EEE } from '../../data/aju22/aju22_eee';
import { AJU22_ME } from '../../data/aju22/aju22_me';
import { AJU25_AIML } from '../../data/aju25/aju25_aiml';
import { AJU25_D } from '../../data/aju25/aju25_d';
import { AJU25_E } from '../../data/aju25/aju25_e';
import { AJU25_F } from '../../data/aju25/aju25_f';
import { AJU25_IBM } from '../../data/aju25/aju25_ibm';
import { AJU25_EEE } from '../../data/aju25/aju25_eee';
import { AJU25_ME } from '../../data/aju25/aju25_me';

const AJU_STUDENTS = [
    ...AJU23_IBM, ...AJU23_C, ...AJU23_D, ...AJU23_EEE, ...AJU23_ME,
    ...AJU24_AIML, ...AJU24_D, ...AJU24_E, ...AJU24_IBM, ...AJU24_EEE, ...AJU24_ME,
    ...AJU22_C, ...AJU22_D, ...AJU22_E, ...AJU22_F, ...AJU22_EEE, ...AJU22_ME,
    ...AJU25_AIML, ...AJU25_D, ...AJU25_E, ...AJU25_F, ...AJU25_IBM, ...AJU25_EEE, ...AJU25_ME
];

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

const DEPARTMENTS = {
    'B.Tech': ['CSE', 'AIDS (IBM)', 'AIML', 'ME', 'EEE', 'DS', 'IOT'],
    'BCA': ['BCA (Regular)', 'AIDL', 'Cybersecurity'],
    'Diploma': ['DCSE', 'DME', 'DEEE'],
};

// Define Field component OUTSIDE the main component to prevent focus loss during state updates
const Field = ({ name, label, type = 'text', placeholder, required, form, setForm, errors, children, disabled = false, onChange }) => (
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
                    className={`form-control ${errors[name] ? 'error' : ''} ${disabled ? 'prefilled-field' : ''}`}
                    placeholder={placeholder}
                    value={form[name] || ''}
                    onChange={onChange || (e => setForm(p => ({ ...p, [name]: e.target.value })))}
                    disabled={disabled}
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
        role: 'student', // default
        password: '',
        confirmPassword: '',
        department: '',
        enrollmentNo: '',
        batch: '',
        semester: '',
        section: ''
    });
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const [isPreFilled, setIsPreFilled] = useState(false);
    const [showOTPModal, setShowOTPModal] = useState(false);
    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const [otpLoading, setOtpLoading] = useState(false);
    const [resendLoading, setResendLoading] = useState(false);
    const [timer, setTimer] = useState(0);

    // Auto-fill logic for restricted batches (AJU/23 & AJU/24)
    useEffect(() => {
        if (form.role === 'student' && form.enrollmentNo.length >= 7) {
            const student = AJU_STUDENTS.find(s => s.enrollmentNo === form.enrollmentNo.toUpperCase());
            if (student) {
                setForm(prev => ({
                    ...prev,
                    name: student.name,
                    email: student.email,
                    department: student.department,
                    batch: student.batch,
                    semester: student.semester,
                    section: student.section,
                    role: 'student'
                }));
                setIsPreFilled(true);
                setErrors(prev => {
                    const newErrors = { ...prev };
                    delete newErrors.enrollmentNo;
                    return newErrors;
                });
            } else if ((form.enrollmentNo.toUpperCase().startsWith('AJU/23') ||
                form.enrollmentNo.toUpperCase().startsWith('AJU/24') ||
                form.enrollmentNo.toUpperCase().startsWith('AJU/22') ||
                form.enrollmentNo.toUpperCase().startsWith('AJU/25')) && form.enrollmentNo.length >= 10) {
                // Restricted batches missing from list
                setIsPreFilled(false);
                setErrors(prev => ({ ...prev, enrollmentNo: 'Enrollment No. not recognized for this batch' }));
            } else {
                // Not in pre-fill list and not a restricted enrollment
                if (isPreFilled) {
                    setForm(prev => ({
                        ...prev,
                        name: '',
                        email: '',
                        department: '',
                        batch: '',
                        semester: '',
                        section: '',
                    }));
                    setIsPreFilled(false);
                }
            }
        } else if (form.role === 'faculty') {
            // Explicitly reset auto-fill state for Faculty
            if (isPreFilled) {
                setForm(prev => ({
                    ...prev,
                    name: '',
                    email: '',
                    department: '',
                    batch: '',
                    semester: '',
                    section: '',
                }));
                setIsPreFilled(false);
            }
        }
    }, [form.enrollmentNo, form.role]);

    const validate = () => {
        const e = {};
        if (!form.name.trim()) e.name = 'Name is required';
        if (!form.email) e.email = 'Email is required';
        else {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(form.email)) {
                e.email = 'Invalid email format';
            } else if (form.role === 'student' && !form.email.toLowerCase().endsWith('@arkajainuniversity.ac.in')) {
                e.email = 'Students must use official university email (@arkajainuniversity.ac.in)';
            }
        }

        if (!form.password) e.password = 'Password is required';
        else if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^a-zA-Z0-9]).{6,10}$/.test(form.password)) {
            e.password = 'Password must be 6-10 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character';
        }
        if (form.password !== form.confirmPassword) e.confirmPassword = 'Passwords do not match';

        // Role-specific validation
        if (!form.department) e.department = 'Department is required';

        if (form.role === 'student') {
            if (!form.batch) e.batch = 'Batch is required';
            else if (!/^\d{4}-(\d{2}|\d{4})$/.test(form.batch)) e.batch = 'Invalid format (e.g. 2022-26 or 2022-2026)';
        }

        if (!form.enrollmentNo) {
            e.enrollmentNo = 'Enrollment No. is required';
        } else if (form.role === 'student') {
            if (!/^AJU\//i.test(form.enrollmentNo)) {
                e.enrollmentNo = 'Student Enrollment No. must start with AJU/';
            } else {
                const searchEnrollment = form.enrollmentNo.toUpperCase();
                const isRestrictedBatch = searchEnrollment.startsWith('AJU/23') ||
                    searchEnrollment.startsWith('AJU/24') ||
                    searchEnrollment.startsWith('AJU/22') ||
                    searchEnrollment.startsWith('AJU/25');
                const student = AJU_STUDENTS.find(s => s.enrollmentNo === searchEnrollment);

                if (isRestrictedBatch && !student) {
                    e.enrollmentNo = 'Enrollment No. not valid for your batch';
                }
            }
        } else if (form.role === 'faculty' && !/^ARKA\/AJU\//i.test(form.enrollmentNo)) {
            e.enrollmentNo = 'Faculty ID must start with ARKA/AJU/';
        }
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
            toast.success('OTP sent to your email!');
            setShowOTPModal(true);
            setTimer(60); // 1 minute resend timer
        } catch (err) {
            toast.error(err.response?.data?.message || 'Registration failed');
        } finally {
            setLoading(false);
        }
    };

    const handleOtpChange = (index, value) => {
        if (isNaN(value)) return;
        const newOtp = [...otp];
        newOtp[index] = value.substring(value.length - 1);
        setOtp(newOtp);

        // Move to next input
        if (value && index < 5) {
            document.getElementById(`otp-${index + 1}`).focus();
        }
    };

    const handleKeyDown = (index, e) => {
        if (e.key === 'Backspace' && !otp[index] && index > 0) {
            document.getElementById(`otp-${index - 1}`).focus();
        }
    };

    const { verifyOTP, resendOTP } = useAuth();

    const handleVerifyOTP = async (e) => {
        e.preventDefault();
        const otpString = otp.join('');
        if (otpString.length !== 6) {
            toast.error('Please enter 6-digit OTP');
            return;
        }

        setOtpLoading(true);
        try {
            await verifyOTP({ email: form.email, otp: otpString });
            toast.success('Email verified! Welcome to SOEIT 🎉');
            navigate('/dashboard', { replace: true });
        } catch (err) {
            toast.error(err.response?.data?.message || 'Verification failed');
        } finally {
            setOtpLoading(false);
        }
    };

    const handleResendOTP = async () => {
        if (timer > 0) return;
        setResendLoading(true);
        try {
            await resendOTP(form.email);
            toast.success('New OTP sent!');
            setTimer(60);
            setOtp(['', '', '', '', '', '']);
        } catch (err) {
            toast.error(err.response?.data?.message || 'Resend failed');
        } finally {
            setResendLoading(false);
        }
    };

    useEffect(() => {
        let interval;
        if (timer > 0) {
            interval = setInterval(() => setTimer(t => t - 1), 1000);
        }
        return () => clearInterval(interval);
    }, [timer]);

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
                    {form.role === 'student' ? 'Student Registration' : 'Faculty Registration'}
                </h1>

                <div className="register-card">
                    <div className="role-switcher">
                        <button
                            type="button"
                            className={`role-btn ${form.role === 'student' ? 'active' : ''}`}
                            onClick={() => {
                                setForm(p => ({ ...p, role: 'student' }));
                                setErrors({});
                            }}
                        >
                            <UserIcon size={18} /> Student
                        </button>
                        <button
                            type="button"
                            className={`role-btn ${form.role === 'faculty' ? 'active' : ''}`}
                            onClick={() => {
                                setForm(p => ({ ...p, role: 'faculty' }));
                                setErrors({});
                            }}
                        >
                            <GraduationCap size={18} /> Faculty
                        </button>
                    </div>

                    <form onSubmit={handleSubmit}>
                        <div className="form-row">
                            <Field 
                                name="enrollmentNo" 
                                label="Enrollment No." 
                                placeholder={form.role === 'student' ? "AJU/221403" : "ARKA/AJU/FACULTY"} 
                                required 
                                form={form} 
                                setForm={setForm} 
                                errors={errors} 
                                onChange={e => {
                                    let val = e.target.value.toUpperCase();
                                    // Auto-format AJU/ for students
                                    if (form.role === 'student') {
                                        if (val.startsWith('AJU') && val.length > 3 && val[3] !== '/') {
                                            val = 'AJU/' + val.substring(3);
                                        }
                                    }
                                    setForm(p => ({ ...p, enrollmentNo: val }));
                                }}
                            />
                            <Field name="name" label="Full Name" placeholder="Full name" required form={form} setForm={setForm} errors={errors} disabled={isPreFilled} />
                        </div>

                        <Field name="email" label="Email Address" type="email" placeholder="example@arkajainuniversity.ac.in" required form={form} setForm={setForm} errors={errors} disabled={isPreFilled} />

                        {form.role === 'student' && (
                            <>
                                <div className="form-group" style={{ marginBottom: '1.25rem' }}>
                                    <label className="form-label">Department *</label>
                                    <select
                                        className={`form-control ${errors.department ? 'error' : ''} ${isPreFilled ? 'prefilled-field' : ''}`}
                                        value={form.department}
                                        onChange={e => setForm(p => ({ ...p, department: e.target.value }))}
                                        disabled={isPreFilled}
                                    >
                                        <option value="">Select Department</option>
                                        {Object.entries(DEPARTMENTS).map(([group, depts]) => (
                                            <optgroup key={group} label={group}>
                                                {depts.map(d => <option key={d} value={d}>{d}</option>)}
                                            </optgroup>
                                        ))}
                                    </select>
                                    {errors.department && <div className="input-error" style={{ color: '#dc2626', fontSize: '0.75rem', marginTop: '0.25rem' }}>{errors.department}</div>}
                                </div>

                                <div className="form-row">
                                    <Field
                                        name="batch"
                                        label="Batch Year"
                                        placeholder="e.g. 2022-26 or 2022-2026"
                                        required
                                        form={form}
                                        setForm={setForm}
                                        errors={errors}
                                        disabled={isPreFilled}
                                    />
                                    <div className="form-row-sm" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', flex: 1.2 }}>
                                        <div className="form-group" style={{ marginBottom: '1.25rem' }}>
                                            <label className="form-label">Semester</label>
                                            <select
                                                className={`form-control ${isPreFilled ? 'prefilled-field' : ''}`}
                                                value={form.semester}
                                                onChange={e => setForm(p => ({ ...p, semester: e.target.value }))}
                                                disabled={isPreFilled}
                                            >
                                                <option value="">Select</option>
                                                {[1, 2, 3, 4, 5, 6, 7, 8].map(s => <option key={s} value={s}>{s}</option>)}
                                            </select>
                                        </div>
                                        <div className="form-group" style={{ marginBottom: '1.25rem' }}>
                                            <label className="form-label">Section</label>
                                            <select
                                                className={`form-control ${isPreFilled ? 'prefilled-field' : ''}`}
                                                value={form.section}
                                                onChange={e => setForm(p => ({ ...p, section: e.target.value }))}
                                                disabled={isPreFilled}
                                            >
                                                <option value="">Select</option>
                                                {['A', 'B', 'C', 'D', 'E', 'F', 'G'].map(s => <option key={s} value={s}>{s}</option>)}
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            </>
                        )}
                        {form.role === 'faculty' && (
                            <Field
                                name="department"
                                label="Department"
                                placeholder="Enter your department"
                                required
                                form={form}
                                setForm={setForm}
                                errors={errors}
                            />
                        )}

                        <div className="form-row">
                            <div className="form-group" style={{ marginBottom: '1.25rem' }}>
                                <label className="form-label">Password *</label>
                                <div style={{ position: 'relative' }}>
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        className={`form-control ${errors.password ? 'error' : ''}`}
                                        placeholder="6-10 chars"
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
                            {loading ? 'Processing...' : 'SIGN UP'}
                        </button>
                    </form>

                    <p className="register-footer-text">
                        Already have an account?{' '}
                        <Link to="/login" className="register-link">Sign in</Link>
                    </p>
                </div>
            </div>

            {/* OTP Modal */}
            {showOTPModal && (
                <div className="otp-overlay">
                    <div className="otp-modal">
                        <button className="otp-close" onClick={() => setShowOTPModal(false)}>×</button>

                        <div className="otp-header">
                            <div className="otp-icon-circle">
                                <Eye size={32} />
                            </div>
                            <h2>Verify your email</h2>
                            <p>We've sent a 6-digit code to <br /><strong>{form.email}</strong></p>
                        </div>

                        <form onSubmit={handleVerifyOTP}>
                            <div className="otp-input-container">
                                {otp.map((digit, idx) => (
                                    <input
                                        key={idx}
                                        id={`otp-${idx}`}
                                        type="text"
                                        maxLength={1}
                                        value={digit}
                                        onChange={e => handleOtpChange(idx, e.target.value)}
                                        onKeyDown={e => handleKeyDown(idx, e)}
                                        className="otp-input"
                                        autoFocus={idx === 0}
                                    />
                                ))}
                            </div>

                            <button
                                type="submit"
                                className="btn-arka-jain w-full"
                                disabled={otpLoading}
                                style={{ marginTop: '2rem', padding: '1rem' }}
                            >
                                {otpLoading ? 'Verifying...' : 'VERIFY OTP'}
                            </button>
                        </form>

                        <div className="otp-footer">
                            <p>Didn't receive code?</p>
                            <button
                                onClick={handleResendOTP}
                                disabled={timer > 0 || resendLoading}
                                className="resend-btn"
                            >
                                {resendLoading ? 'Sending...' : timer > 0 ? `Resend in ${timer}s` : 'Resend Code'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default RegisterPage;

