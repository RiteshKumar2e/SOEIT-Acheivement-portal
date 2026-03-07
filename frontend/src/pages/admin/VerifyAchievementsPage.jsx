import '../../styles/VerifyAchievementsPage.css';
import { useState, useEffect } from 'react';
import { adminAPI } from '../../services/api';
import { CheckCircle, XCircle, Eye, Search, Filter, Clock, FileText, ChevronLeft, ChevronRight } from 'lucide-react';
import { format } from 'date-fns';
import toast from 'react-hot-toast';

const DEPARTMENTS = {
    'B.Tech': ['CSE', 'AIDS (IBM)', 'AIML', 'ME', 'EEE'],
    'BCA': ['BCA (Regular)', 'AIDL', 'Cybersecurity'],
    'Diploma': ['DCSE', 'DME', 'DEEE'],
};
const CATEGORIES = ['', 'Academic', 'Sports', 'Cultural', 'Technical', 'Research', 'Internship', 'Certification', 'Competition', 'Other'];

const VerifyAchievementsPage = () => {
    const [achievements, setAchievements] = useState([]);
    const [loading, setLoading] = useState(true);
    const [total, setTotal] = useState(0);
    const [pages, setPages] = useState(1);
    const [filters, setFilters] = useState({ department: '', category: '', search: '', page: 1 });
    const [selected, setSelected] = useState(null);
    const [action, setAction] = useState('');
    const [remarks, setRemarks] = useState('');
    const [verifying, setVerifying] = useState(false);

    const load = async () => {
        setLoading(true);
        try {
            const params = { ...filters, limit: 10 };
            Object.keys(params).forEach(k => !params[k] && delete params[k]);
            const { data } = await adminAPI.getPending(params);
            setAchievements(data.data);
            setTotal(data.total);
            setPages(data.pages);
        } catch {
            toast.error('Failed to synchronize compliance registry');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { load(); }, [filters.department, filters.category, filters.page]);

    const handleVerify = async () => {
        if (!action) { toast.error('Selection required: Authorization or Invalidation'); return; }
        if (action === 'rejected' && !remarks.trim()) { toast.error('Providence of rejection rationale is mandatory'); return; }
        setVerifying(true);
        try {
            await adminAPI.verify(selected._id, { action, remarks });
            toast.success(`Institutional Record ${action === 'approved' ? 'Authorized' : 'Invalidated'}`);
            setSelected(null);
            setAction('');
            setRemarks('');
            load();
        } catch {
            toast.error('Protocol execution failed');
        } finally {
            setVerifying(false);
        }
    };

    return (
        <div className="animate-fade-in">
            {/* Header Suite */}
            <div className="page-header" style={{ marginBottom: '2.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                <div>
                    <h2 className="heading-display">Compliance Review</h2>
                    <p className="page-subtitle">Rigorous evaluation and formal verification of scholar-submitted academic and technical yields.</p>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem', padding: '0.875rem 1.5rem', background: 'var(--primary-50)', borderRadius: '14px', border: '1px solid var(--primary-100)', boxShadow: 'var(--shadow-xs)' }}>
                    <div style={{ position: 'relative' }}>
                        <Clock size={16} className="text-brand" strokeWidth={3} />
                        <span style={{ position: 'absolute', top: '-4px', right: '-4px', width: '8px', height: '8px', background: 'var(--error-500)', borderRadius: '50%', border: '2px solid white' }}></span>
                    </div>
                    <span style={{ fontSize: '0.9rem', color: 'var(--brand-800)', fontWeight: 900, letterSpacing: '0.02em' }}>{total} OPERATIONS PENDING</span>
                </div>
            </div>

            {/* Advanced Filtering Ecosystem */}
            <div className="card" style={{ padding: '1.5rem', marginBottom: '2rem', border: '1px solid var(--border-primary)' }}>
                <div className="filter-grid-container" style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
                    <div className="search-wrapper filter-search">
                        <input className="form-control" placeholder="Search digital identifiers..." value={filters.search} onChange={e => setFilters(p => ({ ...p, search: e.target.value }))} onKeyDown={e => e.key === 'Enter' && load()} />
                        <Search size={20} className="search-icon" />
                    </div>
                    <select className="form-control filter-select" style={{ height: '48px', fontWeight: 700 }} value={filters.department} onChange={e => setFilters(p => ({ ...p, department: e.target.value, page: 1 }))}>
                        <option value="">All Institutional Departments</option>
                        {Object.entries(DEPARTMENTS).map(([group, depts]) => (
                            <optgroup key={group} label={group}>
                                {depts.map(d => <option key={d} value={d}>{d}</option>)}
                            </optgroup>
                        ))}
                    </select>
                    <select className="form-control filter-select" style={{ height: '48px', fontWeight: 700 }} value={filters.category} onChange={e => setFilters(p => ({ ...p, category: e.target.value, page: 1 }))}>
                        <option value="">All Domain Categories</option>
                        {CATEGORIES.slice(1).map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                    <button className="btn btn-primary filter-btn" onClick={load} style={{ height: '48px', padding: '0 1.5rem' }}>
                        <Filter size={18} strokeWidth={2.5} />
                    </button>
                </div>
            </div>

            <div className={`grid-stack ${selected ? 'grid-stack-2' : ''}`} style={{ transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)' }}>
                {/* Registry Surveillance View */}
                <div style={{ minWidth: 0 }}>
                    {loading ? (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                            {[...Array(5)].map((_, i) => <div key={i} className="skeleton" style={{ height: 110, borderRadius: '16px' }} />)}
                        </div>
                    ) : achievements.length === 0 ? (
                        <div className="card" style={{ padding: '6rem 2rem', textAlign: 'center', background: 'var(--slate-50)', border: '2px dashed var(--border-primary)' }}>
                            <div style={{ width: 88, height: 88, background: 'white', color: 'var(--success-500)', borderRadius: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem auto', boxShadow: 'var(--shadow-sm)' }}>
                                <CheckCircle size={44} strokeWidth={1.5} />
                            </div>
                            <h3 style={{ fontWeight: 900, color: 'var(--text-primary)', marginBottom: '0.75rem', fontSize: '1.5rem' }}>Review Queue Clear</h3>
                            <p style={{ color: 'var(--text-muted)', fontWeight: 600, maxWidth: '400px', margin: '0 auto' }}>All scholar-submitted records have been reconciled. No further administrative action required at this time.</p>
                        </div>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            {achievements.map((a) => (
                                <div key={a._id}
                                    className={`card hover-row ${selected?._id === a._id ? 'active-selection' : ''}`}
                                    style={{
                                        cursor: 'pointer',
                                        padding: '1.5rem',
                                        border: selected?._id === a._id ? '2px solid var(--brand-600)' : '1px solid var(--border-primary)',
                                        background: selected?._id === a._id ? 'var(--primary-50)' : 'white',
                                        boxShadow: selected?._id === a._id ? 'var(--shadow-md)' : 'var(--shadow-sm)',
                                        transition: 'all 0.2s ease',
                                        borderRadius: '16px'
                                    }}
                                    onClick={() => { setSelected(a); setAction(''); setRemarks(''); }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                                        <div style={{ width: 56, height: 56, background: selected?._id === a._id ? 'white' : 'var(--primary-50)', color: 'var(--brand-700)', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: '1.25rem', border: '1px solid var(--primary-100)', flexShrink: 0 }}>
                                            {a.student?.name?.charAt(0) || 'S'}
                                        </div>
                                        <div style={{ flex: 1, minWidth: 0 }}>
                                            <div style={{ fontSize: '1.15rem', fontWeight: 900, color: 'var(--text-primary)', marginBottom: '0.35rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{a.title}</div>
                                            <div style={{ display: 'flex', gap: '1.25rem', alignItems: 'center', flexWrap: 'wrap' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                    <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--brand-400)' }}></div>
                                                    <span style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--text-secondary)' }}>{a.student?.name}</span>
                                                </div>
                                                <span className="badge badge-brand" style={{ fontSize: '0.7rem', fontWeight: 800 }}>{a.department || a.student?.department}</span>
                                                <span className="badge" style={{ background: 'var(--slate-100)', color: 'var(--text-secondary)', border: 'none', fontSize: '0.7rem', fontWeight: 800 }}>{a.category}</span>
                                            </div>
                                            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', marginTop: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.625rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                                                <Clock size={14} strokeWidth={2.5} /> Submitted: {format(new Date(a.createdAt), 'dd MMM yyyy • HH:mm')}
                                            </div>
                                        </div>
                                        <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--brand-500)', border: '1px solid var(--border-primary)' }}>
                                            <ChevronRight size={18} strokeWidth={3} />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {pages > 1 && (
                        <div className="pagination" style={{ marginTop: '2.5rem', justifyContent: 'center', gap: '0.5rem' }}>
                            <button className="btn btn-ghost" style={{ width: 44, height: 44, padding: 0, borderRadius: '12px', background: 'white', border: '1px solid var(--border-primary)' }} onClick={() => setFilters(p => ({ ...p, page: p.page - 1 }))} disabled={filters.page === 1}><ChevronLeft size={18} /></button>
                            {[...Array(pages)].map((_, i) => (
                                <button key={i} className={`btn ${filters.page === i + 1 ? 'btn-primary' : 'btn-ghost'}`} style={{ width: 44, height: 44, padding: 0, borderRadius: '12px', fontWeight: 900, background: filters.page === i + 1 ? 'var(--brand-600)' : 'white', border: filters.page !== i + 1 ? '1px solid var(--border-primary)' : 'none' }} onClick={() => setFilters(p => ({ ...p, page: i + 1 }))}>{i + 1}</button>
                            ))}
                            <button className="btn btn-ghost" style={{ width: 44, height: 44, padding: 0, borderRadius: '12px', background: 'white', border: '1px solid var(--border-primary)' }} onClick={() => setFilters(p => ({ ...p, page: p.page + 1 }))} disabled={filters.page === pages}><ChevronRight size={18} /></button>
                        </div>
                    )}
                </div>

                {/* Analytical Protocol & Evaluation Suite */}
                {selected && (
                    <div className="card animate-slide-in" style={{ position: 'sticky', top: '24px', alignSelf: 'start', height: 'calc(100vh - 48px)', display: 'flex', flexDirection: 'column', border: '1px solid var(--border-primary)', borderRadius: '20px', boxShadow: 'var(--shadow-xl)', overflow: 'hidden' }}>
                        <div className="card-header" style={{ padding: '1.75rem', borderBottom: '1px solid var(--border-primary)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'var(--slate-50)' }}>
                            <div>
                                <h4 style={{ margin: 0, fontWeight: 900, fontSize: '1.25rem', letterSpacing: '-0.02em' }}>Review Protocol</h4>
                                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em' }}>SYSTEM RECORD ID: {selected._id.slice(-12).toUpperCase()}</span>
                            </div>
                            <button className="btn btn-ghost" onClick={() => setSelected(null)} style={{ padding: '0.5rem', borderRadius: '10px', color: 'var(--text-muted)' }}><XCircle size={24} /></button>
                        </div>

                        <div className="card-body" style={{ padding: '1.75rem', overflowY: 'auto', flex: 1 }}>
                            <div style={{ marginBottom: '2rem' }}>
                                <div style={{ fontSize: '1.4rem', fontWeight: 900, color: 'var(--text-primary)', marginBottom: '1rem', lineHeight: 1.25, letterSpacing: '-0.03em' }}>{selected.title}</div>
                                <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginBottom: '2rem' }}>
                                    <div style={{ padding: '0.4rem 0.875rem', background: 'var(--primary-100)', color: 'var(--brand-700)', borderRadius: '10px', fontSize: '0.75rem', fontWeight: 900, textTransform: 'uppercase' }}>{selected.category}</div>
                                    <div style={{ padding: '0.4rem 0.875rem', background: 'var(--slate-100)', color: 'var(--text-secondary)', borderRadius: '10px', fontSize: '0.75rem', fontWeight: 900, textTransform: 'uppercase' }}>{selected.level} TIER</div>
                                </div>

                                <div style={{ padding: '1.5rem', background: 'white', borderRadius: '16px', border: '1px solid var(--border-primary)', marginBottom: '2rem', boxShadow: 'var(--shadow-xs)' }}>
                                    <div style={{ fontSize: '0.75rem', fontWeight: 900, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.75rem', letterSpacing: '0.04em', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                        <FileText size={14} /> Description
                                    </div>
                                    <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', lineHeight: 1.7, margin: 0, fontWeight: 500 }}>{selected.description}</p>
                                </div>

                                <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1rem', padding: '0 0.5rem' }}>
                                    {[
                                        { label: 'Scholar Information', val: selected.student?.name },
                                        { label: 'Academic Department', val: selected.student?.department },
                                        { label: 'Temporal Signature', val: selected.date ? format(new Date(selected.date), 'dd MMMM yyyy') : 'NOT APPPLICABLE' },
                                        { label: 'Institutional Body', val: selected.institution || 'DIRECT PUBLICATION' }
                                    ].map(({ label, val }) => (
                                        <div key={label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '0.75rem', borderBottom: '1px solid var(--slate-50)' }}>
                                            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 800, textTransform: 'uppercase' }}>{label}</span>
                                            <span style={{ fontSize: '0.9rem', color: 'var(--text-primary)', fontWeight: 800 }}>{val}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {selected.proofFiles?.length > 0 && (
                                <div style={{ marginBottom: '2.5rem' }}>
                                    <div style={{ fontSize: '0.8rem', fontWeight: 900, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                        <div style={{ width: 24, height: 2, background: 'var(--brand-500)' }}></div>
                                        Evidentiary Metadata
                                    </div>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                        {selected.proofFiles.map((f, i) => (
                                            <a key={i} href={f.url} target="_blank" rel="noreferrer"
                                                style={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: '1.25rem',
                                                    padding: '1.25rem',
                                                    background: 'white',
                                                    borderRadius: '14px',
                                                    border: '1px solid var(--border-primary)',
                                                    color: 'var(--text-primary)',
                                                    textDecoration: 'none',
                                                    transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)'
                                                }}
                                                className="record-link-hover">
                                                <div style={{ width: 44, height: 44, background: 'var(--primary-50)', color: 'var(--brand-600)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid var(--primary-100)' }}>
                                                    <FileText size={22} strokeWidth={2.5} />
                                                </div>
                                                <div style={{ flex: 1, minWidth: 0 }}>
                                                    <div style={{ fontSize: '0.9rem', fontWeight: 800, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{f.originalname}</div>
                                                    <div style={{ fontSize: '0.7rem', color: 'var(--brand-500)', fontWeight: 800, textTransform: 'uppercase', marginTop: '0.2rem' }}>Audit Evidence</div>
                                                </div>
                                                <Eye size={18} className="text-muted" style={{ opacity: 0.6 }} />
                                            </a>
                                        ))}
                                    </div>
                                </div>
                            )}

                            <div style={{ marginTop: 'auto', paddingTop: '2rem', borderTop: '2px dashed var(--border-primary)' }}>
                                <div style={{ fontSize: '0.8rem', fontWeight: 900, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '1.25rem' }}>Reconciliation Protocol</div>

                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
                                    <button
                                        className={`btn ${action === 'approved' ? 'btn-success' : 'btn-ghost'}`}
                                        style={{ height: '52px', borderRadius: '14px', fontWeight: 900, border: action !== 'approved' ? '1px solid var(--border-primary)' : 'none', background: action === 'approved' ? 'var(--success-600)' : 'white' }}
                                        onClick={() => setAction('approved')}>
                                        <CheckCircle size={20} strokeWidth={3} />
                                        <span>Authorize</span>
                                    </button>
                                    <button
                                        className={`btn ${action === 'rejected' ? 'btn-danger' : 'btn-ghost'}`}
                                        style={{ height: '52px', borderRadius: '14px', fontWeight: 900, border: action !== 'rejected' ? '1px solid var(--border-primary)' : 'none', background: action === 'rejected' ? 'var(--error-600)' : 'white' }}
                                        onClick={() => setAction('rejected')}>
                                        <XCircle size={20} strokeWidth={3} />
                                        <span>Invalidate</span>
                                    </button>
                                </div>

                                <div className="form-group" style={{ marginBottom: '1.75rem' }}>
                                    <label className="form-label" style={{ fontWeight: 900, fontSize: '0.85rem' }}>Audit Disclosures {action === 'rejected' && <span className="text-danger">*</span>}</label>
                                    <textarea className="form-control" style={{ borderRadius: '14px', border: '1px solid var(--border-primary)', padding: '1rem', fontWeight: 600, fontSize: '0.95rem' }} rows={4} placeholder={action === 'rejected' ? 'Formulate the formal rationale for record invalidation...' : 'Supplementary institutional remarks (Optional)...'} value={remarks} onChange={e => setRemarks(e.target.value)} />
                                </div>

                                <button className="btn btn-primary w-full" style={{ height: '56px', borderRadius: '16px', fontWeight: 900, fontSize: '1.1rem', letterSpacing: '-0.02em', boxShadow: 'var(--shadow-lg)' }} onClick={handleVerify} disabled={!action || verifying}>
                                    {verifying ? <div className="spinner-sm" /> : `Commit Evaluation Resolution`}
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default VerifyAchievementsPage;
