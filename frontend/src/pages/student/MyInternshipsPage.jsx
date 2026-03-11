import { useState, useEffect } from 'react';
import { internshipAPI } from '../../services/api';
import { Plus, Trash2, Building2, ExternalLink, Calendar, MapPin, Briefcase, CheckCircle2, MoreVertical, Edit2 } from 'lucide-react';
import toast from 'react-hot-toast';

const MyInternshipsPage = () => {
    const [internships, setInternships] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [formData, setFormData] = useState({
        companyName: '',
        role: '',
        startDate: '',
        endDate: '',
        status: 'Ongoing',
        location: '',
        internshipType: 'Full-time',
        description: '',
        certificateUrl: ''
    });

    const loadInternships = async () => {
        try {
            const res = await internshipAPI.getMy();
            setInternships(res.data.data);
        } catch {
            toast.error('Failed to load internship records');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadInternships();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingId) {
                await internshipAPI.update(editingId, formData);
                toast.success('Internship record updated');
            } else {
                await internshipAPI.add(formData);
                toast.success('Internship record added successfully');
            }
            setShowModal(false);
            resetForm();
            loadInternships();
        } catch (err) {
            toast.error(err.response?.data?.message || 'Operation failed');
        }
    };

    const handleEdit = (internship) => {
        setEditingId(internship.id);
        setFormData({
            companyName: internship.company_name,
            role: internship.role,
            startDate: internship.start_date || '',
            endDate: internship.end_date || '',
            status: internship.status || 'Ongoing',
            location: internship.location || '',
            internshipType: internship.internship_type || 'Full-time',
            description: internship.description || '',
            certificateUrl: internship.certificate_url || ''
        });
        setShowModal(true);
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this internship record?')) return;
        try {
            await internshipAPI.delete(id);
            toast.success('Record deleted');
            loadInternships();
        } catch {
            toast.error('Delete operation failed');
        }
    };

    const resetForm = () => {
        setEditingId(null);
        setFormData({
            companyName: '',
            role: '',
            startDate: '',
            endDate: '',
            status: 'Ongoing',
            location: '',
            internshipType: 'Full-time',
            description: '',
            certificateUrl: ''
        });
    };

    return (
        <div className="animate-fade-in">
            <div className="page-header" style={{ marginBottom: '2.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                <div style={{ minWidth: '200px' }}>
                    <h2 className="heading-display">Internship Journey</h2>
                    <p className="page-subtitle">Document your professional experiences and industry exposure.</p>
                </div>
                <button className="btn btn-primary" onClick={() => { resetForm(); setShowModal(true); }} style={{ width: 'auto' }}>
                    <Plus size={18} />
                    <span>Add Internship</span>
                </button>
            </div>

            {loading ? (
                <div className="grid-res grid-res-2">
                    {[...Array(2)].map((_, i) => <div key={i} className="skeleton" style={{ height: 250, borderRadius: '20px' }} />)}
                </div>
            ) : internships.length === 0 ? (
                <div className="card" style={{ padding: '6rem 2rem', textAlign: 'center' }}>
                    <Briefcase size={64} style={{ opacity: 0.1, margin: '0 auto 1.5rem auto' }} />
                    <h3 style={{ fontWeight: 800 }}>No internships recorded</h3>
                    <p style={{ color: 'var(--text-muted)' }}>Share where you've been working and what you've learned.</p>
                </div>
            ) : (
                <div className="grid-res grid-res-2" style={{ gap: '1.5rem' }}>
                    {internships.map(internship => (
                        <div key={internship.id} className="card animate-scale-in" style={{ padding: '0', border: '1px solid var(--border-primary)', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                            <div style={{ padding: '1.5rem', flex: 1 }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
                                    <div style={{ width: 48, height: 48, background: 'var(--primary-50)', color: 'var(--brand-700)', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <Building2 size={24} />
                                    </div>
                                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                                        <button className="btn btn-ghost btn-sm" onClick={() => handleEdit(internship)} style={{ padding: '0.5rem' }}>
                                            <Edit2 size={16} />
                                        </button>
                                        <button className="btn btn-ghost btn-sm text-danger" onClick={() => handleDelete(internship.id)} style={{ padding: '0.5rem' }}>
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </div>

                                <div style={{ marginBottom: '1rem' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                                        <h4 style={{ fontSize: '1.25rem', fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>{internship.company_name}</h4>
                                        <span className={`badge ${internship.status === 'Completed' ? 'badge-success' : 'badge-primary'}`} style={{ fontSize: '0.65rem' }}>
                                            {internship.status.toUpperCase()}
                                        </span>
                                    </div>
                                    <p style={{ fontSize: '1rem', color: 'var(--brand-700)', fontWeight: 700, margin: 0 }}>{internship.role}</p>
                                </div>

                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                                        <Calendar size={14} />
                                        <span>{internship.start_date} {internship.end_date ? `- ${internship.end_date}` : '(Present)'}</span>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                                        <MapPin size={14} />
                                        <span>{internship.location || 'Not specified'}</span>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                                        <Briefcase size={14} />
                                        <span>{internship.internship_type || 'Full-time'}</span>
                                    </div>
                                </div>

                                {internship.description && (
                                    <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '1.5rem', lineBreak: 'anywhere' }}>
                                        {internship.description}
                                    </p>
                                )}
                            </div>

                            {internship.certificate_url && (
                                <a
                                    href={internship.certificate_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    style={{ padding: '1rem', background: 'var(--slate-50)', borderTop: '1px solid var(--border-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', color: 'var(--brand-700)', fontWeight: 800, fontSize: '0.85rem', textDecoration: 'none' }}
                                >
                                    <ExternalLink size={16} />
                                    VIEW COMPLETION CERTIFICATE
                                </a>
                            )}
                        </div>
                    ))}
                </div>
            )}

            {showModal && (
                <div className="modal-overlay animate-fade-in" style={{ position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.4)', backdropFilter: 'blur(8px)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.5rem' }}>
                    <div className="card animate-scale-in" style={{ width: '100%', maxWidth: '600px', padding: '2rem', maxHeight: '90vh', overflowY: 'auto' }}>
                        <h3 style={{ margin: '0 0 1.5rem 0', fontWeight: 900 }}>{editingId ? 'Update Internship' : 'New Internship Experience'}</h3>
                        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                                <div className="form-group">
                                    <label className="form-label" style={{ fontWeight: 800, fontSize: '0.75rem' }}>COMPANY NAME</label>
                                    <input
                                        className="form-control"
                                        placeholder="e.g. Google, Microsoft, Startup"
                                        required
                                        value={formData.companyName}
                                        onChange={e => setFormData({ ...formData, companyName: e.target.value })}
                                    />
                                </div>
                                <div className="form-group">
                                    <label className="form-label" style={{ fontWeight: 800, fontSize: '0.75rem' }}>ROLE / POSITION</label>
                                    <input
                                        className="form-control"
                                        placeholder="e.g. Web Developer Intern"
                                        required
                                        value={formData.role}
                                        onChange={e => setFormData({ ...formData, role: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                                <div className="form-group">
                                    <label className="form-label" style={{ fontWeight: 800, fontSize: '0.75rem' }}>START DATE</label>
                                    <input
                                        type="month"
                                        className="form-control"
                                        required
                                        value={formData.startDate}
                                        onChange={e => setFormData({ ...formData, startDate: e.target.value })}
                                    />
                                </div>
                                <div className="form-group">
                                    <label className="form-label" style={{ fontWeight: 800, fontSize: '0.75rem' }}>END DATE (OPTIONAL)</label>
                                    <input
                                        type="month"
                                        className="form-control"
                                        value={formData.endDate}
                                        onChange={e => setFormData({ ...formData, endDate: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                <div className="form-group">
                                    <label className="form-label" style={{ fontWeight: 800, fontSize: '0.75rem' }}>STATUS</label>
                                    <select
                                        className="form-control"
                                        value={formData.status}
                                        onChange={e => setFormData({ ...formData, status: e.target.value })}
                                    >
                                        <option value="Ongoing">Ongoing</option>
                                        <option value="Completed">Completed</option>
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label className="form-label" style={{ fontWeight: 800, fontSize: '0.75rem' }}>TYPE</label>
                                    <select
                                        className="form-control"
                                        value={formData.internshipType}
                                        onChange={e => setFormData({ ...formData, internshipType: e.target.value })}
                                    >
                                        <option value="Full-time">Full-time</option>
                                        <option value="Part-time">Part-time</option>
                                        <option value="Remote">Remote</option>
                                        <option value="Contract">Contract</option>
                                    </select>
                                </div>
                            </div>

                            <div className="form-group">
                                <label className="form-label" style={{ fontWeight: 800, fontSize: '0.75rem' }}>LOCATION</label>
                                <input
                                    className="form-control"
                                    placeholder="e.g. Bangalore, Remote, New York"
                                    value={formData.location}
                                    onChange={e => setFormData({ ...formData, location: e.target.value })}
                                />
                            </div>

                            <div className="form-group">
                                <label className="form-label" style={{ fontWeight: 800, fontSize: '0.75rem' }}>DESCRIPTION / KEY CONTRIBUTIONS</label>
                                <textarea
                                    className="form-control"
                                    placeholder="Briefly describe your tasks and achievements..."
                                    rows={3}
                                    value={formData.description}
                                    onChange={e => setFormData({ ...formData, description: e.target.value })}
                                />
                            </div>

                            <div className="form-group">
                                <label className="form-label" style={{ fontWeight: 800, fontSize: '0.75rem' }}>CERTIFICATE URL (OPTIONAL)</label>
                                <input
                                    type="url"
                                    className="form-control"
                                    placeholder="Link to your certificate (Drive, LinkedIn, etc.)"
                                    value={formData.certificateUrl}
                                    onChange={e => setFormData({ ...formData, certificateUrl: e.target.value })}
                                />
                            </div>

                            <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                                <button type="button" className="btn btn-ghost w-full" onClick={() => setShowModal(false)}>Cancel</button>
                                <button type="submit" className="btn btn-primary w-full">{editingId ? 'Update' : 'Record Experience'}</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MyInternshipsPage;
