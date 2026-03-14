import { useState, useEffect } from 'react';
import { courseAPI } from '../../services/api';
import { Plus, Trash2, BookOpen, Clock, CheckCircle2, Book, GraduationCap, ExternalLink, RefreshCw, X } from 'lucide-react';
import toast from 'react-hot-toast';

const MyCoursesPage = () => {
    const [courses, setCourses] = useState([]);
    const [assignedCourses, setAssignedCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showAddModal, setShowAddModal] = useState(false);
    const [syncingId, setSyncingId] = useState(null);
    const [newCourse, setNewCourse] = useState({ 
        courseName: '', 
        platform: '', 
        customPlatform: '', 
        courseLink: '', 
        progress: 0,
        category: 'Technical Core',
        expectedCompletionDate: '',
        skillsToBeLearnt: ''
    });

    const loadData = async () => {
        setLoading(true);
        try {
            const [myRes, assignedRes] = await Promise.all([
                courseAPI.getMy(),
                courseAPI.getMyAssignments()
            ]);
            setCourses(myRes.data.data);
            setAssignedCourses(assignedRes.data.data);
        } catch {
            toast.error('Failed to load courses');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    const handleAddCourse = async (e) => {
        e.preventDefault();
        try {
            const { customPlatform, ...rest } = newCourse;
            const finalPlatform = newCourse.platform === 'Other' ? customPlatform : newCourse.platform;

            if (!finalPlatform) {
                toast.error('Please specify the platform');
                return;
            }

            await courseAPI.add({ ...rest, platform: finalPlatform });
            toast.success('Course added successfully');
            setShowAddModal(false);
            setNewCourse({ 
                courseName: '', 
                platform: '', 
                customPlatform: '', 
                courseLink: '', 
                progress: 0,
                category: 'Technical Core',
                expectedCompletionDate: '',
                skillsToBeLearnt: ''
            });
            loadData();
        } catch (err) {
            toast.error(err.response?.data?.message || 'Initialization failed');
        }
    };

    const handleSyncProgress = async (id, platform) => {
        setSyncingId(id);
        const toastId = toast.loading(`Connecting to ${platform}...`);
        try {
            const res = await courseAPI.syncProgress(id, {}); // Empty creds for now, handled by backend simulation/keys
            toast.success(`Progress synced: ${res.data.data.progress}%`, { id: toastId });
            loadData();
        } catch (err) {
            toast.error(err.response?.data?.message || 'Sync failed', { id: toastId });
        } finally {
            setSyncingId(null);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this course record?')) return;
        try {
            await courseAPI.delete(id);
            toast.success('Course deleted');
            loadData();
        } catch {
            toast.error('Delete operation failed');
        }
    };

    return (
        <>
            <div className="animate-fade-in">
                <div className="page-header" style={{ marginBottom: '2.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                        <h2 className="heading-display">My Courses</h2>
                        <p className="page-subtitle">Track your progress in assigned and personal courses.</p>
                    </div>
                    <button className="btn btn-primary" onClick={() => setShowAddModal(true)} style={{ borderRadius: '12px', padding: '0.75rem 1.5rem', gap: '0.75rem' }}>
                        <Plus size={20} />
                        <span>Add Course</span>
                    </button>
                </div>

                {/* Assigned by Faculty Section */}
                <div style={{ marginBottom: '3.5rem' }}>
                    <div style={{ 
                        display: 'grid', 
                        gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 340px), 1fr))', 
                        gap: '1.5rem' 
                    }}>
                        <GraduationCap size={24} style={{ color: 'var(--brand-600)' }} />
                        <h3 style={{ fontWeight: 900, letterSpacing: '-0.02em' }}>Assigned Courses</h3>
                        {assignedCourses.length > 0 && (
                            <span className="badge badge-brand" style={{ borderRadius: '6px' }}>{assignedCourses.length} Required</span>
                        )}
                    </div>

                    {loading ? (
                        <div className="grid-res grid-res-2" style={{ gap: '1.5rem' }}>
                            {[...Array(2)].map((_, i) => <div key={i} className="skeleton" style={{ height: 180, borderRadius: 'var(--radius-lg)' }} />)}
                        </div>
                    ) : assignedCourses.length === 0 ? (
                        <div className="card" style={{ padding: '3rem 2rem', textAlign: 'center' }}>
                            <GraduationCap size={40} style={{ opacity: 0.2, margin: '0 auto 1rem auto', color: 'var(--brand-600)' }} />
                            <h4 style={{ fontWeight: 800, color: 'var(--brand-700)' }}>No assigned courses</h4>
                            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>You're all caught up with your requirements.</p>
                        </div>
                    ) : (
                        <div className="grid-res grid-res-2" style={{ gap: '1.5rem' }}>
                            {assignedCourses.map(ass => (
                                <div key={ass.id} className="card" style={{ position: 'relative', overflow: 'hidden' }}>
                                    <div className="card-body" style={{ padding: '2rem' }}>
                                        <div style={{ display: 'flex', gap: '1.25rem', alignItems: 'flex-start' }}>
                                            <div style={{ width: 56, height: 56, background: 'var(--brand-600)', color: 'white', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                                <Book size={28} />
                                            </div>
                                            <div style={{ flex: 1 }}>
                                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                                    <div>
                                                        <h4 style={{ fontWeight: 900, fontSize: '1.2rem', color: 'var(--brand-700)', marginBottom: '0.25rem' }}>{ass.course_name}</h4>
                                                        <div style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase' }}>{ass.subject}</div>
                                                    </div>
                                                    <span className="badge badge-success" style={{ borderRadius: '6px', fontSize: '0.7rem' }}>REQUIRED</span>
                                                </div>
                                                <p style={{ marginTop: '1rem', fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>{ass.description || 'No additional details provided.'}</p>
                                                
                                                {ass.course_link && (
                                                    <a 
                                                        href={ass.course_link} 
                                                        target="_blank" 
                                                        rel="noopener noreferrer"
                                                        className="btn btn-primary"
                                                        style={{ 
                                                            marginTop: '1.25rem', 
                                                            width: '100%', 
                                                            justifyContent: 'center', 
                                                            gap: '0.5rem',
                                                            fontSize: '0.85rem',
                                                            fontWeight: 800,
                                                            borderRadius: '12px',
                                                            padding: '0.75rem'
                                                        }}
                                                    >
                                                        <ExternalLink size={16} />
                                                        Go to Course
                                                    </a>
                                                )}
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginTop: '1.5rem', paddingTop: '1.25rem', borderTop: '1px solid rgba(0,0,0,0.05)' }}>
                                                    <div className="avatar avatar-sm" style={{ width: 32, height: 32 }}>{ass.faculty_name.charAt(0)}</div>
                                                    <div style={{ fontSize: '0.8rem', fontWeight: 800 }}>Assigned by: <span style={{ color: 'var(--brand-600)' }}>{ass.faculty_name}</span></div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
                    <BookOpen size={24} style={{ color: 'var(--text-primary)' }} />
                    <h3 style={{ fontWeight: 900, letterSpacing: '-0.02em' }}>Personal Courses</h3>
                </div>

                {loading ? (
                    <div className="grid-res grid-res-3" style={{ gap: '1.5rem' }}>
                        {[...Array(3)].map((_, i) => <div key={i} className="skeleton" style={{ height: 220, borderRadius: 'var(--radius-lg)' }} />)}
                    </div>
                ) : courses.length === 0 ? (
                    <div className="card" style={{ padding: '6rem 2rem', textAlign: 'center' }}>
                        <BookOpen size={64} style={{ opacity: 0.1, margin: '0 auto 1.5rem auto' }} />
                        <h3 style={{ fontWeight: 800 }}>No courses added yet</h3>
                        <p style={{ color: 'var(--text-muted)' }}>Click "Add Course" to get started.</p>
                    </div>
                ) : (
                    <div className="grid-res grid-res-3" style={{ gap: '1.5rem' }}>
                        {courses.map(course => (
                            <div key={course.id} className="card course-card animate-scale-in" style={{ padding: '1.75rem', border: '1px solid var(--border-primary)', position: 'relative', overflow: 'hidden' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
                                    <div style={{ width: 44, height: 44, background: 'var(--primary-50)', color: 'var(--brand-700)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <BookOpen size={22} />
                                    </div>
                                    <button className="btn btn-ghost btn-sm text-danger" onClick={() => handleDelete(course.id)} style={{ padding: '0.5rem' }}>
                                        <Trash2 size={16} />
                                    </button>
                                </div>

                                <h4 style={{ fontSize: '1.1rem', fontWeight: 850, margin: '0 0 0.5rem 0', color: 'var(--text-primary)' }}>{course.course_name}</h4>
                                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 700, marginBottom: '1.5rem' }}>{course.platform}</p>

                                <div style={{ marginBottom: '1.5rem' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                                        <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)' }}>PROGRESS</span>
                                        <span style={{ fontSize: '0.75rem', fontWeight: 900, color: 'var(--brand-700)' }}>{course.progress}%</span>
                                    </div>
                                    <div style={{ height: '8px', background: 'var(--slate-100)', borderRadius: '4px', overflow: 'hidden' }}>
                                        <div style={{ width: `${course.progress}%`, height: '100%', background: 'linear-gradient(90deg, var(--brand-500), var(--brand-700))', transition: 'width 0.5s ease' }} />
                                    </div>
                                </div>

                                <div style={{ display: 'flex', gap: '0.75rem' }}>
                                    <button
                                        className="btn btn-primary w-full"
                                        style={{ fontSize: '0.8rem', fontWeight: 800, padding: '0.75rem', borderRadius: '10px', gap: '0.5rem' }}
                                        onClick={() => handleSyncProgress(course.id, course.platform)}
                                        disabled={syncingId === course.id || course.progress >= 100}
                                    >
                                        {syncingId === course.id ? (
                                            <>
                                                <div className="spinner-sm" style={{ width: 14, height: 14 }} />
                                                <span>Syncing...</span>
                                            </>
                                        ) : (
                                            <>
                                                <RefreshCw size={16} />
                                                <span>Sync Progress</span>
                                            </>
                                        )}
                                    </button>
                                    {course.course_link && (
                                        <a 
                                            href={course.course_link} 
                                            target="_blank" 
                                            rel="noopener noreferrer" 
                                            className="btn btn-ghost" 
                                            style={{ padding: '0.75rem', borderRadius: '10px', background: 'var(--slate-50)', color: 'var(--brand-700)' }}
                                            title="View Material"
                                        >
                                            <ExternalLink size={18} />
                                        </a>
                                    )}
                                    {course.last_synced_at && (
                                        <div style={{ position: 'absolute', bottom: '0.5rem', right: '1.75rem', fontSize: '0.6rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                                            Last Synced: {new Date(course.last_synced_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </div>
                                    )}
                                    {course.progress === 100 && (
                                        <div style={{ position: 'absolute', top: '1.25rem', right: '4rem', background: 'var(--success-50)', color: 'var(--success-700)', padding: '0.2rem 0.6rem', borderRadius: '6px', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                                            <CheckCircle2 size={12} />
                                            <span style={{ fontSize: '0.65rem', fontWeight: 900 }}>COMPLETED</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {showAddModal && (
                <div className="modal-overlay">
                    <div className="modal animate-scale-in">
                        <div className="modal-header">
                            <div>
                                <h3 style={{ margin: 0 }}>Add New Course</h3>
                                <p style={{ margin: 0 }}>Initialize a new course in your learning registry.</p>
                            </div>
                            <button className="btn btn-ghost btn-close-red" onClick={() => setShowAddModal(false)}>
                                <X size={24} />
                            </button>
                        </div>
                        <div className="modal-body" style={{ maxHeight: '70vh', overflowY: 'auto', paddingRight: '0.5rem' }}>
                            <form onSubmit={handleAddCourse} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                                <div className="form-group">
                                    <label className="form-label" style={{ fontWeight: 800, fontSize: '0.85rem' }}>Course Name</label>
                                    <input
                                        className="form-control"
                                        style={{ height: '54px', borderRadius: '14px', fontSize: '1rem' }}
                                        placeholder="e.g. Modern React Architecture"
                                        required
                                        value={newCourse.courseName}
                                        onChange={e => setNewCourse({ ...newCourse, courseName: e.target.value })}
                                    />
                                </div>
                                
                                <div className="form-group">
                                    <label className="form-label" style={{ fontWeight: 800, fontSize: '0.85rem' }}>Learning Platform</label>
                                    <select
                                        className="form-control"
                                        style={{ height: '54px', borderRadius: '14px', fontSize: '1rem', fontWeight: 700 }}
                                        required
                                        value={newCourse.platform}
                                        onChange={e => setNewCourse({ ...newCourse, platform: e.target.value })}
                                    >
                                        <option value="">Select Platform</option>
                                        <optgroup label="Premier Platforms">
                                            <option value="Coursera">Coursera</option>
                                            <option value="Udemy">Udemy</option>
                                            <option value="edX">edX</option>
                                            <option value="NPTEL">NPTEL / Swayam</option>
                                            <option value="LinkedIn Learning">LinkedIn Learning</option>
                                        </optgroup>
                                        <optgroup label="Technical & Coding">
                                            <option value="freeCodeCamp">freeCodeCamp</option>
                                            <option value="Codecademy">Codecademy</option>
                                            <option value="GeeksforGeeks">GeeksforGeeks</option>
                                            <option value="W3Schools">W3Schools</option>
                                            <option value="Scalar Academy">Scalar Academy</option>
                                            <option value="GUVI">GUVI</option>
                                        </optgroup>
                                        <optgroup label="Skills & Career">
                                            <option value="Pluralsight">Pluralsight</option>
                                            <option value="Udacity">Udacity</option>
                                            <option value="DataCamp">DataCamp</option>
                                            <option value="Simplilearn">Simplilearn</option>
                                            <option value="UpGrad">UpGrad</option>
                                            <option value="FutureLearn">FutureLearn</option>
                                            <option value="Great Learning">Great Learning</option>
                                            <option value="Intellipaat">Intellipaat</option>
                                            <option value="Khan Academy">Khan Academy</option>
                                        </optgroup>
                                        <option value="Other">Other</option>
                                    </select>
                                </div>

                                <div className="form-group">
                                    <label className="form-label" style={{ fontWeight: 800, fontSize: '0.85rem' }}>Course Category</label>
                                    <select
                                        className="form-control"
                                        style={{ height: '54px', borderRadius: '14px', fontSize: '1rem', fontWeight: 600 }}
                                        required
                                        value={newCourse.category}
                                        onChange={e => setNewCourse({ ...newCourse, category: e.target.value })}
                                    >
                                        <option value="Technical Core">Technical (Programming, CS, etc.)</option>
                                        <option value="Interdisciplinary">Interdisciplinary (Management, Soft Skills)</option>
                                        <option value="Placement Prep">Placement Prep</option>
                                        <option value="Research/Internship">Research / Internship</option>
                                        <option value="Personal Interest">Personal Interest</option>
                                    </select>
                                </div>

                                <div className="form-group">
                                    <label className="form-label" style={{ fontWeight: 800, fontSize: '0.85rem' }}>Expected Completion Date</label>
                                    <input
                                        type="date"
                                        className="form-control"
                                        style={{ height: '54px', borderRadius: '14px' }}
                                        required
                                        value={newCourse.expectedCompletionDate}
                                        onChange={e => setNewCourse({ ...newCourse, expectedCompletionDate: e.target.value })}
                                    />
                                </div>

                                <div className="form-group">
                                    <label className="form-label" style={{ fontWeight: 800, fontSize: '0.85rem' }}>Skills you wish to learn</label>
                                    <input
                                        className="form-control"
                                        style={{ height: '54px', borderRadius: '14px' }}
                                        placeholder="e.g. React, Docker, Data Structures"
                                        value={newCourse.skillsToBeLearnt}
                                        onChange={e => setNewCourse({ ...newCourse, skillsToBeLearnt: e.target.value })}
                                    />
                                </div>

                                {newCourse.platform === 'Other' && (
                                    <div className="form-group animate-fade-in">
                                        <label className="form-label" style={{ fontWeight: 800, fontSize: '0.85rem' }}>Specify Platform</label>
                                        <input
                                            className="form-control"
                                            style={{ height: '54px', borderRadius: '14px' }}
                                            placeholder="e.g. edX, Pluralsight, etc."
                                            required
                                            value={newCourse.customPlatform}
                                            onChange={e => setNewCourse({ ...newCourse, customPlatform: e.target.value })}
                                        />
                                    </div>
                                )}
                                <div className="form-group">
                                    <label className="form-label" style={{ fontWeight: 800, fontSize: '0.85rem' }}>Course Link (Optional)</label>
                                    <input
                                        type="url"
                                        className="form-control"
                                        style={{ height: '54px', borderRadius: '14px', fontSize: '1rem' }}
                                        placeholder="https://..."
                                        value={newCourse.courseLink}
                                        onChange={e => setNewCourse({ ...newCourse, courseLink: e.target.value })}
                                    />
                                </div>


                                 <div className="modal-actions-responsive">
                                    <button type="button" className="btn btn-secondary cancel-btn" onClick={() => setShowAddModal(false)}>Cancel</button>
                                    <button type="submit" className="btn btn-primary submit-btn">Add Course</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default MyCoursesPage;
