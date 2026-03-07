import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { achievementAPI } from '../../services/api';
import { Trophy, Star, Search, Users, BookOpen, ChevronRight, Award, ArrowLeft } from 'lucide-react';
import '../../styles/PublicPortfoliosPage.css';

const DEPT_PILLS = ['All', 'CSE', 'AIDS (IBM)', 'AIML', 'ME', 'EEE', 'BCA (Regular)', 'AIDL', 'Cybersecurity', 'DCSE', 'DME', 'DEEE'];
const DEPT_GROUPS = [
    { group: 'B.Tech', depts: ['CSE', 'AIDS (IBM)', 'AIML', 'ME', 'EEE'] },
    { group: 'BCA', depts: ['BCA (Regular)', 'AIDL', 'Cybersecurity'] },
    { group: 'Diploma', depts: ['DCSE', 'DME', 'DEEE'] },
];

const getInitials = (name) =>
    name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || 'S';

const StudentCard = ({ student }) => {
    const sid = student._id || student.id;
    return (
        <Link to={`/portfolio/${sid}`} className="pp-card">
            <div className="pp-card-header">
                {student.profileImage ? (
                    <img src={student.profileImage} alt={student.name} className="pp-avatar-img" />
                ) : (
                    <div className="pp-avatar-initial">{getInitials(student.name)}</div>
                )}
                <div className="pp-card-info">
                    <h3 className="pp-student-name">{student.name}</h3>
                    <p className="pp-student-meta">
                        {student.department || 'N/A'} {student.batch ? `• ${student.batch}` : ''}
                    </p>
                    {student.enrollmentNo && (
                        <p className="pp-student-enroll">{student.enrollmentNo}</p>
                    )}
                </div>
            </div>

            {student.bio && (
                <p className="pp-student-bio">{student.bio}</p>
            )}

            <div className="pp-stats-row">
                <div className="pp-stat">
                    <Trophy size={13} />
                    <span>{student.achievementCount}</span>
                    <span className="pp-stat-label">Achievements</span>
                </div>
                <div className="pp-stat">
                    <Star size={13} />
                    <span>{student.totalPoints}</span>
                    <span className="pp-stat-label">Points</span>
                </div>
                <div className="pp-stat">
                    <Award size={13} />
                    <span>{student.categoryCount}</span>
                    <span className="pp-stat-label">Categories</span>
                </div>
            </div>

            <div className="pp-card-footer">
                <span className="pp-view-link">View Portfolio <ChevronRight size={14} /></span>
            </div>
        </Link>
    );
};

const PublicPortfoliosPage = () => {
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [department, setDepartment] = useState('All');
    const [debouncedSearch, setDebouncedSearch] = useState('');

    // Debounce search
    useEffect(() => {
        const t = setTimeout(() => setDebouncedSearch(search), 350);
        return () => clearTimeout(t);
    }, [search]);

    useEffect(() => {
        setLoading(true);
        const params = {};
        if (department !== 'All') params.department = department;
        if (debouncedSearch) params.search = debouncedSearch;

        achievementAPI.getPublicStudents(params)
            .then(res => setStudents(res.data.data || []))
            .catch(() => setStudents([]))
            .finally(() => setLoading(false));
    }, [department, debouncedSearch]);

    const totalAchievements = students.reduce((s, st) => s + (st.achievementCount || 0), 0);

    return (
        <div className="pp-page">
            {/* Back Button */}
            <div style={{ position: 'fixed', top: '1.5rem', left: '1.5rem', zIndex: 100 }}>
                <Link to="/" className="btn btn-secondary" style={{ fontWeight: 700, borderRadius: '12px', boxShadow: '0 10px 30px rgba(0,0,0,0.1)', backdropFilter: 'blur(10px)', border: '1px solid var(--border-primary)', padding: '0.6rem 1.25rem' }}>
                    <ArrowLeft size={16} /> Back to Home
                </Link>
            </div>
            {/* Hero */}

            <div className="pp-hero">
                <div className="container">
                    <div className="pp-hero-inner">
                        <div className="pp-hero-badge">
                            <Users size={16} /> Student Directory
                        </div>
                        <h1 className="pp-hero-title">Public Portfolios</h1>
                        <p className="pp-hero-sub">
                            Explore verified achievements of SOEIT students across all departments.
                        </p>
                        <div className="pp-hero-stats">
                            <div className="pp-hero-stat">
                                <span className="pp-hero-stat-num">{students.length}</span>
                                <span className="pp-hero-stat-lbl">Students</span>
                            </div>
                            <div className="pp-hero-stat-div" />
                            <div className="pp-hero-stat">
                                <span className="pp-hero-stat-num">{totalAchievements}</span>
                                <span className="pp-hero-stat-lbl">Verified Achievements</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Filters */}
            <div className="pp-filters-bar">
                <div className="container">
                    <div className="pp-filters-inner">
                        {/* Search */}
                        <div className="pp-search-wrap">
                            <Search size={16} className="pp-search-icon" />
                            <input
                                type="text"
                                className="pp-search-input"
                                placeholder="Search by name or enrollment no..."
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                            />
                        </div>

                        {/* Department pills — desktop */}
                        <div className="pp-dept-pills desktop-only">
                            {DEPT_PILLS.map(d => (
                                <button
                                    key={d}
                                    className={`pp-dept-pill ${department === d ? 'active' : ''}`}
                                    onClick={() => setDepartment(d)}
                                >
                                    {d}
                                </button>
                            ))}
                        </div>

                        {/* Department dropdown — mobile */}
                        <div className="pp-dept-select mobile-only">
                            <select
                                className="form-control"
                                value={department}
                                onChange={e => setDepartment(e.target.value)}
                                style={{ borderRadius: '12px', fontWeight: 700 }}
                            >
                                <option value="All">All Departments</option>
                                {DEPT_GROUPS.map(({ group, depts }) => (
                                    <optgroup key={group} label={group}>
                                        {depts.map(d => <option key={d} value={d}>{d}</option>)}
                                    </optgroup>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>
            </div>

            {/* Grid */}
            <div className="container pp-grid-section">
                {loading ? (
                    <div className="pp-loading">
                        <div className="spinner" style={{ width: 48, height: 48 }} />
                        <p>Loading student portfolios...</p>
                    </div>
                ) : students.length === 0 ? (
                    <div className="empty-state">
                        <BookOpen size={48} />
                        <h3>No Students Found</h3>
                        <p>Try adjusting your search or department filter.</p>
                    </div>
                ) : (
                    <>
                        <p className="pp-result-count">
                            Showing <strong>{students.length}</strong> student{students.length !== 1 ? 's' : ''}
                            {department !== 'All' ? ` in ${department}` : ''}
                            {debouncedSearch ? ` for "${debouncedSearch}"` : ''}
                        </p>
                        <div className="pp-grid">
                            {students.map(s => (
                                <StudentCard key={s._id || s.id} student={s} />
                            ))}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default PublicPortfoliosPage;
