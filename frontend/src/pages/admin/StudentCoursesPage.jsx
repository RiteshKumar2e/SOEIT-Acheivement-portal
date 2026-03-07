import { useState, useEffect } from 'react';
import { courseAPI } from '../../services/api';
import { Search, Filter, BookOpen, GraduationCap, ChevronLeft, ChevronRight, Activity, Eye } from 'lucide-react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

const StudentCoursesPage = () => {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({ department: '', status: '', search: '' });

    const loadAllCourses = async () => {
        setLoading(true);
        try {
            const res = await courseAPI.getAll(filters);
            setCourses(res.data.data);
        } catch {
            toast.error('Failed to load institutional course registry');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const handler = setTimeout(() => {
            loadAllCourses();
        }, 300); // 300ms debounce
        return () => clearTimeout(handler);
    }, [filters.department, filters.status, filters.search]);

    return (
        <div className="animate-fade-in">
            <div className="page-header" style={{ marginBottom: '2.5rem' }}>
                <h2 className="heading-display">Institutional Course Monitoring</h2>
                <p className="page-subtitle">Real-time surveillance of student skill development and platform-based learning trajectories.</p>
            </div>

            <div className="card" style={{ marginBottom: '2.5rem', border: '1px solid var(--border-primary)' }}>
                <div className="card-body" style={{ padding: '1.25rem' }}>
                    <div className="grid-res grid-res-3" style={{ gap: '1rem', alignItems: 'center' }}>
                        <div className="search-wrapper">
                            <input
                                className="form-control"
                                placeholder="Search by Enrollment No, Scholar Name, or Course Protocol..."
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
                            <option value="">Status Resolution: All</option>
                            <option value="Ongoing">Ongoing Certification</option>
                            <option value="Completed">Verified Completion</option>
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
                                <th>Course Resolution</th>
                                <th>Platform Path</th>
                                <th style={{ textAlign: 'center' }}>Progress Metrics</th>
                                <th>Registry Status</th>
                                <th style={{ textAlign: 'right', paddingRight: '2rem' }}>Audit</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                [...Array(5)].map((_, i) => (
                                    <tr key={i}><td colSpan="5" style={{ padding: '0.75rem 2rem' }}><div className="skeleton" style={{ height: 60, borderRadius: '12px' }} /></td></tr>
                                ))
                            ) : courses.length === 0 ? (
                                <tr>
                                    <td colSpan="5" style={{ padding: '6rem 2rem', textAlign: 'center' }}>
                                        <Activity size={48} style={{ opacity: 0.1, margin: '0 auto 1.5rem auto' }} />
                                        <h4 style={{ fontWeight: 800 }}>No analytical records synchronized</h4>
                                        <p style={{ color: 'var(--text-muted)' }}>The database yielded zero matches for the current institutional cohort.</p>
                                    </td>
                                </tr>
                            ) : (
                                courses.map(course => (
                                    <tr key={course.id} className="hover-row">
                                        <td style={{ paddingLeft: '2rem' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '0.5rem 0' }}>
                                                <div style={{ width: 44, height: 44, background: 'var(--primary-100)', color: 'var(--brand-700)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900 }}>
                                                    {course.studentName.charAt(0)}
                                                </div>
                                                <div>
                                                    <div style={{ fontWeight: 800, fontSize: '0.95rem' }}>{course.studentName}</div>
                                                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 800 }}>{course.enrollmentNo || 'ID: ' + course.id.substring(0, 6)}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td>
                                            <div style={{ fontWeight: 800, fontSize: '0.9rem', color: 'var(--text-primary)' }}>{course.courseName}</div>
                                            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 800, textTransform: 'uppercase' }}>DEPT: {course.department}</div>
                                        </td>
                                        <td>
                                            <span style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--text-secondary)' }}>{course.platform}</span>
                                        </td>
                                        <td style={{ textAlign: 'center' }}>
                                            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '1rem', width: '200px' }}>
                                                <div style={{ flex: 1, height: '6px', background: 'var(--slate-100)', borderRadius: '3px', overflow: 'hidden' }}>
                                                    <div style={{ width: `${course.progress}%`, height: '100%', background: 'linear-gradient(90deg, var(--brand-500), var(--brand-700))' }} />
                                                </div>
                                                <span style={{ fontSize: '0.8rem', fontWeight: 900, color: 'var(--brand-700)', minWidth: '40px' }}>{course.progress}%</span>
                                            </div>
                                        </td>
                                        <td style={{ textAlign: 'center' }}>
                                            <span className={`badge ${course.status === 'Completed' ? 'badge-success' : 'badge-warning'}`} style={{ fontWeight: 800, padding: '0.4rem 0.8rem', textTransform: 'uppercase' }}>
                                                {course.status}
                                            </span>
                                        </td>
                                        <td style={{ textAlign: 'right', paddingRight: '2rem' }}>
                                            <Link to={`/portfolio/${course.student_id || course.studentId}`} className="btn btn-ghost" style={{ padding: '0.5rem', color: 'var(--brand-600)' }} title="Audit Scholar Portfolio">
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

export default StudentCoursesPage;
