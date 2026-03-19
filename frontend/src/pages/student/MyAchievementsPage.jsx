import '../../styles/pages/student/MyAchievementsPage.css';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { achievementAPI } from '../../services/api';
import { Trophy, Search, Filter, Pencil, Trash2, Clock, CheckCircle, XCircle, X, Eye, Upload, ChevronLeft, ChevronRight, Star, GraduationCap, Download } from 'lucide-react';
import { format } from 'date-fns';
import toast from 'react-hot-toast';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { useAuth } from '../../context/AuthContext';
import { STATIC_BASE_URL } from '../../services/api';

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
    const { user } = useAuth();
    const [achievements, setAchievements] = useState([]);
    const [loading, setLoading] = useState(true);
    const [downloading, setDownloading] = useState(false);
    const [total, setTotal] = useState(0);
    const [pages, setPages] = useState(1);
    const [filters, setFilters] = useState({ status: '', category: '', search: '', page: 1 });
    const [selected, setSelected] = useState(null);

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
            toast.error('Failed to load achievements');
        } finally {
            setLoading(false);
        }
    };

    const handleDownloadAll = async () => {
        if (downloading || achievements.length === 0) return;
        const toastId = toast.loading('Preparing your certificates...');
        setDownloading(true);

        try {
            const zip = new JSZip();

            // Collect ALL proof files from currently loaded achievements
            const filesToDownload = [];
            achievements.forEach(ach => {
                // Universal Path Normalizer: Gracefully handles legacy filesystem and modern DB paths
                const getRelPath = (rawUrl) => {
                    if (!rawUrl) return '';
                    // 1. If it's already a relative institutional path, keep it
                    if (rawUrl.startsWith('/api') || rawUrl.startsWith('/uploads')) return rawUrl;
                    // 2. If it's a full URL containing /uploads or /api, extract the relative part
                    const uploadsIdx = rawUrl.indexOf('/uploads/');
                    if (uploadsIdx !== -1) return rawUrl.substring(uploadsIdx);
                    const apiIdx = rawUrl.indexOf('/api/');
                    if (apiIdx !== -1) return rawUrl.substring(apiIdx);
                    // 3. Otherwise assume it's a target for the database serving route
                    return `/api/achievements/files/${rawUrl.split('/').pop()}`;
                };

                if (ach.proofFiles && ach.proofFiles.length > 0) {
                    ach.proofFiles.forEach(file => {
                        filesToDownload.push({
                            relPath: getRelPath(file.url),
                            name: `${ach.category}_${decodeURIComponent(file.originalname)}`
                        });
                    });
                } else if (ach.certificateUrl) {
                    filesToDownload.push({
                        relPath: getRelPath(ach.certificateUrl),
                        name: `${ach.category}_Certificate.pdf`
                    });
                }
            });

            if (filesToDownload.length === 0) {
                toast.error('No certificates found to download.', { id: toastId });
                setDownloading(false);
                return;
            }

            let missingFilesCount = 0;
            const downloadPromises = filesToDownload.map(async (file, index) => {
                try {
                    // Direct fetch from Render Backend ONLY
                    const response = await fetch(`${STATIC_BASE_URL}${file.relPath}`);

                    if (!response.ok) {
                        // Audit Log for legacy file loss
                        if (file.relPath.startsWith('/uploads')) {
                            console.warn(`[DIAGNOSTIC] Peer-to-peer sync failure for legacy file: ${file.name}. Render disk purged. Re-upload required to migrate to database.`);
                        }
                        missingFilesCount++;
                        return;
                    }

                    const blob = await response.blob();
                    const extension = file.name.split('.').pop();
                    const baseName = file.name.substring(0, file.name.lastIndexOf('.'));
                    const finalName = `${baseName}_${index}.${extension}`;
                    zip.file(finalName, blob);
                } catch (err) {
                    missingFilesCount++;
                }
            });

            await Promise.all(downloadPromises);

            if (Object.keys(zip.files).length === 0) {
                toast.error('Certificates could not be retrieved. They may have been deleted from Render.', { id: toastId, duration: 6000 });
                setDownloading(false);
                return;
            }

            const content = await zip.generateAsync({ type: 'blob' });
            const fileName = `${user?.name?.replace(/\s+/g, '_')}_CERTIFICATES.zip`;
            saveAs(content, fileName);

            if (missingFilesCount > 0) {
                toast.success(`Download complete. (${missingFilesCount} files were unavailable)`, { id: toastId });
            } else {
                toast.success('All certificates downloaded successfully!', { id: toastId });
            }
        } catch (error) {
            console.error('Archival failure', error);
            toast.error('Failed to download certificates.', { id: toastId });
        } finally {
            setDownloading(false);
        }
    };

    useEffect(() => { load(); }, [filters.status, filters.category, filters.page]);

    const handleSearch = (e) => {
        e.preventDefault();
        setFilters(p => ({ ...p, page: 1 }));
        load();
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this achievement?')) return;
        try {
            await achievementAPI.delete(id);
            toast.success('Achievement deleted');
            load();
        } catch {
            toast.error('Failed to delete achievement');
        }
    };

    return (
        <div className="animate-fade-in">
            {/* Header Suite */}
            <div className="page-header" style={{ marginBottom: '3rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '1rem' }}>
                <div>
                    <h2 className="heading-display">My Achievements</h2>
                    <p className="page-subtitle">View and manage all your submitted achievements and certificates.</p>
                </div>
                <div style={{ display: 'flex', gap: '1rem' }}>
                    <button
                        className="btn btn-ghost"
                        onClick={handleDownloadAll}
                        disabled={downloading || achievements.length === 0}
                        style={{ padding: '0.8rem 1.5rem', fontWeight: 900, border: '1px solid var(--border-primary)', background: 'white' }}
                    >
                        {downloading ? <div className="spinner-sm" /> : <Download size={18} />}
                        <span>Download All</span>
                    </button>
                    <Link to="/achievements/upload" className="btn btn-primary" style={{ padding: '0.8rem 2rem', fontWeight: 900 }}>
                        <Upload size={18} />
                        <span>Add Achievement</span>
                    </Link>
                </div>
            </div>

            {/* Navigation & Control Suite */}
            <div className="card" style={{ marginBottom: '2rem', padding: '1.5rem', background: 'var(--slate-50)', border: '1px solid var(--border-primary)' }}>
                <form onSubmit={handleSearch} className="filter-grid-container achievements-filter-form">
                    <div className="search-wrapper filter-search achievements-search-wrap">
                        <input
                            className="form-control"
                            placeholder="Search by title..."
                            value={filters.search}
                            onChange={e => setFilters(p => ({ ...p, search: e.target.value }))}
                        />
                        <Search size={18} className="search-icon" />
                    </div>

                    <select className="form-control filter-select achievements-select" value={filters.status} onChange={e => setFilters(p => ({ ...p, status: e.target.value, page: 1 }))}>
                        <option value="">Verification Status</option>
                        {STATUSES.slice(1).map(s => <option key={s} value={s} style={{ textTransform: 'capitalize' }}>{s.toUpperCase()}</option>)}
                    </select>

                    <select className="form-control filter-select achievements-select" value={filters.category} onChange={e => setFilters(p => ({ ...p, category: e.target.value, page: 1 }))}>
                        <option value="">Category</option>
                        {CATEGORIES.slice(1).map(c => <option key={c} value={c}>{c}</option>)}
                    </select>

                    <div className="achievements-filter-actions">
                        <button type="submit" className="btn btn-primary filter-btn achievements-action-btn">
                            <Filter size={18} />
                            <span>Filter</span>
                        </button>

                        <button type="button" className="btn btn-ghost filter-reset-btn achievements-action-btn achievements-reset-btn" onClick={() => setFilters({ status: '', category: '', search: '', page: 1 })}>
                            Reset
                        </button>
                    </div>
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
                            <h3 style={{ fontWeight: 900, fontSize: '1.5rem', marginBottom: '0.75rem' }}>No Achievements Found</h3>
                            <p style={{ color: 'var(--text-muted)', fontWeight: 600, maxWidth: '450px', margin: '0 auto 2.5rem auto' }}>You haven't added any achievements yet.</p>
                            <Link to="/achievements/upload" className="btn btn-primary" style={{ padding: '0.8rem 2.5rem', fontWeight: 900 }}>
                                Add Your First Achievement
                            </Link>
                        </div>
                    ) : (
                        <>
                            <table className="table" style={{ width: '100%', borderCollapse: 'collapse' }}>
                                <thead>
                                    <tr style={{ borderBottom: '2px solid var(--border-primary)', background: 'var(--slate-50)' }}>
                                        <th style={{ padding: '1.25rem 2rem', textAlign: 'left', fontWeight: 800, textTransform: 'uppercase', fontSize: '0.75rem', color: 'var(--text-muted)', letterSpacing: '0.05em' }}>Achievement Title</th>
                                        <th style={{ padding: '1.25rem 2rem', textAlign: 'left', fontWeight: 800, textTransform: 'uppercase', fontSize: '0.75rem', color: 'var(--text-muted)', letterSpacing: '0.05em' }}>Category</th>
                                        <th style={{ padding: '1.25rem 2rem', textAlign: 'left', fontWeight: 800, textTransform: 'uppercase', fontSize: '0.75rem', color: 'var(--text-muted)', letterSpacing: '0.05em' }}>Level</th>
                                        <th style={{ padding: '1.25rem 2rem', textAlign: 'left', fontWeight: 800, textTransform: 'uppercase', fontSize: '0.75rem', color: 'var(--text-muted)', letterSpacing: '0.05em' }}>Date</th>
                                        <th style={{ padding: '1.25rem 2rem', textAlign: 'left', fontWeight: 800, textTransform: 'uppercase', fontSize: '0.75rem', color: 'var(--text-muted)', letterSpacing: '0.05em' }}>Status</th>
                                        <th style={{ padding: '1.25rem 2rem', textAlign: 'left', fontWeight: 800, textTransform: 'uppercase', fontSize: '0.75rem', color: 'var(--text-muted)', letterSpacing: '0.05em' }}>Points</th>
                                        <th style={{ padding: '1.25rem 2rem', textAlign: 'right', fontWeight: 800, textTransform: 'uppercase', fontSize: '0.75rem', color: 'var(--text-muted)', letterSpacing: '0.05em' }}>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {achievements.map((a) => (
                                        <tr key={a._id} style={{ borderBottom: '1px solid var(--border-primary)', transition: 'background 0.2s ease' }} className="hover-slate">
                                            <td style={{ padding: '1.25rem 2rem' }}>
                                                <div style={{ fontWeight: 800, color: 'var(--text-primary)', fontSize: '0.95rem' }}>{a.title}</div>
                                                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600, marginTop: '2px' }}>{a.institution || 'Achievement Record'}</div>
                                            </td>
                                            <td style={{ padding: '1.25rem 2rem' }}><span className="badge badge-primary" style={{ fontWeight: 800, textTransform: 'uppercase' }}>{a.category}</span></td>
                                            <td style={{ padding: '1.25rem 2rem' }}><span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-muted)' }}>{a.level}</span></td>
                                            <td style={{ padding: '1.25rem 2rem' }}><span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 }}>{format(new Date(a.date || a.createdAt), 'MMM dd, yyyy')}</span></td>
                                            <td style={{ padding: '1.25rem 2rem' }}><StatusBadge status={a.status} /></td>
                                            <td style={{ padding: '1.25rem 2rem' }}>
                                                {a.status === 'approved' ? (
                                                    <div style={{ fontWeight: 900, color: 'var(--brand-700)', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '1.1rem' }}>
                                                        <Star size={14} fill="var(--brand-600)" />
                                                        {a.points}
                                                    </div>
                                                ) : (
                                                    <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem', fontWeight: 700 }}>PENDING</span>
                                                )}
                                            </td>
                                            <td style={{ padding: '1.25rem 2rem', textAlign: 'right' }}>
                                                <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                                                    {a.status !== 'approved' && (
                                                        <Link to={`/achievements/edit/${a._id}`} className="btn btn-ghost btn-icon" style={{ borderRadius: '10px' }}>
                                                            <Pencil size={18} />
                                                        </Link>
                                                    )}
                                                    <button className="btn btn-ghost btn-icon" style={{ borderRadius: '10px' }} onClick={() => setSelected(a)}>
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
                                        Showing <span style={{ color: 'var(--text-primary)' }}>{achievements.length}</span> of <span style={{ color: 'var(--text-primary)' }}>{total}</span> achievements
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

            {/* Achievement Detail Modal */}
            {selected && (
                <div className="modal-overlay animate-fade-in" style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'rgba(15, 23, 42, 0.5)',
                    backdropFilter: 'blur(4px)',
                    zIndex: 9999,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '1.5rem',
                    height: '100vh',
                    width: '100vw'
                }}>
                    <div className="modal animate-scale-in" style={{ padding: 0, overflow: 'hidden', margin: '0' }}>
                        <div className="modal-header" style={{ alignItems: 'flex-start', padding: '1.5rem 1.5rem 1.25rem' }}>
                            <div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', opacity: 0.8, marginBottom: '0.5rem' }}>
                                    <Trophy size={14} />
                                    <span style={{ fontSize: '0.65rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Achievement Record</span>
                                </div>
                                <h3 style={{ margin: 0, fontSize: '1.4rem', fontWeight: 900, letterSpacing: '-0.02em', lineHeight: 1.2 }}>{selected.title}</h3>
                                <div style={{ marginTop: '1rem', display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                                    <span style={{ background: 'rgba(255,255,255,0.15)', padding: '0.3rem 0.6rem', borderRadius: '8px', fontSize: '0.7rem', fontWeight: 800 }}>{selected.category}</span>
                                    <span style={{ background: 'rgba(255,255,255,0.15)', padding: '0.3rem 0.6rem', borderRadius: '8px', fontSize: '0.7rem', fontWeight: 800 }}>{selected.level}</span>
                                    <span style={{
                                        background: selected.status === 'approved' ? 'rgba(34, 197, 94, 0.2)' : selected.status === 'rejected' ? 'rgba(239, 68, 68, 0.2)' : 'rgba(245, 158, 11, 0.2)',
                                        color: selected.status === 'approved' ? '#86efac' : selected.status === 'rejected' ? '#fca5a5' : '#fcd34d',
                                        padding: '0.3rem 0.6rem',
                                        borderRadius: '8px',
                                        fontSize: '0.7rem',
                                        fontWeight: 900,
                                        textTransform: 'uppercase'
                                    }}>{selected.status}</span>
                                </div>
                            </div>
                            <button className="btn btn-ghost" onClick={() => setSelected(null)} style={{ color: '#ef4444', padding: '0.25rem' }}>
                                <X size={20} strokeWidth={3} />
                            </button>
                        </div>

                        <div className="modal-body" style={{ maxHeight: '65vh', overflowY: 'auto', padding: '1.5rem' }}>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
                                <div style={{ background: 'var(--slate-50)', padding: '1rem', borderRadius: '12px', border: '1px solid var(--border-primary)' }}>
                                    <div style={{ fontSize: '0.6rem', fontWeight: 900, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.25rem', letterSpacing: '0.05em' }}>Points Awarded</div>
                                    <div style={{ fontSize: '1.1rem', fontWeight: 900, color: 'var(--brand-700)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                        <Star size={16} fill="var(--brand-600)" />
                                        {selected.points || 0}
                                    </div>
                                </div>
                                <div style={{ background: 'var(--slate-50)', padding: '1rem', borderRadius: '12px', border: '1px solid var(--border-primary)' }}>
                                    <div style={{ fontSize: '0.6rem', fontWeight: 900, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.25rem', letterSpacing: '0.05em' }}>Event Date</div>
                                    <div style={{ fontSize: '0.9rem', fontWeight: 800, color: 'var(--text-primary)' }}>{format(new Date(selected.date || selected.createdAt), 'MMM dd, yyyy')}</div>
                                </div>
                            </div>

                            <div style={{ marginBottom: '1.5rem' }}>
                                <div style={{ fontSize: '0.65rem', fontWeight: 900, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.75rem', letterSpacing: '0.1em', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <div style={{ width: 16, height: 2, background: 'var(--brand-500)' }}></div>
                                    Description
                                </div>
                                <div style={{ background: 'white', border: '1px solid var(--border-primary)', padding: '1rem', borderRadius: '12px', fontSize: '0.85rem', lineHeight: 1.5, color: 'var(--text-secondary)', fontWeight: 500 }}>
                                    {selected.description || "No description provided."}
                                </div>
                            </div>

                            <div style={{ marginBottom: '0.5rem' }}>
                                <div style={{ fontSize: '0.65rem', fontWeight: 900, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.75rem', letterSpacing: '0.1em', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <div style={{ width: 16, height: 2, background: 'var(--brand-500)' }}></div>
                                    Proof Documents
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                    {(() => {
                                        const fileUrl = selected.certificateUrl || (selected.proofFiles?.length > 0 ? selected.proofFiles[0].url : null);
                                        if (fileUrl) {
                                            return (
                                                <a href={fileUrl.startsWith('http') ? fileUrl : `${STATIC_BASE_URL}${fileUrl}`} target="_blank" rel="noreferrer"
                                                    className="proof-link-card"
                                                    style={{
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        gap: '1rem',
                                                        padding: '1rem',
                                                        background: 'var(--primary-50)',
                                                        borderRadius: '12px',
                                                        border: '1px solid var(--primary-100)',
                                                        textDecoration: 'none',
                                                    }}
                                                >
                                                    <div style={{ width: 36, height: 36, background: 'white', color: 'var(--brand-700)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: 'var(--shadow-xs)' }}>
                                                        <Trophy size={16} strokeWidth={2.5} />
                                                    </div>
                                                    <div style={{ flex: 1 }}>
                                                        <div style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--text-primary)' }}>Certificate File</div>
                                                        <div style={{ fontSize: '0.65rem', color: 'var(--brand-600)', fontWeight: 800, textTransform: 'uppercase', marginTop: '2px' }}>Click to view original</div>
                                                    </div>
                                                    <ChevronRight size={16} className="text-brand" strokeWidth={3} />
                                                </a>
                                            );
                                        }
                                        return (
                                            <div style={{ textAlign: 'center', padding: '1.5rem', background: 'var(--slate-50)', borderRadius: '12px', border: '1px dashed var(--border-primary)' }}>
                                                <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 700 }}>No proof files available for this record.</p>
                                            </div>
                                        );
                                    })()}
                                </div>
                            </div>
                        </div>

                        {selected.status !== 'approved' && (
                            <div style={{ padding: '1rem 1.5rem', background: 'var(--slate-50)', borderTop: '1px solid var(--border-primary)', display: 'flex', justifyContent: 'flex-end' }}>
                                <Link to={`/achievements/edit/${selected._id}`} className="btn btn-primary btn-sm" style={{ fontWeight: 800, padding: '0.5rem 1.5rem' }}>
                                    Edit Achievement
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default MyAchievementsPage;
