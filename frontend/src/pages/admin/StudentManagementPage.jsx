import '../../styles/StudentManagementPage.css';
import { useState, useEffect } from 'react';
import { adminAPI } from '../../services/api';
import { Users, Search, Trophy, Star, Eye, ChevronLeft, ChevronRight, Download, XCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { useAuth } from '../../context/AuthContext';

const DEPARTMENTS = {
    'B.Tech': ['CSE', 'AIDS (IBM)', 'AIML', 'ME', 'EEE'],
    'BCA': ['BCA (Regular)', 'AIDL', 'Cybersecurity'],
    'Diploma': ['DCSE', 'DME', 'DEEE'],
};

const StudentManagementPage = () => {
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [total, setTotal] = useState(0);
    const [pages, setPages] = useState(1);
    const [filters, setFilters] = useState({ department: '', search: '', semester: '', page: 1 });
    const [selectedIds, setSelectedIds] = useState([]);
    const [deleting, setDeleting] = useState(false);
    const { user } = useAuth();

    const load = async () => {
        setLoading(true);
        try {
            const params = { ...filters, limit: 12 };
            Object.keys(params).forEach(k => !params[k] && delete params[k]);
            const { data } = await adminAPI.getStudents(params);
            setStudents(data.data);
            setTotal(data.total);
            setPages(data.pages);
        } catch {
            toast.error('Failed to load students');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { load(); }, [filters.department, filters.semester, filters.page]);

    const handleDeleteSelected = async () => {
        if (selectedIds.length === 0) return;
        if (!window.confirm(`Are you sure you want to delete ${selectedIds.length} student records? This cannot be undone.`)) return;
        setDeleting(true);
        try {
            await adminAPI.deleteUsers(selectedIds);
            toast.success('Student records deleted');
            setSelectedIds([]);
            load();
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

    const getInitials = (name) => name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || 'S';

    const exportStudentData = (type) => {
        try {
            const date = new Date().toLocaleDateString().replace(/\//g, '-');
            if (type === 'excel') {
                const excelData = students.map(s => ({
                    'Name': s.name,
                    'Enrollment No': s.enrollmentNo || s.studentId,
                    'Department': s.department,
                    'Semester': s.semester || 'N/A',
                    'Section': s.section || 'X',
                    'Email': s.email,
                    'Batch': s.batch || 'N/A',
                    'Total Achievements': s.achievementCounts?.total || 0,
                    'Approved': s.achievementCounts?.approved || 0,
                    'Total Points': s.achievementCounts?.points || 0
                }));
                const ws = XLSX.utils.json_to_sheet(excelData);
                const wb = XLSX.utils.book_new();
                XLSX.utils.book_append_sheet(wb, ws, "Students");
                XLSX.writeFile(wb, `SOEIT_Scholars_${date}.xlsx`);
                toast.success('Excel exported');
            } else {
                const doc = new jsPDF('l', 'mm', 'a4');
                doc.setFillColor(30, 41, 59);
                doc.rect(0, 0, 297, 30, 'F');
                doc.setTextColor(255, 255, 255);
                doc.setFontSize(20);
                doc.text('SOEIT STUDENT MANAGEMENT REPORT', 148, 15, { align: 'center' });
                doc.setFontSize(10);
                doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 148, 22, { align: 'center' });
                autoTable(doc, {
                    startY: 40,
                    head: [['Name', 'ID/Enrollment', 'Dept', 'Sem', 'Email', 'Unit Yield', 'Total Points']],
                    body: students.map(s => [
                        s.name, s.enrollmentNo || s.studentId, s.department, `${s.semester || 'N/A'}-${s.section || 'X'}`,
                        s.email, s.achievementCounts?.total || 0, s.achievementCounts?.points || 0
                    ]),
                    theme: 'grid',
                    headStyles: { fillColor: [59, 130, 246] },
                });
                doc.save(`SOEIT_Scholars_Registry_${date}.pdf`);
                toast.success('PDF report generated');
            }
        } catch (error) {
            toast.error('Export failed');
        }
    };

    return (
        <div className="animate-fade-in">
            {/* Header Suite */}
            <div className="page-header student-header-suite" style={{ marginBottom: '2.5rem' }}>
                <div className="header-content">
                    <h2 className="heading-display">Student List</h2>
                    <p className="page-subtitle">Manage all students and view their total achievements and points.</p>
                </div>
                <div className="header-actions">
                    {user?.role === 'admin' && selectedIds.length > 0 && (
                        <button className="btn btn-danger animate-fade-in" onClick={handleDeleteSelected} disabled={deleting} style={{ fontWeight: 800, padding: '0 1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <XCircle size={18} />
                            <span>Delete Selected ({selectedIds.length})</span>
                        </button>
                    )}
                    <button className="btn btn-ghost" onClick={() => exportStudentData('excel')} style={{ border: '1px solid var(--border-primary)', fontWeight: 800 }}>
                        <Download size={18} />
                        <span className="hide-mobile">Export Excel</span>
                        <span className="show-mobile">Excel</span>
                    </button>
                    <button className="btn btn-primary" onClick={() => exportStudentData('pdf')} style={{ fontWeight: 800, padding: '0 1.5rem' }}>
                        <Users size={18} />
                        <span className="hide-mobile">Generate Report</span>
                        <span className="show-mobile">Report</span>
                    </button>
                </div>
            </div>

            {/* Advanced Filtering Intelligence */}
            <div className="card filter-card" style={{ padding: '1.5rem', marginBottom: '2rem', border: '1px solid var(--border-primary)' }}>
                <div className="filter-grid-container" style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
                    <div className="search-wrapper filter-search flex-order-last-desktop" style={{ flex: 1.5, minWidth: '300px' }}>
                        <input className="form-control" placeholder="Search by name, enrollment, or ID..." value={filters.search} onChange={e => setFilters(p => ({ ...p, search: e.target.value }))} onKeyDown={e => e.key === 'Enter' && load()} />
                        <Search size={20} className="search-icon" />
                    </div>
                    <select className="form-control filter-select" style={{ height: '48px', fontWeight: 700, flex: 1, minWidth: '200px' }} value={filters.department} onChange={e => setFilters(p => ({ ...p, department: e.target.value, page: 1 }))}>
                        <option value="">All Departments</option>
                        {Object.entries(DEPARTMENTS).map(([group, depts]) => (
                            <optgroup key={group} label={group}>
                                {depts.map(d => <option key={d} value={d}>{d}</option>)}
                            </optgroup>
                        ))}
                    </select>
                    <select className="form-control filter-select" style={{ height: '48px', fontWeight: 700, flex: 1, minWidth: '180px' }} value={filters.semester} onChange={e => setFilters(p => ({ ...p, semester: e.target.value, page: 1 }))}>
                        <option value="">All Semesters</option>
                        {[1, 2, 3, 4, 5, 6, 7, 8].map(s => <option key={s} value={s}>Semester {s}</option>)}
                    </select>
                    <button className="btn btn-primary filter-btn" style={{ height: '48px', width: '48px', padding: 0, flexShrink: 0 }} onClick={load}>
                        <Search size={20} strokeWidth={3} />
                    </button>
                    <button className="btn btn-ghost filter-reset-btn" style={{ height: '48px', fontWeight: 700, minWidth: '120px' }} onClick={() => setFilters({ department: '', search: '', semester: '', page: 1 })}>
                        Clear All
                    </button>
                </div>
            </div>

            {/* Registry Table Ecosystem */}
            <div className="card" style={{ border: '1px solid var(--border-primary)', overflow: 'hidden' }}>
                <div className="table-container">
                    {loading ? (
                        <div style={{ padding: '2rem' }}>
                            {[...Array(8)].map((_, i) => <div key={i} className="skeleton" style={{ height: 60, marginBottom: '1rem', borderRadius: '12px' }} />)}
                        </div>
                    ) : students.length === 0 ? (
                        <div style={{ padding: '6rem 2rem', textAlign: 'center' }}>
                            <div style={{ width: 80, height: 80, background: 'var(--primary-50)', color: 'var(--brand-600)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem auto' }}>
                                <Users size={40} />
                            </div>
                            <h3 style={{ fontWeight: 900, color: 'var(--text-primary)' }}>No Students Found</h3>
                            <p style={{ color: 'var(--text-muted)', fontWeight: 600 }}>Try changing your search or filters.</p>
                        </div>
                    ) : (
                        <>
                            <table className="table" style={{ minWidth: '1000px' }}>
                                <thead>
                                    <tr>
                                        {user?.role === 'admin' && (
                                            <th style={{ paddingLeft: '2rem', width: '50px' }}>
                                                <input type="checkbox" checked={students.length > 0 && selectedIds.length === students.length} onChange={toggleSelectAll} style={{ width: '18px', height: '18px', cursor: 'pointer' }} />
                                            </th>
                                        )}
                                        <th>Student</th>
                                        <th>Department</th>
                                        <th>Email</th>
                                        <th style={{ textAlign: 'center' }}>Total Achievements</th>
                                        <th style={{ textAlign: 'center' }}>Points</th>
                                        <th style={{ textAlign: 'right', paddingRight: '2rem' }}>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {students.map((s) => (
                                        <tr key={s._id} className={`hover-row ${selectedIds.includes(s._id) ? 'active-selection' : ''}`}>
                                            {user?.role === 'admin' && (
                                                <td style={{ paddingLeft: '2rem' }}>
                                                    <input type="checkbox" checked={selectedIds.includes(s._id)} onChange={() => toggleSelect(s._id)} style={{ width: '18px', height: '18px', cursor: 'pointer' }} />
                                                </td>
                                            )}
                                            <td style={{ paddingLeft: '1rem' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', padding: '0.75rem 0' }}>
                                                    {s.profileImage ? (
                                                        <img src={`${import.meta.env.VITE_UPLOADS_URL || ''}${s.profileImage}`} alt={s.name} style={{ width: 44, height: 44, borderRadius: '12px', objectFit: 'cover', border: '2px solid white', boxShadow: 'var(--shadow-sm)' }} />
                                                    ) : (
                                                        <div style={{ width: 44, height: 44, borderRadius: '12px', background: 'var(--primary-100)', color: 'var(--brand-700)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: '1rem', border: '2px solid white', boxShadow: 'var(--shadow-sm)' }}>
                                                            {getInitials(s.name)}
                                                        </div>
                                                    )}
                                                    <div>
                                                        <div style={{ fontWeight: 800, fontSize: '0.95rem', color: 'var(--text-primary)' }}>{s.name}</div>
                                                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 800 }}>{s.enrollmentNo || s.studentId}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td>
                                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                                                    <span className="badge badge-brand" style={{ fontWeight: 800, padding: '0.4rem 0.6rem' }}>{s.department}</span>
                                                    <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Semester {s.semester} • {s.section || 'X'}</span>
                                                </div>
                                            </td>
                                            <td>
                                                <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                    <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--brand-400)' }}></div>
                                                    {s.email}
                                                </div>
                                            </td>
                                            <td style={{ textAlign: 'center' }}>
                                                <div style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--text-primary)' }}>{s.achievementCounts?.total ?? 0}</div>
                                            </td>
                                            <td style={{ textAlign: 'center' }}>
                                                <div style={{ fontSize: '1.125rem', fontWeight: 900, color: 'var(--brand-700)' }}>{s.achievementCounts?.points ?? 0}</div>
                                            </td>
                                            <td style={{ textAlign: 'right', paddingRight: '2rem' }}>
                                                <Link to={`/portfolio/${s._id}`} className="btn btn-ghost" style={{ padding: '0.5rem', borderRadius: '10px', color: 'var(--brand-600)' }} title="Conduct Portfolio Audit">
                                                    <Eye size={22} strokeWidth={2.5} />
                                                </Link>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>

                            {/* Sequential Pagination */}
                            {pages > 1 && (
                                <div className="pagination-footer-responsive" style={{ borderTop: '1px solid var(--border-primary)', padding: '1.25rem 2rem', background: 'var(--slate-50)' }}>
                                    <div className="pagination-status" style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 700 }}>
                                        TOTAL STUDENTS: <strong style={{ color: 'var(--text-primary)' }}>{total}</strong>
                                    </div>
                                    <div className="pagination" style={{ margin: 0, gap: '0.5rem' }}>
                                        <button className="btn btn-ghost pagination-btn-res" onClick={() => setFilters(p => ({ ...p, page: p.page - 1 }))} disabled={filters.page === 1}><ChevronLeft size={18} /></button>
                                        {[...Array(pages)].map((_, i) => (
                                            <button key={i} className={`btn pagination-btn-res ${filters.page === i + 1 ? 'btn-primary' : 'btn-ghost'}`} style={{ padding: 0, width: 40, height: 40, fontWeight: 800, background: filters.page === i + 1 ? 'var(--brand-600)' : 'white', border: filters.page !== i + 1 ? '1px solid var(--border-primary)' : 'none' }} onClick={() => setFilters(p => ({ ...p, page: i + 1 }))}>{i + 1}</button>
                                        ))}
                                        <button className="btn btn-ghost pagination-btn-res" onClick={() => setFilters(p => ({ ...p, page: p.page + 1 }))} disabled={filters.page === pages}><ChevronRight size={18} /></button>
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default StudentManagementPage;
