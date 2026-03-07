import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { adminAPI, noticeAPI } from '../../services/api';
import {
    Users, Trophy, Clock, CheckCircle, GraduationCap,
    Search, Filter, ChevronRight, Eye, Download, UsersRound, XCircle, X
} from 'lucide-react';
import toast from 'react-hot-toast';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';

const FacultyDashboard = () => {
    const [stats, setStats] = useState(null);
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [semester, setSemester] = useState('all');
    const [section, setSection] = useState('all');
    const [search, setSearch] = useState('');
    const [selectedIds, setSelectedIds] = useState([]);
    const [deleting, setDeleting] = useState(false);
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

        autoTable(doc, {
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

    const exportToExcel = () => {
        if (students.length === 0) {
            toast.error('No empirical data available for export');
            return;
        }

        try {
            const excelData = students.map((s, i) => ({
                'S.No': i + 1,
                'Scholar Name': s.name,
                'Enrollment ID': s.enrollmentNo || s.studentId,
                'Department': s.department,
                'Semester': s.semester || 'N/A',
                'Section': s.section || 'N/A',
                'Batch': s.batch || 'N/A',
                'Total Submissions': s.achievementCounts?.total || 0,
                'Verified': s.achievementCounts?.approved || 0,
                'Institutional Points': s.achievementCounts?.points || 0
            }));

            const ws = XLSX.utils.json_to_sheet(excelData);
            const wb = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(wb, ws, "Scholar Analytics");

            const date = new Date().toLocaleDateString().replace(/\//g, '-');
            XLSX.writeFile(wb, `SOEIT_Faculty_Oversight_${date}.xlsx`);
            toast.success('Excel analytics synchronized and exported');
        } catch (error) {
            toast.error('Excel export failure');
        }
    };

    const handlePostNotice = async (e) => {
        e.preventDefault();
        try {
            await noticeAPI.create(noticeData);
            toast.success('Official notification broadcast successfully!');
            setShowNoticeModal(false);
            setNoticeData({ title: '', content: '', priority: 'Medium' });
        } catch {
            toast.error('Strategic communication failure');
        }
    };

    const handleDeleteSelected = async () => {
        if (selectedIds.length === 0) return;
        if (!window.confirm(`Are you sure you want to permanently purge ${selectedIds.length} scholar records? This action is irreversible.`)) return;
        setDeleting(true);
        try {
            await adminAPI.deleteUsers(selectedIds);
            toast.success('Scholar registry synchronized: Records purged');
            setSelectedIds([]);
            loadStudents();
        } catch {
            toast.error('Registry synchronization failure');
        } finally {
            setDeleting(false);
        }
    };

    const toggleSelect = (id) => {
        setSelectedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
    };

    const toggleSelectAll = () => {
        if (selectedIds.length === students.length) setSelectedIds([]);
        else setSelectedIds(students.map(s => s._id));
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
                    <button className="btn btn-ghost" onClick={exportToExcel} style={{ border: '1px solid var(--border-primary)', fontWeight: 800 }}>
                        <Download size={18} />
                        <span className="hide-mobile">Export Excel</span>
                        <span className="show-mobile">Excel</span>
                    </button>
                    <button className="btn btn-secondary" onClick={exportToPDF} style={{ fontWeight: 800 }}>
                        <Download size={18} />
                        <span>Export Analytics</span>
                    </button>
                    <button className="btn btn-primary" onClick={() => navigate('/admin/verify')} style={{ fontWeight: 800, background: 'var(--success-600)', borderColor: 'var(--success-700)' }}>
                        <CheckCircle size={18} />
                        <span>Verification Queue</span>
                    </button>
                    <button className="btn btn-primary" onClick={() => setShowNoticeModal(true)} style={{ fontWeight: 800 }}>
                        <GraduationCap size={18} />
                        <span>Dispatch Notice</span>
                    </button>
                </div>
            </div>

            {/* Analytical Metrics */}
            <div className="grid-res grid-res-4" style={{ marginBottom: '2.5rem' }}>
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

                    <div className="semester-select-container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        {/* Desktop Version: Button Group */}
                        <div className="semester-btn-group desktop-only" style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
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

                        {/* Mobile Version: Dropdown */}
                        <div className="semester-select-mobile mobile-only" style={{ width: '100%' }}>
                            <select
                                className="form-control"
                                value={semester}
                                onChange={(e) => { setSemester(e.target.value); setSection('all'); }}
                                style={{
                                    fontWeight: 700,
                                    borderRadius: '12px',
                                    border: '2px solid var(--border-primary)',
                                    padding: '0.8rem',
                                    width: '100%',
                                    appearance: 'none',
                                    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E")`,
                                    backgroundRepeat: 'no-repeat',
                                    backgroundPosition: 'right 1rem center',
                                    backgroundSize: '1.2em'
                                }}
                            >
                                <option value="all">Complete Registry</option>
                                {semesters.map(sem => (
                                    <option key={sem.id} value={sem.id}>{sem.label}</option>
                                ))}
                            </select>
                        </div>
                        {selectedIds.length > 0 && (
                            <button className="btn btn-danger animate-fade-in" onClick={handleDeleteSelected} disabled={deleting} style={{ padding: '0.6rem 1.25rem', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <XCircle size={16} />
                                Purge Selected ({selectedIds.length})
                            </button>
                        )}
                    </div>

                    {semester !== 'all' && (
                        <div className="animate-fade-in" style={{ padding: '1rem', background: 'var(--primary-50)', borderRadius: '12px', border: '1px solid var(--primary-100)', display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <Filter size={16} className="text-brand" />
                                <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--brand-700)' }}>Section Resolution:</span>
                            </div>

                            {/* Desktop Version: Button Group */}
                            <div className="section-btn-group desktop-only" style={{ display: 'flex', gap: '0.5rem' }}>
                                <button onClick={() => setSection('all')} className={`btn btn-sm ${section === 'all' ? 'btn-primary' : 'btn-ghost'}`} style={{ fontSize: '0.75rem' }}>All Sections</button>
                                {(semester === '1' || semester === '2' ? ['A', 'B', 'C', 'D', 'E', 'F', 'G'] : ['A', 'B', 'C', 'D', 'E', 'F']).map(s => (
                                    <button key={s} onClick={() => setSection(s)} className={`btn btn-sm ${section === s ? 'btn-primary' : 'btn-ghost'}`} style={{ fontSize: '0.75rem' }}>Section {s}</button>
                                ))}
                            </div>

                            {/* Mobile Version: Dropdown */}
                            <div className="section-select-mobile mobile-only" style={{ width: '100%', marginTop: '0.5rem' }}>
                                <select
                                    className="form-control"
                                    value={section}
                                    onChange={(e) => setSection(e.target.value)}
                                    style={{
                                        fontWeight: 700,
                                        borderRadius: '10px',
                                        border: '1px solid var(--primary-200)',
                                        padding: '0.6rem',
                                        width: '100%',
                                        fontSize: '0.85rem',
                                        background: 'white',
                                        appearance: 'none',
                                        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E")`,
                                        backgroundRepeat: 'no-repeat',
                                        backgroundPosition: 'right 0.75rem center',
                                        backgroundSize: '1.2em'
                                    }}
                                >
                                    <option value="all">All Sections</option>
                                    {(semester === '1' || semester === '2' ? ['A', 'B', 'C', 'D', 'E', 'F', 'G'] : ['A', 'B', 'C', 'D', 'E', 'F']).map(s => (
                                        <option key={s} value={s}>Section {s}</option>
                                    ))}
                                </select>
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
                    <div className="search-wrapper" style={{ width: '350px' }}>
                        <input
                            className="form-control"
                            placeholder="Identify scholars by nomenclature or ID..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                        <Search size={18} className="search-icon" />
                    </div>
                </div>

                <div className="table-responsive">
                    <table className="table">
                        <thead>
                            <tr>
                                <th style={{ paddingLeft: '1.75rem', width: '50px' }}>
                                    <input type="checkbox" checked={students.length > 0 && selectedIds.length === students.length} onChange={toggleSelectAll} style={{ width: '18px', height: '18px', cursor: 'pointer' }} />
                                </th>
                                <th>Scholar Profile</th>
                                <th className="desktop-only text-center">Academic Compliance</th>
                                <th className="desktop-only text-center">Verification Matrix</th>
                                <th className="text-center">Cumulative Pts</th>
                                <th className="text-right">Operations</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                [...Array(5)].map((_, i) => (
                                    <tr key={i}><td colSpan="6"><div className="skeleton" style={{ height: '60px' }} /></td></tr>
                                ))
                            ) : students.length === 0 ? (
                                <tr className="empty-row">
                                    <td colSpan="6">
                                        <div style={{ textAlign: 'center', padding: '4rem 1rem' }}>
                                            <UsersRound size={48} style={{ opacity: 0.1, margin: '0 auto 1.5rem auto' }} />
                                            <h5 style={{ fontWeight: 800, margin: '0 0 0.5rem 0' }}>No Records Extracted</h5>
                                            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', margin: 0 }}>The requested scholar cohort yielded zero results from the database.</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : students.map(student => (
                                <tr key={student._id} className={`hover-row ${selectedIds.includes(student._id) ? 'active-selection' : ''}`}>
                                    <td style={{ paddingLeft: '1.75rem' }}>
                                        <input type="checkbox" checked={selectedIds.includes(student._id)} onChange={() => toggleSelect(student._id)} style={{ width: '18px', height: '18px', cursor: 'pointer' }} />
                                    </td>
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
                    <div className="card animate-slide-up" style={{ width: '100%', maxWidth: '600px', padding: 0, overflow: 'hidden', boxShadow: 'var(--shadow-xl)', borderRadius: '20px', border: 'none' }}>
                        <div className="card-header" style={{ padding: '1.75rem', background: 'var(--brand-700)', color: '#ffffff', display: 'flex', justifyContent: 'space-between', alignItems: 'center', border: 'none' }}>
                            <div>
                                <h3 style={{ margin: 0, fontSize: '1.4rem', fontWeight: 900, color: '#ffffff', letterSpacing: '-0.02em' }}>Broadcast Institutional Notice</h3>
                                <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.85rem', opacity: 0.9, color: '#ffffff', fontWeight: 500 }}>Formal communication suite for academic oversight.</p>
                            </div>
                            <button onClick={() => setShowNoticeModal(false)} className="btn btn-ghost" style={{ padding: '0.5rem', color: '#ffffff', background: 'rgba(255,255,255,0.1)', borderRadius: '12px' }}><X size={24} /></button>
                        </div>
                        <div className="card-body" style={{ padding: '2rem' }}>
                            <form onSubmit={handlePostNotice} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                                <div className="form-group">
                                    <label className="form-label" style={{ fontWeight: 800, color: 'var(--text-primary)', textTransform: 'uppercase', fontSize: '0.75rem', letterSpacing: '0.05em' }}>Communication Title</label>
                                    <input className="form-control" placeholder="Identify the core subject of this broadcast..." required value={noticeData.title} onChange={e => setNoticeData({ ...noticeData, title: e.target.value })} />
                                </div>
                                <div className="form-group">
                                    <label className="form-label" style={{ fontWeight: 800, color: 'var(--text-primary)', textTransform: 'uppercase', fontSize: '0.75rem', letterSpacing: '0.05em' }}>Priority Resolution</label>
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
                                    <label className="form-label" style={{ fontWeight: 800, color: 'var(--text-primary)', textTransform: 'uppercase', fontSize: '0.75rem', letterSpacing: '0.05em' }}>Broadcast Content</label>
                                    <textarea className="form-control" rows="6" placeholder="Document the description of the institutional notice..." required style={{ resize: 'none' }} value={noticeData.content} onChange={e => setNoticeData({ ...noticeData, content: e.target.value })} />
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
                                {selectedStudent.name.charAt(0)}
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
