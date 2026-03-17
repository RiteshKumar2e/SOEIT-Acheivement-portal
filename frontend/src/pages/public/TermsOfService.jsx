import { Gavel, Scale, AlertCircle, CheckCircle2, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const TermsOfService = () => {
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
                            background: 'var(--warning-50)',
                            borderRadius: '99px',
                            color: 'var(--warning-700)',
                            fontSize: '0.875rem',
                            fontWeight: 700,
                            marginBottom: '1.5rem',
                            gap: '0.5rem',
                            alignItems: 'center'
                        }}>
                            <Gavel size={16} /> Legal Agreement
                        </div>
                        <h1 style={{ fontSize: '3.5rem', fontWeight: 800, color: 'var(--gray-900)' }}>Terms of <span className="text-gradient">Service</span></h1>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', marginTop: '1rem' }}>
                            By using the SOEIT Portal, you agree to these institutional guidelines.
                        </p>
                    </div>

                    <div className="card shadow-sm" style={{ padding: '3rem', borderRadius: '1.5rem', background: 'white', border: '1px solid var(--border-primary)' }}>
                        <div className="space-y-12">
                            <section>
                                <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '1.5rem', fontWeight: 700, color: 'var(--gray-900)', marginBottom: '1.5rem' }}>
                                    <Scale className="text-brand-600" size={24} /> 1. Academic Integrity
                                </h2>
                                <p style={{ color: 'var(--gray-600)', lineHeight: '1.8', fontSize: '1.05rem' }}>
                                    Users are strictly prohibited from uploading fraudulent certificates, misrepresenting achievements, or forging faculty signatures. Any violation of academic integrity will be reported to the disciplinary committee as per institutional norms.
                                </p>
                            </section>

                            <hr style={{ border: 'none', borderTop: '1px solid var(--gray-100)', margin: '2.5rem 0' }} />

                            <section>
                                <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '1.5rem', fontWeight: 700, color: 'var(--gray-900)', marginBottom: '1.5rem' }}>
                                    <AlertCircle className="text-brand-600" size={24} /> 2. Verification Process
                                </h2>
                                <p style={{ color: 'var(--gray-600)', lineHeight: '1.8', fontSize: '1.05rem' }}>
                                    All submissions are subject to manual verification by designated faculty members. The portal reserves the right to reject submissions with insufficient proof or those that do not align with the category requirements.
                                </p>
                            </section>

                            <hr style={{ border: 'none', borderTop: '1px solid var(--gray-100)', margin: '2.5rem 0' }} />

                            <section>
                                <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '1.5rem', fontWeight: 700, color: 'var(--gray-900)', marginBottom: '1.5rem' }}>
                                    <CheckCircle2 className="text-brand-600" size={24} /> 3. Responsible Usage
                                </h2>
                                <p style={{ color: 'var(--gray-600)', lineHeight: '1.8', fontSize: '1.05rem' }}>
                                    Users must maintain the confidentiality of their login credentials. Any unauthorized access or attempt to bypass security measures will result in immediate suspension of the account and potential legal action.
                                </p>
                            </section>

                            <hr style={{ border: 'none', borderTop: '1px solid var(--gray-100)', margin: '2.5rem 0' }} />

                            <section>
                                <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--gray-900)', marginBottom: '1.5rem' }}>
                                    4. Portal Availability
                                </h2>
                                <p style={{ color: 'var(--gray-600)', lineHeight: '1.8', fontSize: '1.05rem' }}>
                                    While we strive for 24/7 availability, the portal may undergo scheduled maintenance for system upgrades or audit readiness. We are not liable for any temporary loss of access during these periods.
                                </p>
                            </section>

                            <div style={{ marginTop: '4rem', padding: '2rem', background: 'var(--gray-50)', borderRadius: '1rem', border: '1px dashed var(--gray-300)', textAlign: 'center' }}>
                                <p style={{ color: 'var(--gray-500)', fontSize: '0.9rem', fontStyle: 'italic' }}>
                                    Standard institutional terms apply. For detailed inquiries, please refer to the University Student Handbook.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default TermsOfService;
