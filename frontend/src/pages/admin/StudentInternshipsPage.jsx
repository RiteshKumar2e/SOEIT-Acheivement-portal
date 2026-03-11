import { useState, useEffect } from 'react';
import { internshipAPI } from '../../services/api';
import { Search, Building2, Calendar, MapPin, Briefcase, ExternalLink, Eye, Filter } from 'lucide-react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

const StudentInternshipsPage = () => {
    const [internships, setInternships] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({ department: '', status: '', search: '' });

    const loadAllInternships = async () => {
        setLoading(true);
        try {
            const res = await internshipAPI.getAll(filters);
            setInternships(res.data.data);
        } catch {
            toast.error('Failed to load institutional internship registry');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const handler = setTimeout(() => {
            loadAllInternships();
        }, 300);
        return () => clearTimeout(handler);
    }, [filters.department, filters.status, filters.search]);

    return (
        <div className="animate-fade-in">
            <div className="page-header" style={{ marginBottom: '2.5rem' }}>
                <h2 className="heading-display">Internship Surveillance</h2>
                <p className="page-subtitle">Monitoring real-world industry exposure and student placements across all departments.</p>
            </div>

            <div className="card" style={{ marginBottom: '2.5rem', border: '1px solid var(--border-primary)' }}>
                <div className="card-body" style={{ padding: '1.25rem' }}>
                    <div className="grid-res grid-res-3" style={{ gap: '1rem', alignItems: 'center' }}>
                        <div className="search-wrapper">
                            <input
                                className="form-control"
                                placeholder="Search Scholar, Company, or Role..."
                                value={filters.search}
                                onChange={e => setFilters({ ...filters, search: e.target.value })}
                            />
                            <Search size={18} className="search-icon" />
                        </div>
                        <select
                            className="form-control"
                            style={{ fontWeight: 700 }}
                            value={filters.department}
                            onChange={e => setFilters({ ...filters, department: e.target.value })}
                        >
                            <option value="">All Institutional Departments</option>
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
                        <select
                            className="form-control"
                            style={{ fontWeight: 700 }}
                            value={filters.status}
                            onChange={e => setFilters({ ...filters, status: e.target.value })}
                        >
                            <option value="">Status: All Experiences</option>
                            <option value="Ongoing">Active Placement</option>
                            <option value="Completed">Verified Experience</option>
                        </select>
                    </div>
                </div>
            </div>

            <div className="card" style={{ border: '1px solid var(--border-primary)', overflow: 'hidden' }}>
                <div className="table-responsive">
                    <table className="table">
                        <thead>
                            <tr>
                                <th style={{ paddingLeft: '2rem' }}>Scholar Identity</th>
                                <th>Placement Details</th>
                                <th>Timeline & Type</th>
                                <th>Registry Status</th>
                                <th style={{ textAlign: 'center' }}>Artifacts</th>
                                <th style={{ textAlign: 'right', paddingRight: '2rem' }}>Audit</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                [...Array(5)].map((_, i) => (
                                    <tr key={i}>
                                        <td colSpan="6" style={{ padding: '0.75rem 2rem' }}>
                                            <div className="skeleton" style={{ height: 60, borderRadius: '12px' }} />
                                        </td>
                                    </tr>
                                ))
                            ) : internships.length === 0 ? (
                                <tr>
                                    <td colSpan="6" style={{ padding: '6rem 2rem', textAlign: 'center' }}>
                                        <Briefcase size={48} style={{ opacity: 0.1, margin: '0 auto 1.5rem auto' }} />
                                        <h4 style={{ fontWeight: 800 }}>No internship records synchronized</h4>
                                        <p style={{ color: 'var(--text-muted)' }}>The database yielded zero placement matches for the current institutional cohort.</p>
                                    </td>
                                </tr>
                            ) : (
                                internships.map(internship => (
                                    <tr key={internship.id} className="hover-row">
                                        <td style={{ paddingLeft: '2rem' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '0.5rem 0' }}>
                                                <div style={{ width: 44, height: 44, background: 'var(--primary-100)', color: 'var(--brand-700)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900 }}>
                                                    {internship.student_name ? internship.student_name.charAt(0) : 'S'}
                                                </div>
                                                <div>
                                                    <div style={{ fontWeight: 800, fontSize: '0.95rem' }}>{internship.student_name}</div>
                                                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 800 }}>{internship.enrollment_no || 'DEPT: ' + internship.department}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td>
                                            <div style={{ fontWeight: 800, fontSize: '0.9rem', color: 'var(--text-primary)' }}>{internship.company_name}</div>
                                            <div style={{ fontSize: '0.75rem', color: 'var(--brand-700)', fontWeight: 800, textTransform: 'uppercase' }}>{internship.role}</div>
                                        </td>
                                        <td>
                                            <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-secondary)' }}>
                                                {internship.start_date} {internship.end_date ? `- ${internship.end_date}` : '(Present)'}
                                            </div>
                                            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 800 }}>{internship.internship_type || 'Full-time'} • {internship.location || 'Remote'}</div>
                                        </td>
                                        <td>
                                            <span className={`badge ${internship.status === 'Completed' ? 'badge-success' : 'badge-primary'}`} style={{ fontWeight: 800, padding: '0.4rem 0.8rem', textTransform: 'uppercase', fontSize: '0.65rem' }}>
                                                {internship.status}
                                            </span>
                                        </td>
                                        <td style={{ textAlign: 'center' }}>
                                            {internship.certificate_url ? (
                                                <a href={internship.certificate_url} target="_blank" rel="noopener noreferrer" className="btn btn-ghost" style={{ padding: '0.5rem', color: 'var(--success-600)' }}>
                                                    <ExternalLink size={18} />
                                                </a>
                                            ) : (
                                                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 800 }}>N/A</span>
                                            )}
                                        </td>
                                        <td style={{ textAlign: 'right', paddingRight: '2rem' }}>
                                            <Link to={`/portfolio/${internship.student_id}`} className="btn btn-ghost" style={{ padding: '0.5rem', color: 'var(--brand-600)' }} title="Audit Scholar Portfolio">
                                                <Eye size={20} strokeWidth={2.5} />
                                            </Link>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default StudentInternshipsPage;
