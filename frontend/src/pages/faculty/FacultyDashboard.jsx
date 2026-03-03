import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { adminAPI, noticeAPI } from '../../services/api';
import {
    Users, Trophy, Clock, CheckCircle, GraduationCap,
    Search, Filter, ChevronRight, Eye, Download, UsersRound, XCircle, X
} from 'lucide-react';
import toast from 'react-hot-toast';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const FacultyDashboard = () => {
    const [stats, setStats] = useState(null);
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [semester, setSemester] = useState('all');
    const [section, setSection] = useState('all');
    const [search, setSearch] = useState('');
    const [showNoticeModal, setShowNoticeModal] = useState(false);
    const [noticeData, setNoticeData] = useState({ title: '', content: '', priority: 'Medium' });
    const [selectedStudent, setSelectedStudent] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const loadStats = async () => {
            try {
                const res = await adminAPI.getDashboard();
                setStats(res.data);
            } catch {
                toast.error('Failed to synchronize portal operations');
            }
        };
        loadStats();
    }, []);

    useEffect(() => {
        const loadStudents = async () => {
            setLoading(true);
            try {
                const params = {
                    semester: semester === 'all' ? undefined : semester,
                    section: section === 'all' ? undefined : section,
                    search: search || undefined,
                    limit: 100
                };
                const res = await adminAPI.getStudents(params);
                setStudents(res.data.data);
            } catch {
                toast.error('Failed to load scholar directory');
            } finally {
                setLoading(false);
            }
        };
        loadStudents();
    }, [semester, section, search]);

    const exportToPDF = () => {
        if (students.length === 0) {
            toast.error('No empirical data available for export');
            return;
        }

        const doc = new jsPDF();
        const timestamp = new Date().toLocaleString();

        doc.setFontSize(22);
        doc.setTextColor(15, 23, 42); // slate-900
        doc.text('ARKA JAIN UNIVERSITY', 105, 20, { align: 'center' });

        doc.setFontSize(14);
        doc.setTextColor(30, 58, 138); // blue-900
        doc.text('DEPARTMENT OF ENGINEERING & IT', 105, 30, { align: 'center' });
        doc.text('Faculty Oversight Achievement Report', 105, 40, { align: 'center' });

        doc.setFontSize(10);
        doc.setTextColor(100, 116, 139); // slate-500
        doc.text(`Generation Timestamp: ${timestamp}`, 105, 48, { align: 'center' });

        doc.setDrawColor(226, 232, 240);
        doc.line(20, 55, 190, 55);

        const tableData = students.map((s, i) => [
            i + 1,
            s.name,
            s.enrollmentNo || 'N/A',
            `Sem ${s.semester || 'N/A'} - ${s.section || 'N/A'}`,
            s.achievementCounts?.total || 0,
            s.achievementCounts?.approved || 0,
            s.achievementCounts?.points || 0
        ]);

        doc.autoTable({
            startY: 65,
            head: [['#', 'Scholar Name', 'Enrollment ID', 'Academic Unit', 'Total', 'Verified', 'Score']],
            body: tableData,
            headStyles: { fillColor: [30, 58, 138], textColor: [255, 255, 255], fontStyle: 'bold', halign: 'center' },
            bodyStyles: { fontSize: 9, halign: 'center' },
            columnStyles: { 1: { halign: 'left' } },
            alternateRowStyles: { fillColor: [248, 250, 252] },
        });

        const filename = `SOEIT_Faculty_Report_${new Date().getTime()}.pdf`;
        doc.save(filename);
        toast.success('Professional report exported successfully');
    };

    const handlePostNotice = async (e) => {
        e.preventDefault();
        const toastId = toast.loading('Executing broadcast protocol...');
        try {
            await noticeAPI.create(noticeData);
            toast.success('Institutional notice published successfully', { id: toastId });
            setShowNoticeModal(false);
            setNoticeData({ title: '', content: '', priority: 'Medium' });
        } catch (error) {
            toast.error(error.response?.data?.message || 'Broadcast protocol failed', { id: toastId });
        }
    };

    const statCards = [
        { label: 'Scholar Registry', value: stats?.stats?.totalStudents ?? 0, icon: Users, color: 'var(--brand-600)', bg: 'var(--primary-50)' },
        { label: 'Evaluation Queue', value: stats?.stats?.pendingCount ?? 0, icon: Clock, color: 'var(--warning-500)', bg: 'rgba(245,158,11,0.08)' },
        { label: 'Verified Records', value: stats?.stats?.approvedCount ?? 0, icon: CheckCircle, color: 'var(--success-600)', bg: 'var(--success-50)' },
        { label: 'Total Submissions', value: stats?.stats?.totalAchievements ?? 0, icon: Trophy, color: 'var(--brand-600)', bg: 'var(--primary-50)' },
    ];

    const semesters = [
        { id: '1', label: 'Semester 1' },
        { id: '2', label: 'Semester 2' },
        { id: '3', label: 'Semester 3' },
        { id: '4', label: 'Semester 4' },
        { id: '5', label: 'Semester 5' },
        { id: '6', label: 'Semester 6' },
        { id: '7', label: 'Semester 7' },
        { id: '8', label: 'Semester 8' },
    ];

    return (
        <div className="animate-fade-in">
            {/* Header Suite */}
            <div className="page-header" style={{ marginBottom: '2.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                <div>
                    <h2 className="heading-display">Faculty Command Center</h2>
                    <p className="page-subtitle">Administrative oversight, scholar progress tracking, and institutional broadcasting.</p>
                </div>
                <div style={{ display: 'flex', gap: '1rem' }}>
                    <button className="btn btn-secondary" onClick={exportToPDF}>
                        <Download size={18} />
                        <span>Export Analytics</span>
                    </button>
                    <button className="btn btn-primary" onClick={() => setShowNoticeModal(true)}>
                        <GraduationCap size={18} />
                        <span>Dispatch Notice</span>
                    </button>
                </div>
            </div>

            {/* Analytical Metrics */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.5rem', marginBottom: '2.5rem' }}>
                {statCards.map(({ label, value, icon: Icon, color, bg }) => (
                    <div key={label} className="card" style={{ padding: '1.5rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                            <div style={{ width: 44, height: 44, background: bg, borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <Icon size={22} color={color} />
                            </div>
                            <div className="badge badge-brand" style={{ fontSize: '0.6rem' }}>SYNCHRONIZED</div>
                        </div>
                        <div style={{ fontSize: '2rem', fontWeight: 900, color: 'var(--text-primary)', marginBottom: '0.25rem' }}>{value.toLocaleString()}</div>
                        <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', fontWeight: 600 }}>{label}</div>
                    </div>
                ))}
            </div>

            {/* Academic Controls */}
            <div className="card" style={{ padding: '1.5rem', marginBottom: '1.5rem' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <h4 style={{ margin: 0, fontWeight: 800, fontSize: '0.9rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Academic Cohort Selection</h4>
                        <div style={{ height: '1px', flex: 1, background: 'var(--border-primary)' }}></div>
                    </div>

                    <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                        <button
                            onClick={() => { setSemester('all'); setSection('all'); }}
                            className={`btn ${semester === 'all' ? 'btn-primary' : 'btn-ghost'}`}
                            style={{ padding: '0.6rem 1.25rem', fontSize: '0.85rem' }}
                        >
                            Complete Registry
                        </button>
                        {semesters.map(sem => (
                            <button
                                key={sem.id}
                                onClick={() => { setSemester(sem.id); setSection('all'); }}
                                className={`btn ${semester === sem.id ? 'btn-primary' : 'btn-ghost'}`}
                                style={{ padding: '0.6rem 1.25rem', fontSize: '0.85rem' }}
                            >
                                {sem.label}
                            </button>
                        ))}
                    </div>

                    {semester !== 'all' && (
                        <div className="animate-fade-in" style={{ padding: '1rem', background: 'var(--primary-50)', borderRadius: '12px', border: '1px solid var(--primary-100)', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            <Filter size={16} className="text-brand" />
                            <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--brand-700)' }}>Section Resolution:</span>
                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                <button onClick={() => setSection('all')} className={`btn btn-sm ${section === 'all' ? 'btn-primary' : 'btn-ghost'}`} style={{ fontSize: '0.75rem' }}>All Sections</button>
                                {(semester === '1' || semester === '2' ? ['A', 'B', 'C', 'D', 'E', 'F', 'G'] : ['A', 'B', 'C', 'D', 'E', 'F']).map(s => (
                                    <button key={s} onClick={() => setSection(s)} className={`btn btn-sm ${section === s ? 'btn-primary' : 'btn-ghost'}`} style={{ fontSize: '0.75rem' }}>Section {s}</button>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Scholar Management Suite */}
            <div className="card">
                <div className="card-header" style={{ padding: '1.25rem 1.75rem', borderBottom: '1px solid var(--border-primary)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h4 style={{ margin: 0, fontWeight: 800, fontSize: '1.1rem' }}>
                        Scholar Directory — {semester === 'all' ? 'Institutional View' : `Semester ${semester}`} {section !== 'all' ? `(Section ${section})` : ''}
                    </h4>
                    <div style={{ position: 'relative', width: '300px' }}>
                        <Search size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', opacity: 0.6 }} />
                        <input
                            className="form-control"
                            style={{ padding: '0.65rem 1rem 0.65rem 2.75rem', fontSize: '0.85rem' }}
                            placeholder="Identify by name or enrollment..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                </div>

                <div className="table-responsive">
                    <table className="table">
                        <thead>
                            <tr>
                                <th>Scholar Profile</th>
                                <th>Academic Compliance</th>
                                <th className="text-center">Verification Matrix</th>
                                <th className="text-center">Cumulative Pts</th>
                                <th className="text-right">Operations</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                [...Array(5)].map((_, i) => (
                                    <tr key={i}><td colSpan="5"><div className="skeleton" style={{ height: '60px' }} /></td></tr>
                                ))
                            ) : students.length === 0 ? (
                                <tr className="empty-row">
                                    <td colSpan="5">
                                        <div style={{ textAlign: 'center', padding: '4rem 1rem' }}>
                                            <UsersRound size={48} style={{ opacity: 0.1, margin: '0 auto 1.5rem auto' }} />
                                            <h5 style={{ fontWeight: 800, margin: '0 0 0.5rem 0' }}>No Records Extracted</h5>
                                            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', margin: 0 }}>The requested scholar cohort yielded zero results from the database.</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : students.map(student => (
                                <tr key={student._id} className="hover-row">
                                    <td style={{ padding: '1rem 1.75rem' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                            <div className="avatar avatar-md" style={{ background: 'var(--primary-100)', color: 'var(--brand-700)', fontWeight: 800 }}>
                                                {student.name.charAt(0)}
                                            </div>
                                            <div>
                                                <div style={{ fontWeight: 800, fontSize: '0.95rem' }}>{student.name}</div>
                                                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>{student.enrollmentNo || student.email}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td style={{ padding: '1rem 1.75rem' }}>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                                            <span className="badge badge-brand" style={{ width: 'fit-content', fontSize: '0.65rem' }}>{student.department}</span>
                                            <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 700 }}>Sem {student.semester || 'N/A'} • {student.batch}</span>
                                        </div>
                                    </td>
                                    <td className="text-center" style={{ padding: '1rem 1.75rem' }}>
                                        <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem' }}>
                                            <div>
                                                <div style={{ fontSize: '1rem', fontWeight: 900, color: 'var(--text-primary)' }}>{student.achievementCounts?.total || 0}</div>
                                                <div style={{ fontSize: '0.6rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>Sum</div>
                                            </div>
                                            <div style={{ width: '1px', background: 'var(--border-primary)' }}></div>
                                            <div>
                                                <div style={{ fontSize: '1rem', fontWeight: 900, color: 'var(--success-600)' }}>{student.achievementCounts?.approved || 0}</div>
                                                <div style={{ fontSize: '0.6rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>Val</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="text-center" style={{ padding: '1rem 1.75rem' }}>
                                        <div style={{ fontSize: '1.15rem', fontWeight: 900, color: 'var(--brand-600)' }}>{student.achievementCounts?.points || 0}</div>
                                    </td>
                                    <td className="text-right" style={{ padding: '1rem 1.75rem' }}>
                                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
                                            <button className="btn btn-ghost btn-sm" onClick={() => setSelectedStudent(student)} title="View Summary"><Eye size={18} /></button>
                                            <button className="btn btn-ghost btn-sm" onClick={() => navigate(`/portfolio/${student._id}`)} title="Full Portfolio"><ChevronRight size={18} /></button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Institutional Broadcasting Modal */}
            {showNoticeModal && (
                <div className="modal-overlay animate-fade-in" style={{ position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.4)', backdropFilter: 'blur(4px)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.5rem' }}>
                    <div className="card animate-slide-up" style={{ width: '100%', maxWidth: '600px', padding: 0, overflow: 'hidden' }}>
                        <div className="card-header" style={{ padding: '1.5rem', background: 'var(--brand-700)', color: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div>
                                <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 800 }}>Broadcast Institutional Notice</h3>
                                <p style={{ margin: 0, fontSize: '0.8rem', opacity: 0.8 }}>Formal communication suite for academic oversight.</p>
                            </div>
                            <button onClick={() => setShowNoticeModal(false)} className="btn btn-ghost" style={{ padding: '0.25rem', color: 'white' }}><XCircle size={24} /></button>
                        </div>
                        <div className="card-body" style={{ padding: '2rem' }}>
                            <form onSubmit={handlePostNotice} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                                <div className="form-group">
                                    <label className="form-label" style={{ fontWeight: 800 }}>Communication Title</label>
                                    <input className="form-control" placeholder="Identify the core subject of this broadcast..." required value={noticeData.title} onChange={e => setNoticeData({ ...noticeData, title: e.target.value })} />
                                </div>
                                <div className="form-group">
                                    <label className="form-label" style={{ fontWeight: 800 }}>Priority Resolution</label>
                                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.75rem' }}>
                                        {['Low', 'Medium', 'High', 'Urgent'].map(p => (
                                            <button key={p} type="button" onClick={() => setNoticeData({ ...noticeData, priority: p })}
                                                className={`btn btn-sm ${noticeData.priority === p ? (p === 'Urgent' ? 'btn-danger' : 'btn-primary') : 'btn-ghost'}`}
                                                style={{ border: noticeData.priority !== p ? '1px solid var(--border-primary)' : 'none', fontSize: '0.75rem' }}>
                                                {p}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label className="form-label" style={{ fontWeight: 800 }}>Broadcast Content</label>
                                    <textarea className="form-control" rows="6" placeholder="Document the detailed narrative of the institutional notice..." required style={{ resize: 'none' }} value={noticeData.content} onChange={e => setNoticeData({ ...noticeData, content: e.target.value })} />
                                </div>
                                <div style={{ padding: '1rem', background: 'var(--error-50)', borderRadius: '12px', border: '1px solid var(--error-100)', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                    <Clock size={20} className="text-danger" />
                                    <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--error-800)', fontWeight: 700 }}>
                                        PROTOCOL: Execution will trigger an immediate SMTP broadcast to all active scholar endpoints.
                                    </p>
                                </div>
                                <button type="submit" className="btn btn-primary" style={{ padding: '1.25rem', fontWeight: 800 }}>Publish Broadcast & Execute Email Protocol</button>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            {/* Scholar Insight Suite */}
            {selectedStudent && (
                <div className="modal-overlay animate-fade-in" style={{ position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.4)', backdropFilter: 'blur(4px)', zIndex: 1001, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.5rem' }}>
                    <div className="card animate-scale-in" style={{ width: '100%', maxWidth: '480px', padding: 0, overflow: 'hidden' }}>
                        <div style={{ background: 'linear-gradient(135deg, var(--brand-700), var(--brand-900))', padding: '2.5rem 1.5rem', textAlign: 'center', color: 'white' }}>
                            <div className="avatar avatar-xl" style={{ width: 96, height: 96, background: 'rgba(255,255,255,0.15)', border: '4px solid rgba(255,255,255,0.2)', margin: '0 auto 1.5rem auto', fontSize: '2.5rem', fontWeight: 900 }}>
                                {student.name.charAt(0)}
                            </div>
                            <h3 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 800 }}>{selectedStudent.name}</h3>
                            <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.9rem', opacity: 0.9, fontWeight: 600 }}>{selectedStudent.enrollmentNo || 'Institutional Entry: ' + selectedStudent._id.slice(-6).toUpperCase()}</p>
                        </div>
                        <div className="card-body" style={{ padding: '2rem' }}>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '2rem' }}>
                                <div style={{ padding: '1rem', background: 'var(--slate-50)', borderRadius: '16px', textAlign: 'center', border: '1px solid var(--border-primary)' }}>
                                    <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', fontWeight: 800, textTransform: 'uppercase', marginBottom: '0.25rem' }}>Academic Unit</div>
                                    <div style={{ fontWeight: 800, color: 'var(--text-primary)', fontSize: '0.9rem' }}>Sem {selectedStudent.semester} • {selectedStudent.section}</div>
                                </div>
                                <div style={{ padding: '1rem', background: 'var(--slate-50)', borderRadius: '16px', textAlign: 'center', border: '1px solid var(--border-primary)' }}>
                                    <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', fontWeight: 800, textTransform: 'uppercase', marginBottom: '0.25rem' }}>Department</div>
                                    <div style={{ fontWeight: 800, color: 'var(--text-primary)', fontSize: '0.9rem' }}>{selectedStudent.department}</div>
                                </div>
                            </div>

                            <div style={{ borderTop: '1px solid var(--border-primary)', paddingTop: '1.5rem', marginBottom: '2rem' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                                    <h5 style={{ margin: 0, fontSize: '0.85rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Achievement Analytical Summary</h5>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', textAlign: 'center' }}>
                                    <div>
                                        <div style={{ fontSize: '1.75rem', fontWeight: 900, color: 'var(--success-600)' }}>{selectedStudent.achievementCounts?.approved || 0}</div>
                                        <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 700 }}>VERIFIED</div>
                                    </div>
                                    <div style={{ width: '1px', background: 'var(--border-primary)' }}></div>
                                    <div>
                                        <div style={{ fontSize: '1.75rem', fontWeight: 900, color: 'var(--warning-500)' }}>{selectedStudent.achievementCounts?.pending || 0}</div>
                                        <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 700 }}>REVIEW</div>
                                    </div>
                                    <div style={{ width: '1px', background: 'var(--border-primary)' }}></div>
                                    <div>
                                        <div style={{ fontSize: '1.75rem', fontWeight: 900, color: 'var(--brand-600)' }}>{selectedStudent.achievementCounts?.points || 0}</div>
                                        <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 700 }}>POINTS</div>
                                    </div>
                                </div>
                            </div>

                            <div style={{ display: 'flex', gap: '1rem' }}>
                                <button className="btn btn-ghost w-full" style={{ padding: '1rem', fontWeight: 700 }} onClick={() => setSelectedStudent(null)}>Terminate View</button>
                                <button className="btn btn-primary w-full" style={{ padding: '1rem', fontWeight: 800 }} onClick={() => navigate(`/portfolio/${selectedStudent._id}`)}>Full Portfolio</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default FacultyDashboard;
