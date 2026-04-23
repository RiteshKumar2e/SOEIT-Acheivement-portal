import { useState, useEffect } from 'react';
import { internshipAPI } from '../../services/api';
import { Search, Building2, Calendar, MapPin, Briefcase, ExternalLink, Eye, Filter, X, User, Activity, FileText } from 'lucide-react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

const StudentInternshipsPage = () => {
    const [internships, setInternships] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({ department: '', status: '', search: '' });
    const [selectedInternship, setSelectedInternship] = useState(null);
    const [showDetailsModal, setShowDetailsModal] = useState(false);

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
        <>
            <div className="animate-fade-in">
                <div className="page-header" style={{ marginBottom: '2.5rem' }}>
                <h2 className="heading-display">Internship Surveillance</h2>
                <p className="page-subtitle">Monitoring real-world industry exposure and student placements across all departments.</p>
            </div>

            <div className="card" style={{ marginBottom: '2.5rem', border: '1px solid var(--border-primary)' }}>
                <div className="card-body" style={{ padding: '1.25rem' }}>
                    <div className="filter-grid-container" style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
                        <div className="search-wrapper flex-order-last-desktop" style={{ flex: 1, minWidth: '280px' }}>
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
                            style={{ fontWeight: 700, flex: 1, minWidth: '200px' }}
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
                            style={{ fontWeight: 700, flex: 1, minWidth: '200px' }}
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
                {/* Desktop View */}
                <div className="table-container display-desktop">
                    <table className="table" style={{ minWidth: '1000px' }}>
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
                                            <button 
                                                className="btn btn-ghost" 
                                                style={{ padding: '0.5rem', color: 'var(--brand-600)' }} 
                                                onClick={() => { setSelectedInternship(internship); setShowDetailsModal(true); }}
                                                title="Audit Scholar Experience"
                                            >
                                                <Eye size={20} strokeWidth={2.5} />
                                            </button>
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
                    ) : internships.length === 0 ? (
                        <div style={{ padding: '3rem 1rem', textAlign: 'center' }}>
                            <Briefcase size={40} style={{ opacity: 0.1, marginBottom: '1rem' }} />
                            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>No internships found</p>
                        </div>
                    ) : (
                        internships.map(internship => (
                            <div key={internship.id} className="card" style={{ padding: '1.25rem', border: '1px solid var(--border-primary)', borderRadius: '16px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                                    <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                                        <div style={{ width: 40, height: 40, background: 'var(--primary-100)', color: 'var(--brand-700)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: '0.9rem' }}>
                                            {internship.student_name ? internship.student_name.charAt(0) : 'S'}
                                        </div>
                                        <div>
                                            <div style={{ fontWeight: 800, fontSize: '0.9rem' }}>{internship.student_name}</div>
                                            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 700 }}>{internship.enrollment_no || internship.department}</div>
                                        </div>
                                    </div>
                                    <button 
                                        className="btn btn-ghost btn-sm" 
                                        style={{ padding: '0.4rem', color: 'var(--brand-600)' }}
                                        onClick={() => { setSelectedInternship(internship); setShowDetailsModal(true); }}
                                    >
                                        <Eye size={18} />
                                    </button>
                                </div>

                                <div style={{ marginBottom: '1rem' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <div style={{ fontWeight: 800, fontSize: '1rem', color: 'var(--text-primary)' }}>{internship.company_name}</div>
                                        <span className={`badge ${internship.status === 'Completed' ? 'badge-success' : 'badge-primary'}`} style={{ fontSize: '0.6rem', padding: '0.1rem 0.4rem' }}>
                                            {internship.status.toUpperCase()}
                                        </span>
                                    </div>
                                    <div style={{ fontSize: '0.85rem', color: 'var(--brand-700)', fontWeight: 700, marginTop: '0.25rem' }}>{internship.role}</div>
                                </div>

                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '1rem' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-muted)', fontSize: '0.75rem', fontWeight: 600 }}>
                                        <Calendar size={12} /> {internship.start_date}
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-muted)', fontSize: '0.75rem', fontWeight: 600 }}>
                                        <MapPin size={12} /> {internship.location || 'Remote'}
                                    </div>
                                </div>

                                {internship.certificate_url && (
                                    <a href={internship.certificate_url} target="_blank" rel="noopener noreferrer" className="btn btn-ghost btn-sm w-full" style={{ gap: '0.5rem', background: 'var(--success-50)', color: 'var(--success-700)', fontSize: '0.8rem', fontWeight: 800 }}>
                                        <ExternalLink size={14} /> VIEW CERTIFICATE
                                    </a>
                                )}
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
            {showDetailsModal && selectedInternship && (
                <div className="modal-overlay animate-fade-in" onClick={() => setShowDetailsModal(false)}>
                    <div className="modal animate-scale-in" onClick={e => e.stopPropagation()} style={{ maxWidth: '700px' }}>
                        <div className="modal-header" style={{ background: 'linear-gradient(135deg, var(--brand-700), var(--brand-800))', borderBottom: 'none' }}>
                            <div>
                                <h2 style={{ color: '#fff', fontWeight: 900, letterSpacing: '-0.02em', margin: 0 }}>Experience Audit</h2>
                                <p style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '0.85rem', margin: '0.25rem 0 0 0', fontWeight: 600 }}>Institutional placement verification & performance record</p>
                            </div>
                            <button className="btn btn-ghost" onClick={() => setShowDetailsModal(false)} style={{ color: '#fff', opacity: 0.6, borderRadius: '50%', width: 40, height: 40, padding: 0 }}>
                                <X size={24} />
                            </button>
                        </div>
                        <div className="modal-body" style={{ padding: '0', background: 'var(--slate-50)' }}>
                            {/* Inner scrollable wrapper if needed, though modal-body already scrolls */}
                            
                            {/* Scholar Profile Section */}
                            <div style={{ padding: '1.5rem 2rem', background: '#fff', borderBottom: '1px solid var(--border-primary)' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
                                    <div style={{ width: 64, height: 64, background: 'var(--brand-50)', color: 'var(--brand-700)', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: '1.75rem', border: '2px solid #fff', boxShadow: 'var(--shadow-sm)' }}>
                                        {selectedInternship.student_name ? selectedInternship.student_name.charAt(0) : 'S'}
                                    </div>
                                    <div>
                                        <div style={{ fontWeight: 900, fontSize: '1.25rem', color: 'var(--brand-800)', letterSpacing: '-0.01em' }}>{selectedInternship.student_name}</div>
                                        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', marginTop: '0.2rem' }}>
                                            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 800 }}>{selectedInternship.enrollment_no}</span>
                                            <span style={{ width: 4, height: 4, background: 'var(--primary-300)', borderRadius: '50%' }}></span>
                                            <span style={{ fontSize: '0.85rem', color: 'var(--brand-600)', fontWeight: 800 }}>{selectedInternship.department}</span>
                                        </div>
                                    </div>
                                    <div style={{ marginLeft: 'auto' }}>
                                        <span className={`badge ${selectedInternship.status === 'Completed' ? 'badge-success' : 'badge-primary'}`} style={{ borderRadius: '10px', padding: '0.6rem 1.25rem', fontSize: '0.75rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.02em', boxShadow: 'var(--shadow-sm)' }}>
                                            {selectedInternship.status}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div style={{ padding: '2rem' }}>
                                {/* Data Grid */}
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1.5rem', marginBottom: '2rem' }}>
                                    <div style={{ background: '#fff', padding: '1.25rem', borderRadius: '16px', border: '1px solid var(--border-primary)', boxShadow: 'var(--shadow-sm)' }}>
                                        <label style={{ display: 'block', fontSize: '0.65rem', fontWeight: 900, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.75rem', letterSpacing: '0.05em' }}>Organization</label>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                            <Building2 size={20} className="text-brand" style={{ opacity: 0.8 }} />
                                            <div style={{ fontWeight: 800, fontSize: '1.05rem', color: 'var(--text-primary)' }}>{selectedInternship.company_name}</div>
                                        </div>
                                    </div>
                                    <div style={{ background: '#fff', padding: '1.25rem', borderRadius: '16px', border: '1px solid var(--border-primary)', boxShadow: 'var(--shadow-sm)' }}>
                                        <label style={{ display: 'block', fontSize: '0.65rem', fontWeight: 900, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.75rem', letterSpacing: '0.05em' }}>Designated Role</label>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                            <Briefcase size={20} className="text-brand" style={{ opacity: 0.8 }} />
                                            <div style={{ fontWeight: 800, fontSize: '1.05rem', color: 'var(--brand-600)' }}>{selectedInternship.role}</div>
                                        </div>
                                    </div>
                                    <div style={{ background: '#fff', padding: '1.25rem', borderRadius: '16px', border: '1px solid var(--border-primary)', boxShadow: 'var(--shadow-sm)' }}>
                                        <label style={{ display: 'block', fontSize: '0.65rem', fontWeight: 900, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.75rem', letterSpacing: '0.05em' }}>Execution Period</label>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                            <Calendar size={20} className="text-brand" style={{ opacity: 0.8 }} />
                                            <div style={{ fontWeight: 800, fontSize: '0.95rem' }}>
                                                {selectedInternship.start_date} — {selectedInternship.end_date || 'Present'}
                                            </div>
                                        </div>
                                    </div>
                                    <div style={{ background: '#fff', padding: '1.25rem', borderRadius: '16px', border: '1px solid var(--border-primary)', boxShadow: 'var(--shadow-sm)' }}>
                                        <label style={{ display: 'block', fontSize: '0.65rem', fontWeight: 900, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.75rem', letterSpacing: '0.05em' }}>Placement Modality</label>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                            <MapPin size={20} className="text-brand" style={{ opacity: 0.8 }} />
                                            <div style={{ fontWeight: 800, fontSize: '0.95rem' }}>
                                                {selectedInternship.internship_type || 'Full-time'} • {selectedInternship.location || 'Onsite'}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Narrative / Description */}
                                {selectedInternship.description && (
                                    <div style={{ marginBottom: '2rem' }}>
                                        <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 900, color: 'var(--brand-700)', textTransform: 'uppercase', marginBottom: '1rem', letterSpacing: '0.02em', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                            <Activity size={16} /> Work Execution Narrative
                                        </label>
                                        <div style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', lineHeight: 1.8, background: '#fff', padding: '1.75rem', borderRadius: '20px', fontWeight: 600, border: '1px solid var(--border-primary)', boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.02)' }}>
                                            {selectedInternship.description}
                                        </div>
                                    </div>
                                )}

                                {/* Audit Actions */}
                                <div style={{ display: 'flex', gap: '1.25rem', marginTop: '1rem' }}>
                                    {selectedInternship.certificate_url && (
                                        <a 
                                            href={selectedInternship.certificate_url} 
                                            target="_blank" 
                                            rel="noopener noreferrer" 
                                            className="btn btn-ghost" 
                                            style={{ flex: 1, height: '56px', borderRadius: '18px', border: '1.5px solid var(--success-200)', color: 'var(--success-700)', background: '#fff', fontWeight: 900, gap: '0.75rem', fontSize: '0.9rem' }}
                                        >
                                            <FileText size={22} />
                                            View Certification
                                        </a>
                                    )}
                                    <Link 
                                        to={`/portfolio/${selectedInternship.student_id}`} 
                                        className="btn btn-primary" 
                                        style={{ flex: 1.2, height: '56px', borderRadius: '18px', fontWeight: 900, gap: '0.875rem', boxShadow: '0 8px 20px -6px rgba(0, 51, 102, 0.4)', fontSize: '0.9rem' }}
                                    >
                                        <User size={22} />
                                        Audit Full Portfolio
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default StudentInternshipsPage;
