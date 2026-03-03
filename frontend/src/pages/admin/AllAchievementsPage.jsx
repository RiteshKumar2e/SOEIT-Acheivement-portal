import '../../styles/AllAchievementsPage.css';
import { useState, useEffect } from 'react';
import { adminAPI } from '../../services/api';
import { Search, Filter, Trophy, ChevronLeft, ChevronRight, Clock, CheckCircle, XCircle } from 'lucide-react';
import { format } from 'date-fns';
import toast from 'react-hot-toast';

const STATUSES = ['', 'pending', 'approved', 'rejected'];
const DEPARTMENTS = ['', 'CSE', 'IT', 'ECE', 'EEE', 'ME', 'CE'];
const CATEGORIES = ['', 'Academic', 'Sports', 'Cultural', 'Technical', 'Research', 'Internship', 'Certification', 'Competition', 'Other'];

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
            toast.error('Failed to synchronize institutional records');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { load(); }, [filters.status, filters.category, filters.department, filters.page]);

    return (
        <div className="animate-fade-in">
            {/* Professional Header */}
            <div className="page-header" style={{ marginBottom: '2.5rem' }}>
                <h2 className="heading-display">Institutional Achievement Repository</h2>
                <p className="page-subtitle">Historical ledger containing all validated and pending achievements across SOEIT.</p>
            </div>

            {/* Admin Filter Center */}
            <div className="card" style={{ marginBottom: '2.5rem' }}>
                <div className="card-body" style={{ padding: '1.5rem' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr 1fr 1fr auto auto', gap: '0.875rem', alignItems: 'center' }}>
                        <div className="search-box">
                            <Search size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                            <input
                                className="form-control"
                                style={{ paddingLeft: '2.75rem' }}
                                placeholder="Search records or student names..."
                                value={filters.search}
                                onChange={e => setFilters(p => ({ ...p, search: e.target.value }))}
                                onKeyDown={e => e.key === 'Enter' && load()}
                            />
                        </div>

                        <select className="form-control" value={filters.status} onChange={e => setFilters(p => ({ ...p, status: e.target.value, page: 1 }))}>
                            <option value="">Status: All</option>
                            {STATUSES.slice(1).map(s => <option key={s} value={s} style={{ textTransform: 'capitalize' }}>{s}</option>)}
                        </select>

                        <select className="form-control" value={filters.department} onChange={e => setFilters(p => ({ ...p, department: e.target.value, page: 1 }))}>
                            <option value="">Dept: All</option>
                            {DEPARTMENTS.slice(1).map(d => <option key={d} value={d}>{d}</option>)}
                        </select>

                        <select className="form-control" value={filters.category} onChange={e => setFilters(p => ({ ...p, category: e.target.value, page: 1 }))}>
                            <option value="">Category: All</option>
                            {CATEGORIES.slice(1).map(c => <option key={c} value={c}>{c}</option>)}
                        </select>

                        <button className="btn btn-primary" style={{ padding: '0 1.5rem', height: '42px' }} onClick={load}>
                            <Filter size={16} />
                            <span>Filter</span>
                        </button>

                        <button className="btn btn-ghost" style={{ height: '42px' }} onClick={() => setFilters({ status: '', category: '', department: '', search: '', page: 1 })}>
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
                            <h3>No institutional records match your query</h3>
                            <p>Try refining your search parameters or adjusting active filters.</p>
                        </div>
                    ) : (
                        <>
                            <table className="table">
                                <thead>
                                    <tr>
                                        <th style={{ paddingLeft: '1.5rem' }}>Achievement Record</th>
                                        <th>Student Affiliate</th>
                                        <th>Department</th>
                                        <th>Functional Category</th>
                                        <th>Impact Level</th>
                                        <th>Verification Status</th>
                                        <th>Points</th>
                                        <th style={{ textAlign: 'right', paddingRight: '1.5rem' }}>Date Recorded</th>
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
                                            <td><StatusBadge status={a.status} /></td>
                                            <td>
                                                <span style={{ fontWeight: 700, color: a.status === 'approved' ? 'var(--brand-600)' : 'var(--text-muted)', fontSize: '0.9rem' }}>
                                                    {a.status === 'approved' ? `+${a.points}` : '0'}
                                                </span>
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
                                        Exhibiting <strong>{achievements.length}</strong> of <strong>{total}</strong> historical records
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
