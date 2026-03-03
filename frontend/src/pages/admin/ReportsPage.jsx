import '../../styles/ReportsPage.css';
import { useState, useEffect } from 'react';
import { adminAPI } from '../../services/api';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend, AreaChart, Area } from 'recharts';
import { Trophy, Star, TrendingUp, Award, Download, BarChart3 } from 'lucide-react';
import toast from 'react-hot-toast';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

const COLORS = ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444', '#06b6d4', '#ec4899', '#84cc16'];

const ReportsPage = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        adminAPI.getReports()
            .then(res => setData(res.data))
            .catch(() => toast.error('Failed to synchronize analytical stream'))
            .finally(() => setLoading(false));
    }, []);

    if (loading) return (
        <div className="animate-fade-in">
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.5rem', marginBottom: '2.5rem' }}>
                {[...Array(4)].map((_, i) => <div key={i} className="skeleton" style={{ height: 120, borderRadius: 'var(--radius-lg)' }} />)}
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1.5rem', marginBottom: '1.5rem' }}>
                {[...Array(2)].map((_, i) => <div key={i} className="skeleton" style={{ height: 350, borderRadius: 'var(--radius-lg)' }} />)}
            </div>
        </div>
    );

    const monthlyData = (data?.monthlyTrend || []).map(d => ({
        name: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][d._id.month - 1],
        submitted: d.submitted, approved: d.approved,
    }));

    const exportReportsPDF = () => {
        try {
            const doc = new jsPDF();
            const date = new Date().toLocaleDateString();
            doc.setFillColor(30, 64, 175);
            doc.rect(0, 0, 210, 45, 'F');
            doc.setTextColor(255, 255, 255);
            doc.setFontSize(24);
            doc.text('SOEIT ACADEMIC PORTAL', 105, 20, { align: 'center' });
            doc.setFontSize(14);
            doc.text('Performance & Achievement Analytical Projection', 105, 30, { align: 'center' });
            doc.setFontSize(10);
            doc.text(`Official Document ID: SOEIT-REP-${date.replace(/\//g, '')} | Date: ${date}`, 105, 38, { align: 'center' });

            let y = 60;
            doc.setTextColor(30, 64, 175);
            doc.setFontSize(16);
            doc.text('I. INSTITUTIONAL GROWTH METRICS', 14, y);
            y += 10;
            autoTable(doc, {
                startY: y,
                head: [['Analytical Period (Month)', 'Submissions Received', 'Verified Achievements']],
                body: monthlyData.map(d => [d.name, d.submitted, d.approved]),
                theme: 'grid',
                headStyles: { fillColor: [30, 64, 175], textColor: [255, 255, 255], fontStyle: 'bold' },
                alternateRowStyles: { fillColor: [248, 250, 252] },
            });
            y = doc.lastAutoTable.finalY + 20;

            if (y > 220) { doc.addPage(); y = 20; }
            doc.setFontSize(16);
            doc.text('II. DEPARTMENTAL DISTRIBUTION ANALYSIS', 14, y);
            y += 10;
            autoTable(doc, {
                startY: y,
                head: [['Institutional Department', 'Cumulative Achievement Count']],
                body: (data?.departmentStats || []).map(d => [d._id, d.count]),
                theme: 'grid',
                headStyles: { fillColor: [79, 70, 229], textColor: [255, 255, 255] },
            });
            y = doc.lastAutoTable.finalY + 20;

            if (y > 180) { doc.addPage(); y = 20; }
            doc.setFontSize(16);
            doc.text('III. ACADEMIC EXCELLENCE RECOGNITION', 14, y);
            y += 10;
            autoTable(doc, {
                startY: y,
                head: [['Rank', 'Scholar Name', 'Department', 'Institutional Points', 'Records']],
                body: (data?.topPerformers || []).map((p, i) => [i + 1, p.student?.name, p.student?.department, p.totalPoints, p.achievementCount]),
                theme: 'grid',
                headStyles: { fillColor: [245, 158, 11], textColor: [255, 255, 255] },
            });

            doc.save(`SOEIT_Academic_Projection_${date.replace(/\//g, '-')}.pdf`);
            toast.success('Official projection document exported');
        } catch (error) {
            toast.error('Projection export failed! ' + error.message);
        }
    };

    return (
        <div className="animate-fade-in">
            {/* Header Suite */}
            <div className="page-header" style={{ marginBottom: '2.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                <div>
                    <h2 className="heading-display">Analytical Intelligence</h2>
                    <p className="page-subtitle">Unified narrative of institutional growth, departmental performance, and excellence metrics.</p>
                </div>
                <button className="btn btn-primary" onClick={exportReportsPDF} style={{ height: '48px', padding: '0 1.5rem', fontWeight: 800 }}>
                    <Download size={18} />
                    <span>Generate Academic Report</span>
                </button>
            </div>

            {/* Performance Overview Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.5rem', marginBottom: '2.5rem' }}>
                {[
                    { label: 'Cumulative Yield', value: data?.topPerformers?.reduce((acc, p) => acc + p.totalPoints, 0) || 0, icon: Star, color: 'var(--brand-600)', bg: 'var(--primary-50)' },
                    { label: 'Evaluation Density', value: data?.categoryStats?.reduce((acc, c) => acc + c.count, 0) || 0, icon: BarChart3, color: 'var(--purple-600)', bg: 'var(--purple-50)' },
                    { label: 'Excellence Points', value: data?.topPerformers?.[0]?.totalPoints || 0, icon: Trophy, color: 'var(--warning-600)', bg: 'var(--warning-50)' },
                    { label: 'Active Domains', value: data?.categoryStats?.length || 0, icon: Award, color: 'var(--success-600)', bg: 'var(--success-50)' },
                ].map(({ label, value, icon: Icon, color, bg }) => (
                    <div key={label} className="card" style={{ padding: '1.5rem', border: '1px solid var(--border-primary)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                            <div style={{ width: 40, height: 40, background: bg, borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: color }}>
                                <Icon size={20} />
                            </div>
                            <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</span>
                        </div>
                        <div style={{ fontSize: '1.75rem', fontWeight: 900, color: 'var(--text-primary)', lineHeight: 1 }}>{value.toLocaleString()}</div>
                    </div>
                ))}
            </div>

            {/* Charts Ecosystem */}
            <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr', gap: '1.5rem', marginBottom: '2rem' }}>
                <div className="card" style={{ border: '1px solid var(--border-primary)' }}>
                    <div className="card-header" style={{ borderBottom: '1px solid var(--border-primary)', padding: '1.5rem' }}>
                        <h4 style={{ margin: 0, fontWeight: 800, fontSize: '1.1rem' }}>Longitudinal Submission Analytics</h4>
                    </div>
                    <div className="card-body" style={{ padding: '2rem 1rem 1rem 1rem' }}>
                        <ResponsiveContainer width="100%" height={300}>
                            <AreaChart data={monthlyData}>
                                <defs>
                                    <linearGradient id="gradSub" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="var(--brand-600)" stopOpacity={0.12} /><stop offset="100%" stopColor="var(--brand-600)" stopOpacity={0} /></linearGradient>
                                    <linearGradient id="gradApp" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="var(--success-500)" stopOpacity={0.12} /><stop offset="100%" stopColor="var(--success-500)" stopOpacity={0} /></linearGradient>
                                </defs>
                                <XAxis dataKey="name" tick={{ fill: '#64748b', fontSize: 12, fontWeight: 700 }} tickLine={false} axisLine={false} dy={10} />
                                <YAxis tick={{ fill: '#64748b', fontSize: 12, fontWeight: 700 }} tickLine={false} axisLine={false} />
                                <Tooltip contentStyle={{ background: '#fff', border: 'none', borderRadius: 12, boxShadow: 'var(--shadow-xl)' }} />
                                <Area type="monotone" dataKey="submitted" stroke="var(--brand-700)" strokeWidth={3} fill="url(#gradSub)" name="Registry Input" dot={{ r: 4, fill: '#fff', strokeWidth: 2 }} activeDot={{ r: 6 }} />
                                <Area type="monotone" dataKey="approved" stroke="var(--success-600)" strokeWidth={3} fill="url(#gradApp)" name="Verified Output" dot={{ r: 4, fill: '#fff', strokeWidth: 2 }} activeDot={{ r: 6 }} />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="card" style={{ border: '1px solid var(--border-primary)' }}>
                    <div className="card-header" style={{ borderBottom: '1px solid var(--border-primary)', padding: '1.5rem' }}>
                        <h4 style={{ margin: 0, fontWeight: 800, fontSize: '1.1rem' }}>Categorical Distribution</h4>
                    </div>
                    <div className="card-body" style={{ padding: '1.5rem' }}>
                        <ResponsiveContainer width="100%" height={300}>
                            <PieChart>
                                <Pie
                                    data={data?.categoryStats || []}
                                    dataKey="count"
                                    nameKey="_id"
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={75}
                                    outerRadius={105}
                                    paddingAngle={6}
                                    stroke="none"
                                >
                                    {(data?.categoryStats || []).map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                                </Pie>
                                <Tooltip contentStyle={{ background: '#fff', border: 'none', borderRadius: 12, boxShadow: 'var(--shadow-xl)' }} />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Performance Excellence Leaderboard */}
            <div className="card" style={{ border: '1px solid var(--border-primary)' }}>
                <div className="card-header" style={{ padding: '1.75rem', borderBottom: '1px solid var(--border-primary)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem' }}>
                        <div style={{ width: 44, height: 44, background: 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 15px rgba(255, 165, 0, 0.2)' }}>
                            <Trophy size={24} color="#fff" strokeWidth={2.5} />
                        </div>
                        <div>
                            <h4 style={{ fontSize: '1.25rem', fontWeight: 900, margin: 0 }}>Excellence Leaderboard</h4>
                            <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>Elite scholars classified by verified institutional point distribution.</p>
                        </div>
                    </div>
                </div>
                <div className="table-container">
                    <table className="table">
                        <thead>
                            <tr>
                                <th style={{ paddingLeft: '2rem', width: '100px' }}>Rank</th>
                                <th>Scholar Profile</th>
                                <th>Focus Department</th>
                                <th style={{ textAlign: 'center' }}>Verified Units</th>
                                <th style={{ textAlign: 'right', paddingRight: '2rem' }}>Institutional Points</th>
                            </tr>
                        </thead>
                        <tbody>
                            {(data?.topPerformers || []).map((p, i) => (
                                <tr key={p._id} className="hover-row">
                                    <td style={{ paddingLeft: '2rem' }}>
                                        <div style={{
                                            width: 36,
                                            height: 36,
                                            borderRadius: '50%',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            fontWeight: 900,
                                            fontSize: '0.9rem',
                                            background: i < 3 ? ['#FFF9C4', '#F1F5F9', '#FFEDD5'][i] : 'var(--slate-50)',
                                            color: i < 3 ? ['#B79100', '#64748B', '#9A3412'][i] : 'var(--text-muted)',
                                            border: i < 3 ? `2px solid ${['#FDE68A', '#E2E8F0', '#FED7AA'][i]}` : '1px solid var(--border-primary)'
                                        }}>
                                            {i + 1}
                                        </div>
                                    </td>
                                    <td>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '0.5rem 0' }}>
                                            <div style={{ width: 44, height: 44, background: i < 3 ? 'var(--primary-50)' : 'var(--slate-50)', color: 'var(--brand-700)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: '1rem', border: '2px solid white', boxShadow: 'var(--shadow-xs)' }}>
                                                {p.student?.name?.charAt(0) || 'S'}
                                            </div>
                                            <div>
                                                <div style={{ fontWeight: 800, color: 'var(--text-primary)', fontSize: '0.95rem' }}>{p.student?.name}</div>
                                                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>ID: {p.student?.studentId}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td>
                                        <span className="badge badge-brand" style={{ fontWeight: 800, padding: '0.4rem 0.75rem' }}>{p.student?.department}</span>
                                    </td>
                                    <td style={{ textAlign: 'center' }}>
                                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', fontWeight: 800, color: 'var(--text-secondary)' }}>
                                            {p.achievementCount} <span style={{ fontSize: '0.7rem', opacity: 0.6 }}>Synchronized</span>
                                        </div>
                                    </td>
                                    <td style={{ textAlign: 'right', paddingRight: '2rem' }}>
                                        <div style={{ fontSize: '1.25rem', fontWeight: 900, color: 'var(--brand-700)', letterSpacing: '-0.02em' }}>
                                            {p.totalPoints}
                                            <span style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--text-muted)', marginLeft: '0.5rem', opacity: 0.6 }}>PTS RESOLUTION</span>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default ReportsPage;
