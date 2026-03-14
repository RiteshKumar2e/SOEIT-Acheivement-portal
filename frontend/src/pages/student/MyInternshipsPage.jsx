import { useState, useEffect } from 'react';
import { internshipAPI } from '../../services/api';
import { Plus, Trash2, Building2, ExternalLink, Calendar, MapPin, Briefcase, CheckCircle2, MoreVertical, Edit2, X } from 'lucide-react';
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
        <>
            <div className="animate-fade-in">
                <div className="page-header" style={{ marginBottom: '2.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                    <div>
                        <h2 className="heading-display">Internship Journey</h2>
                        <p className="page-subtitle">Document your professional experiences and industry exposure.</p>
                    </div>
                    <button className="btn btn-primary" onClick={() => { resetForm(); setShowModal(true); }} style={{ borderRadius: '12px', padding: '0.75rem 1.5rem', gap: '0.75rem' }}>
                        <Plus size={20} />
                        <span>Add Experience</span>
                    </button>
                </div>

                {loading ? (
                    <div className="grid-res grid-res-2" style={{ gap: '1.5rem' }}>
                        {[...Array(2)].map((_, i) => <div key={i} className="skeleton" style={{ height: 250, borderRadius: 'var(--radius-lg)' }} />)}
                    </div>
                ) : internships.length === 0 ? (
                    <div className="card" style={{ padding: '6rem 2rem', textAlign: 'center' }}>
                        <Briefcase size={64} style={{ opacity: 0.1, margin: '0 auto 1.5rem auto' }} />
                        <h3 style={{ fontWeight: 800 }}>Start your professional registry</h3>
                        <p style={{ color: 'var(--text-muted)' }}>You haven't added any internships yet. Share your experience to build your profile.</p>
                    </div>
                ) : (
                    <div className="grid-res grid-res-2" style={{ gap: '1.5rem' }}>
                        {internships.map(internship => (
                            <div key={internship.id} className="card animate-scale-in" style={{ padding: '0', display: 'flex', flexDirection: 'column', borderRadius: '24px' }}>
                                <div style={{ padding: '2rem', flex: 1 }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                                        <div style={{ width: 52, height: 52, background: 'var(--primary-50)', color: 'var(--brand-700)', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                            <Building2 size={26} />
                                        </div>
                                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                                            <button className="btn btn-ghost btn-sm" onClick={() => handleEdit(internship)} style={{ padding: '0.5rem', background: 'var(--primary-50)', borderRadius: '10px' }}>
                                                <Edit2 size={16} />
                                            </button>
                                            <button className="btn btn-ghost btn-sm text-danger" onClick={() => handleDelete(internship.id)} style={{ padding: '0.5rem', background: 'var(--error-50)', borderRadius: '10px' }}>
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </div>

                                    <div style={{ marginBottom: '1.5rem' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.35rem', flexWrap: 'wrap' }}>
                                            <h4 style={{ fontSize: '1.35rem', fontWeight: 900, margin: 0, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>{internship.company_name}</h4>
                                            <span className={`badge ${internship.status === 'Completed' ? 'badge-success' : 'badge-primary'}`} style={{ borderRadius: '6px', fontSize: '0.7rem' }}>
                                                {internship.status.toUpperCase()}
                                            </span>
                                        </div>
                                        <p style={{ fontSize: '1rem', color: 'var(--brand-700)', fontWeight: 850, margin: 0 }}>{internship.role}</p>
                                    </div>

                                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', color: 'var(--text-secondary)', fontSize: '0.85rem', fontWeight: 700 }}>
                                            <Calendar size={16} style={{ color: 'var(--brand-500)' }} />
                                            <span>{internship.start_date} {internship.end_date ? `— ${internship.end_date}` : '(Present)'}</span>
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', color: 'var(--text-secondary)', fontSize: '0.85rem', fontWeight: 700 }}>
                                            <MapPin size={16} style={{ color: 'var(--brand-500)' }} />
                                            <span>{internship.location || 'Not specified'}</span>
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', color: 'var(--text-secondary)', fontSize: '0.85rem', fontWeight: 700 }}>
                                            <Briefcase size={16} style={{ color: 'var(--brand-500)' }} />
                                            <span>{internship.internship_type || 'Full-time'}</span>
                                        </div>
                                    </div>

                                    {internship.description && (
                                        <div style={{ padding: '1rem', background: 'var(--primary-50)', borderRadius: '14px', fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.6, border: '1px solid var(--primary-100)' }}>
                                            {internship.description}
                                        </div>
                                    )}
                                </div>

                                {internship.certificate_url && (
                                    <a
                                        href={internship.certificate_url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="btn btn-ghost"
                                        style={{ 
                                            padding: '1.25rem', 
                                            background: 'transparent', 
                                            borderTop: '1px solid var(--border-primary)', 
                                            display: 'flex', 
                                            alignItems: 'center', 
                                            justifyContent: 'center', 
                                            gap: '0.75rem', 
                                            color: 'var(--brand-700)', 
                                            fontWeight: 900, 
                                            fontSize: '0.85rem',
                                            borderRadius: '0 0 24px 24px'
                                        }}
                                    >
                                        <ExternalLink size={18} />
                                        VIEW COMPLETION CERTIFICATE
                                    </a>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {showModal && (
                <div className="modal-overlay">
                    <div className="modal animate-scale-in">
                        <div className="modal-header">
                            <div>
                                <h3 style={{ margin: 0 }}>{editingId ? 'Update Experience' : 'New Internship'}</h3>
                                <p style={{ margin: 0 }}>Fill in your professional experience details.</p>
                            </div>
                            <button className="btn btn-ghost" onClick={() => setShowModal(false)} style={{ color: 'white', opacity: 0.8 }}>
                                <X size={24} />
                            </button>
                        </div>
                        <div className="modal-body" style={{ padding: '2.5rem' }}>
                            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem' }}>
                                    <div className="form-group" style={{ margin: 0 }}>
                                        <label className="form-label" style={{ fontWeight: 800, fontSize: '0.85rem' }}>COMPANY NAME</label>
                                        <input
                                            className="form-control"
                                            style={{ height: '54px', borderRadius: '14px' }}
                                            placeholder="e.g. Google, Microsoft, Startup"
                                            required
                                            value={formData.companyName}
                                            onChange={e => setFormData({ ...formData, companyName: e.target.value })}
                                        />
                                    </div>
                                    <div className="form-group" style={{ margin: 0 }}>
                                        <label className="form-label" style={{ fontWeight: 800, fontSize: '0.85rem' }}>ROLE / POSITION</label>
                                        <input
                                            className="form-control"
                                            style={{ height: '54px', borderRadius: '14px' }}
                                            placeholder="e.g. Web Developer Intern"
                                            required
                                            value={formData.role}
                                            onChange={e => setFormData({ ...formData, role: e.target.value })}
                                        />
                                    </div>
                                </div>

                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem' }}>
                                    <div className="form-group" style={{ margin: 0 }}>
                                        <label className="form-label" style={{ fontWeight: 800, fontSize: '0.85rem' }}>START DATE</label>
                                        <input
                                            type="month"
                                            className="form-control"
                                            style={{ height: '54px', borderRadius: '14px', fontWeight: 700 }}
                                            required
                                            value={formData.startDate}
                                            onChange={e => setFormData({ ...formData, startDate: e.target.value })}
                                        />
                                    </div>
                                    <div className="form-group" style={{ margin: 0 }}>
                                        <label className="form-label" style={{ fontWeight: 800, fontSize: '0.85rem' }}>END DATE (OPTIONAL)</label>
                                        <input
                                            type="month"
                                            className="form-control"
                                            style={{ height: '54px', borderRadius: '14px', fontWeight: 700 }}
                                            value={formData.endDate}
                                            placeholder="Present"
                                            onChange={e => setFormData({ ...formData, endDate: e.target.value })}
                                        />
                                    </div>
                                </div>

                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                                    <div className="form-group" style={{ margin: 0 }}>
                                        <label className="form-label" style={{ fontWeight: 800, fontSize: '0.85rem' }}>STATUS</label>
                                        <select
                                            className="form-control"
                                            style={{ height: '54px', borderRadius: '14px', fontWeight: 700 }}
                                            value={formData.status}
                                            onChange={e => setFormData({ ...formData, status: e.target.value })}
                                        >
                                            <option value="Ongoing">Ongoing</option>
                                            <option value="Completed">Completed</option>
                                        </select>
                                    </div>
                                    <div className="form-group" style={{ margin: 0 }}>
                                        <label className="form-label" style={{ fontWeight: 800, fontSize: '0.85rem' }}>TYPE</label>
                                        <select
                                            className="form-control"
                                            style={{ height: '54px', borderRadius: '14px', fontWeight: 700 }}
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

                                <div className="form-group" style={{ margin: 0 }}>
                                    <label className="form-label" style={{ fontWeight: 800, fontSize: '0.85rem' }}>LOCATION</label>
                                    <input
                                        className="form-control"
                                        style={{ height: '54px', borderRadius: '14px' }}
                                        placeholder="e.g. Bangalore, Remote, New York"
                                        value={formData.location}
                                        onChange={e => setFormData({ ...formData, location: e.target.value })}
                                    />
                                </div>

                                <div className="form-group" style={{ margin: 0 }}>
                                    <label className="form-label" style={{ fontWeight: 800, fontSize: '0.85rem' }}>DESCRIPTION / KEY CONTRIBUTIONS</label>
                                    <textarea
                                        className="form-control"
                                        style={{ borderRadius: '14px', padding: '1rem' }}
                                        placeholder="Briefly describe your tasks and achievements..."
                                        rows={3}
                                        value={formData.description}
                                        onChange={e => setFormData({ ...formData, description: e.target.value })}
                                    />
                                </div>

                                <div className="form-group" style={{ margin: 0 }}>
                                    <label className="form-label" style={{ fontWeight: 800, fontSize: '0.85rem' }}>CERTIFICATE URL (OPTIONAL)</label>
                                    <input
                                        type="url"
                                        className="form-control"
                                        style={{ height: '54px', borderRadius: '14px' }}
                                        placeholder="Link to your certificate (Drive, LinkedIn, etc.)"
                                        value={formData.certificateUrl}
                                        onChange={e => setFormData({ ...formData, certificateUrl: e.target.value })}
                                    />
                                </div>

                                <div className="modal-actions-responsive">
                                    <button type="button" className="btn btn-secondary cancel-btn" onClick={() => setShowModal(false)}>Cancel</button>
                                    <button type="submit" className="btn btn-primary submit-btn">{editingId ? 'Save Changes' : 'Record Experience'}</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default MyInternshipsPage;
