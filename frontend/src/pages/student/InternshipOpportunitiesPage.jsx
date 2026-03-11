import { useState, useEffect } from 'react';
import { internshipPostingAPI } from '../../services/api';
import { Search, Building2, MapPin, Briefcase, ExternalLink, Calendar, Info, Clock, CheckCircle2 } from 'lucide-react';
import toast from 'react-hot-toast';

const InternshipOpportunitiesPage = () => {
    const [postings, setPostings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [selectedPosting, setSelectedPosting] = useState(null);

    const loadPostings = async () => {
        setLoading(true);
        try {
            const res = await internshipPostingAPI.getAll({ search });
            setPostings(res.data.data);
        } catch {
            toast.error('Failed to load internship opportunities');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const handler = setTimeout(() => {
            loadPostings();
        }, 300);
        return () => clearTimeout(handler);
    }, [search]);

    return (
        <div className="animate-fade-in">
            <div className="page-header" style={{ marginBottom: '2.5rem' }}>
                <h2 className="heading-display">Institutional Placement Registry</h2>
                <p className="page-subtitle">Verified professional opportunities synchronized via SOEIT faculty and corporate corridors.</p>
            </div>

            <div className="card" style={{ marginBottom: '2.5rem', border: '1px solid var(--border-primary)' }}>
                <div className="card-body" style={{ padding: '1rem' }}>
                    <div className="search-wrapper">
                        <input
                            className="form-control"
                            placeholder="Filter by Nomenclature, Designation, or Geographic Node..."
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                        />
                        <Search size={18} className="search-icon" />
                    </div>
                </div>
            </div>

            {loading ? (
                <div className="grid-res grid-res-3">
                    {[...Array(3)].map((_, i) => <div key={i} className="skeleton" style={{ height: 280, borderRadius: '20px' }} />)}
                </div>
            ) : postings.length === 0 ? (
                <div className="card" style={{ padding: '6rem 2rem', textAlign: 'center' }}>
                    <Briefcase size={64} style={{ opacity: 0.1, margin: '0 auto 1.5rem auto' }} />
                    <h3 style={{ fontWeight: 800 }}>Dormant Registry</h3>
                    <p style={{ color: 'var(--text-muted)' }}>Check the chronology later for new professional broadcast signals.</p>
                </div>
            ) : (
                <div className="grid-res grid-res-3" style={{ gap: '1.5rem' }}>
                    {postings.map(post => (
                        <div key={post.id} className="card opportunity-card animate-scale-in" style={{ padding: '0', border: '1px solid var(--border-primary)', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                            <div style={{ padding: '1.5rem', flex: 1 }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
                                    <div style={{ width: 48, height: 48, background: 'var(--primary-50)', color: 'var(--brand-700)', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <Building2 size={24} />
                                    </div>
                                    <div className="badge badge-success" style={{ height: 'fit-content', fontSize: '0.65rem' }}>ACTIVE</div>
                                </div>

                                <h4 style={{ fontSize: '1.15rem', fontWeight: 800, margin: '0 0 0.25rem 0', color: 'var(--text-primary)' }}>{post.role}</h4>
                                <p style={{ fontSize: '0.95rem', color: 'var(--brand-700)', fontWeight: 700, marginBottom: '1rem' }}>{post.company_name}</p>

                                <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '0.75rem', marginBottom: '1.5rem' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                                        <MapPin size={14} />
                                        <span>{post.location || 'Remote'}</span>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                                        <Clock size={14} />
                                        <span>Deadline Resolution: {post.deadline || 'Not specified'}</span>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                                        <Briefcase size={14} />
                                        <span>Compensation Dynamics: {post.stipend || 'Unpaid/Discussable'}</span>
                                    </div>
                                </div>
                            </div>

                            <div style={{ padding: '1.25rem', borderTop: '1px solid var(--border-primary)', display: 'flex', gap: '0.75rem' }}>
                                <button
                                    className="btn btn-ghost w-full"
                                    style={{ fontSize: '0.85rem', fontWeight: 800 }}
                                    onClick={() => setSelectedPosting(post)}
                                >
                                    Examine Specification
                                </button>
                                {post.apply_link && (
                                    <a
                                        href={post.apply_link}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="btn btn-primary w-full"
                                        style={{ fontSize: '0.85rem', fontWeight: 800, textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
                                    >
                                        Initiate Application Protocol
                                        <ExternalLink size={14} />
                                    </a>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Opportunity Detail Modal */}
            {selectedPosting && (
                <div className="modal-overlay animate-fade-in" style={{ position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.4)', backdropFilter: 'blur(8px)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.5rem' }}>
                    <div className="card animate-scale-in" style={{ width: '100%', maxWidth: '700px', padding: 0, overflow: 'hidden' }}>
                        <div style={{ background: 'var(--brand-700)', padding: '2rem', color: 'white' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                <div>
                                    <h3 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 900, color: 'white' }}>{selectedPosting.role}</h3>
                                    <p style={{ margin: '0.5rem 0 0 0', opacity: 0.9, fontWeight: 700 }}>{selectedPosting.company_name}</p>
                                </div>
                                <div style={{ textAlign: 'right' }}>
                                    <div className="badge" style={{ background: 'rgba(255,255,255,0.2)', color: 'white', border: 'none' }}>Posted by {selectedPosting.creator?.name}</div>
                                    <div style={{ fontSize: '0.7rem', opacity: 0.7, marginTop: '0.5rem', fontWeight: 700 }}>VERIFIED OFFICIAL</div>
                                </div>
                            </div>
                        </div>

                        <div style={{ padding: '2rem', maxHeight: '60vh', overflowY: 'auto' }}>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem', marginBottom: '2rem' }}>
                                <div>
                                    <label style={{ fontSize: '0.7rem', fontWeight: 900, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Location</label>
                                    <div style={{ fontWeight: 800 }}>{selectedPosting.location || 'Remote'}</div>
                                </div>
                                <div>
                                    <label style={{ fontSize: '0.7rem', fontWeight: 900, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Stipend</label>
                                    <div style={{ fontWeight: 800 }}>{selectedPosting.stipend || 'Not specified'}</div>
                                </div>
                                <div>
                                    <label style={{ fontSize: '0.7rem', fontWeight: 900, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Deadline Resolution</label>
                                    <div style={{ fontWeight: 800 }}>{selectedPosting.deadline || 'Rolling basis'}</div>
                                </div>
                            </div>

                            <div style={{ marginBottom: '2rem' }}>
                                <h5 style={{ fontWeight: 900, color: 'var(--text-primary)', marginBottom: '0.75rem' }}>Opportunity Specification</h5>
                                <div style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', lineHeight: 1.6, whiteSpace: 'pre-line' }}>
                                    {selectedPosting.description || 'No detailed description provided.'}
                                </div>
                            </div>

                            {selectedPosting.requirements && (
                                <div style={{ marginBottom: '2rem' }}>
                                    <h5 style={{ fontWeight: 900, color: 'var(--text-primary)', marginBottom: '0.75rem' }}>Technical Prerequisites</h5>
                                    <div style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', lineHeight: 1.6, whiteSpace: 'pre-line' }}>
                                        {selectedPosting.requirements}
                                    </div>
                                </div>
                            )}
                        </div>

                        <div style={{ padding: '1.5rem 2rem', borderTop: '1px solid var(--border-primary)', display: 'flex', gap: '1rem', background: 'var(--slate-50)' }}>
                            <button className="btn btn-ghost w-full" style={{ padding: '1rem', fontWeight: 800 }} onClick={() => setSelectedPosting(null)}>Close View</button>
                            {selectedPosting.apply_link && (
                                <a
                                    href={selectedPosting.apply_link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="btn btn-primary w-full"
                                    style={{ padding: '1rem', fontWeight: 800, textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
                                >
                                    Proceed to Application Portal
                                    <ExternalLink size={18} />
                                </a>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default InternshipOpportunitiesPage;
