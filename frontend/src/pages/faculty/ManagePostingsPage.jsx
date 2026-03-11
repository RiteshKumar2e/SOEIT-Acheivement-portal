import { useState, useEffect } from 'react';
import { internshipPostingAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import {
    Plus, Trash2, Edit2, Search, Building2,
    MapPin, Calendar, ExternalLink, Users,
    X, Briefcase, Info, AlertCircle
} from 'lucide-react';
import toast from 'react-hot-toast';

const ManagePostingsPage = () => {
    const { user } = useAuth();
    const [postings, setPostings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [formData, setFormData] = useState({
        companyName: '',
        role: '',
        location: '',
        stipend: '',
        deadline: '',
        description: '',
        requirements: '',
        applyLink: ''
    });

    const loadPostings = async () => {
        setLoading(true);
        try {
            const res = await internshipPostingAPI.getAll({ search });
            setPostings(res.data.data);
        } catch {
            toast.error('Failed to load institutional registry');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const handler = setTimeout(loadPostings, 300);
        return () => clearTimeout(handler);
    }, [search]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingId) {
                await internshipPostingAPI.update(editingId, formData);
                toast.success('Opportunity updated successfully');
            } else {
                await internshipPostingAPI.create(formData);
                toast.success('Internship opportunity broadcasted');
            }
            setShowModal(false);
            resetForm();
            loadPostings();
        } catch (err) {
            toast.error(err.response?.data?.message || 'Operation failed');
        }
    };

    const handleEdit = (post) => {
        setEditingId(post.id);
        setFormData({
            companyName: post.company_name,
            role: post.role,
            location: post.location || '',
            stipend: post.stipend || '',
            deadline: post.deadline || '',
            description: post.description || '',
            requirements: post.requirements || '',
            applyLink: post.apply_link || ''
        });
        setShowModal(true);
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Determine extinction: Permanently purge this opportunity from the registry?')) return;
        try {
            await internshipPostingAPI.delete(id);
            toast.success('Resource purged successfully');
            loadPostings();
        } catch {
            toast.error('Deletion protocol failed');
        }
    };

    const resetForm = () => {
        setEditingId(null);
        setFormData({
            companyName: '',
            role: '',
            location: '',
            stipend: '',
            deadline: '',
            description: '',
            requirements: '',
            applyLink: ''
        });
    };

    return (
        <div className="animate-fade-in">
            <div className="page-header" style={{ marginBottom: '2.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                <div>
                    <h2 className="heading-display">Placement Command Suite</h2>
                    <p className="page-subtitle">Strategic management of institutional internship opportunities and broadcast protocols.</p>
                </div>
                <button className="btn btn-primary" onClick={() => { resetForm(); setShowModal(true); }}>
                    <Plus size={18} />
                    <span>Add New Internship</span>
                </button>
            </div>

            <div className="card" style={{ marginBottom: '2.5rem', border: '1px solid var(--border-primary)' }}>
                <div className="card-body" style={{ padding: '1.25rem', display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
                    <div className="search-wrapper" style={{ flex: 1 }}>
                        <input
                            className="form-control"
                            placeholder="Identify opportunities by nomenclature or sector..."
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                        />
                        <Search size={18} className="search-icon" />
                    </div>
                </div>
            </div>

            <div className="card" style={{ border: '1px solid var(--border-primary)', overflow: 'hidden' }}>
                <div className="table-responsive">
                    <table className="table">
                        <thead>
                            <tr>
                                <th style={{ paddingLeft: '2rem' }}>Opportunity Detail</th>
                                <th>Institutional Origin</th>
                                <th>Timeline & Compensation</th>
                                <th style={{ textAlign: 'right', paddingRight: '2rem' }}>Operational Control</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                [...Array(5)].map((_, i) => (
                                    <tr key={i}><td colSpan="4" style={{ padding: '1rem 2rem' }}><div className="skeleton" style={{ height: 60, borderRadius: '12px' }} /></td></tr>
                                ))
                            ) : postings.length === 0 ? (
                                <tr>
                                    <td colSpan="4" style={{ padding: '6rem 2rem', textAlign: 'center' }}>
                                        <Briefcase size={48} style={{ opacity: 0.1, margin: '0 auto 1.5rem auto' }} />
                                        <h4 style={{ fontWeight: 800 }}>No opportunities registered</h4>
                                        <p style={{ color: 'var(--text-muted)' }}>Use the "Initiate New Opportunity" command to populate the scholarship registry.</p>
                                    </td>
                                </tr>
                            ) : (
                                postings.map(post => (
                                    <tr key={post.id} className="hover-row">
                                        <td style={{ paddingLeft: '2rem' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                                <div style={{ width: 44, height: 44, background: 'var(--primary-100)', color: 'var(--brand-700)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                    <Building2 size={20} />
                                                </div>
                                                <div>
                                                    <div style={{ fontWeight: 800, fontSize: '0.95rem' }}>{post.role}</div>
                                                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 800 }}>{post.company_name} • {post.location || 'Remote'}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                <div className="avatar avatar-xs" style={{ background: 'var(--slate-100)', color: 'var(--text-primary)', fontWeight: 800 }}>{post.creator?.name?.charAt(0)}</div>
                                                <div>
                                                    <div style={{ fontSize: '0.85rem', fontWeight: 800 }}>{post.creator?.name}</div>
                                                    <div className="badge badge-brand" style={{ fontSize: '0.6rem', padding: '0.1rem 0.4rem' }}>{post.creator?.role?.toUpperCase()}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td>
                                            <div style={{ fontSize: '0.85rem', fontWeight: 700 }}>Deadline: {post.deadline || 'None'}</div>
                                            <div style={{ fontSize: '0.75rem', color: 'var(--success-600)', fontWeight: 800 }}>{post.stipend || 'Unpaid'}</div>
                                        </td>
                                        <td style={{ textAlign: 'right', paddingRight: '2rem' }}>
                                            {(user.id === post.created_by || user.role === 'admin') && (
                                                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
                                                    <button className="btn btn-ghost btn-sm" onClick={() => handleEdit(post)}><Edit2 size={18} /></button>
                                                    <button className="btn btn-ghost btn-sm text-danger" onClick={() => handleDelete(post.id)}><Trash2 size={18} /></button>
                                                </div>
                                            )}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Post/Edit Modal */}
            {showModal && (
                <div className="modal-overlay animate-fade-in" style={{ position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.4)', backdropFilter: 'blur(8px)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.5rem' }}>
                    <div className="card animate-scale-in" style={{ width: '100%', maxWidth: '700px', padding: 0, maxHeight: '95vh', overflowY: 'auto', borderRadius: '24px', border: 'none', boxShadow: 'var(--shadow-2xl)' }}>
                        <div style={{ background: 'linear-gradient(135deg, var(--brand-700), var(--brand-900))', padding: '2rem', color: 'white' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div>
                                    <h3 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 900, color: 'white' }}>{editingId ? 'Edit Opportunity' : 'Broadcast Placement'}</h3>
                                    <p style={{ margin: '0.5rem 0 0 0', opacity: 0.9, fontWeight: 600, fontSize: '0.85rem' }}>Define the parameters for institutional scholarship outreach.</p>
                                </div>
                                <button onClick={() => setShowModal(false)} className="btn btn-ghost" style={{ color: 'white' }}><X size={24} /></button>
                            </div>
                        </div>

                        <form onSubmit={handleSubmit} style={{ padding: '2.5rem' }}>
                            <div className="grid-res grid-res-2" style={{ gap: '1.5rem', marginBottom: '1.5rem' }}>
                                <div className="form-group">
                                    <label className="form-label" style={{ fontWeight: 800, fontSize: '0.75rem', letterSpacing: '0.05em' }}>COMPANY NOMENCLATURE</label>
                                    <input className="form-control" required placeholder="e.g. NVIDIA Corporation" value={formData.companyName} onChange={e => setFormData({ ...formData, companyName: e.target.value })} />
                                </div>
                                <div className="form-group">
                                    <label className="form-label" style={{ fontWeight: 800, fontSize: '0.75rem', letterSpacing: '0.05em' }}>DESIGNATED ROLE</label>
                                    <input className="form-control" required placeholder="e.g. AI Research Engineer" value={formData.role} onChange={e => setFormData({ ...formData, role: e.target.value })} />
                                </div>
                            </div>

                            <div className="grid-res grid-res-3" style={{ gap: '1.5rem', marginBottom: '1.5rem' }}>
                                <div className="form-group">
                                    <label className="form-label" style={{ fontWeight: 800, fontSize: '0.75rem', letterSpacing: '0.05em' }}>INTERNSHIP MODE</label>
                                    <select
                                        className="form-control"
                                        required
                                        value={formData.location.includes('Remote') ? 'Remote' : (formData.location.includes('Hybrid') ? 'Hybrid' : 'On-site')}
                                        onChange={e => {
                                            const mode = e.target.value;
                                            if (mode === 'Remote' || mode === 'Hybrid') {
                                                setFormData({ ...formData, location: mode });
                                            } else {
                                                setFormData({ ...formData, location: '' });
                                            }
                                        }}
                                    >
                                        <option value="On-site">Institutional On-site</option>
                                        <option value="Remote">Remote Operations</option>
                                        <option value="Hybrid">Hybrid Synergy</option>
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label className="form-label" style={{ fontWeight: 800, fontSize: '0.75rem', letterSpacing: '0.05em' }}>GEOGRAPHIC RESOLUTION</label>
                                    <input
                                        className="form-control"
                                        placeholder="e.g. Global HQ / Remote"
                                        disabled={formData.location === 'Remote'}
                                        value={formData.location === 'Remote' || formData.location === 'Hybrid' ? '' : formData.location}
                                        onChange={e => setFormData({ ...formData, location: e.target.value })}
                                    />
                                </div>
                                <div className="form-group">
                                    <label className="form-label" style={{ fontWeight: 800, fontSize: '0.75rem', letterSpacing: '0.05em' }}>STIPEND DYNAMICS</label>
                                    <input className="form-control" placeholder="e.g. ₹25K/mo or Unpaid" value={formData.stipend} onChange={e => setFormData({ ...formData, stipend: e.target.value })} />
                                </div>
                            </div>

                            <div className="grid-res grid-res-2" style={{ gap: '1.5rem', marginBottom: '1.5rem' }}>
                                <div className="form-group">
                                    <label className="form-label" style={{ fontWeight: 800, fontSize: '0.75rem', letterSpacing: '0.05em' }}>DEADLINE RESOLUTION</label>
                                    <input type="date" className="form-control" value={formData.deadline} onChange={e => setFormData({ ...formData, deadline: e.target.value })} />
                                </div>
                                <div className="form-group">
                                    <label className="form-label" style={{ fontWeight: 800, fontSize: '0.75rem', letterSpacing: '0.05em' }}>EXTERNAL PORTAL LINK</label>
                                    <input type="url" className="form-control" placeholder="Direct URL to portal or application form" value={formData.applyLink} onChange={e => setFormData({ ...formData, applyLink: e.target.value })} />
                                </div>
                            </div>

                            <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                                <label className="form-label" style={{ fontWeight: 800, fontSize: '0.75rem', letterSpacing: '0.05em' }}>OPPORTUNITY SPECIFICATION</label>
                                <textarea className="form-control" rows={4} placeholder="Document the core responsibilities and vision..." value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} />
                            </div>

                            <div className="form-group" style={{ marginBottom: '2.5rem' }}>
                                <label className="form-label" style={{ fontWeight: 800, fontSize: '0.75rem', letterSpacing: '0.05em' }}>TECHNICAL PREREQUISITES</label>
                                <textarea className="form-control" rows={3} placeholder="Skills, qualifications, and academic requirements..." value={formData.requirements} onChange={e => setFormData({ ...formData, requirements: e.target.value })} />
                            </div>

                            <div style={{ display: 'flex', gap: '1.25rem' }}>
                                <button type="button" className="btn btn-ghost w-full" style={{ padding: '1rem', fontWeight: 800 }} onClick={() => setShowModal(false)}>Terminate Protocol</button>
                                <button type="submit" className="btn btn-primary w-full" style={{ padding: '1rem', fontWeight: 800 }}>Execute Broadcast</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ManagePostingsPage;
