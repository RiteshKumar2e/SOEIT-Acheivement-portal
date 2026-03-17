import { ShieldCheck, Lock, Eye, FileText, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const PrivacyPolicy = () => {
    return (
        <div style={{ minHeight: '100vh', background: 'var(--bg-primary)' }}>
            <div style={{ position: 'fixed', top: '1.5rem', left: '1.5rem', zIndex: 100 }}>
                <Link to="/" className="btn btn-secondary" style={{ fontWeight: 700, borderRadius: '12px', boxShadow: '0 10px 30px rgba(0,0,0,0.1)', backdropFilter: 'blur(10px)', border: '1px solid var(--border-primary)', padding: '0.6rem 1.25rem' }}>
                    <ArrowLeft size={16} /> Back to Home
                </Link>
            </div>
            <section style={{ paddingTop: '100px', paddingBottom: '5rem' }}>
                <div className="container" style={{ maxWidth: '900px' }}>
                    <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
                        <div style={{
                            display: 'inline-flex',
                            padding: '0.5rem 1rem',
                            background: 'var(--brand-50)',
                            borderRadius: '99px',
                            color: 'var(--brand-600)',
                            fontSize: '0.875rem',
                            fontWeight: 700,
                            marginBottom: '1.5rem',
                            gap: '0.5rem',
                            alignItems: 'center'
                        }}>
                            <ShieldCheck size={16} /> Compliance & Trust
                        </div>
                        <h1 style={{ fontSize: '3.5rem', fontWeight: 800, color: 'var(--gray-900)' }}>Privacy <span className="text-gradient">Policy</span></h1>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', marginTop: '1rem' }}>
                            Last updated: March 2024
                        </p>
                    </div>

                    <div className="card shadow-sm" style={{ padding: '3rem', borderRadius: '1.5rem', background: 'white', border: '1px solid var(--border-primary)' }}>
                        <div className="space-y-12">
                            <section>
                                <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '1.5rem', fontWeight: 700, color: 'var(--gray-900)', marginBottom: '1.5rem' }}>
                                    <FileText className="text-brand-600" size={24} /> 1. Information Collection
                                </h2>
                                <p style={{ color: 'var(--gray-600)', lineHeight: '1.8', fontSize: '1.05rem' }}>
                                    We collect information necessary to verify and showcase your academic achievements. This includes your name, institutional email, student ID, department, and any documentation (certificates, links, media) you upload as proof of achievement.
                                </p>
                            </section>

                            <hr style={{ border: 'none', borderTop: '1px solid var(--gray-100)', margin: '2.5rem 0' }} />

                            <section>
                                <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '1.5rem', fontWeight: 700, color: 'var(--gray-900)', marginBottom: '1.5rem' }}>
                                    <Eye className="text-brand-600" size={24} /> 2. Visibility & Portfolios
                                </h2>
                                <p style={{ color: 'var(--gray-600)', lineHeight: '1.8', fontSize: '1.05rem' }}>
                                    Your profile and verified achievements may be visible to registered faculty members and administrative staff of SOEIT. If you choose to enable your "Public Portfolio," selected achievements will be visible to external partners and employers via your unique portfolio link.
                                </p>
                            </section>

                            <hr style={{ border: 'none', borderTop: '1px solid var(--gray-100)', margin: '2.5rem 0' }} />

                            <section>
                                <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '1.5rem', fontWeight: 700, color: 'var(--gray-900)', marginBottom: '1.5rem' }}>
                                    <Lock className="text-brand-600" size={24} /> 3. Data Security
                                </h2>
                                <p style={{ color: 'var(--gray-600)', lineHeight: '1.8', fontSize: '1.05rem' }}>
                                    We implement industry-standard security measures to protect your institutional data. All uploaded certificates are stored securely, and access is restricted based on departmental roles. We do not sell your personal data to third parties.
                                </p>
                            </section>

                            <hr style={{ border: 'none', borderTop: '1px solid var(--gray-100)', margin: '2.5rem 0' }} />

                            <section>
                                <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--gray-900)', marginBottom: '1.5rem' }}>
                                    4. Cookies & Tracking
                                </h2>
                                <p style={{ color: 'var(--gray-600)', lineHeight: '1.8', fontSize: '1.05rem' }}>
                                    The portal uses essential session cookies to keep you logged in and functional cookies to remember your dashboard preferences. We do not use third-party tracking cookies for advertising.
                                </p>
                            </section>

                            <section style={{ marginTop: '4rem', padding: '2rem', background: 'var(--brand-50)', borderRadius: '1rem', border: '1px solid var(--brand-100)' }}>
                                <h4 style={{ color: 'var(--brand-700)', fontWeight: 700, marginBottom: '0.5rem' }}>Questions about Privacy?</h4>
                                <p style={{ color: 'var(--brand-600)', fontSize: '0.9rem' }}>
                                    If you have concerns about how your achievement data is handled, please contact the IT Department or your Department HOD.
                                </p>
                            </section>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default PrivacyPolicy;
