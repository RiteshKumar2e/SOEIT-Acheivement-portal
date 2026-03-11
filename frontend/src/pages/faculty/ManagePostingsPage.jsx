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
            toast.error('Failed to load internships');
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
                toast.success('Internship added successfully');
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
        if (!window.confirm('Are you sure you want to delete this internship?')) return;
        try {
            await internshipPostingAPI.delete(id);
            toast.success('Internship deleted successfully');
            loadPostings();
        } catch {
            toast.error('Failed to delete internship');
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
            <div className="page-header" style={{ marginBottom: '2.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                <div style={{ minWidth: '200px' }}>
                    <h2 className="heading-display">Internship Postings</h2>
                    <p className="page-subtitle">Add and manage internship opportunities for students.</p>
                </div>
                <button className="btn btn-primary" onClick={() => { resetForm(); setShowModal(true); }} style={{ width: 'auto' }}>
                    <Plus size={18} />
                    <span>Add New Internship</span>
                </button>
            </div>

            <div className="card" style={{ marginBottom: '2.5rem', border: '1px solid var(--border-primary)' }}>
                <div className="card-body" style={{ padding: '1.25rem', display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
                    <div className="search-wrapper" style={{ flex: 1 }}>
                        <input
                            className="form-control"
                            placeholder="Search by company or role..."
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                        />
                        <Search size={18} className="search-icon" />
                    </div>
                </div>
            </div>

            <div className="card" style={{ border: '1px solid var(--border-primary)', overflow: 'hidden' }}>
                {/* Desktop View */}
                <div className="table-container display-desktop">
                    <table className="table">
                        <thead>
                            <tr>
                                <th>Internship Details</th>
                                <th>Posted By</th>
                                <th>Deadline & Pay</th>
                                <th style={{ textAlign: 'right', paddingRight: '2rem' }}>Actions</th>
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
                                        <h4 style={{ fontWeight: 800 }}>No internships found</h4>
                                        <p style={{ color: 'var(--text-muted)' }}>Click the "Add New Internship" button to post your first opportunity.</p>
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

                {/* Mobile View */}
                <div className="display-mobile" style={{ flexDirection: 'column', padding: '1rem', gap: '1rem' }}>
                    {loading ? (
                        [...Array(3)].map((_, i) => (
                            <div key={i} className="skeleton" style={{ height: 160, borderRadius: '16px' }} />
                        ))
                    ) : postings.length === 0 ? (
                        <div style={{ padding: '3rem 1rem', textAlign: 'center' }}>
                            <Briefcase size={40} style={{ opacity: 0.1, marginBottom: '1rem' }} />
                            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>No internship opportunities</p>
                        </div>
                    ) : (
                        postings.map(post => (
                            <div key={post.id} className="card" style={{ padding: '1.25rem', border: '1px solid var(--border-primary)', borderRadius: '16px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                                    <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                                        <div style={{ width: 40, height: 40, background: 'var(--primary-100)', color: 'var(--brand-700)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                            <Building2 size={20} />
                                        </div>
                                        <div>
                                            <div style={{ fontWeight: 800, fontSize: '0.9rem' }}>{post.role}</div>
                                            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 700 }}>{post.company_name}</div>
                                        </div>
                                    </div>
                                    {(user.id === post.created_by || user.role === 'admin') && (
                                        <div style={{ display: 'flex', gap: '0.25rem' }}>
                                            <button className="btn btn-ghost btn-xs" onClick={() => handleEdit(post)} style={{ padding: '0.4rem' }}><Edit2 size={16} /></button>
                                            <button className="btn btn-ghost btn-xs text-danger" onClick={() => handleDelete(post.id)} style={{ padding: '0.4rem' }}><Trash2 size={16} /></button>
                                        </div>
                                    )}
                                </div>

                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '1rem' }}>
                                    <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                                        <MapPin size={12} /> {post.location || 'Remote'}
                                    </div>
                                    <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--success-600)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                                        <Info size={12} /> {post.stipend || 'Unpaid'}
                                    </div>
                                    <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--error-500)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                                        <Calendar size={12} /> {post.deadline || 'No Deadline'}
                                    </div>
                                </div>

                                <div style={{ borderTop: '1px solid var(--slate-100)', paddingTop: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <div className="avatar avatar-xs" style={{ background: 'var(--slate-100)', color: 'var(--text-primary)', fontWeight: 800, width: 24, height: 24, fontSize: '0.6rem' }}>{post.creator?.name?.charAt(0)}</div>
                                    <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Posted by: <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{post.creator?.name}</span></div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* Post/Edit Modal */}
            {showModal && (
                <div className="modal-overlay animate-fade-in" style={{ position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.4)', backdropFilter: 'blur(8px)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.5rem' }}>
                    <div className="card animate-scale-in" style={{ width: '100%', maxWidth: '700px', padding: 0, maxHeight: '95vh', overflowY: 'auto', borderRadius: '24px', border: 'none', boxShadow: 'var(--shadow-2xl)' }}>
                        <div style={{ background: 'linear-gradient(135deg, var(--brand-700), var(--brand-900))', padding: '2rem', color: 'white' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div>
                                    <h3 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 900, color: 'white' }}>{editingId ? 'Edit Internship' : 'Add Internship'}</h3>
                                    <p style={{ margin: '0.5rem 0 0 0', opacity: 0.9, fontWeight: 600, fontSize: '0.85rem' }}>Enter the internship details for the students.</p>
                                </div>
                                <button onClick={() => setShowModal(false)} className="btn btn-ghost" style={{ color: 'white' }}><X size={24} /></button>
                            </div>
                        </div>

                        <form onSubmit={handleSubmit} style={{ padding: '2.5rem' }}>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginBottom: '1.5rem' }}>
                                <div className="form-group">
                                    <label className="form-label" style={{ fontWeight: 800, fontSize: '0.75rem', letterSpacing: '0.05em' }}>COMPANY NAME</label>
                                    <input className="form-control" required placeholder="e.g. Google, TCS, etc." value={formData.companyName} onChange={e => setFormData({ ...formData, companyName: e.target.value })} />
                                </div>
                                <div className="form-group">
                                    <label className="form-label" style={{ fontWeight: 800, fontSize: '0.75rem', letterSpacing: '0.05em' }}>ROLE</label>
                                    <input className="form-control" required placeholder="e.g. Web Developer" value={formData.role} onChange={e => setFormData({ ...formData, role: e.target.value })} />
                                </div>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginBottom: '1.5rem' }}>
                                <div className="form-group">
                                    <label className="form-label" style={{ fontWeight: 800, fontSize: '0.75rem', letterSpacing: '0.05em' }}>WORK MODE</label>
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
                                        <option value="On-site">Office / On-site</option>
                                        <option value="Remote">Remote (Work from Home)</option>
                                        <option value="Hybrid">Hybrid</option>
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label className="form-label" style={{ fontWeight: 800, fontSize: '0.75rem', letterSpacing: '0.05em' }}>LOCATION</label>
                                    <input
                                        className="form-control"
                                        placeholder="City name (e.g. Pune)"
                                        disabled={formData.location === 'Remote'}
                                        value={formData.location === 'Remote' || formData.location === 'Hybrid' ? '' : formData.location}
                                        onChange={e => setFormData({ ...formData, location: e.target.value })}
                                    />
                                </div>
                                <div className="form-group">
                                    <label className="form-label" style={{ fontWeight: 800, fontSize: '0.75rem', letterSpacing: '0.05em' }}>STIPEND (PER MONTH)</label>
                                    <input className="form-control" placeholder="e.g. ₹10,000" value={formData.stipend} onChange={e => setFormData({ ...formData, stipend: e.target.value })} />
                                </div>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginBottom: '1.5rem' }}>
                                <div className="form-group">
                                    <label className="form-label" style={{ fontWeight: 800, fontSize: '0.75rem', letterSpacing: '0.05em' }}>LAST DATE TO APPLY</label>
                                    <input type="date" className="form-control" value={formData.deadline} onChange={e => setFormData({ ...formData, deadline: e.target.value })} />
                                </div>
                                <div className="form-group">
                                    <label className="form-label" style={{ fontWeight: 800, fontSize: '0.75rem', letterSpacing: '0.05em' }}>APPLICATION LINK</label>
                                    <input type="url" className="form-control" placeholder="Paste the application URL here" value={formData.applyLink} onChange={e => setFormData({ ...formData, applyLink: e.target.value })} />
                                </div>
                            </div>

                            <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                                <label className="form-label" style={{ fontWeight: 800, fontSize: '0.75rem', letterSpacing: '0.05em' }}>DESCRIPTION</label>
                                <textarea className="form-control" rows={4} placeholder="What will the student do?" value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} />
                            </div>

                            <div className="form-group" style={{ marginBottom: '2.5rem' }}>
                                <label className="form-label" style={{ fontWeight: 800, fontSize: '0.75rem', letterSpacing: '0.05em' }}>REQUIREMENTS</label>
                                <textarea className="form-control" rows={3} placeholder="Skills or qualifications needed" value={formData.requirements} onChange={e => setFormData({ ...formData, requirements: e.target.value })} />
                            </div>

                            <div style={{ display: 'flex', gap: '1.25rem' }}>
                                <button type="button" className="btn btn-ghost w-full" style={{ padding: '1rem', fontWeight: 800 }} onClick={() => setShowModal(false)}>Cancel</button>
                                <button type="submit" className="btn btn-primary w-full" style={{ padding: '1rem', fontWeight: 800 }}>Save Internship</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ManagePostingsPage;
