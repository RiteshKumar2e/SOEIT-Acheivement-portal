import '../../styles/StudentDashboard.css';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { achievementAPI } from '../../services/api';
import { Trophy, CheckCircle, Clock, XCircle, Star, Upload, TrendingUp, Award, GraduationCap, ArrowUpRight } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { format } from 'date-fns';
import toast from 'react-hot-toast';

const COLORS = ['var(--brand-600)', 'var(--accent-500)', '#8b5cf6', '#f59e0b', '#ef4444', '#06b6d4', '#ec4899', '#84cc16'];

const StatusBadge = ({ status }) => {
    const map = {
        pending: ['badge-warning', Clock],
        approved: ['badge-success', CheckCircle],
        rejected: ['badge-error', XCircle]
    };
    const [cls, Icon] = map[status] || ['badge-primary', null];
    return (
        <span className={`badge ${cls}`} style={{ fontWeight: 800, padding: '0.4rem 0.8rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            {Icon && <Icon size={12} style={{ marginRight: '4px' }} />}
            {status}
        </span>
    );
};

const StudentDashboard = () => {
    const { user } = useAuth();
    const [stats, setStats] = useState({ stats: { all: 0, approved: 0, pending: 0, totalPoints: 0, byCategory: [], byLevel: [] }, recentActivity: [] });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const load = async () => {
            try {
                const { data } = await achievementAPI.getStats();
                if (data) setStats(data);
            } catch {
                toast.error('Could not load dashboard data. Please check your connection.');
            } finally {
                setLoading(false);
            }
        };
        load();
    }, []);

    const statCards = [
        { label: 'Total Dossier Submissions', value: stats?.stats?.all ?? 0, icon: Trophy, color: 'var(--brand-600)', bg: 'var(--primary-50)', delta: 'Verified Institutional Record' },
        { label: 'Validated Credentials', value: stats?.stats?.approved ?? 0, icon: CheckCircle, color: 'var(--success-500)', bg: 'var(--success-50)', delta: 'Authorized by Faculty' },
        { label: 'Evaluation Queue', value: stats?.stats?.pending ?? 0, icon: Clock, color: 'var(--warning-500)', bg: 'var(--warning-50)', delta: 'Pending Verification' },
        { label: 'Institutional Merit Score', value: stats?.stats?.totalPoints ?? 0, icon: Award, color: '#8b5cf6', bg: '#f5f3ff', delta: 'Cumulative Performance' },
    ];

    const categoryData = stats?.stats?.byCategory?.map(d => ({ name: d._id, count: d.count })) || [];
    const levelData = stats?.stats?.byLevel?.map(d => ({ name: d._id, value: d.count })) || [];

    if (loading) {
        return (
            <div className="animate-fade-in dashboard-skeleton-suite">
                <div className="dashboard-skeleton-grid" style={{ marginBottom: '2.5rem' }}>
                    {[...Array(4)].map((_, i) => <div key={i} className="skeleton" style={{ height: 160, borderRadius: '16px' }} />)}
                </div>
                <div className="dashboard-skeleton-charts">
                    <div className="skeleton" style={{ height: 380, borderRadius: '16px' }} />
                    <div className="skeleton" style={{ height: 380, borderRadius: '16px' }} />
                </div>
            </div>
        );
    }

    return (
        <div className="animate-fade-in">
            {/* Scholar Identity Header */}
            <div className="page-header dashboard-header-suite" style={{ marginBottom: '2.5rem' }}>
                <div className="dashboard-header-content">
                    <h2 className="heading-display">Scholar Performance Suite</h2>
                    <p className="page-subtitle">Unified tracking of institutional achievements, certifications, and academic impact.</p>
                </div>
                <Link to="/achievements/upload" className="btn btn-primary dashboard-header-btn">
                    <Upload size={18} />
                    <span className="hide-mobile">Upload New Credential</span>
                    <span className="show-mobile">Upload</span>
                </Link>
            </div>

            {/* Welcome Institutional Banner */}
            <div className="card welcome-institutional-banner" style={{ marginBottom: '2.5rem', background: 'linear-gradient(135deg, #f0f7ff 0%, #e8f4fd 50%, #f0f3ff 100%)', border: '1px solid var(--brand-200)', position: 'relative', overflow: 'hidden', boxShadow: 'var(--shadow-md)' }}>
                <div className="banner-motif-1" style={{ position: 'absolute', top: '-30%', right: '-3%', width: '280px', height: '280px', background: 'rgba(0, 33, 71, 0.04)', borderRadius: '50%' }}></div>
                <div className="banner-motif-2" style={{ position: 'absolute', bottom: '-40%', right: '15%', width: '200px', height: '200px', background: 'rgba(0, 33, 71, 0.03)', borderRadius: '50%' }}></div>
                <div className="banner-inner-content">
                    <div className="banner-icon-container" style={{ borderRadius: '20px', background: 'linear-gradient(135deg, var(--brand-600), var(--brand-800))', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 8px 24px rgba(0, 33, 71, 0.25)', flexShrink: 0 }}>
                        <GraduationCap size={40} />
                    </div>
                    <div className="banner-text-content">
                        <h3 className="welcome-headline" style={{ fontSize: '1.75rem', fontWeight: 900, marginBottom: '0.5rem', letterSpacing: '-0.03em', color: 'var(--brand-700)' }}>Welcome back, {user?.name}</h3>
                        <div className="banner-meta-row" style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', flexWrap: 'wrap' }}>
                            <div className="banner-meta-item" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--success-500)' }}></div>
                                <span style={{ fontWeight: 700, fontSize: '0.8rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{user?.department} DOMAIN</span>
                            </div>
                            <div className="meta-divider" style={{ width: '1px', height: '14px', background: 'var(--border-primary)' }}></div>
                            <span className="banner-meta-text" style={{ fontWeight: 700, fontSize: '0.8rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>ACADEMIC COHORT: {user?.batch || '2024'}</span>
                            <div className="meta-divider" style={{ width: '1px', height: '14px', background: 'var(--border-primary)' }}></div>
                            <span className="banner-meta-text" style={{ fontWeight: 700, fontSize: '0.8rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>SEMESTER: {user?.semester || 'N/A'}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Performance Metrics Grid */}
            <div className="dashboard-perf-metrics-grid" style={{ marginBottom: '2.5rem' }}>
                {statCards.map(({ label, value, icon: Icon, color, bg, delta }) => (
                    <div key={label} className="card stat-card-responsive" style={{ padding: '1.5rem', position: 'relative', overflow: 'hidden' }}>
                        <div className="stat-card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                            <div className="stat-icon-wrap" style={{ width: 44, height: 44, background: bg, borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: color }}>
                                <Icon size={22} />
                            </div>
                            <TrendingUp size={16} className="trending-icon" style={{ color: color, opacity: 0.5 }} />
                        </div>
                        <div className="stat-card-value" style={{ fontSize: '2.25rem', fontWeight: 900, color: 'var(--text-primary)', lineHeight: 1, marginBottom: '0.25rem', letterSpacing: '-0.02em' }}>{value}</div>
                        <div className="stat-card-label" style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</div>
                        <div className="stat-card-delta" style={{ fontSize: '0.7rem', fontWeight: 700, color: color, marginTop: '1rem', background: bg, padding: '0.25rem 0.5rem', borderRadius: '4px', width: 'fit-content' }}>
                            {delta}
                        </div>
                    </div>
                ))}
            </div>

            {/* Analytical Distribution Suite */}
            <div className="dashboard-analytical-distribution" style={{ marginBottom: '2.5rem' }}>
                <div className="card analytical-card-res" style={{ padding: '2rem' }}>
                    <div className="card-header analytical-header" style={{ marginBottom: '2rem', padding: 0 }}>
                        <h4 style={{ margin: 0, fontWeight: 800, fontSize: '1.1rem' }}>Institutional Achievement Trend</h4>
                        <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>Categorical analysis of verified credentials.</p>
                    </div>
                    <div className="analytical-chart-wrap">
                        {categoryData.length > 0 ? (
                            <ResponsiveContainer width="100%" height={300}>
                                <BarChart data={categoryData}>
                                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: 'var(--text-muted)', fontWeight: 700 }} dy={10} />
                                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: 'var(--text-muted)', fontWeight: 700 }} />
                                    <Tooltip
                                        cursor={{ fill: 'var(--primary-50)' }}
                                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: 'var(--shadow-xl)', fontWeight: 800 }}
                                    />
                                    <Bar dataKey="count" fill="var(--brand-600)" radius={[6, 6, 0, 0]} barSize={36} />
                                </BarChart>
                            </ResponsiveContainer>
                        ) : (
                            <div style={{ padding: '4rem 2rem', textAlign: 'center' }}>
                                <Trophy size={48} style={{ color: 'var(--slate-200)', marginBottom: '1rem' }} />
                                <p style={{ color: 'var(--text-muted)', fontWeight: 700 }}>No categorical data synchronized.</p>
                            </div>
                        )}
                    </div>
                </div>

                <div className="card analytical-card-res" style={{ padding: '2rem' }}>
                    <div className="card-header analytical-header" style={{ marginBottom: '2rem', padding: 0 }}>
                        <h4 style={{ margin: 0, fontWeight: 800, fontSize: '1.1rem' }}>Impact Recognition</h4>
                        <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>Global vs Departmental recognition distribution.</p>
                    </div>
                    <div className="analytical-chart-wrap">
                        {levelData.length > 0 ? (
                            <ResponsiveContainer width="100%" height={300}>
                                <PieChart>
                                    <Pie data={levelData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={70} outerRadius={90} paddingAngle={8} stroke="none">
                                        {levelData.map((_, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: 'var(--shadow-xl)', fontWeight: 800 }} />
                                    <Legend verticalAlign="bottom" iconType="circle" wrapperStyle={{ paddingTop: '20px' }} formatter={v => <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-secondary)' }}>{v}</span>} />
                                </PieChart>
                            </ResponsiveContainer>
                        ) : (
                            <div style={{ padding: '4rem 2rem', textAlign: 'center' }}>
                                <Award size={48} style={{ color: 'var(--slate-200)', marginBottom: '1rem' }} />
                                <p style={{ color: 'var(--text-muted)', fontWeight: 700 }}>Insufficient recognition data.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Submission Chronology Suite */}
            <div className="card recent-chronology-card" style={{ overflow: 'hidden' }}>
                <div className="card-header chronology-header" style={{ padding: '1.5rem 2rem', borderBottom: '1px solid var(--border-primary)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--slate-50)' }}>
                    <div className="chronology-header-content">
                        <h4 style={{ margin: 0, fontWeight: 800, fontSize: '1.1rem' }}>Recent Chronology Submissions</h4>
                        <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>Review the latest entries in your institutional portfolio.</p>
                    </div>
                    <Link to="/achievements" className="btn btn-ghost btn-sm chronology-action-btn" style={{ fontWeight: 800 }}>
                        <span>Full Registry</span>
                        <ArrowUpRight size={14} />
                    </Link>
                </div>

                <div style={{ overflowX: 'auto' }}>
                    {stats?.recentActivity?.length > 0 ? (
                        <table className="table" style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead>
                                <tr style={{ borderBottom: '2px solid var(--border-primary)' }}>
                                    <th style={{ padding: '1.25rem 2rem', textAlign: 'left', fontWeight: 800, textTransform: 'uppercase', fontSize: '0.75rem', color: 'var(--text-muted)', letterSpacing: '0.05em' }}>Achievement Profile</th>
                                    <th style={{ padding: '1.25rem 2rem', textAlign: 'left', fontWeight: 800, textTransform: 'uppercase', fontSize: '0.75rem', color: 'var(--text-muted)', letterSpacing: '0.05em' }}>Department Tag</th>
                                    <th style={{ padding: '1.25rem 2rem', textAlign: 'left', fontWeight: 800, textTransform: 'uppercase', fontSize: '0.75rem', color: 'var(--text-muted)', letterSpacing: '0.05em' }}>Impact Resolution</th>
                                    <th style={{ padding: '1.25rem 2rem', textAlign: 'left', fontWeight: 800, textTransform: 'uppercase', fontSize: '0.75rem', color: 'var(--text-muted)', letterSpacing: '0.05em' }}>Verification Status</th>
                                    <th style={{ padding: '1.25rem 2rem', textAlign: 'left', fontWeight: 800, textTransform: 'uppercase', fontSize: '0.75rem', color: 'var(--text-muted)', letterSpacing: '0.05em' }}>Registry Date</th>
                                </tr>
                            </thead>
                            <tbody>
                                {stats.recentActivity.map((a) => (
                                    <tr key={a._id} style={{ borderBottom: '1px solid var(--border-primary)', transition: 'background 0.2s ease' }} className="hover-slate">
                                        <td style={{ padding: '1.25rem 2rem', fontWeight: 800, color: 'var(--text-primary)', fontSize: '0.95rem' }}>{a.title}</td>
                                        <td style={{ padding: '1.25rem 2rem' }}><span className="badge badge-primary" style={{ fontWeight: 800 }}>{a.category}</span></td>
                                        <td style={{ padding: '1.25rem 2rem', fontWeight: 600, fontSize: '0.85rem' }}>{a.level} Resolution</td>
                                        <td style={{ padding: '1.25rem 2rem' }}><StatusBadge status={a.status} /></td>
                                        <td style={{ padding: '1.25rem 2rem', color: 'var(--text-muted)', fontWeight: 600, fontSize: '0.85rem' }}>{format(new Date(a.createdAt), 'MMM dd, yyyy')}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <div style={{ padding: '6rem 2rem', textAlign: 'center' }}>
                            <div style={{ width: 80, height: 80, background: 'var(--primary-50)', color: 'var(--brand-700)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem auto' }}>
                                <TrendingUp size={40} />
                            </div>
                            <h3 style={{ fontWeight: 800, marginBottom: '0.5rem' }}>Portfolio Initialization Required</h3>
                            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', maxWidth: '400px', margin: '0 auto 2rem auto' }}>You have not synchronized any achievement records with the institutional database.</p>
                            <Link to="/achievements/upload" className="btn btn-primary" style={{ padding: '0.8rem 2.5rem', fontWeight: 900 }}>Initiate First Submission</Link>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default StudentDashboard;
