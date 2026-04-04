import { Link } from 'react-router-dom';
import { GraduationCap, Mail, Phone, MapPin, Linkedin, Github, Twitter, Youtube, ExternalLink } from 'lucide-react';
import '../../styles/layout/Footer.css';

const Footer = () => {
    const currentYear = new Date().getFullYear();

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
                            <a href="#" className="footer-social-link" aria-label="Twitter">
                                <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M23.953 4.57c-.469.399-1.012.723-1.604.945C21.84 5.093 21.1 4.59 20.26 4.304a5.006 5.006 0 00-6.19 2.012 5.008 5.008 0 00-.73 3.659C9.728 9.617 6.44 7.842 4.24 5.15c-.464.793-.728 1.707-.728 2.68 0 1.942.988 3.655 2.488 4.656-.917-.03-1.78-.281-2.534-.7v.063c0 2.71 1.93 4.973 4.49 5.488-.47.127-.963.195-1.472.195-.36 0-.711-.035-1.054-.1 1.037 3.238 4.045 5.594 7.61 5.66A10.023 10.023 0 010 20.354 14.168 14.168 0 007.61 22.5c9.13 0 14.13-7.56 14.13-14.13 0-.21 0-.43-.015-.64A10.09 10.09 0 0024 5.14c-.87.38-1.80.64-2.77.76.99-.59 1.76-1.54 2.12-2.67z"/></svg>
                            </a>
                            <a href="#" className="footer-social-link" aria-label="LinkedIn">
                                <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                            </a>
                            <a href="#" className="footer-social-link" aria-label="GitHub">
                                <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
                            </a>
                            <a href="#" className="footer-social-link" aria-label="YouTube">
                                <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
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
                            <a href="#" className="app-badge-box">
                                <img src="https://developer.apple.com/assets/elements/badges/download-on-the-app-store.svg" alt="App Store" />
                            </a>
                            <a href="#" className="app-badge-box">
                                <img src="https://play.google.com/intl/en_us/badges/static/images/badges/en_badge_web_generic.png" alt="Google Play" />
                            </a>
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
        </footer>
    );
};

export default Footer;

