import { useState, useEffect } from 'react';
import { courseAPI } from '../../services/api';
import { Search, Filter, BookOpen, GraduationCap, ChevronLeft, ChevronRight, Activity, Eye, Plus, Trash2, User, Book, Hash, RefreshCw, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

const StudentCoursesPage = () => {
    const [courses, setCourses] = useState([]);
    const [assignments, setAssignments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('progress'); // 'progress' or 'assignments'
    const [filters, setFilters] = useState({ department: '', status: '', search: '' });
    const [showAssignModal, setShowAssignModal] = useState(false);
    const [selectedCourse, setSelectedCourse] = useState(null);
    const [showDetailsModal, setShowDetailsModal] = useState(false);
    const [assignmentForm, setAssignmentForm] = useState({
        courseName: '',
        subject: '',
        description: '',
        department: '',
        semester: '',
        courseLink: ''
    });

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

    const loadAssignments = async () => {
        setLoading(true);
        try {
            const res = await courseAPI.getAssignments();
            setAssignments(res.data.data);
        } catch {
            toast.error('Failed to fetch departmental allocations');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (activeTab === 'progress') {
            const handler = setTimeout(() => {
                loadAllCourses();
            }, 300);
            return () => clearTimeout(handler);
        } else {
            loadAssignments();
        }
    }, [filters.department, filters.status, filters.search, activeTab]);

    const handleAssignCourse = async (e) => {
        e.preventDefault();
        try {
            await courseAPI.assign(assignmentForm);
            toast.success('Course assigned to cohort successfully');
            setShowAssignModal(false);
            setAssignmentForm({ courseName: '', subject: '', description: '', department: '', semester: '', courseLink: '' });
            loadAssignments();
        } catch (err) {
            toast.error(err.response?.data?.message || 'Assignment failed');
        }
    };

    const handleDeleteAssignment = async (id) => {
        if (!window.confirm('Are you sure you want to delete this allocation?')) return;
        try {
            await courseAPI.deleteAssignment(id);
            toast.success('Allocation deleted from registry');
            loadAssignments();
        } catch {
            toast.error('De-allocation failed');
        }
    };

    return (
        <>
            <div className="animate-fade-in">
            <div className="page-header" style={{ marginBottom: '2.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <h2 className="heading-display">Course Management</h2>
                    <p className="page-subtitle">Track student progress and assign courses to different departments.</p>
                </div>
                {activeTab === 'assignments' && (
                    <button className="btn btn-primary" onClick={() => setShowAssignModal(true)} style={{ borderRadius: '12px', padding: '0.75rem 1.5rem', gap: '0.75rem' }}>
                        <Plus size={20} />
                        Assign New Course
                    </button>
                )}
            </div>

            <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', borderBottom: '1px solid var(--border-primary)', paddingBottom: '1px' }}>
                <button 
                    onClick={() => setActiveTab('progress')}
                    style={{ 
                        padding: '1rem 1.5rem', 
                        fontWeight: 800, 
                        fontSize: '0.9rem', 
                        color: activeTab === 'progress' ? 'var(--brand-600)' : 'var(--text-muted)',
                        borderBottom: activeTab === 'progress' ? '3px solid var(--brand-600)' : '3px solid transparent',
                        transition: 'all 0.2s'
                    }}
                >
                    Student Progress
                </button>
                <button 
                    onClick={() => setActiveTab('assignments')}
                    style={{ 
                        padding: '1rem 1.5rem', 
                        fontWeight: 800, 
                        fontSize: '0.9rem', 
                        color: activeTab === 'assignments' ? 'var(--brand-600)' : 'var(--text-muted)',
                        borderBottom: activeTab === 'assignments' ? '3px solid var(--brand-600)' : '3px solid transparent',
                        transition: 'all 0.2s'
                    }}
                >
                    Assigned Courses
                </button>
            </div>

            {activeTab === 'progress' ? (
                <>
                    <div className="card" style={{ marginBottom: '2.5rem', border: '1px solid var(--border-primary)' }}>
                        <div className="card-body" style={{ padding: '1.25rem' }}>
                            <div className="filter-grid-container" style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
                                <div className="search-wrapper flex-order-last-desktop" style={{ flex: 1, minWidth: '280px' }}>
                                    <input
                                        className="form-control"
                                        placeholder="Search by Name, Roll No or Course..."
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
                                <select
                                    className="form-control"
                                    style={{ fontWeight: 700, flex: 1, minWidth: '200px' }}
                                    value={filters.status}
                                    onChange={e => setFilters({ ...filters, status: e.target.value })}
                                >
                                    <option value="">Filter by Status</option>
                                    <option value="Ongoing">Ongoing</option>
                                    <option value="Completed">Completed</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* ── Desktop Table ── */}
                    <div className="card desktop-only" style={{ border: '1px solid var(--border-primary)', overflow: 'hidden' }}>
                        <div style={{ overflowX: 'auto', width: '100%' }}>
                            <table className="table" style={{ minWidth: 800 }}>
                                <thead>
                                    <tr>
                                        <th style={{ paddingLeft: '2rem' }}>Student Name</th>
                                        <th>Course &amp; Category</th>
                                        <th>Platform</th>
                                        <th>Target Date</th>
                                        <th style={{ textAlign: 'center' }}>Progress</th>
                                        <th>Status</th>
                                        <th style={{ textAlign: 'right', paddingRight: '2rem' }}>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {loading ? (
                                        [...Array(5)].map((_, i) => (
                                            <tr key={i}><td colSpan="7" style={{ padding: '0.75rem 2rem' }}><div className="skeleton" style={{ height: 60, borderRadius: '12px' }} /></td></tr>
                                        ))
                                    ) : courses.length === 0 ? (
                                        <tr>
                                            <td colSpan="7" style={{ padding: '6rem 2rem', textAlign: 'center' }}>
                                                <Activity size={48} style={{ opacity: 0.1, margin: '0 auto 1.5rem auto' }} />
                                                <h4 style={{ fontWeight: 800 }}>No course records found</h4>
                                            </td>
                                        </tr>
                                    ) : (
                                        courses.map(course => (
                                            <tr key={course.id} className="hover-row">
                                                <td style={{ paddingLeft: '2rem' }}>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '0.5rem 0' }}>
                                                        <div style={{ width: 44, height: 44, background: 'var(--primary-100)', color: 'var(--brand-700)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, flexShrink: 0 }}>
                                                            {course.studentName.charAt(0)}
                                                        </div>
                                                        <div>
                                                            <div style={{ fontWeight: 800, fontSize: '0.95rem' }}>{course.studentName}</div>
                                                            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 800 }}>{course.enrollmentNo}</div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td>
                                                    <div style={{ fontWeight: 800, fontSize: '0.9rem' }}>{course.courseName}</div>
                                                    <div style={{ display: 'flex', gap: '0.4rem', marginTop: '0.2rem', flexWrap: 'wrap' }}>
                                                        <span style={{ fontSize: '0.65rem', background: 'var(--brand-50)', color: 'var(--brand-700)', padding: '2px 6px', borderRadius: '4px', fontWeight: 900 }}>{course.category}</span>
                                                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 800 }}>{course.department}</span>
                                                    </div>
                                                    {course.skillsToBeLearnt && (
                                                        <div style={{ fontSize: '0.7rem', color: 'var(--brand-600)', fontWeight: 700, marginTop: '2px', fontStyle: 'italic' }}>
                                                            Targeting: {course.skillsToBeLearnt}
                                                        </div>
                                                    )}
                                                </td>
                                                <td><span style={{ fontSize: '0.85rem', fontWeight: 800 }}>{course.platform}</span></td>
                                                <td>
                                                    <div style={{ fontSize: '0.85rem', fontWeight: 800 }}>
                                                        {course.expectedCompletionDate ? new Date(course.expectedCompletionDate).toLocaleDateString() : 'N/A'}
                                                    </div>
                                                </td>
                                                <td style={{ textAlign: 'center' }}>
                                                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.75rem', width: '180px' }}>
                                                        <div style={{ flex: 1, height: '6px', background: 'var(--slate-100)', borderRadius: '3px', overflow: 'hidden' }}>
                                                            <div style={{ width: `${course.progress}%`, height: '100%', background: 'var(--brand-600)' }} />
                                                        </div>
                                                        <div style={{ textAlign: 'right', minWidth: 36 }}>
                                                            <div style={{ fontSize: '0.8rem', fontWeight: 900 }}>{course.progress}%</div>
                                                            {course.lastSyncedAt && (
                                                                <div style={{ fontSize: '0.6rem', color: 'var(--text-muted)', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '3px', justifyContent: 'flex-end' }}>
                                                                    <RefreshCw size={8} />
                                                                    {new Date(course.lastSyncedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                </td>
                                                <td>
                                                    <span className={`badge ${course.status === 'Completed' ? 'badge-success' : 'badge-warning'}`} style={{ fontWeight: 800 }}>{course.status}</span>
                                                </td>
                                                <td style={{ textAlign: 'right', paddingRight: '2rem' }}>
                                                    <button 
                                                        className="btn btn-ghost" 
                                                        style={{ color: 'var(--brand-600)' }}
                                                        onClick={() => { setSelectedCourse(course); setShowDetailsModal(true); }}
                                                    >
                                                        <Eye size={20} />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* ── Mobile Cards ── */}
                    <div className="mobile-only" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {loading ? (
                            [...Array(4)].map((_, i) => <div key={i} className="skeleton" style={{ height: 140, borderRadius: '16px' }} />)
                        ) : courses.length === 0 ? (
                            <div style={{ padding: '4rem 1rem', textAlign: 'center', background: 'var(--bg-secondary)', borderRadius: '16px' }}>
                                <Activity size={40} style={{ opacity: 0.15, marginBottom: '1rem' }} />
                                <h4 style={{ fontWeight: 800, color: 'var(--text-secondary)' }}>No course records found</h4>
                            </div>
                        ) : (
                            courses.map(course => (
                                <div key={course.id} className="card" style={{ border: '1px solid var(--border-primary)', borderRadius: '16px', padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
                                    {/* Row 1 – Student + Action */}
                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.75rem' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', minWidth: 0 }}>
                                            <div style={{ width: 40, height: 40, background: 'var(--primary-100)', color: 'var(--brand-700)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, flexShrink: 0 }}>
                                                {course.studentName.charAt(0)}
                                            </div>
                                            <div style={{ minWidth: 0 }}>
                                                <div style={{ fontWeight: 800, fontSize: '0.9rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{course.studentName}</div>
                                                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 700 }}>{course.enrollmentNo}</div>
                                            </div>
                                        </div>
                                        <button 
                                            className="btn btn-ghost" 
                                            style={{ color: 'var(--brand-600)', flexShrink: 0 }}
                                            onClick={() => { setSelectedCourse(course); setShowDetailsModal(true); }}
                                        >
                                            <Eye size={18} />
                                        </button>
                                    </div>

                                    {/* Row 2 – Course name + badges */}
                                    <div>
                                        <div style={{ fontWeight: 800, fontSize: '0.9rem', marginBottom: '0.35rem' }}>{course.courseName}</div>
                                        <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', alignItems: 'center' }}>
                                            <span style={{ fontSize: '0.65rem', background: 'var(--brand-50)', color: 'var(--brand-700)', padding: '2px 7px', borderRadius: '4px', fontWeight: 900 }}>{course.category}</span>
                                            <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 700 }}>{course.department}</span>
                                            {course.skillsToBeLearnt && (
                                                <span style={{ fontSize: '0.68rem', color: 'var(--brand-600)', fontWeight: 700, fontStyle: 'italic' }}>· Targeting: {course.skillsToBeLearnt}</span>
                                            )}
                                        </div>
                                    </div>

                                    {/* Row 3 – Meta info */}
                                    <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 700 }}>
                                        <span><strong style={{ color: 'var(--text-primary)' }}>Platform:</strong> {course.platform || 'N/A'}</span>
                                        <span><strong style={{ color: 'var(--text-primary)' }}>Due:</strong> {course.expectedCompletionDate ? new Date(course.expectedCompletionDate).toLocaleDateString() : 'N/A'}</span>
                                    </div>

                                    {/* Row 4 – Progress + Status */}
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                        <div style={{ flex: 1, height: '6px', background: 'var(--slate-100)', borderRadius: '3px', overflow: 'hidden' }}>
                                            <div style={{ width: `${course.progress}%`, height: '100%', background: 'var(--brand-600)' }} />
                                        </div>
                                        <span style={{ fontSize: '0.8rem', fontWeight: 900, minWidth: 36 }}>{course.progress}%</span>
                                        <span className={`badge ${course.status === 'Completed' ? 'badge-success' : 'badge-warning'}`} style={{ fontWeight: 800, flexShrink: 0 }}>{course.status}</span>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </>
            ) : (
                <div className="grid-res grid-res-2" style={{ gap: '1.5rem' }}>
                    {loading ? (
                        [...Array(4)].map((_, i) => <div key={i} className="skeleton" style={{ height: 200, borderRadius: '20px' }} />)
                    ) : assignments.length === 0 ? (
                        <div className="col-span-full" style={{ padding: '6rem 2rem', textAlign: 'center', background: 'var(--bg-secondary)', borderRadius: '20px' }}>
                            <BookOpen size={48} style={{ opacity: 0.1, marginBottom: '1.5rem' }} />
                            <h4 style={{ fontWeight: 800 }}>No courses assigned yet</h4>
                            <p className="text-muted">Faculty can assign courses to specific departments and semesters.</p>
                        </div>
                    ) : (
                        assignments.map(ass => (
                            <div key={ass.id} className="card" style={{ borderRadius: '20px', border: '1px solid var(--border-primary)', position: 'relative' }}>
                                <div className="card-body" style={{ padding: '2rem' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                                        <div style={{ width: 48, height: 48, background: 'var(--brand-50)', color: 'var(--brand-600)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                            <Book size={24} />
                                        </div>
                                        <button onClick={() => handleDeleteAssignment(ass.id)} style={{ color: 'var(--error-500)', opacity: 0.5 }} className="btn btn-ghost"><Trash2 size={18} /></button>
                                    </div>
                                    <h3 style={{ fontWeight: 800, fontSize: '1.2rem', marginBottom: '0.5rem' }}>{ass.course_name}</h3>
                                    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
                                        <span className="badge badge-brand" style={{ borderRadius: '6px' }}>{ass.department}</span>
                                        <span className="badge badge-primary" style={{ borderRadius: '6px' }}>Semester {ass.semester}</span>
                                        <span className="badge" style={{ borderRadius: '6px', background: 'var(--slate-100)', color: 'var(--slate-700)' }}>{ass.subject}</span>
                                    </div>
                                    <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1.5rem', lineHeight: 1.6 }}>{ass.description}</p>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', paddingTop: '1rem', borderTop: '1px solid var(--border-primary)' }}>
                                        <div className="avatar avatar-sm">{ass.faculty_name.charAt(0)}</div>
                                        <div style={{ fontSize: '0.8rem', fontWeight: 800 }}>Assigned by: {ass.faculty_name}</div>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            )}
        </div>

        {showAssignModal && (
                <div className="modal-overlay animate-fade-in">
                    <div className="modal animate-scale-in">
                        <div className="modal-header">
                            <div>
                                <h2 style={{ color: '#fff', fontWeight: 900, letterSpacing: '-0.02em', margin: 0 }}>Assign New Course</h2>
                                <p style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '0.9rem', margin: '0.25rem 0 0 0' }}>Select a department and semester to assign a course.</p>
                            </div>
                            <button type="button" className="btn btn-ghost" onClick={() => setShowAssignModal(false)} style={{ color: '#ef4444', borderRadius: '50%', width: 44, height: 44, padding: 0 }}>
                                <X size={24} />
                            </button>
                        </div>
                        <div className="modal-body">
                            <form onSubmit={handleAssignCourse}>
                            <div className="form-group">
                                <label className="form-label" style={{ fontWeight: 800 }}>Course Name</label>
                                <input 
                                    className="form-control" 
                                    style={{ height: '50px', borderRadius: '12px' }}
                                    placeholder="e.g., Full Stack Development"
                                    required
                                    value={assignmentForm.courseName}
                                    onChange={e => setAssignmentForm({...assignmentForm, courseName: e.target.value})}
                                />
                            </div>
                            <div className="grid-res grid-res-2" style={{ gap: '1rem' }}>
                                <div className="form-group">
                                    <label className="form-label" style={{ fontWeight: 800 }}>Subject</label>
                                    <input 
                                        className="form-control" 
                                        style={{ height: '50px', borderRadius: '12px' }}
                                        placeholder="e.g., Web Technologies"
                                        required
                                        value={assignmentForm.subject}
                                        onChange={e => setAssignmentForm({...assignmentForm, subject: e.target.value})}
                                    />
                                </div>
                                <div className="form-group">
                                    <label className="form-label" style={{ fontWeight: 800 }}>Semester</label>
                                    <select 
                                        className="form-control"
                                        style={{ height: '50px', borderRadius: '12px', fontWeight: 800 }}
                                        required
                                        value={assignmentForm.semester}
                                        onChange={e => setAssignmentForm({...assignmentForm, semester: e.target.value})}
                                    >
                                        <option value="">Select Semester</option>
                                        {[1,2,3,4,5,6,7,8].map(s => <option key={s} value={s}>Semester {s}</option>)}
                                    </select>
                                </div>
                            </div>
                            <div className="form-group">
                                <label className="form-label" style={{ fontWeight: 800 }}>Department</label>
                                <select 
                                    className="form-control"
                                    style={{ height: '50px', borderRadius: '12px', fontWeight: 800 }}
                                    required
                                    value={assignmentForm.department}
                                    onChange={e => setAssignmentForm({...assignmentForm, department: e.target.value})}
                                >
                                    <option value="">Select Department</option>
                                    {['CSE', 'AIDS (IBM)', 'AIML', 'ME', 'EEE', 'BCA (Regular)', 'AIDL', 'Cybersecurity', 'DCSE', 'DME', 'DEEE'].map(d => (
                                        <option key={d} value={d}>{d}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="form-group">
                                <label className="form-label" style={{ fontWeight: 800 }}>Description</label>
                                <textarea 
                                    className="form-control" 
                                    placeholder="Add any instructions or details about the course..."
                                    style={{ borderRadius: '15px', padding: '1rem' }}
                                    rows={3}
                                    value={assignmentForm.description}
                                    onChange={e => setAssignmentForm({...assignmentForm, description: e.target.value})}
                                />
                            </div>
                            <div className="form-group">
                                <label className="form-label" style={{ fontWeight: 800 }}>Course Link (Optional)</label>
                                <input 
                                    className="form-control" 
                                    style={{ height: '50px', borderRadius: '12px' }}
                                    placeholder="https://example.com/course"
                                    value={assignmentForm.courseLink}
                                    onChange={e => setAssignmentForm({...assignmentForm, courseLink: e.target.value})}
                                />
                            </div>
                            <div style={{ display: 'flex', gap: '1rem', marginTop: '2.5rem' }}>
                                <button type="button" className="btn btn-secondary" style={{ flex: 1, height: '54px', borderRadius: '15px' }} onClick={() => setShowAssignModal(false)}>Cancel</button>
                                <button type="submit" className="btn btn-primary" style={{ flex: 2, height: '54px', borderRadius: '15px', fontWeight: 800 }}>Assign Course</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        )}
        {showDetailsModal && selectedCourse && (
                <div className="modal-overlay animate-fade-in" onClick={() => setShowDetailsModal(false)}>
                    <div className="modal animate-scale-in" onClick={e => e.stopPropagation()} style={{ maxWidth: '600px' }}>
                        <div className="modal-header" style={{ background: 'var(--brand-600)' }}>
                            <div>
                                <h2 style={{ color: '#fff', fontWeight: 900, letterSpacing: '-0.02em', margin: 0 }}>Course Intelligence</h2>
                                <p style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '0.9rem', margin: '0.25rem 0 0 0' }}>Detailed analytical view of the student's learning trajectory.</p>
                            </div>
                            <button className="btn btn-ghost" onClick={() => setShowDetailsModal(false)} style={{ color: '#fff', opacity: 0.8 }}>
                                <X size={24} />
                            </button>
                        </div>
                        <div className="modal-body" style={{ padding: '2rem' }}>
                            {/* Student Profile Header in Modal */}
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', marginBottom: '2rem', padding: '1.25rem', background: 'var(--primary-50)', borderRadius: '16px', border: '1px solid var(--primary-100)' }}>
                                <div style={{ width: 56, height: 56, background: 'white', color: 'var(--brand-700)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: '1.25rem', boxShadow: 'var(--shadow-sm)' }}>
                                    {selectedCourse.studentName.charAt(0)}
                                </div>
                                <div>
                                    <div style={{ fontWeight: 900, fontSize: '1.1rem', color: 'var(--brand-800)' }}>{selectedCourse.studentName}</div>
                                    <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 800 }}>{selectedCourse.enrollmentNo} • {selectedCourse.department}</div>
                                </div>
                            </div>

                            {/* Course Metrics */}
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
                                <div className="detail-item">
                                    <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 900, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.4rem', letterSpacing: '0.05em' }}>Course Name</label>
                                    <div style={{ fontWeight: 800, fontSize: '1rem', color: 'var(--text-primary)' }}>{selectedCourse.courseName}</div>
                                </div>
                                <div className="detail-item">
                                    <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 900, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.4rem', letterSpacing: '0.05em' }}>Platform</label>
                                    <div style={{ fontWeight: 800, fontSize: '1rem', color: 'var(--brand-600)' }}>{selectedCourse.platform}</div>
                                </div>
                                <div className="detail-item">
                                    <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 900, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.4rem', letterSpacing: '0.05em' }}>Category</label>
                                    <div><span className="badge badge-primary" style={{ borderRadius: '6px', fontSize: '0.75rem', fontWeight: 800 }}>{selectedCourse.category}</span></div>
                                </div>
                                <div className="detail-item">
                                    <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 900, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.4rem', letterSpacing: '0.05em' }}>Target Date</label>
                                    <div style={{ fontWeight: 800, fontSize: '0.95rem' }}>{selectedCourse.expectedCompletionDate ? new Date(selectedCourse.expectedCompletionDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : 'N/A'}</div>
                                </div>
                            </div>

                            {/* Progress Analytics */}
                            <div style={{ marginBottom: '2rem', padding: '1.5rem', border: '1px solid var(--border-primary)', borderRadius: '16px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                        <Activity size={16} className="text-brand" />
                                        <span style={{ fontWeight: 900, fontSize: '0.85rem', color: 'var(--text-primary)' }}>PROGRESS TRACKER</span>
                                    </div>
                                    <span style={{ fontWeight: 900, fontSize: '1.1rem', color: 'var(--brand-700)' }}>{selectedCourse.progress}%</span>
                                </div>
                                <div style={{ height: '10px', background: 'var(--slate-100)', borderRadius: '5px', overflow: 'hidden', marginBottom: '0.75rem' }}>
                                    <div style={{ width: `${selectedCourse.progress}%`, height: '100%', background: 'linear-gradient(90deg, var(--brand-500), var(--brand-700))', borderRadius: '5px' }} />
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', fontWeight: 800, color: 'var(--text-muted)' }}>
                                    <span style={{ textTransform: 'uppercase' }}>Status: {selectedCourse.status}</span>
                                    {selectedCourse.lastSyncedAt && (
                                        <span>LAST SYNCED: {new Date(selectedCourse.lastSyncedAt).toLocaleString()}</span>
                                    )}
                                </div>
                            </div>

                            {/* Skills Section */}
                            {selectedCourse.skillsToBeLearnt && (
                                <div style={{ marginBottom: '2rem' }}>
                                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 900, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.75rem', letterSpacing: '0.05em' }}>Skills Acquisition Goal</label>
                                    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                                        {selectedCourse.skillsToBeLearnt.split(',').map((skill, i) => (
                                            <span key={i} style={{ background: 'var(--slate-100)', color: 'var(--slate-700)', padding: '0.4rem 0.8rem', borderRadius: '8px', fontSize: '0.8rem', fontWeight: 700 }}>
                                                {skill.trim()}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Action Buttons */}
                            <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                                {selectedCourse.courseLink && (
                                    <a 
                                        href={selectedCourse.courseLink} 
                                        target="_blank" 
                                        rel="noopener noreferrer" 
                                        className="btn btn-ghost" 
                                        style={{ flex: 1, height: '52px', borderRadius: '14px', border: '1px solid var(--border-primary)', fontWeight: 800, gap: '0.5rem' }}
                                    >
                                        <Book size={18} />
                                        Course Material
                                    </a>
                                )}
                                <Link 
                                    to={`/portfolio/${selectedCourse.studentId}`} 
                                    className="btn btn-primary" 
                                    style={{ flex: 1.5, height: '52px', borderRadius: '14px', fontWeight: 900, gap: '0.75rem' }}
                                >
                                    <User size={18} />
                                    Full Portfolio Audit
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default StudentCoursesPage;
