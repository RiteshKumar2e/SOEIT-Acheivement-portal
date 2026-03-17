import '../../styles/HowItWorksPage.css';
import { UserPlus, Upload, Clock, CheckCircle, Share2, TrendingUp, ArrowRight, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const steps = [
    { icon: UserPlus, step: '01', title: 'Create Your Account', desc: 'Register with your college email, student ID, and department. Verify your account and set up your profile.', color: '#3b82f6' },
    { icon: Upload, step: '02', title: 'Submit Achievement', desc: 'Fill in achievement details — title, category, level, date — and upload supporting certificates or proof documents.', color: '#8b5cf6' },
    { icon: Clock, step: '03', title: 'Awaits Verification', desc: 'Your submission enters the faculty review queue. You can track its status in real-time from your dashboard.', color: '#f59e0b' },
    { icon: CheckCircle, step: '04', title: 'Faculty Verifies', desc: 'A faculty member reviews your proof, gives remarks, and approves or requests additional information.', color: '#10b981' },
    { icon: TrendingUp, step: '05', title: 'Earn Points & Badges', desc: 'Approved achievements earn points based on level. International > National > State > College rankings.', color: '#ef4444' },
    { icon: Share2, step: '06', title: 'Share Your Portfolio', desc: 'Your verified achievements appear on your public digital portfolio — shareable with recruiters and institutions.', color: '#06b6d4' },
];

const HowItWorksPage = () => (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)' }}>
        <div style={{ position: 'fixed', top: '1.5rem', left: '1.5rem', zIndex: 100 }}>
            <Link to="/" className="btn btn-secondary" style={{ fontWeight: 700, borderRadius: '12px', boxShadow: '0 10px 30px rgba(0,0,0,0.1)', backdropFilter: 'blur(10px)', border: '1px solid var(--border-primary)', padding: '0.6rem 1.25rem' }}>
                <ArrowLeft size={16} /> Back to Home
            </Link>
        </div>
        <section style={{ paddingTop: '100px', paddingBottom: '5rem' }}>
            <div className="container">
                <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
                    <h1>How It <span className="text-gradient">Works</span></h1>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', maxWidth: '500px', margin: '1rem auto 0', lineHeight: 1.8 }}>
                        From registration to a verified digital portfolio — here's the complete journey in 6 simple steps.
                    </p>
                </div>

                <div style={{ position: 'relative' }}>
                    {steps.map(({ icon: Icon, step, title, desc, color }, i) => (
                        <div key={step} className="how-step-row">
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0 }}>
                                <div style={{ width: 60, height: 60, background: color + '20', border: `2px solid ${color}`, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1, position: 'relative' }}>
                                    <Icon size={26} color={color} />
                                </div>
                                {i < steps.length - 1 && (
                                    <div style={{ width: 2, height: 40, background: 'linear-gradient(to bottom, ' + color + ', transparent)', marginTop: 4 }} />
                                )}
                            </div>
                            <div className="card card-body" style={{ flex: 1, transition: 'all 0.3s' }}
                                onMouseEnter={e => { e.currentTarget.style.borderColor = color + '66'; e.currentTarget.style.transform = 'translateX(8px)'; }}
                                onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border-primary)'; e.currentTarget.style.transform = 'translateX(0)'; }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
                                    <span style={{ fontSize: '0.75rem', fontWeight: 800, color, background: color + '20', padding: '0.2rem 0.6rem', borderRadius: 'var(--radius-sm)', fontFamily: 'Space Grotesk' }}>STEP {step}</span>
                                    <h3 style={{ fontSize: '1.25rem' }}>{title}</h3>
                                </div>
                                <p style={{ color: 'var(--text-secondary)', lineHeight: 1.8 }}>{desc}</p>
                            </div>
                        </div>
                    ))}
                </div>

                <div style={{ textAlign: 'center', marginTop: '3rem' }}>
                    <Link to="/register" className="btn btn-primary btn-lg">
                        Start Your Journey <ArrowRight size={18} />
                    </Link>
                </div>
            </div>
        </section>
    </div>
);

export default HowItWorksPage;
