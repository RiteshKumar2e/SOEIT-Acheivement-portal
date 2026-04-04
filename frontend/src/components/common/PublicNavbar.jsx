import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { GraduationCap, Menu, X, ArrowRight } from 'lucide-react';
import '../../styles/layout/PublicNavbar.css';

const PublicNavbar = () => {
    const [scrolled, setScrolled] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const handler = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handler, { passive: true });
        return () => window.removeEventListener('scroll', handler);
    }, []);

    useEffect(() => {
        if (menuOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => {
            document.body.style.overflow = '';
        };
    }, [menuOpen]);

    const navLinks = [
        { path: '/', label: 'Home' },
        { path: '/about', label: 'About' },
        { path: '/features', label: 'Features' },
        { path: '/how-it-works', label: 'How It Works' },
        { path: '/contact', label: 'Contact' },
    ];

    return (
        <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
            <div className="container">
                <div className="navbar-inner">
                    {/* Brand Logo */}
                    <Link to="/" className="nav-logo">
                        <div className="nav-logo-icon">
                            <GraduationCap size={24} color="#fff" />
                        </div>
                        <div className="hidden sm:block">
                            <div className="nav-logo-text">SoEIT Portal</div>
                            <div className="nav-logo-subtitle">Technical Excellence</div>
                        </div>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="nav-link-group">
                        {navLinks.map(({ path, label }) => (
                            <Link key={path} to={path} className="nav-item">
                                {label}
                            </Link>
                        ))}
                    </div>

                    {/* Auth Actions */}
                    <div className="nav-cta-group">
                        <Link to="/login" className="btn btn-secondary btn-md rounded-lg px-8 py-3 font-bold text-[15px]">
                            Sign In
                        </Link>
                        <Link to="/register" className="btn btn-primary btn-md rounded-lg px-8 py-3 bg-brand-900 border-none font-bold text-[15px] shadow-lg hover:scale-105 transition-transform">
                            Register
                        </Link>

                        {/* Mobile Toggle */}
                        <button
                            className="p-2 md:hidden text-gray-600"
                            onClick={() => setMenuOpen(!menuOpen)}
                        >
                            {menuOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>
                </div>

                {/* Mobile Menu Overlay */}
                {menuOpen && (
                    <div className="mobile-menu-overlay">
                        {navLinks.map(({ path, label }) => (
                            <Link
                                key={path}
                                to={path}
                                className="mobile-nav-item"
                                onClick={() => setMenuOpen(false)}
                            >
                                {label}
                            </Link>
                        ))}
                        <div className="mobile-nav-cta">
                            <Link to="/login" className="btn btn-secondary w-full py-4 text-center justify-center" onClick={() => setMenuOpen(false)}>Sign In</Link>
                            <Link to="/register" className="btn btn-primary w-full py-4 text-center justify-center flex items-center gap-2" onClick={() => setMenuOpen(false)}>Get Started <ArrowRight size={18} /></Link>
                        </div>
                    </div>
                )}
            </div>
        </nav>
    );
};

export default PublicNavbar;

