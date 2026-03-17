import '../../styles/AboutPage.css';
import { GraduationCap, Target, Eye, Heart, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const AboutPage = () => (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)' }}>
        <div style={{ position: 'fixed', top: '1.5rem', left: '1.5rem', zIndex: 100 }}>
            <Link to="/" className="btn btn-secondary" style={{ fontWeight: 700, borderRadius: '12px', boxShadow: '0 10px 30px rgba(0,0,0,0.1)', backdropFilter: 'blur(10px)', border: '1px solid var(--border-primary)', padding: '0.6rem 1.25rem' }}>
                <ArrowLeft size={16} /> Back to Home
            </Link>
        </div>
        <section style={{ paddingTop: '100px', paddingBottom: '5rem' }}>
            <div className="container">
                <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
                    <h1>About <span className="text-gradient">SOEIT Portal</span></h1>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', maxWidth: '600px', margin: '1rem auto 0', lineHeight: 1.8 }}>
                        A centralized achievement management platform built for the School of Engineering & IT at Arka Jain University.
                    </p>
                </div>

                <div className="about-hero-grid">
                    {[
                        { icon: Target, title: 'Our Mission', text: 'To provide every SOEIT student with a transparent, efficient, and professional platform to document, verify, and share their academic and extracurricular achievements.', color: '#3b82f6' },
                        { icon: Eye, title: 'Our Vision', text: 'To become the gold standard for institutional achievement tracking in engineering colleges across India, enabling data-driven decisions about student potential.', color: '#8b5cf6' },
                        { icon: Heart, title: 'Our Values', text: 'Transparency in verification, fairness in recognition, and excellence in design. We believe every student achievement deserves proper documentation and celebration.', color: '#10b981' },
                    ].map(({ icon: Icon, title, text, color }) => (
                        <div key={title} className="card card-body">
                            <div style={{ width: 52, height: 52, background: color + '20', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem' }}>
                                <Icon size={26} color={color} />
                            </div>
                            <h3 style={{ marginBottom: '0.75rem' }}>{title}</h3>
                            <p style={{ color: 'var(--text-secondary)', lineHeight: 1.8 }}>{text}</p>
                        </div>
                    ))}
                </div>

                <div className="card card-body" style={{ background: 'linear-gradient(135deg, rgba(59,130,246,0.05), rgba(99,102,241,0.05))' }}>
                    <div className="about-content-grid">
                        <div>
                            <h2 style={{ marginBottom: '1rem' }}>About <span className="text-gradient">Arka Jain University</span></h2>
                            <p style={{ color: 'var(--text-secondary)', lineHeight: 1.8, marginBottom: '1rem' }}>
                                Arka Jain University is a premier engineering institution in Jharkhand, known for its commitment to academic excellence, innovation, and holistic student development.
                            </p>
                            <p style={{ color: 'var(--text-secondary)', lineHeight: 1.8 }}>
                                The School of Engineering & IT (SOEIT) offers programs in CSE, IT, ECE, EEE, Mechanical, and Civil Engineering, with a strong emphasis on practical learning and industry readiness.
                            </p>
                        </div>
                        <div className="about-stats-grid">
                            {[['10+', 'Years of Excellence'], ['5000+', 'Alumni Network'], ['50+', 'Industry Partners'], ['95%', 'Placement Rate']].map(([val, lbl]) => (
                                <div key={lbl} style={{ background: 'rgba(255,255,255,0.03)', borderRadius: 'var(--radius-md)', padding: '1.25rem', border: '1px solid var(--border-primary)', textAlign: 'center' }}>
                                    <div style={{ fontSize: '1.75rem', fontWeight: 800, fontFamily: 'Space Grotesk', color: 'var(--primary-400)' }}>{val}</div>
                                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>{lbl}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    </div>
);

export default AboutPage;
