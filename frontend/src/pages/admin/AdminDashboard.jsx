import '../../styles/AdminDashboard.css';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { adminAPI } from '../../services/api';
import { Users, Trophy, Clock, CheckCircle, XCircle, TrendingUp, BarChart3, Award, Shield } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, AreaChart, Area, PieChart, Pie, Cell, Legend } from 'recharts';
import { format } from 'date-fns';
import toast from 'react-hot-toast';

const COLORS = ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444', '#06b6d4'];

const AdminDashboard = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const load = async () => {
            try {
                const res = await adminAPI.getDashboard();
                setData(res.data);
            } catch {
                toast.error('Failed to synchronize administrative intelligence stream');
            } finally {
                setLoading(false);
            }
        };
        load();
    }, []);

    const statCards = [
        { label: 'Scholar Registry', value: data?.stats?.totalStudents ?? 0, icon: Users, color: 'var(--brand-600)', bg: 'var(--primary-50)', delta: 'Active academic enrollments', iconColor: 'var(--brand-700)' },
        { label: 'Faculty Roster', value: data?.stats?.totalFaculties ?? 0, icon: Shield, color: 'var(--indigo-600)', bg: 'var(--indigo-50)', delta: 'Authorized institutional staff', iconColor: 'var(--indigo-700)' },
        { label: 'Total Achievements', value: data?.stats?.totalAchievements ?? 0, icon: Trophy, color: 'var(--success-600)', bg: 'var(--success-50)', delta: `Verified: ${data?.stats?.approvedCount ?? 0} units`, iconColor: 'var(--success-700)' },
        { label: 'Review Queue', value: data?.stats?.pendingCount ?? 0, icon: Clock, color: 'var(--warning-500)', bg: 'var(--warning-50)', delta: 'Pending reconciliation', iconColor: 'var(--warning-700)' },
    ];

    const trendData = (data?.monthlyTrend || []).map(d => ({
        name: `${['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][d._id.month - 1]}`,
        count: d.count,
    }));

    if (loading) {
        return (
            <div className="animate-fade-in">
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.5rem', marginBottom: '2.5rem' }}>
                    {[...Array(4)].map((_, i) => <div key={i} className="skeleton" style={{ height: 160, borderRadius: '20px' }} />)}
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1.8fr 1fr', gap: '2rem' }}>
                    <div className="skeleton" style={{ height: 400, borderRadius: '20px' }} />
                    <div className="skeleton" style={{ height: 400, borderRadius: '20px' }} />
                </div>
            </div>
        );
    }

    return (
        <div className="animate-fade-in">
            {/* Header Context Suite */}
            <div className="page-header" style={{ marginBottom: '2.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                <div>
                    <h2 className="heading-display">Administrative Oversight</h2>
                    <p className="page-subtitle">Unified surveillance of institutional achievements, departmental growth, and evaluation performance metrics.</p>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.625rem 1.25rem', background: 'white', borderRadius: '12px', border: '1px solid var(--border-primary)', boxShadow: 'var(--shadow-sm)' }}>
                    <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--success-500)', boxShadow: '0 0 0 4px var(--success-50)' }}></div>
                    <span style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '0.02em' }}>REAL-TIME SYNCHRONIZATION</span>
                </div>
            </div>

            {/* Premium Stat Architecture */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.5rem', marginBottom: '2.5rem' }}>
                {statCards.map(({ label, value, icon: Icon, color, bg, delta, iconColor }) => (
                    <div key={label} className="card" style={{ padding: '1.75rem', position: 'relative', overflow: 'hidden', border: '1px solid var(--border-primary)', borderRadius: '20px', boxShadow: 'var(--shadow-sm)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.25rem' }}>
                            <div style={{ width: 52, height: 52, background: bg, borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: `1px solid ${bg}` }}>
                                <Icon size={24} style={{ color: iconColor }} strokeWidth={2.5} />
                            </div>
                            <div style={{ padding: '0.4rem 0.6rem', background: 'var(--slate-50)', borderRadius: '8px', border: '1px solid var(--border-primary)', fontSize: '0.7rem', fontWeight: 900, color: 'var(--text-muted)' }}>
                                ANALYTICS
                            </div>
                        </div>
                        <div style={{ fontSize: '2.25rem', fontWeight: 900, color: 'var(--text-primary)', lineHeight: 1, marginBottom: '0.5rem', letterSpacing: '-0.03em' }}>{value.toLocaleString()}</div>
                        <div style={{ fontSize: '0.9rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>{label}</div>
                        <div style={{ fontSize: '0.75rem', fontWeight: 700, color: color, marginTop: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 0.75rem', background: bg, borderRadius: '10px', width: 'fit-content' }}>
                            <TrendingUp size={14} strokeWidth={3} />
                            {delta}
                        </div>
                    </div>
                ))}
            </div>

            {/* Dynamic Visualization Ecosystem */}
            <div style={{ display: 'grid', gridTemplateColumns: '1.8fr 1fr', gap: '2rem', marginBottom: '2.5rem' }}>
                {/* Submission Longitudinal Trend */}
                <div className="card" style={{ border: '1px solid var(--border-primary)', borderRadius: '20px', overflow: 'hidden' }}>
                    <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-primary)', padding: '1.5rem 2rem', background: 'var(--slate-50)' }}>
                        <h4 style={{ margin: 0, fontWeight: 900, fontSize: '1.15rem', color: 'var(--text-primary)' }}>Submission Longitudinal Trend</h4>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.75rem', fontWeight: 900, color: 'var(--brand-600)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                            <BarChart3 size={16} /> 12-Month Resolution
                        </div>
                    </div>
                    <div className="card-body" style={{ padding: '2.5rem 1.5rem 1rem 1.5rem' }}>
                        <ResponsiveContainer width="100%" height={320}>
                            <AreaChart data={trendData}>
                                <defs>
                                    <linearGradient id="adminTrend" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="0%" stopColor="var(--brand-600)" stopOpacity={0.15} />
                                        <stop offset="100%" stopColor="var(--brand-600)" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <XAxis dataKey="name" tick={{ fill: 'var(--text-muted)', fontSize: 12, fontWeight: 800 }} tickLine={false} axisLine={false} dy={15} />
                                <YAxis tick={{ fill: 'var(--text-muted)', fontSize: 12, fontWeight: 800 }} tickLine={false} axisLine={false} dx={-10} />
                                <Tooltip cursor={{ stroke: 'var(--brand-200)', strokeWidth: 2 }} contentStyle={{ background: '#fff', border: '1px solid var(--border-primary)', borderRadius: 14, boxShadow: 'var(--shadow-xl)', padding: '12px' }} />
                                <Area type="monotone" dataKey="count" stroke="var(--brand-600)" strokeWidth={4} fill="url(#adminTrend)" dot={{ r: 6, fill: '#fff', stroke: 'var(--brand-600)', strokeWidth: 3 }} activeDot={{ r: 8, strokeWidth: 0, fill: 'var(--brand-700)' }} />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Domain Distribution Intelligence */}
                <div className="card" style={{ border: '1px solid var(--border-primary)', borderRadius: '20px', overflow: 'hidden' }}>
                    <div className="card-header" style={{ borderBottom: '1px solid var(--border-primary)', padding: '1.5rem 2rem', background: 'var(--slate-50)' }}>
                        <h4 style={{ margin: 0, fontWeight: 900, fontSize: '1.15rem', color: 'var(--text-primary)' }}>Domain Yield Analysis</h4>
                    </div>
                    <div className="card-body" style={{ padding: '2rem' }}>
                        <ResponsiveContainer width="100%" height={320}>
                            <PieChart>
                                <Pie
                                    data={data?.byCategory || []}
                                    dataKey="count"
                                    nameKey="_id"
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={75}
                                    outerRadius={105}
                                    paddingAngle={8}
                                    stroke="none"
                                >
                                    {(data?.byCategory || []).map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} style={{ filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.05))' }} />)}
                                </Pie>
                                <Tooltip contentStyle={{ background: '#fff', border: '1px solid var(--border-primary)', borderRadius: 14, boxShadow: 'var(--shadow-xl)' }} />
                                <Legend verticalAlign="bottom" align="center" iconType="circle" iconSize={10} wrapperStyle={{ paddingTop: '30px' }} formatter={v => <span style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.04em' }}>{v}</span>} />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Departmental Intelligence & Critical Action Queue */}
            <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.5fr) minmax(0, 1fr)', gap: '2rem' }}>
                <div className="card" style={{ border: '1px solid var(--border-primary)', borderRadius: '20px', overflow: 'hidden' }}>
                    <div className="card-header" style={{ borderBottom: '1px solid var(--border-primary)', padding: '1.5rem 2rem', background: 'var(--slate-50)' }}>
                        <h4 style={{ margin: 0, fontWeight: 900, fontSize: '1.15rem', color: 'var(--text-primary)' }}>Departmental Compliance Performance</h4>
                    </div>
                    <div className="card-body" style={{ padding: '2.5rem 2rem 1.5rem 1rem' }}>
                        <ResponsiveContainer width="100%" height={320}>
                            <BarChart data={data?.byDepartment || []} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                                <XAxis dataKey="_id" tick={{ fill: 'var(--text-muted)', fontSize: 12, fontWeight: 900 }} tickLine={false} axisLine={false} dy={15} />
                                <YAxis tick={{ fill: 'var(--text-muted)', fontSize: 12, fontWeight: 900 }} tickLine={false} axisLine={false} />
                                <Tooltip cursor={{ fill: 'var(--slate-50)', radius: 8 }} contentStyle={{ background: '#fff', border: '1px solid var(--border-primary)', borderRadius: 14, boxShadow: 'var(--shadow-xl)' }} />
                                <Bar dataKey="count" name="Cumulative Yield" fill="var(--slate-200)" radius={[6, 6, 0, 0]} barSize={28} />
                                <Bar dataKey="approved" name="Verified Yield" fill="var(--brand-600)" radius={[6, 6, 0, 0]} barSize={28} />
                                <Legend align="right" verticalAlign="top" wrapperStyle={{ top: -25, paddingBottom: '20px' }} iconSize={12} formatter={v => <span style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--text-secondary)', textTransform: 'uppercase' }}>{v}</span>} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="card" style={{ border: '1px solid var(--border-primary)', borderRadius: '20px', overflow: 'hidden' }}>
                    <div className="card-header" style={{ borderBottom: '1px solid var(--border-primary)', padding: '1.5rem 2rem', background: 'var(--slate-50)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <h4 style={{ margin: 0, fontWeight: 900, fontSize: '1.15rem', color: 'var(--text-primary)' }}>Critical Review Queue</h4>
                        <Link to="/admin/verify" className="btn btn-ghost" style={{ fontSize: '0.75rem', fontWeight: 900, color: 'var(--brand-600)', display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'white', border: '1px solid var(--border-primary)', padding: '0.5rem 1rem', borderRadius: '10px' }}>
                            <span>AUDIT REGISTRY</span> <Award size={16} strokeWidth={2.5} />
                        </Link>
                    </div>
                    <div className="card-body" style={{ padding: '1.25rem' }}>
                        {(data?.recentAchievements || []).length === 0 ? (
                            <div style={{ padding: '5rem 2rem', textAlign: 'center' }}>
                                <div style={{ width: 80, height: 80, background: 'var(--success-50)', color: 'var(--success-600)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem auto' }}>
                                    <CheckCircle size={40} strokeWidth={1.5} />
                                </div>
                                <h5 style={{ fontWeight: 900, margin: '0 0 0.75rem 0', color: 'var(--text-primary)', fontSize: '1.25rem' }}>Registry Synchronized</h5>
                                <p style={{ fontSize: '0.95rem', color: 'var(--text-muted)', margin: 0, fontWeight: 600 }}>All pending evaluations have been formally executed.</p>
                            </div>
                        ) : (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                {data.recentAchievements.map(a => (
                                    <div key={a._id} style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', padding: '1.25rem', borderRadius: '16px', background: 'white', border: '1px solid var(--border-primary)', transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)', cursor: 'default' }} className="hover-row">
                                        <div style={{ width: 48, height: 48, background: 'var(--primary-50)', color: 'var(--brand-700)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: '1.1rem', border: '1px solid var(--primary-100)', flexShrink: 0 }}>
                                            {a.studentId?.name?.charAt(0) || 'S'}
                                        </div>
                                        <div style={{ flex: 1, minWidth: 0 }}>
                                            <div style={{ fontSize: '1rem', fontWeight: 900, color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginBottom: '0.2rem' }}>{a.title}</div>
                                            <div style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)' }}>{a.studentId?.name} • <span style={{ color: 'var(--brand-600)' }}>{a.studentId?.department}</span></div>
                                        </div>
                                        <div style={{ padding: '0.4rem 0.75rem', background: 'var(--warning-50)', color: 'var(--warning-700)', borderRadius: '8px', fontSize: '0.65rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.05em', border: '1px solid var(--warning-100)' }}>PENDING</div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
