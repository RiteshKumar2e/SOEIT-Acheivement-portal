import { useState, useEffect } from 'react';
import { projectAPI } from '../../services/api';
import { Plus, Trash2, Github, ExternalLink, Code2, Layers, X } from 'lucide-react';
import toast from 'react-hot-toast';

const MyProjectsPage = () => {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        githubLink: '',
        liveLink: '',
        techStack: '',
        status: 'Completed'
    });

    const loadProjects = async () => {
        try {
            const res = await projectAPI.getMy();
            setProjects(res.data.data);
        } catch {
            toast.error('Failed to load project records');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadProjects();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingId) {
                // await projectAPI.update(editingId, formData);
                // toast.success('Project updated');
            } else {
                await projectAPI.add(formData);
                toast.success('Project added successfully');
            }
            setShowModal(false);
            resetForm();
            loadProjects();
        } catch (err) {
            toast.error(err.response?.data?.message || 'Operation failed');
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this project?')) return;
        try {
            await projectAPI.delete(id);
            toast.success('Project deleted');
            loadProjects();
        } catch {
            toast.error('Delete operation failed');
        }
    };

    const resetForm = () => {
        setEditingId(null);
        setFormData({
            title: '',
            description: '',
            githubLink: '',
            liveLink: '',
            techStack: '',
            status: 'Completed'
        });
    };

    return (
        <>
            <div className="animate-fade-in">
                <div className="page-header" style={{ marginBottom: '2.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                    <div style={{ minWidth: '200px' }}>
                        <h2 className="heading-display">My Projects</h2>
                        <p className="page-subtitle">Showcase your technical work and personal projects.</p>
                    </div>
                    <button className="btn btn-primary" onClick={() => { resetForm(); setShowModal(true); }} style={{ width: 'auto' }}>
                        <Plus size={18} />
                        <span>Add Project</span>
                    </button>
                </div>

                {loading ? (
                    <div className="grid-res grid-res-2">
                        {[...Array(2)].map((_, i) => <div key={i} className="skeleton" style={{ height: 250, borderRadius: '20px' }} />)}
                    </div>
                ) : projects.length === 0 ? (
                    <div className="card" style={{ padding: '6rem 2rem', textAlign: 'center' }}>
                        <Code2 size={64} style={{ opacity: 0.1, margin: '0 auto 1.5rem auto' }} />
                        <h3 style={{ fontWeight: 800 }}>No projects added yet</h3>
                        <p style={{ color: 'var(--text-muted)' }}>Start by highlighting your best technical work.</p>
                    </div>
                ) : (
                    <div className="grid-res grid-res-2" style={{ gap: '1.5rem' }}>
                        {projects.map(project => (
                            <div key={project.id} className="card animate-scale-in" style={{ padding: '1.5rem', border: '1px solid var(--border-primary)', display: 'flex', flexDirection: 'column' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
                                    <div style={{ width: 48, height: 48, background: 'var(--primary-50)', color: 'var(--brand-700)', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <Layers size={24} />
                                    </div>
                                    <button className="btn btn-ghost btn-sm text-danger" onClick={() => handleDelete(project.id)} style={{ padding: '0.5rem' }}>
                                        <Trash2 size={16} />
                                    </button>
                                </div>

                                <div style={{ marginBottom: '1rem' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                                        <h4 style={{ fontSize: '1.25rem', fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>{project.title}</h4>
                                        <span className={`badge ${project.status === 'Completed' ? 'badge-success' : 'badge-primary'}`} style={{ fontSize: '0.65rem' }}>
                                            {project.status.toUpperCase()}
                                        </span>
                                    </div>
                                    <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginTop: '0.5rem', lineBreak: 'anywhere' }}>
                                        {project.description}
                                    </p>
                                </div>

                                <div style={{ marginBottom: '1.25rem' }}>
                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                                        {project.techStack?.split(',').map((tech, i) => (
                                            <span key={i} style={{ background: 'var(--slate-100)', padding: '0.2rem 0.6rem', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-secondary)' }}>
                                                {tech.trim()}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                <div style={{ display: 'flex', gap: '1rem', marginTop: 'auto' }}>
                                    {project.githubLink && (
                                        <a href={project.githubLink} target="_blank" rel="noopener noreferrer" className="btn btn-ghost btn-sm" style={{ flex: 1, gap: '0.5rem' }}>
                                            <Github size={16} /> GitHub
                                        </a>
                                    )}
                                    {project.liveLink && (
                                        <a href={project.liveLink} target="_blank" rel="noopener noreferrer" className="btn btn-ghost btn-sm" style={{ flex: 1, gap: '0.5rem' }}>
                                            <ExternalLink size={16} /> Live Demo
                                        </a>
                                    )}
                                </div>
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
                                <h3 style={{ margin: 0 }}>Add New Project</h3>
                                <p style={{ margin: 0 }}>Showcase your technical work and achievements.</p>
                            </div>
                            <button className="btn btn-ghost" onClick={() => setShowModal(false)} style={{ color: 'white', opacity: 0.8 }}>
                                <X size={24} />
                            </button>
                        </div>
                        <div className="modal-body" style={{ padding: '2rem' }}>
                            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                                <div className="form-group">
                                    <label className="form-label" style={{ fontWeight: 800, fontSize: '0.75rem' }}>PROJECT TITLE</label>
                                    <input
                                        className="form-control"
                                        placeholder="e.g. Portfolio Website, E-commerce App"
                                        required
                                        value={formData.title}
                                        onChange={e => setFormData({ ...formData, title: e.target.value })}
                                    />
                                </div>

                                <div className="form-group">
                                    <label className="form-label" style={{ fontWeight: 800, fontSize: '0.75rem' }}>DESCRIPTION</label>
                                    <textarea
                                        className="form-control"
                                        placeholder="Describe your project, features, and your role..."
                                        rows={4}
                                        required
                                        value={formData.description}
                                        onChange={e => setFormData({ ...formData, description: e.target.value })}
                                    />
                                </div>

                                <div className="form-group">
                                    <label className="form-label" style={{ fontWeight: 800, fontSize: '0.75rem' }}>TECH STACK (COMMA SEPARATED)</label>
                                    <input
                                        className="form-control"
                                        placeholder="e.g. React, Node.js, MongoDB"
                                        value={formData.techStack}
                                        onChange={e => setFormData({ ...formData, techStack: e.target.value })}
                                    />
                                </div>

                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                                    <div className="form-group">
                                        <label className="form-label" style={{ fontWeight: 800, fontSize: '0.75rem' }}>GITHUB LINK</label>
                                        <input
                                            type="url"
                                            className="form-control"
                                            placeholder="https://github.com/..."
                                            value={formData.githubLink}
                                            onChange={e => setFormData({ ...formData, githubLink: e.target.value })}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label" style={{ fontWeight: 800, fontSize: '0.75rem' }}>LIVE DEMO LINK</label>
                                        <input
                                            type="url"
                                            className="form-control"
                                            placeholder="https://..."
                                            value={formData.liveLink}
                                            onChange={e => setFormData({ ...formData, liveLink: e.target.value })}
                                        />
                                    </div>
                                </div>

                                <div className="form-group">
                                    <label className="form-label" style={{ fontWeight: 800, fontSize: '0.75rem' }}>STATUS</label>
                                    <select
                                        className="form-control"
                                        value={formData.status}
                                        onChange={e => setFormData({ ...formData, status: e.target.value })}
                                    >
                                        <option value="Completed">Completed</option>
                                        <option value="Ongoing">Ongoing</option>
                                    </select>
                                </div>

                                <div className="modal-actions-responsive">
                                    <button type="button" className="btn btn-secondary cancel-btn" onClick={() => setShowModal(false)}>Cancel</button>
                                    <button type="submit" className="btn btn-primary submit-btn">Add Project</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default MyProjectsPage;
