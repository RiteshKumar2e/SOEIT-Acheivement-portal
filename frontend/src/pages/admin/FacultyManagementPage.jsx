import { useState, useEffect } from 'react';
import { adminAPI } from '../../services/api';
import { Users, Search, Mail, Shield, UserCheck, UserX, Download } from 'lucide-react';
import toast from 'react-hot-toast';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';

const FacultyManagementPage = () => {
    const [faculty, setFaculty] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');

    const loadFaculty = async () => {
        setLoading(true);
        try {
            const { data } = await adminAPI.getFaculty({ search });
            setFaculty(data.data);
        } catch {
            toast.error('Failed to synchronize faculty directory');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadFaculty();
    }, []);

    const toggleStatus = async (id, currentStatus) => {
        try {
            await adminAPI.manageUser(id, { isActive: !currentStatus });
            toast.success(`Access ${!currentStatus ? 'synchronized' : 'revoked'} successfully`);
            loadFaculty();
        } catch {
            toast.error('Failed to update faculty authorization status');
        }
    };

    const exportFacultyData = (type) => {
        try {
            const date = new Date().toLocaleDateString().replace(/\//g, '-');
            if (type === 'excel') {
                const excelData = faculty.map(f => ({
                    'Faculty Name': f.name,
                    'Employee/Faculty ID': f.studentId || 'N/A',
                    'Institutional Email': f.email,
                    'Department': f.department || 'General',
                    'Authorization Status': f.isActive ? 'Active' : 'Inactive'
                }));
                const ws = XLSX.utils.json_to_sheet(excelData);
                const wb = XLSX.utils.book_new();
                XLSX.utils.book_append_sheet(wb, ws, "SOEIT_Faculty");
                XLSX.writeFile(wb, `SOEIT_Faculty_Roster_${date}.xlsx`);
                toast.success('Excel protocol: Archive exported');
            } else {
                const doc = new jsPDF();
                doc.setFillColor(30, 64, 175);
                doc.rect(0, 0, 210, 30, 'F');
                doc.setTextColor(255, 255, 255);
                doc.setFontSize(22);
                doc.text('SOEIT FACULTY DIRECTORY', 105, 16, { align: 'center' });
                doc.setFontSize(10);
                doc.text(`Official Faculty Authorization Records - ${new Date().toLocaleDateString()}`, 105, 23, { align: 'center' });
                autoTable(doc, {
                    startY: 40,
                    head: [['Faculty Name', 'Employee ID', 'Official Email', 'Department', 'Status']],
                    body: faculty.map(f => [f.name, f.studentId || 'N/A', f.email, f.department || 'General', f.isActive ? 'Active' : 'Deactivated']),
                    theme: 'grid',
                    headStyles: { fillColor: [30, 64, 175], textColor: [255, 255, 255], fontStyle: 'bold' },
                });
                doc.save(`SOEIT_Institutional_Faculty_Roster_${date}.pdf`);
                toast.success('PDF protocol: Archive generated');
            }
        } catch (error) {
            toast.error('Archive synchronization failed');
        }
    };

    const getInitials = (name) => name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || 'F';

    return (
        <div className="animate-fade-in">
            {/* Header Suite */}
            <div className="page-header" style={{ marginBottom: '2.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                <div>
                    <h2 className="heading-display">Faculty Administration</h2>
                    <p className="page-subtitle">Governance of institutional access, departmental roles, and authentication status for faculty associates.</p>
                </div>
                <div style={{ display: 'flex', gap: '0.875rem' }}>
                    <button className="btn btn-ghost" onClick={() => exportFacultyData('excel')} style={{ border: '1px solid var(--border-primary)', fontWeight: 800 }}>
                        <Download size={18} />
                        <span>Excel Archive</span>
                    </button>
                    <button className="btn btn-primary" onClick={() => exportFacultyData('pdf')} style={{ fontWeight: 800, padding: '0 1.5rem' }}>
                        <Users size={18} />
                        <span>Generate Master Roster</span>
                    </button>
                </div>
            </div>

            {/* Advanced Filtering Intelligence */}
            <div className="card" style={{ padding: '1.5rem', marginBottom: '2rem', border: '1px solid var(--border-primary)' }}>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                    <div style={{ position: 'relative', flex: 1 }}>
                        <Search size={20} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', opacity: 0.6 }} />
                        <input className="form-control" style={{ paddingLeft: '3rem', height: '48px', fontWeight: 600 }} placeholder="Search faculty nomenclature, institutional emails, or professional identifiers..." value={search} onChange={e => setSearch(e.target.value)} onKeyDown={e => e.key === 'Enter' && loadFaculty()} />
                    </div>
                    <button className="btn btn-primary" style={{ height: '48px', padding: '0 2rem', fontWeight: 800 }} onClick={loadFaculty}>
                        Execute Query
                    </button>
                </div>
            </div>

            {/* Registry Table Ecosystem */}
            <div className="card" style={{ border: '1px solid var(--border-primary)', overflow: 'hidden' }}>
                <div className="table-container">
                    {loading ? (
                        <div style={{ padding: '2rem' }}>
                            {[...Array(6)].map((_, i) => <div key={i} className="skeleton" style={{ height: 64, marginBottom: '1rem', borderRadius: '12px' }} />)}
                        </div>
                    ) : faculty.length === 0 ? (
                        <div style={{ padding: '6rem 2rem', textAlign: 'center' }}>
                            <div style={{ width: 80, height: 80, background: 'var(--primary-50)', color: 'var(--brand-600)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem auto' }}>
                                <Users size={40} />
                            </div>
                            <h3 style={{ fontWeight: 900, color: 'var(--text-primary)' }}>No Faculty Records Synchronized</h3>
                            <p style={{ color: 'var(--text-muted)', fontWeight: 600 }}>Refine your search parameters or synchronize the central directory.</p>
                        </div>
                    ) : (
                        <table className="table">
                            <thead>
                                <tr>
                                    <th style={{ paddingLeft: '2rem' }}>Faculty Associate</th>
                                    <th>Authentication Endpoint</th>
                                    <th>Institutional Department</th>
                                    <th style={{ textAlign: 'center' }}>Authorization Status</th>
                                    <th style={{ textAlign: 'right', paddingRight: '2rem' }}>Administration</th>
                                </tr>
                            </thead>
                            <tbody>
                                {faculty.map((f) => (
                                    <tr key={f._id} className="hover-row">
                                        <td style={{ paddingLeft: '2rem' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', padding: '0.75rem 0' }}>
                                                {f.profileImage ? (
                                                    <img src={`${import.meta.env.VITE_UPLOADS_URL || ''}${f.profileImage}`} alt={f.name} style={{ width: 48, height: 48, borderRadius: '12px', objectFit: 'cover', border: '2px solid white', boxShadow: 'var(--shadow-sm)' }} />
                                                ) : (
                                                    <div style={{ width: 48, height: 48, borderRadius: '12px', background: 'var(--primary-100)', color: 'var(--brand-700)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: '1.1rem', border: '2px solid white', boxShadow: 'var(--shadow-sm)' }}>
                                                        {getInitials(f.name)}
                                                    </div>
                                                )}
                                                <div>
                                                    <div style={{ fontWeight: 800, fontSize: '0.95rem', color: 'var(--text-primary)' }}>{f.name}</div>
                                                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 800 }}>EMP ID: {f.studentId || 'NOT ASSIGNED'}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td>
                                            <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
                                                <Mail size={16} style={{ opacity: 0.5, color: 'var(--brand-500)' }} />
                                                {f.email}
                                            </div>
                                        </td>
                                        <td>
                                            <span className="badge badge-brand" style={{ fontWeight: 800, padding: '0.4rem 0.75rem' }}>{f.department || 'General Management'}</span>
                                        </td>
                                        <td style={{ textAlign: 'center' }}>
                                            <span className={`badge ${f.isActive ? 'badge-success' : 'badge-error'}`} style={{ fontSize: '0.7rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.05em', padding: '0.4rem 0.75rem' }}>
                                                {f.isActive ? 'Authorized' : 'Suspended'}
                                            </span>
                                        </td>
                                        <td style={{ textAlign: 'right', paddingRight: '2rem' }}>
                                            <button
                                                className={`btn btn-sm ${f.isActive ? 'btn-ghost' : 'btn-primary'}`}
                                                onClick={() => toggleStatus(f._id, f.isActive)}
                                                style={{ minWidth: '130px', fontWeight: 800, height: '36px', borderRadius: '10px' }}
                                                title={f.isActive ? 'Revoke Institutional Access' : 'Restore Institutional Access'}
                                            >
                                                {f.isActive ? <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--error-600)' }}><UserX size={16} /><span>Disable Access</span></div> : <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><UserCheck size={16} /><span>Grant Access</span></div>}
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </div>
    );
};

export default FacultyManagementPage;
