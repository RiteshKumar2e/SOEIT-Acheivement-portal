import '../../styles/MyAchievementsPage.css';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { achievementAPI } from '../../services/api';
import { Trophy, Search, Filter, Pencil, Trash2, Clock, CheckCircle, XCircle, Eye, Upload, ChevronLeft, ChevronRight, Star, GraduationCap } from 'lucide-react';
import { format } from 'date-fns';
import toast from 'react-hot-toast';

const CATEGORIES = ['', 'Academic', 'Sports', 'Cultural', 'Technical', 'Research', 'Internship', 'Certification', 'Competition', 'Other'];
const STATUSES = ['', 'pending', 'approved', 'rejected'];

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

const MyAchievementsPage = () => {
    const [achievements, setAchievements] = useState([]);
    const [loading, setLoading] = useState(true);
    const [total, setTotal] = useState(0);
    const [pages, setPages] = useState(1);
    const [filters, setFilters] = useState({ status: '', category: '', search: '', page: 1 });

    const load = async () => {
        setLoading(true);
        try {
            const params = { ...filters, limit: 10 };
            Object.keys(params).forEach(k => !params[k] && delete params[k]);
            const { data } = await achievementAPI.getMy(params);
            setAchievements(data.data);
            setTotal(data.total);
            setPages(data.pages);
        } catch {
            toast.error('Identity protocol failed: Records unavailable');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { load(); }, [filters.status, filters.category, filters.page]);

    const handleSearch = (e) => {
        e.preventDefault();
        setFilters(p => ({ ...p, page: 1 }));
        load();
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Security protocol: Permanent elimination of this record required?')) return;
        try {
            await achievementAPI.delete(id);
            toast.success('Credential protocol: Record eliminated');
            load();
        } catch {
            toast.error('Elimination protocol failed');
        }
    };

    return (
        <div className="animate-fade-in">
            {/* Header Suite */}
            <div className="page-header" style={{ marginBottom: '3rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                <div>
                    <h2 className="heading-display">Institutional Achievement Registry</h2>
                    <p className="page-subtitle">Unified chronological ledger of verified academic and professional milestones.</p>
                </div>
                <Link to="/achievements/upload" className="btn btn-primary" style={{ padding: '0.8rem 2rem', fontWeight: 900 }}>
                    <Upload size={18} />
                    <span>Synchronize New Record</span>
                </Link>
            </div>

            {/* Navigation & Control Suite */}
            <div className="card" style={{ marginBottom: '2rem', padding: '1.5rem', background: 'var(--slate-50)', border: '1px solid var(--border-primary)' }}>
                <form onSubmit={handleSearch} className="filter-grid-container" style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
                    <div className="search-wrapper filter-search">
                        <input
                            className="form-control"
                            placeholder="Query by record title..."
                            value={filters.search}
                            onChange={e => setFilters(p => ({ ...p, search: e.target.value }))}
                        />
                        <Search size={18} className="search-icon" />
                    </div>

                    <select className="form-control filter-select" style={{ height: '48px', fontWeight: 700 }} value={filters.status} onChange={e => setFilters(p => ({ ...p, status: e.target.value, page: 1 }))}>
                        <option value="">Verification Status</option>
                        {STATUSES.slice(1).map(s => <option key={s} value={s} style={{ textTransform: 'capitalize' }}>{s.toUpperCase()}</option>)}
                    </select>

                    <select className="form-control filter-select" style={{ height: '48px', fontWeight: 700 }} value={filters.category} onChange={e => setFilters(p => ({ ...p, category: e.target.value, page: 1 }))}>
                        <option value="">Functional Category</option>
                        {CATEGORIES.slice(1).map(c => <option key={c} value={c}>{c.toUpperCase()}</option>)}
                    </select>

                    <button type="submit" className="btn btn-primary filter-btn" style={{ height: '48px', padding: '0 1.5rem', fontWeight: 900 }}>
                        <Filter size={18} />
                        <span>Filter</span>
                    </button>

                    <button type="button" className="btn btn-ghost filter-reset-btn" style={{ height: '48px', fontWeight: 800, border: '1px solid var(--border-primary)', background: 'white' }} onClick={() => setFilters({ status: '', category: '', search: '', page: 1 })}>
                        Reset
                    </button>
                </form>
            </div>

            {/* Registry Documentation Table */}
            <div className="card" style={{ overflow: 'hidden' }}>
                <div style={{ overflowX: 'auto' }}>
                    {loading ? (
                        <div style={{ padding: '2rem' }}>
                            {[...Array(6)].map((_, i) => <div key={i} className="skeleton" style={{ height: 72, marginBottom: '1rem', borderRadius: '12px' }} />)}
                        </div>
                    ) : achievements.length === 0 ? (
                        <div style={{ padding: '8rem 2rem', textAlign: 'center' }}>
                            <div style={{ width: 100, height: 100, background: 'var(--primary-50)', color: 'var(--brand-700)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 2rem auto' }}>
                                <GraduationCap size={48} />
                            </div>
                            <h3 style={{ fontWeight: 900, fontSize: '1.5rem', marginBottom: '0.75rem' }}>Registry Initialization Required</h3>
                            <p style={{ color: 'var(--text-muted)', fontWeight: 600, maxWidth: '450px', margin: '0 auto 2.5rem auto' }}>No achievement records have been synchronized with the institutional database for the current query.</p>
                            <Link to="/achievements/upload" className="btn btn-primary" style={{ padding: '0.8rem 2.5rem', fontWeight: 900 }}>
                                Initiate First Submission
                            </Link>
                        </div>
                    ) : (
                        <>
                            <table className="table" style={{ width: '100%', borderCollapse: 'collapse' }}>
                                <thead>
                                    <tr style={{ borderBottom: '2px solid var(--border-primary)', background: 'var(--slate-50)' }}>
                                        <th style={{ padding: '1.25rem 2rem', textAlign: 'left', fontWeight: 800, textTransform: 'uppercase', fontSize: '0.75rem', color: 'var(--text-muted)', letterSpacing: '0.05em' }}>Record Nomenclature</th>
                                        <th style={{ padding: '1.25rem 2rem', textAlign: 'left', fontWeight: 800, textTransform: 'uppercase', fontSize: '0.75rem', color: 'var(--text-muted)', letterSpacing: '0.05em' }}>Domain</th>
                                        <th style={{ padding: '1.25rem 2rem', textAlign: 'left', fontWeight: 800, textTransform: 'uppercase', fontSize: '0.75rem', color: 'var(--text-muted)', letterSpacing: '0.05em' }}>Resolution</th>
                                        <th style={{ padding: '1.25rem 2rem', textAlign: 'left', fontWeight: 800, textTransform: 'uppercase', fontSize: '0.75rem', color: 'var(--text-muted)', letterSpacing: '0.05em' }}>Registry Date</th>
                                        <th style={{ padding: '1.25rem 2rem', textAlign: 'left', fontWeight: 800, textTransform: 'uppercase', fontSize: '0.75rem', color: 'var(--text-muted)', letterSpacing: '0.05em' }}>Verification</th>
                                        <th style={{ padding: '1.25rem 2rem', textAlign: 'left', fontWeight: 800, textTransform: 'uppercase', fontSize: '0.75rem', color: 'var(--text-muted)', letterSpacing: '0.05em' }}>Yield</th>
                                        <th style={{ padding: '1.25rem 2rem', textAlign: 'right', fontWeight: 800, textTransform: 'uppercase', fontSize: '0.75rem', color: 'var(--text-muted)', letterSpacing: '0.05em' }}>Suite</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {achievements.map((a) => (
                                        <tr key={a._id} style={{ borderBottom: '1px solid var(--border-primary)', transition: 'background 0.2s ease' }} className="hover-slate">
                                            <td style={{ padding: '1.25rem 2rem' }}>
                                                <div style={{ fontWeight: 800, color: 'var(--text-primary)', fontSize: '0.95rem' }}>{a.title}</div>
                                                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600, marginTop: '2px' }}>{a.institution || 'Institutional Record'}</div>
                                            </td>
                                            <td style={{ padding: '1.25rem 2rem' }}><span className="badge badge-primary" style={{ fontWeight: 800, textTransform: 'uppercase' }}>{a.category}</span></td>
                                            <td style={{ padding: '1.25rem 2rem' }}><span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-muted)' }}>{a.level} Resolution</span></td>
                                            <td style={{ padding: '1.25rem 2rem' }}><span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 }}>{format(new Date(a.date || a.createdAt), 'MMM dd, yyyy')}</span></td>
                                            <td style={{ padding: '1.25rem 2rem' }}><StatusBadge status={a.status} /></td>
                                            <td style={{ padding: '1.25rem 2rem' }}>
                                                {a.status === 'approved' ? (
                                                    <div style={{ fontWeight: 900, color: 'var(--brand-700)', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '1.1rem' }}>
                                                        <Star size={14} fill="var(--brand-600)" />
                                                        {a.points}
                                                    </div>
                                                ) : (
                                                    <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem', fontWeight: 700 }}>PENDING YIELD</span>
                                                )}
                                            </td>
                                            <td style={{ padding: '1.25rem 2rem', textAlign: 'right' }}>
                                                <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                                                    {a.status !== 'approved' && (
                                                        <Link to={`/achievements/edit/${a._id}`} className="btn btn-ghost btn-icon" style={{ borderRadius: '10px' }}>
                                                            <Pencil size={18} />
                                                        </Link>
                                                    )}
                                                    <button className="btn btn-ghost btn-icon" style={{ borderRadius: '10px' }}>
                                                        <Eye size={18} />
                                                    </button>
                                                    <button className="btn btn-ghost btn-icon" style={{ color: 'var(--error-500)', borderRadius: '10px' }} onClick={() => handleDelete(a._id)}>
                                                        <Trash2 size={18} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>

                            {/* Paginator Resolution */}
                            {pages > 1 && (
                                <div style={{ padding: '1.5rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--slate-50)' }}>
                                    <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 700 }}>
                                        SYNCHRONIZED: <span style={{ color: 'var(--text-primary)' }}>{achievements.length}</span> / <span style={{ color: 'var(--text-primary)' }}>{total}</span> DOSSIERS
                                    </div>
                                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                                        <button className="btn btn-ghost" style={{ padding: '0.5rem', height: '40px', width: '40px', background: 'white', border: '1px solid var(--border-primary)' }} onClick={() => setFilters(p => ({ ...p, page: p.page - 1 }))} disabled={filters.page === 1}><ChevronLeft size={18} /></button>
                                        {[...Array(pages)].map((_, i) => (
                                            <button key={i} onClick={() => setFilters(p => ({ ...p, page: i + 1 }))}
                                                className={`btn ${filters.page === i + 1 ? 'btn-primary' : 'btn-ghost'}`}
                                                style={{ height: '40px', width: '40px', padding: 0, fontWeight: 800, background: filters.page === i + 1 ? 'var(--brand-600)' : 'white', border: filters.page !== i + 1 ? '1px solid var(--border-primary)' : 'none' }}>
                                                {i + 1}
                                            </button>
                                        ))}
                                        <button className="btn btn-ghost" style={{ padding: '0.5rem', height: '40px', width: '40px', background: 'white', border: '1px solid var(--border-primary)' }} onClick={() => setFilters(p => ({ ...p, page: p.page + 1 }))} disabled={filters.page === pages}><ChevronRight size={18} /></button>
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

export default MyAchievementsPage;
