import { Link } from 'react-router-dom';
import { HelpCircle, Mail, MessageSquare, BookOpen, ExternalLink, ArrowRight, ArrowLeft } from 'lucide-react';

const Support = () => {
    return (
        <div style={{ minHeight: '100vh', background: 'var(--bg-primary)' }}>
            <div style={{ position: 'fixed', top: '1.5rem', left: '1.5rem', zIndex: 100 }}>
                <Link to="/" className="btn btn-secondary" style={{ fontWeight: 700, borderRadius: '12px', boxShadow: '0 10px 30px rgba(0,0,0,0.1)', backdropFilter: 'blur(10px)', border: '1px solid var(--border-primary)', padding: '0.6rem 1.25rem' }}>
                    <ArrowLeft size={16} /> Back to Home
                </Link>
            </div>
            <section style={{ paddingTop: '100px', paddingBottom: '5rem' }}>
                <div className="container" style={{ maxWidth: '1000px' }}>
                    <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
                        <div style={{
                            display: 'inline-flex',
                            padding: '0.5rem 1.25rem',
                            background: 'var(--brand-500)',
                            borderRadius: '99px',
                            color: 'white',
                            fontSize: '0.875rem',
                            fontWeight: 700,
                            marginBottom: '1.5rem',
                            gap: '0.5rem',
                            alignItems: 'center',
                            boxShadow: '0 10px 20px -5px rgba(59, 130, 246, 0.3)'
                        }}>
                            <HelpCircle size={16} /> Help Center
                        </div>
                        <h1 style={{ fontSize: '3.5rem', fontWeight: 800, color: 'var(--gray-900)' }}>Portal <span className="text-gradient">Support</span></h1>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '1.25rem', marginTop: '1rem', maxWidth: '600px', margin: '1rem auto' }}>
                            Need assistance with your achievements or technical issues? We're here to help you succeed.
                        </p>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', marginBottom: '4rem' }}>
                        {/* Technical Support */}
                        <div className="card shadow-md h-full" style={{ padding: '2.5rem', borderRadius: '1.25rem', background: 'white', display: 'flex', flexDirection: 'column' }}>
                            <div style={{ width: 56, height: 56, background: 'var(--brand-50)', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem' }}>
                                <Mail size={24} className="text-brand-600" />
                            </div>
                            <h3 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1rem' }}>Technical Help</h3>
                            <p style={{ color: 'var(--gray-500)', marginBottom: '2rem', flexGrow: 1 }}>
                                Issues with login, achievement uploads, or portal errors? Contact our IT support team directly.
                            </p>
                            <a href="mailto:it.support@SOEIT.com" className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem' }}>
                                Email Support <ArrowRight size={16} />
                            </a>
                        </div>

                        {/* Functional Queries */}
                        <div className="card shadow-md h-full" style={{ padding: '2.5rem', borderRadius: '1.25rem', background: 'white', display: 'flex', flexDirection: 'column' }}>
                            <div style={{ width: 56, height: 56, background: '#f0fdf4', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem' }}>
                                <MessageSquare size={24} style={{ color: '#16a34a' }} />
                            </div>
                            <h3 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1rem' }}>Academic Queries</h3>
                            <p style={{ color: 'var(--gray-500)', marginBottom: '2rem', flexGrow: 1 }}>
                                Questions about achievement categories or verification criteria? Reach out to your Faculty Coordinator.
                            </p>
                            <button className="btn btn-outline" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem', borderColor: '#16a34a', color: '#16a34a' }}>
                                View Coordinators <ExternalLink size={16} />
                            </button>
                        </div>

                        {/* Documentation */}
                        <div className="card shadow-md h-full" style={{ padding: '2.5rem', borderRadius: '1.25rem', background: 'white', display: 'flex', flexDirection: 'column' }}>
                            <div style={{ width: 56, height: 56, background: '#fff7ed', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem' }}>
                                <BookOpen size={24} style={{ color: '#ea580c' }} />
                            </div>
                            <h3 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1rem' }}>User Guide</h3>
                            <p style={{ color: 'var(--gray-500)', marginBottom: '2rem', flexGrow: 1 }}>
                                Learn how to maximize your portfolio with our comprehensive portal documentation and FAQs.
                            </p>
                            <Link to="/manual" className="btn btn-outline" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem', borderColor: '#ea580c', color: '#ea580c' }}>
                                Read Manual <ExternalLink size={16} />
                            </Link>
                        </div>
                    </div>

                    {/* FAQ Quick Link */}
                    <div style={{ textAlign: 'center', background: 'var(--gray-900)', color: 'white', padding: '3rem', borderRadius: '2rem' }}>
                        <h2 style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '1rem', color: 'white' }}>Still have questions?</h2>
                        <p style={{ color: 'rgba(255,255,255,0.7)', marginBottom: '2.5rem' }}>Our frequently asked questions might have the answer you're looking for.</p>
                        <a href="/#faq" className="btn btn-primary" style={{ background: 'white', color: 'var(--gray-900)' }}>
                            Browse FAQ Section
                        </a>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Support;
