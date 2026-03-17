import '../../styles/FeaturesPage.css';
import { Upload, Shield, BarChart3, Globe, Award, TrendingUp, CheckCircle, Search, Star, Zap, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const features = [
    { icon: Upload, color: '#3b82f6', title: 'Easy Achievement Upload', points: ['Supports images, PDFs, Word documents', 'Drag & drop file upload', 'Real-time progress indicator', 'Multi-file upload (up to 5 per achievement)'] },
    { icon: Shield, color: '#8b5cf6', title: 'Transparent Verification', points: ['Faculty review queue', 'Approve or reject with remarks', 'Full audit trail', 'Real-time status updates for students'] },
    { icon: BarChart3, color: '#10b981', title: 'Analytics Dashboard', points: ['Department-wise statistics', 'Category trend charts', 'Monthly submission trends', 'Top performers leaderboard'] },
    { icon: Globe, color: '#f59e0b', title: 'Digital Portfolio', points: ['Publicly shareable link', 'Category-based filtering', 'Verified achievements badge', 'Social links integration'] },
    { icon: Award, color: '#ef4444', title: 'Points & Recognition', points: ['Tiered points system (10–100)', 'Level-based rewards', 'Performance comparison', 'Department ranking'] },
    { icon: TrendingUp, color: '#06b6d4', title: 'Performance Tracking', points: ['Semester-wise tracking', 'Progress over time', 'Category breakdown', 'Peer benchmarking'] },
    { icon: Search, color: '#ec4899', title: 'Smart Filtering', points: ['Multi-parameter search', 'Status-based filtering', 'Category & level filters', 'Paginated results'] },
    { icon: Zap, color: '#84cc16', title: 'Fast & Secure', points: ['JWT authentication', 'Role-based access control', 'Helmet security headers', 'Input sanitization'] },
];

const FeaturesPage = () => (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)' }}>
        <div style={{ position: 'fixed', top: '1.5rem', left: '1.5rem', zIndex: 100 }}>
            <Link to="/" className="btn btn-secondary" style={{ fontWeight: 700, borderRadius: '12px', boxShadow: '0 10px 30px rgba(0,0,0,0.1)', backdropFilter: 'blur(10px)', border: '1px solid var(--border-primary)', padding: '0.6rem 1.25rem' }}>
                <ArrowLeft size={16} /> Back to Home
            </Link>
        </div>
        <section style={{ paddingTop: '100px', paddingBottom: '6rem' }}>
            <div className="container">
                <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.3)', borderRadius: 'var(--radius-full)', padding: '0.4rem 1rem', marginBottom: '1rem' }}>
                        <Star size={14} color="var(--primary-400)" />
                        <span style={{ fontSize: '0.8rem', color: 'var(--primary-400)', fontWeight: 600 }}>Platform Features</span>
                    </div>
                    <h1>Built for <span className="text-gradient">Real Institutional Use</span></h1>
                    <p style={{ color: 'var(--text-secondary)', maxWidth: 550, margin: '1rem auto 0', lineHeight: 1.8, fontSize: '1.05rem' }}>
                        Every feature is designed with SOEIT students and faculty in mind — not a prototype, but a deployable production platform.
                    </p>
                </div>

                <div className="features-grid">
                    {features.map(({ icon: Icon, color, title, points }) => (
                        <div key={title} className="card card-body" style={{ transition: 'all 0.3s' }}
                            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-5px)'; e.currentTarget.style.borderColor = color + '55'; }}
                            onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.borderColor = 'var(--border-primary)'; }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem', marginBottom: '1.25rem' }}>
                                <div style={{ width: 48, height: 48, background: color + '20', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                    <Icon size={24} color={color} />
                                </div>
                                <h4 style={{ fontSize: '1rem', color: 'var(--text-primary)' }}>{title}</h4>
                            </div>
                            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                {points.map(p => (
                                    <li key={p} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                                        <CheckCircle size={14} style={{ color, flexShrink: 0 }} /> {p}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                <div style={{ textAlign: 'center', marginTop: '4rem' }}>
                    <h2 style={{ marginBottom: '1.5rem' }}>Ready to get started?</h2>
                    <div className="features-action-btns">
                        <Link to="/register" className="btn btn-primary btn-lg">Create Student Account</Link>
                    </div>
                </div>
            </div>
        </section>
    </div>
);

export default FeaturesPage;
