import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { adminAPI } from '../../services/api';
import { Search, Filter, Trophy, ChevronLeft, ChevronRight, Clock, CheckCircle, XCircle, Download } from 'lucide-react';
import { format } from 'date-fns';
import toast from 'react-hot-toast';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';

const STATUSES = ['', 'pending', 'approved', 'rejected'];
const DEPARTMENTS = {
    'B.Tech': ['CSE', 'AIDS (IBM)', 'AIML', 'ME', 'EEE'],
    'BCA': ['BCA (Regular)', 'AIDL', 'Cybersecurity'],
    'Diploma': ['DCSE', 'DME', 'DEEE'],
};
const CATEGORIES = ['', 'Academic', 'Sports', 'Cultural', 'Technical', 'Research', 'Internship', 'Certification', 'Competition', 'Community Service', 'Other'];

const StatusBadge = ({ status }) => {
    const map = {
        pending: ['badge-warning', Clock],
        approved: ['badge-success', CheckCircle],
        rejected: ['badge-error', XCircle]
    };
    const [cls, Icon] = map[status] || ['badge-primary', null];
    return (
        <span className={`badge ${cls}`} style={{ fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', padding: '0.4rem 0.8rem' }}>
            {Icon && <Icon size={12} style={{ marginRight: '4px' }} />}
            {status}
        </span>
    );
};

const AllAchievementsPage = () => {
    const navigate = useNavigate();
    const [achievements, setAchievements] = useState([]);
    const [loading, setLoading] = useState(true);
    const [total, setTotal] = useState(0);
    const [pages, setPages] = useState(1);
    const [filters, setFilters] = useState({ status: '', category: '', department: '', search: '', page: 1 });

    const load = async () => {
        setLoading(true);
        try {
            const params = { ...filters, limit: 12 };
            Object.keys(params).forEach(k => !params[k] && delete params[k]);
            const { data } = await adminAPI.getAll(params);
            setAchievements(data.data);
            setTotal(data.total);
            setPages(data.pages);
        } catch {
            toast.error('Failed to load achievements');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { load(); }, [filters.status, filters.category, filters.department, filters.page]);

    const exportAchievements = (type) => {
        if (achievements.length === 0) {
            toast.error('No records available to export');
            return;
        }

        try {
            const date = new Date().toLocaleDateString().replace(/\//g, '-');
            if (type === 'excel') {
                const excelData = achievements.map(a => ({
                    'Achievement Title': a.title,
                    'Student Name': a.student?.name,
                    'ID/Enrollment': a.student?.idNumber || 'N/A',
                    'Department': a.student?.department,
                    'Category': a.category,
                    'Level': a.level,
                    'Status': a.status,
                    'Points': a.status === 'approved' ? a.points : 0,
                    'Date Recorded': format(new Date(a.createdAt), 'MMM dd, yyyy')
                }));
                const ws = XLSX.utils.json_to_sheet(excelData);
                const wb = XLSX.utils.book_new();
                XLSX.utils.book_append_sheet(wb, ws, "Achievements");
                XLSX.writeFile(wb, `SOEIT_Achievements_${date}.xlsx`);
                toast.success('Excel: Achievements exported');
            } else {
                const doc = new jsPDF('l', 'mm', 'a4');
                doc.setFillColor(30, 41, 59);
                doc.rect(0, 0, 297, 30, 'F');
                doc.setTextColor(255, 255, 255);
                doc.setFontSize(20);
                doc.text('SOEIT ACHIEVEMENT LIST', 148, 15, { align: 'center' });
                doc.setFontSize(10);
                doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 148, 22, { align: 'center' });

                autoTable(doc, {
                    startY: 40,
                    head: [['Achievement', 'Student', 'Department', 'Category', 'Status', 'Points', 'Date']],
                    body: achievements.map(a => [
                        a.title,
                        a.student?.name,
                        a.student?.department,
                        a.category,
                        a.status,
                        a.status === 'approved' ? a.points : 0,
                        format(new Date(a.createdAt), 'MMM dd, yyyy')
                    ]),
                    theme: 'grid',
                    headStyles: { fillColor: [59, 130, 246] },
                });
                doc.save(`SOEIT_Achievements_List_${date}.pdf`);
                toast.success('PDF report generated');
            }
        } catch (error) {
            toast.error('Failed to export records');
        }
    };

    return (
        <div className="animate-fade-in">
            {/* Professional Header */}
            <div className="page-header" style={{ marginBottom: '2.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                <div>
                    <h2 className="heading-display">All Student Achievements</h2>
                    <p className="page-subtitle">View and manage all uploaded achievements in one place.</p>
                </div>
                <div style={{ display: 'flex', gap: '1rem' }}>
                    <button className="btn btn-ghost" onClick={() => exportAchievements('excel')} style={{ border: '1px solid var(--border-primary)', fontWeight: 800 }}>
                        <Download size={18} />
                        <span className="hide-mobile">Export Excel</span>
                        <span className="show-mobile">Excel</span>
                    </button>
                    <button className="btn btn-primary" onClick={() => exportAchievements('pdf')} style={{ fontWeight: 800 }}>
                        <Download size={18} />
                        <span className="hide-mobile">Generate PDF Report</span>
                        <span className="show-mobile">PDF</span>
                    </button>
                </div>
            </div>

            {/* Admin Filter Center */}
            <div className="card" style={{ marginBottom: '2.5rem' }}>
                <div className="card-body" style={{ padding: '1.5rem' }}>
                    <div className="filter-grid-container" style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
                        <select className="form-control filter-select" style={{ height: '48px', fontWeight: 700, flex: 1, minWidth: '150px' }} value={filters.status} onChange={e => setFilters(p => ({ ...p, status: e.target.value, page: 1 }))}>
                            <option value="">Status: All</option>
                            {STATUSES.slice(1).map(s => <option key={s} value={s} style={{ textTransform: 'capitalize' }}>{s}</option>)}
                        </select>

                        <select className="form-control filter-select" style={{ height: '48px', fontWeight: 700, flex: 1, minWidth: '150px' }} value={filters.department} onChange={e => setFilters(p => ({ ...p, department: e.target.value, page: 1 }))}>
                            <option value="">Dept: All</option>
                            {Object.entries(DEPARTMENTS).map(([group, depts]) => (
                                <optgroup key={group} label={group}>
                                    {depts.map(d => <option key={d} value={d}>{d}</option>)}
                                </optgroup>
                            ))}
                        </select>

                        <select className="form-control filter-select" style={{ height: '48px', fontWeight: 700, flex: 1, minWidth: '150px' }} value={filters.category} onChange={e => setFilters(p => ({ ...p, category: e.target.value, page: 1 }))}>
                            <option value="">Category: All</option>
                            {CATEGORIES.slice(1).map(c => <option key={c} value={c}>{c}</option>)}
                        </select>

                        <div className="search-wrapper filter-search" style={{ flex: 2, minWidth: '300px' }}>
                            <input
                                className="form-control"
                                placeholder="Search by name, enrollment, or ID..."
                                value={filters.search}
                                onChange={e => setFilters(p => ({ ...p, search: e.target.value }))}
                                onKeyDown={e => e.key === 'Enter' && load()}
                            />
                            <Search size={18} className="search-icon" />
                        </div>

                        <button className="btn btn-primary" style={{ width: '48px', height: '48px', padding: 0, flexShrink: 0, background: 'var(--primary-900)' }} onClick={load}>
                            <Search size={22} strokeWidth={2.5} />
                        </button>

                        <button className="btn btn-ghost" style={{ height: '48px', fontWeight: 800, color: 'var(--text-secondary)' }} onClick={() => setFilters({ status: '', category: '', department: '', search: '', page: 1 })}>
                            Clear All
                        </button>
                    </div>
                </div>
            </div>

            {/* Result Set Table */}
            <div className="card">
                <div className="table-container">
                    {loading ? (
                        <div style={{ padding: '2rem' }}>
                            {[...Array(8)].map((_, i) => <div key={i} className="skeleton" style={{ height: 64, marginBottom: '0.875rem' }} />)}
                        </div>
                    ) : achievements.length === 0 ? (
                        <div className="empty-state" style={{ padding: '6rem' }}>
                            <Trophy size={64} style={{ opacity: 0.2, marginBottom: '1rem' }} />
                            <h3>No records found</h3>
                            <p>Try searching for something else or changing filters.</p>
                        </div>
                    ) : (
                        <>
                            <table className="table">
                                <thead>
                                    <tr>
                                        <th style={{ paddingLeft: '1.5rem' }}>Achievement</th>
                                        <th>Student</th>
                                        <th>Department</th>
                                        <th>Category</th>
                                        <th>Level</th>
                                        <th style={{ textAlign: 'center' }}>Status</th>
                                        <th>Points</th>
                                        <th style={{ textAlign: 'center' }}>Action</th>
                                        <th style={{ textAlign: 'right', paddingRight: '1.5rem' }}>Date</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {achievements.map(a => (
                                        <tr key={a._id} className="hover-row">
                                            <td style={{ paddingLeft: '1.5rem' }}>
                                                <div style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: '0.875rem' }}>{a.title}</div>
                                                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>ID: {a._id.substring(0, 8).toUpperCase()}</div>
                                            </td>
                                            <td>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                                    <div className="avatar avatar-sm" style={{ fontWeight: 700, background: 'var(--primary-100)', color: 'var(--brand-700)' }}>
                                                        {a.student?.name?.charAt(0) || 'S'}
                                                    </div>
                                                    <div>
                                                        <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)' }}>{a.student?.name}</div>
                                                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}># {a.student?.idNumber || 'N/A'}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td><span className="badge badge-brand">{a.student?.department}</span></td>
                                            <td><span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{a.category}</span></td>
                                            <td><span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 500 }}>{a.level}</span></td>
                                            <td style={{ textAlign: 'center' }}><StatusBadge status={a.status} /></td>
                                            <td>
                                                <span style={{ fontWeight: 700, color: a.status === 'approved' ? 'var(--brand-600)' : 'var(--text-muted)', fontSize: '0.9rem' }}>
                                                    {a.status === 'approved' ? `+${a.points}` : '0'}
                                                </span>
                                            </td>
                                            <td style={{ textAlign: 'center' }}>
                                                <button
                                                    className="btn btn-ghost btn-sm"
                                                    onClick={() => navigate(`/admin/verify?id=${a._id}&status=${a.status}`)}
                                                    style={{
                                                        color: a.status === 'pending' ? 'var(--brand-600)' : 'var(--text-muted)',
                                                        fontWeight: 800,
                                                        fontSize: '0.7rem',
                                                        textTransform: 'uppercase',
                                                        border: '1px solid var(--border-primary)',
                                                        padding: '0.3rem 0.6rem',
                                                        background: a.status === 'pending' ? 'var(--primary-50)' : 'white'
                                                    }}
                                                >
                                                    {a.status === 'pending' ? 'Verify' : 'Review'}
                                                </button>
                                            </td>
                                            <td style={{ textAlign: 'right', paddingRight: '1.5rem', color: 'var(--text-muted)', fontSize: '0.82rem' }}>
                                                {format(new Date(a.createdAt), 'MMM dd, yyyy')}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>

                            {/* Paginator Actions */}
                            {pages > 1 && (
                                <div style={{ borderTop: '1px solid var(--border-primary)', padding: '1rem 1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                                        Showing <strong>{achievements.length}</strong> of <strong>{total}</strong> records
                                    </div>
                                    <div className="pagination" style={{ margin: 0 }}>
                                        <button className="page-btn" onClick={() => setFilters(p => ({ ...p, page: p.page - 1 }))} disabled={filters.page === 1}><ChevronLeft size={16} /></button>
                                        {[...Array(Math.min(pages, 7))].map((_, i) => (
                                            <button key={i} className={`page-btn ${filters.page === i + 1 ? 'active' : ''}`} onClick={() => setFilters(p => ({ ...p, page: i + 1 }))}>{i + 1}</button>
                                        ))}
                                        <button className="page-btn" onClick={() => setFilters(p => ({ ...p, page: p.page + 1 }))} disabled={filters.page === pages}><ChevronRight size={16} /></button>
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

export default AllAchievementsPage;
