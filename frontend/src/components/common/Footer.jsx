import { useState } from 'react';
import { Link } from 'react-router-dom';
import { GraduationCap, Mail, Phone, MapPin, Linkedin, Github, Twitter, Youtube, ExternalLink, X } from 'lucide-react';
import '../../styles/layout/Footer.css';

const Footer = () => {
    const currentYear = new Date().getFullYear();
    const [showAppModal, setShowAppModal] = useState(false);

    const socialLinks = [
        { icon: Linkedin, href: '#' },
        { icon: Github, href: '#' },
        { icon: Twitter, href: '#' },
    ];

    const quickLinks = [
        { path: '/', label: 'Home' },
        { path: '/about', label: 'About Us' },
        { path: '/features', label: 'Features' },
        { path: '/how-it-works', label: 'How It Works' },
        { path: '/contact', label: 'Contact' },
    ];

    const platformLinks = [
        { path: '/register', label: 'Student Registration' },
        { path: '/login', label: 'Portal Login' },
        { path: '/admin-login', label: 'Admin Login' },
        { path: '/features', label: 'Achievement Categories' },
        { path: '/public-portfolio', label: 'Public Portfolios' },

    ];

    return (
        <footer className="footer-dark">
            <div className="container-lg">
                <div className="footer-main-grid">
                    {/* Brand Column */}
                    <div className="footer-brand-section">
                        <Link to="/" className="footer-logo">
                            <div className="footer-logo-icon">
                                <GraduationCap size={24} color="#fff" />
                            </div>
                            <div>
                                <h3 className="footer-logo-text">SOEIT Portal</h3>
                                <span className="footer-logo-tagline">Academic Excellence</span>
                            </div>
                        </Link>
                        <p className="footer-description">
                            A centralized platform for students to showcase achievements and for faculty to verify and monitor academic performance at SOEIT.
                        </p>
                        <div className="footer-social-wrapper">
                            <a href="mailto:riteshkumar90359@gmail.com" className="footer-social-link" aria-label="Gmail">
                                <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M24 5.457v13.909c0 .904-.732 1.636-1.636 1.636h-3.819V11.73L12 16.64l-6.545-4.91v9.273H1.636A1.636 1.636 0 0 1 0 19.366V5.457c0-2.023 2.309-3.178 3.927-1.964L5.455 4.64 12 9.548l6.545-4.91 1.528-1.145C21.69 2.28 24 3.434 24 5.457z" /></svg>
                            </a>
                            <a href="https://www.linkedin.com/in/riteshkumar-tech/" className="footer-social-link" aria-label="LinkedIn">
                                <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" /></svg>
                            </a>
                            <a href="https://github.com/RiteshKumar2e" className="footer-social-link" aria-label="GitHub">
                                <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" /></svg>
                            </a>
                        </div>
                    </div>

                    {/* Links Columns */}
                    <div className="footer-links-column">
                        <h4 className="footer-title">Navigations</h4>
                        <nav className="footer-nav">
                            {quickLinks.map(({ path, label }) => (
                                <Link key={path} to={path} className="footer-nav-link">{label}</Link>
                            ))}
                        </nav>
                    </div>

                    <div className="footer-links-column">
                        <h4 className="footer-title">Portal</h4>
                        <nav className="footer-nav">
                            {platformLinks.map(({ path, label }) => (
                                <Link key={label} to={path} className="footer-nav-link">{label}</Link>
                            ))}
                        </nav>
                    </div>

                    <div className="footer-links-column">
                        <h4 className="footer-title">Reach Us</h4>
                        <div className="footer-contact-info">
                            <div className="contact-item">
                                <Mail size={16} />
                                <a href="mailto:soeit@arkajainuniversity.ac.in">soeit@arkajainuniversity.ac.in</a>
                            </div>
                            <div className="contact-item">
                                <Phone size={16} />
                                <span>+91 1234567890</span>
                            </div>
                            <div className="contact-item">
                                <MapPin size={16} />
                                <span>Jamshedpur, Jharkhand, India</span>
                            </div>
                        </div>
                        {/* Badges moved here under Reach Us */}
                        <div className="footer-badges-column">
                            <button onClick={() => setShowAppModal(true)} className="app-badge-box" style={{ background: 'transparent', border: 'none', padding: 0, cursor: 'pointer' }}>
                                <img src="https://developer.apple.com/assets/elements/badges/download-on-the-app-store.svg" alt="App Store" />
                            </button>
                            <button onClick={() => setShowAppModal(true)} className="app-badge-box" style={{ background: 'transparent', border: 'none', padding: 0, cursor: 'pointer' }}>
                                <img src="https://play.google.com/intl/en_us/badges/static/images/badges/en_badge_web_generic.png" alt="Google Play" style={{ width: '135px' }} />
                            </button>
                        </div>
                    </div>
                </div>

                <div className="footer-divider"></div>

                <div className="footer-bottom-full">
                    <div className="footer-legal-bar">
                        <Link to="/privacy">Privacy Policy</Link>
                        <Link to="/terms">Terms of Service</Link>
                        <Link to="/cookies">Cookie Policy</Link>
                        <Link to="/accessibility">Accessibility</Link>
                        <Link to="/privacy-preferences">Manage Privacy Preferences</Link>
                    </div>

                    <div className="footer-copyright-main">
                        © {currentYear} SOEIT Inc. All rights reserved.
                    </div>
                </div>
            </div>

            {/* Coming Soon App Modal */}
            {showAppModal && (
                <div style={{
                    position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.6)', backdropFilter: 'blur(4px)',
                    zIndex: 10000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.5rem', animation: 'fadeIn 0.2s ease-out'
                }}>
                    <div style={{
                        background: '#ffffff', width: '100%', maxWidth: '450px', borderRadius: '20px', padding: '2rem',
                        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)', position: 'relative', textAlign: 'center', animation: 'slideUp 0.3s ease-out'
                    }}>
                        <button 
                            onClick={() => setShowAppModal(false)}
                            style={{ position: 'absolute', top: '1rem', right: '1rem', background: '#f1f5f9', border: 'none', borderRadius: '50%', padding: '0.5rem', cursor: 'pointer', color: '#64748b', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s' }}
                            onMouseOver={(e) => { e.currentTarget.style.background = '#e2e8f0'; e.currentTarget.style.color = '#0f172a'; }}
                            onMouseOut={(e) => { e.currentTarget.style.background = '#f1f5f9'; e.currentTarget.style.color = '#64748b'; }}
                        >
                            <X size={20} strokeWidth={2.5} />
                        </button>
                        <div style={{ width: '60px', height: '60px', background: '#eff6ff', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem auto' }}>
                            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="5" y="2" width="14" height="20" rx="2" ry="2"></rect><line x1="12" y1="18" x2="12.01" y2="18"></line></svg>
                        </div>
                        <h3 style={{ margin: '0 0 1rem 0', fontSize: '1.5rem', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.02em' }}>Available Soon!</h3>
                        <p style={{ margin: '0 0 1rem 0', color: '#475569', fontSize: '1rem', lineHeight: 1.6 }}>
                            Our mobile application is currently under development and will be available soon on the App Store and Google Play.
                        </p>
                        <p style={{ margin: 0, color: '#64748b', fontSize: '0.9rem', fontWeight: 500 }}>
                            We are working to deliver a seamless and high-quality experience. Thank you for your patience and support.
                        </p>
                        <button 
                            onClick={() => setShowAppModal(false)}
                            style={{ width: '100%', padding: '0.875rem', background: '#2563eb', color: 'white', border: 'none', borderRadius: '12px', fontWeight: 700, fontSize: '1rem', marginTop: '2rem', cursor: 'pointer', transition: 'background 0.2s' }}
                            onMouseOver={(e) => e.currentTarget.style.background = '#1d4ed8'}
                            onMouseOut={(e) => e.currentTarget.style.background = '#2563eb'}
                        >
                            Got It
                        </button>
                    </div>
                </div>
            )}
        </footer>
    );
};

export default Footer;

