import { useState, useEffect } from 'react';
import { projectAPI } from '../../services/api';
import { Search, Code2, ExternalLink, Eye, Github } from 'lucide-react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

const StudentProjectsPage = () => {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({ department: '', search: '' });

    const loadAllProjects = async () => {
        setLoading(true);
        try {
            const res = await projectAPI.getAll(filters);
            setProjects(res.data.data);
        } catch {
            toast.error('Failed to load project records');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const handler = setTimeout(() => {
            loadAllProjects();
        }, 300);
        return () => clearTimeout(handler);
    }, [filters.department, filters.search]);

    return (
        <div className="animate-fade-in">
            <div className="page-header" style={{ marginBottom: '2.5rem' }}>
                <h2 className="heading-display">Student Projects</h2>
                <p className="page-subtitle">View and monitor technical projects built by students across all departments.</p>
            </div>

            <div className="card" style={{ marginBottom: '2.5rem', border: '1px solid var(--border-primary)' }}>
                <div className="card-body" style={{ padding: '1.25rem' }}>
                    <div className="filter-grid-container" style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
                        <div className="search-wrapper flex-order-last-desktop" style={{ flex: 1, minWidth: '280px' }}>
                            <input
                                className="form-control"
                                placeholder="Search by Student, Project, or Tech Stack..."
                                value={filters.search}
                                onChange={e => setFilters({ ...filters, search: e.target.value })}
                            />
                            <Search size={18} className="search-icon" />
                        </div>
                        <select
                            className="form-control"
                            style={{ fontWeight: 700, flex: 1, minWidth: '200px' }}
                            value={filters.department}
                            onChange={e => setFilters({ ...filters, department: e.target.value })}
                        >
                            <option value="">All Departments</option>
                            {[
                                { group: 'B.Tech', depts: ['CSE', 'AIDS (IBM)', 'AIML', 'ME', 'EEE'] },
                                { group: 'BCA', depts: ['BCA (Regular)', 'AIDL', 'Cybersecurity'] },
                                { group: 'Diploma', depts: ['DCSE', 'DME', 'DEEE'] },
                            ].map(({ group, depts }) => (
                                <optgroup key={group} label={group}>
                                    {depts.map(d => <option key={d} value={d}>{d}</option>)}
                                </optgroup>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            <div className="card" style={{ border: '1px solid var(--border-primary)', overflow: 'hidden' }}>
                {/* Desktop View */}
                <div className="table-container display-desktop">
                    <table className="table" style={{ minWidth: '900px' }}>
                        <thead>
                            <tr>
                                <th style={{ paddingLeft: '2rem' }}>Student Details</th>
                                <th>Project Name</th>
                                <th>Tech Stack</th>
                                <th style={{ textAlign: 'center' }}>Links</th>
                                <th style={{ textAlign: 'right', paddingRight: '2rem' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                [...Array(5)].map((_, i) => (
                                    <tr key={i}>
                                        <td colSpan="5" style={{ padding: '0.75rem 2rem' }}>
                                            <div className="skeleton" style={{ height: 60, borderRadius: '12px' }} />
                                        </td>
                                    </tr>
                                ))
                            ) : projects.length === 0 ? (
                                <tr>
                                    <td colSpan="5" style={{ padding: '6rem 2rem', textAlign: 'center' }}>
                                        <Code2 size={48} style={{ opacity: 0.1, margin: '0 auto 1.5rem auto' }} />
                                        <h4 style={{ fontWeight: 800 }}>No projects found</h4>
                                        <p style={{ color: 'var(--text-muted)' }}>No student projects match your search criteria.</p>
                                    </td>
                                </tr>
                            ) : (
                                projects.map(project => (
                                    <tr key={project.id} className="hover-row">
                                        <td style={{ paddingLeft: '2rem' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '0.5rem 0' }}>
                                                <div style={{ width: 44, height: 44, background: 'var(--primary-100)', color: 'var(--brand-700)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900 }}>
                                                    {project.student?.name ? project.student.name.charAt(0) : 'S'}
                                                </div>
                                                <div>
                                                    <div style={{ fontWeight: 800, fontSize: '0.95rem' }}>{project.student?.name}</div>
                                                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 800 }}>{project.student?.department}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td>
                                            <div style={{ fontWeight: 800, fontSize: '0.9rem', color: 'var(--text-primary)' }}>{project.title}</div>
                                            <div style={{ fontSize: '0.75rem', color: 'var(--brand-700)', fontWeight: 800, textTransform: 'uppercase' }}>{project.status}</div>
                                        </td>
                                        <td>
                                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
                                                {project.techStack?.split(',').map((tech, i) => (
                                                    <span key={i} style={{ background: 'var(--slate-100)', padding: '0.1rem 0.5rem', borderRadius: '4px', fontSize: '0.65rem', fontWeight: 800, color: 'var(--text-secondary)' }}>
                                                        {tech.trim()}
                                                    </span>
                                                ))}
                                            </div>
                                        </td>
                                        <td style={{ textAlign: 'center' }}>
                                            <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
                                                {project.githubLink && (
                                                    <a href={project.githubLink} target="_blank" rel="noopener noreferrer" className="btn btn-ghost" style={{ padding: '0.5rem', color: 'var(--text-primary)' }} title="GitHub">
                                                        <Github size={18} />
                                                    </a>
                                                )}
                                                {project.liveLink && (
                                                    <a href={project.liveLink} target="_blank" rel="noopener noreferrer" className="btn btn-ghost" style={{ padding: '0.5rem', color: 'var(--brand-600)' }} title="Live Demo">
                                                        <ExternalLink size={18} />
                                                    </a>
                                                )}
                                            </div>
                                        </td>
                                        <td style={{ textAlign: 'right', paddingRight: '2rem' }}>
                                            <Link to={`/portfolio/${project.studentId}`} className="btn btn-ghost" style={{ padding: '0.5rem', color: 'var(--brand-600)' }} title="View Profile">
                                                <Eye size={20} strokeWidth={2.5} />
                                            </Link>
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
                            <div key={i} className="skeleton" style={{ height: 180, borderRadius: '16px' }} />
                        ))
                    ) : projects.length === 0 ? (
                        <div style={{ padding: '3rem 1rem', textAlign: 'center' }}>
                            <Code2 size={40} style={{ opacity: 0.1, marginBottom: '1rem' }} />
                            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>No projects found</p>
                        </div>
                    ) : (
                        projects.map(project => (
                            <div key={project.id} className="card" style={{ padding: '1.25rem', border: '1px solid var(--border-primary)', borderRadius: '16px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                                    <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                                        <div style={{ width: 40, height: 40, background: 'var(--primary-100)', color: 'var(--brand-700)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: '0.9rem' }}>
                                            {project.student?.name ? project.student.name.charAt(0) : 'S'}
                                        </div>
                                        <div>
                                            <div style={{ fontWeight: 800, fontSize: '0.9rem' }}>{project.student?.name}</div>
                                            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 700 }}>{project.student?.department}</div>
                                        </div>
                                    </div>
                                    <Link to={`/portfolio/${project.studentId}`} className="btn btn-ghost btn-sm" style={{ padding: '0.4rem', color: 'var(--brand-600)' }}>
                                        <Eye size={18} />
                                    </Link>
                                </div>

                                <div style={{ marginBottom: '1rem' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <div style={{ fontWeight: 800, fontSize: '1rem', color: 'var(--text-primary)' }}>{project.title}</div>
                                        <span className={`badge ${project.status === 'Completed' ? 'badge-success' : 'badge-primary'}`} style={{ fontSize: '0.6rem', padding: '0.1rem 0.4rem' }}>
                                            {project.status.toUpperCase()}
                                        </span>
                                    </div>
                                </div>

                                <div style={{ marginBottom: '1rem' }}>
                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
                                        {project.techStack?.split(',').map((tech, i) => (
                                            <span key={i} style={{ background: 'var(--slate-100)', padding: '0.1rem 0.5rem', borderRadius: '4px', fontSize: '0.65rem', fontWeight: 800, color: 'var(--text-secondary)' }}>
                                                {tech.trim()}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                <div style={{ display: 'flex', gap: '0.75rem' }}>
                                    {project.githubLink && (
                                        <a href={project.githubLink} target="_blank" rel="noopener noreferrer" className="btn btn-ghost btn-sm" style={{ flex: 1, gap: '0.4rem', background: 'var(--slate-50)', fontSize: '0.75rem' }}>
                                            <Github size={14} /> GitHub
                                        </a>
                                    )}
                                    {project.liveLink && (
                                        <a href={project.liveLink} target="_blank" rel="noopener noreferrer" className="btn btn-ghost btn-sm" style={{ flex: 1, gap: '0.4rem', background: 'var(--primary-50)', color: 'var(--brand-700)', fontSize: '0.75rem' }}>
                                            <ExternalLink size={14} /> Demo
                                        </a>
                                    )}
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default StudentProjectsPage;
