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
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const load = async () => {
            try {
                const { data } = await achievementAPI.getStats();
                setStats(data);
            } catch {
                toast.error('Identity synchronization failed: Dashboard unavailable');
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
            <div className="animate-fade-in">
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.5rem', marginBottom: '2.5rem' }}>
                    {[...Array(4)].map((_, i) => <div key={i} className="skeleton" style={{ height: 160, borderRadius: '16px' }} />)}
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1.8fr 1fr', gap: '1.5rem' }}>
                    <div className="skeleton" style={{ height: 380, borderRadius: '16px' }} />
                    <div className="skeleton" style={{ height: 380, borderRadius: '16px' }} />
                </div>
            </div>
        );
    }

    return (
        <div className="animate-fade-in">
            {/* Scholar Identity Header */}
            <div className="page-header" style={{ marginBottom: '2.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                <div>
                    <h2 className="heading-display">Scholar Performance Suite</h2>
                    <p className="page-subtitle">Unified tracking of institutional achievements, certifications, and academic impact.</p>
                </div>
                <Link to="/achievements/upload" className="btn btn-primary" style={{ padding: '0.8rem 2rem', fontWeight: 900 }}>
                    <Upload size={18} />
                    <span>Upload New Credential</span>
                </Link>
            </div>

            {/* Welcome Institutional Banner */}
            <div className="card" style={{ marginBottom: '2.5rem', background: 'linear-gradient(135deg, var(--brand-700), var(--brand-900))', padding: '2.5rem', border: 'none', position: 'relative', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', top: '-20%', right: '-5%', width: '300px', height: '300px', background: 'rgba(255,255,255,0.03)', borderRadius: '50%' }}></div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '2.5rem', position: 'relative', zIndex: 1 }}>
                    <div style={{ width: 100, height: 100, borderRadius: '24px', background: 'rgba(255,255,255,0.15)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: 'var(--shadow-xl)', border: '1px solid rgba(255,255,255,0.2)' }}>
                        <GraduationCap size={48} />
                    </div>
                    <div style={{ color: 'white' }}>
                        <h3 style={{ fontSize: '2.25rem', fontWeight: 900, marginBottom: '0.75rem', letterSpacing: '-0.02em' }}>Welcome back, {user?.name}</h3>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', flexWrap: 'wrap' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--success-400)' }}></div>
                                <span style={{ fontWeight: 700, fontSize: '0.9rem', opacity: 0.9 }}>{user?.department} DOMAIN</span>
                            </div>
                            <div style={{ width: '1px', height: '16px', background: 'rgba(255,255,255,0.2)' }}></div>
                            <span style={{ fontWeight: 700, fontSize: '0.9rem', opacity: 0.9 }}>ACADEMIC COHORT: {user?.batch || '2024'}</span>
                            <div style={{ width: '1px', height: '16px', background: 'rgba(255,255,255,0.2)' }}></div>
                            <span style={{ fontWeight: 700, fontSize: '0.9rem', opacity: 0.9 }}>SEMESTER RESOLUTION: {user?.semester || 'N/A'}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Performance Metrics Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.5rem', marginBottom: '2.5rem' }}>
                {statCards.map(({ label, value, icon: Icon, color, bg, delta }) => (
                    <div key={label} className="card" style={{ padding: '1.5rem', position: 'relative', overflow: 'hidden' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                            <div style={{ width: 44, height: 44, background: bg, borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: color }}>
                                <Icon size={22} />
                            </div>
                            <TrendingUp size={16} style={{ color: color, opacity: 0.5 }} />
                        </div>
                        <div style={{ fontSize: '2.25rem', fontWeight: 900, color: 'var(--text-primary)', lineHeight: 1, marginBottom: '0.25rem', letterSpacing: '-0.02em' }}>{value}</div>
                        <div style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</div>
                        <div style={{ fontSize: '0.7rem', fontWeight: 700, color: color, marginTop: '1rem', background: bg, padding: '0.25rem 0.5rem', borderRadius: '4px', width: 'fit-content' }}>
                            {delta}
                        </div>
                    </div>
                ))}
            </div>

            {/* Analytical Distribution Suite */}
            <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr', gap: '1.5rem', marginBottom: '2.5rem' }}>
                <div className="card" style={{ padding: '2rem' }}>
                    <div className="card-header" style={{ marginBottom: '2rem', padding: 0 }}>
                        <h4 style={{ margin: 0, fontWeight: 800, fontSize: '1.1rem' }}>Institutional Achievement Trend</h4>
                        <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>Categorical analysis of verified credentials.</p>
                    </div>
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

                <div className="card" style={{ padding: '2rem' }}>
                    <div className="card-header" style={{ marginBottom: '2rem', padding: 0 }}>
                        <h4 style={{ margin: 0, fontWeight: 800, fontSize: '1.1rem' }}>Impact Recognition</h4>
                        <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>Global vs Departmental recognition distribution.</p>
                    </div>
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

            {/* Submission Chronology Suite */}
            <div className="card" style={{ overflow: 'hidden' }}>
                <div className="card-header" style={{ padding: '1.5rem 2rem', borderBottom: '1px solid var(--border-primary)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--slate-50)' }}>
                    <div>
                        <h4 style={{ margin: 0, fontWeight: 800, fontSize: '1.1rem' }}>Recent Chronology Submissions</h4>
                        <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>Review the latest entries in your institutional portfolio.</p>
                    </div>
                    <Link to="/achievements" className="btn btn-ghost btn-sm" style={{ fontWeight: 800 }}>
                        <span>Archive Full Registry</span>
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
