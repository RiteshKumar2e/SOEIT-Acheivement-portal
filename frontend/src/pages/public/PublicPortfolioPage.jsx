import '../../styles/PublicPortfolioPage.css';
import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { achievementAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { Trophy, Star, Globe, Github, Linkedin, Award, CheckCircle, Calendar, Building, Share2, ArrowLeft, Terminal, Download, Shield } from 'lucide-react';
import { format } from 'date-fns';
import toast from 'react-hot-toast';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';

const LEVEL_COLORS = { International: '#f59e0b', National: '#3b82f6', State: '#8b5cf6', University: '#10b981', College: '#06b6d4', Department: '#6b7280' };
const CATEGORY_ICONS = { Academic: '🎓', Sports: '🏆', Cultural: '🎭', Technical: '💻', Research: '🔬', Internship: '💼', Certification: '📜', Competition: '🥇', 'Community Service': '🤝', Other: '⭐' };

const PublicPortfolioPage = () => {
    const { user } = useAuth();
    const { userId } = useParams();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [downloading, setDownloading] = useState(false);
    const [error, setError] = useState(null);
    const [selectedCat, setSelectedCat] = useState('');

    useEffect(() => {
        setLoading(true);
        setError(null);
        achievementAPI.getPortfolio(userId)
            .then(res => setData(res.data))
            .catch(err => {
                const msg = err.response?.data?.message || 'Portfolio not found';
                setError(msg);
                toast.error(msg);
            })
            .finally(() => setLoading(false));
    }, [userId]);

    const handleShare = () => {
        navigator.clipboard.writeText(window.location.href);
        toast.success('Portfolio link copied! 🔗');
    };

    const handleDownloadAll = async () => {
        if (!data || !data.achievements || data.achievements.length === 0) {
            toast.error('No verified records identified for export protocol.');
            return;
        }

        setDownloading(true);
        const toastId = toast.loading('Initializing archival protocol: Synchronizing evidentiary records...');

        try {
            const zip = new JSZip();
            // Robust base URL construction: detect if the API URL includes '/api' and strip it for static files
            let apiBase = import.meta.env.VITE_API_URL || 'https://soeit-acheivement-portal.onrender.com';
            const staticBase = apiBase.endsWith('/api') ? apiBase.replace(/\/api$/, '') : apiBase;

            // Gather all proof files across all achievements
            const filesToDownload = [];
            data.achievements.forEach(ach => {
                if (ach.proofFiles && ach.proofFiles.length > 0) {
                    ach.proofFiles.forEach(file => {
                        filesToDownload.push({
                            url: file.url.startsWith('http') ? file.url : `${staticBase}${file.url}`,
                            name: `${ach.category}_${decodeURIComponent(file.originalname)}`
                        });
                    });
                } else if (ach.certificateUrl) {
                    filesToDownload.push({
                        url: ach.certificateUrl.startsWith('http') ? ach.certificateUrl : `${staticBase}${ach.certificateUrl}`,
                        name: `${ach.category}_Certificate.pdf` // Fallback name
                    });
                }
            });

            if (filesToDownload.length === 0) {
                toast.error('No evidentiary documents found for direct extraction.');
                setDownloading(false);
                toast.dismiss(toastId);
                return;
            }

            // Fetch all files in parallel with validation
            const downloadPromises = filesToDownload.map(async (file, index) => {
                try {
                    const response = await fetch(file.url);
                    if (!response.ok) {
                        console.error(`Fetch failure for ${file.name}: ${response.status} ${response.statusText}`);
                        return; // Skip invalid records to prevent corrupted ZIP entries
                    }
                    const blob = await response.blob();
                    // Handle duplicate filenames by appending index
                    const extension = file.name.split('.').pop();
                    const baseName = file.name.substring(0, file.name.lastIndexOf('.'));
                    const finalName = `${baseName}_${index}.${extension}`;
                    zip.file(finalName, blob);
                } catch (err) {
                    console.error(`Protocol failure for record: ${file.name}`, err);
                }
            });

            await Promise.all(downloadPromises);

            // Generate ZIP only if it's not empty
            if (Object.keys(zip.files).length === 0) {
                toast.error('Archival synchronization resulted in an empty set. Check records.', { id: toastId });
                setDownloading(false);
                return;
            }

            const content = await zip.generateAsync({ type: 'blob' });

            const isFacultyOrAdmin = user?.role === 'admin' || user?.role === 'faculty';
            const idKey = data.student.enrollmentNo || data.student.enrollment_no || data.student.studentId || data.student.student_id || 'unidentified';
            const fileName = isFacultyOrAdmin
                ? `${idKey}_academic_evidence.zip`
                : `${data.student.name.replace(/\s+/g, '_')}_achievements.zip`;

            saveAs(content, fileName);
            toast.success('Archival sequence complete. Student records exported.', { id: toastId });
        } catch (error) {
            console.error('Archival protocol exception:', error);
            toast.error('Critical failure during record synchronization.', { id: toastId });
        } finally {
            setDownloading(false);
        }
    };

    if (loading) return (
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-primary)' }}>
            <div className="spinner" style={{ width: 48, height: 48 }} />
        </div>
    );

    if (error) return (
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-primary)', flexDirection: 'column', gap: '1.5rem', padding: '2rem', textAlign: 'center' }}>
            <div style={{ padding: '2rem', background: 'var(--primary-50)', borderRadius: '50%', color: 'var(--brand-600)' }}>
                <Shield size={64} />
            </div>
            <div style={{ maxWidth: 500 }}>
                <h2 style={{ color: 'var(--text-primary)', fontWeight: 900, marginBottom: '0.5rem' }}>Access Synchronization Failure</h2>
                <p style={{ color: 'var(--text-muted)', fontWeight: 600, lineHeight: 1.6 }}>{error}</p>
            </div>
            <Link to={user?.role === 'student' ? '/dashboard' : '/'} className="btn btn-primary" style={{ fontWeight: 800, padding: '0.75rem 2rem' }}>Return to Terminal</Link>
        </div>
    );

    if (!data) return (
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-primary)', flexDirection: 'column', gap: '1rem' }}>
            <Trophy size={64} style={{ color: 'var(--text-muted)', opacity: 0.4 }} />
            <h2 style={{ color: 'var(--text-secondary)' }}>Portfolio Not found</h2>
            <Link to="/" className="btn btn-primary">Back Home</Link>
        </div>
    );

    const { student, achievements, stats, courses = [] } = data;
    const categories = [...new Set(achievements.map(a => a.category))];
    const filtered = selectedCat ? achievements.filter(a => a.category === selectedCat) : achievements;
    const getInitials = (name) => name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || 'S';

    return (
        <div style={{ minHeight: '100vh', background: 'var(--bg-primary)' }}>
            {/* Back Button */}
            <div style={{ position: 'fixed', top: '1.5rem', left: '1.5rem', zIndex: 100 }}>
                <Link to="/" className="btn btn-secondary" style={{ fontWeight: 700, borderRadius: '12px', boxShadow: '0 10px 30px rgba(0,0,0,0.1)', backdropFilter: 'blur(10px)', border: '1px solid var(--border-primary)', padding: '0.6rem 1.25rem' }}>
                    <ArrowLeft size={16} /> Back to Home
                </Link>
            </div>
            {/* Action buttons */}
            <div style={{ position: 'fixed', top: '1rem', right: '1rem', zIndex: 100, display: 'flex', gap: '0.75rem' }}>
                <button
                    className={`btn ${downloading ? 'btn-ghost' : 'btn-secondary'} btn-sm`}
                    onClick={handleDownloadAll}
                    disabled={downloading}
                    style={{ backdropFilter: 'blur(10px)', fontWeight: 800 }}
                >
                    {downloading ? <div className="spinner-sm" /> : <><Download size={14} /> Download Ledger</>}
                </button>
                <button className="btn btn-primary btn-sm" onClick={handleShare} style={{ backdropFilter: 'blur(10px)', fontWeight: 800 }}>
                    <Share2 size={14} /> Share Portfolio
                </button>
            </div>

            {/* Hero Banner */}
            <div style={{ background: 'linear-gradient(135deg, rgba(59,130,246,0.15) 0%, rgba(99,102,241,0.12) 50%, rgba(16,185,129,0.08) 100%)', borderBottom: '1px solid var(--border-primary)', padding: '6rem 0 3rem' }}>
                <div className="container">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '2rem', flexWrap: 'wrap' }}>
                        {student.profileImage ? (
                            <img src={`${import.meta.env.VITE_UPLOADS_URL || ''}${student.profileImage}`} alt={student.name} style={{ width: 110, height: 110, borderRadius: '50%', objectFit: 'cover', border: '4px solid rgba(59,130,246,0.4)', boxShadow: '0 0 30px rgba(59,130,246,0.3)' }} />
                        ) : (
                            <div className="avatar" style={{ width: 110, height: 110, fontSize: '2.5rem', border: '4px solid rgba(59,130,246,0.4)', boxShadow: '0 0 30px rgba(59,130,246,0.3)' }}>{getInitials(student.name)}</div>
                        )}
                        <div style={{ flex: 1 }}>
                            <h1 style={{ marginBottom: '0.375rem' }}>{student.name}</h1>
                            <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', marginBottom: '0.75rem' }}>
                                {student.department} Engineering • {student.enrollment_no ? `Enrollment: ${student.enrollment_no}` : ''} {student.semester ? `• Sem ${student.semester}` : ''}
                            </p>
                            {student.bio && <p style={{ color: 'var(--text-muted)', maxWidth: 500, lineHeight: 1.7, marginBottom: '1rem', fontSize: '0.9rem' }}>{student.bio}</p>}
                            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                                {student.linkedIn && <a href={student.linkedIn.startsWith('http') ? student.linkedIn : `https://${student.linkedIn}`} target="_blank" rel="noreferrer" className="btn btn-secondary btn-sm"><Linkedin size={14} /> LinkedIn</a>}
                                {student.github && <a href={student.github.startsWith('http') ? student.github : `https://${student.github}`} target="_blank" rel="noreferrer" className="btn btn-secondary btn-sm"><Github size={14} /> GitHub</a>}
                                {student.portfolio && <a href={student.portfolio.startsWith('http') ? student.portfolio : `https://${student.portfolio}`} target="_blank" rel="noreferrer" className="btn btn-secondary btn-sm"><Globe size={14} /> Portfolio</a>}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Stats Strip */}
            <div style={{ background: 'var(--bg-secondary)', borderBottom: '1px solid var(--border-primary)', padding: '1.5rem 0' }}>
                <div className="container">
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '1.5rem', textAlign: 'center' }}>
                        {[
                            { label: 'Achievements', value: stats.total, icon: Trophy, color: '#3b82f6' },
                            { label: 'Total Points', value: stats.totalPoints, icon: Star, color: '#f59e0b' },
                            { label: 'Hackathons Explored', value: stats.hackathonsExplored || 0, icon: Terminal, color: '#8b5cf6' },
                            { label: 'Courses Enrolled', value: stats.courses || 0, icon: Award, color: '#06b6d4' },
                            { label: 'Completed', value: stats.completedCourses || 0, icon: CheckCircle, color: '#10b981' },
                        ].map(({ label, value, icon: Icon, color }) => (
                            <div key={label}>
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', marginBottom: '0.375rem' }}>
                                    <Icon size={16} style={{ color }} />
                                    <span style={{ fontSize: '1.5rem', fontWeight: 800, fontFamily: 'Space Grotesk', color: 'var(--text-primary)' }}>{value}</span>
                                </div>
                                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Courses Section (if any) */}
            {courses.length > 0 && (
                <div className="container" style={{ padding: '3rem 1.5rem 0' }}>
                    <div className="section-header" style={{ marginBottom: '2rem' }}>
                        <h2 style={{ fontSize: '1.5rem', fontWeight: 900, color: 'var(--text-primary)' }}>Skill Development Ledger</h2>
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Real-time synchronization of external certifications and platform-based learning.</p>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.25rem' }}>
                        {courses.map(course => (
                            <div key={course.id} className="card card-body" style={{ border: '1px solid var(--border-primary)' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                                    <div>
                                        <h4 style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.25rem' }}>{course.course_name}</h4>
                                        <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--brand-600)' }}>{course.platform}</div>
                                    </div>
                                    <span style={{
                                        fontSize: '0.65rem',
                                        fontWeight: 800,
                                        padding: '0.2rem 0.6rem',
                                        borderRadius: '6px',
                                        background: course.status === 'Completed' ? 'var(--success-50)' : 'var(--primary-50)',
                                        color: course.status === 'Completed' ? 'var(--success-700)' : 'var(--brand-700)',
                                        textTransform: 'uppercase'
                                    }}>
                                        {course.status}
                                    </span>
                                </div>
                                <div style={{ height: '6px', background: 'var(--slate-100)', borderRadius: '3px', overflow: 'hidden', marginBottom: '0.5rem' }}>
                                    <div style={{ width: `${course.progress}%`, height: '100%', background: 'linear-gradient(90deg, var(--brand-500), var(--brand-700))' }} />
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-muted)' }}>
                                    <span>PROGRESS</span>
                                    <span>{course.progress}%</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Achievements */}
            <div className="container" style={{ padding: '3rem 1.5rem' }}>
                <div className="section-header" style={{ marginBottom: '2rem' }}>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: 900, color: 'var(--text-primary)' }}>Verified Accomplishments</h2>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>A chronological record of validated institutional achievements and merit points.</p>
                </div>
                {/* Category Filter */}
                {categories.length > 1 && (
                    <div style={{ marginBottom: '2rem' }}>
                        {/* Desktop Version: Filter Buttons */}
                        <div className="category-filter-desktop desktop-only" style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                            <button onClick={() => setSelectedCat('')} style={{ padding: '0.4rem 1rem', borderRadius: 'var(--radius-full)', border: `1px solid ${!selectedCat ? 'var(--primary-500)' : 'var(--border-primary)'}`, background: !selectedCat ? 'rgba(59,130,246,0.15)' : 'transparent', color: !selectedCat ? 'var(--primary-400)' : 'var(--text-muted)', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 500, transition: 'all 0.2s' }}>
                                All ({achievements.length})
                            </button>
                            {categories.map(cat => (
                                <button key={cat} onClick={() => setSelectedCat(cat)} style={{ padding: '0.4rem 1rem', borderRadius: 'var(--radius-full)', border: `1px solid ${selectedCat === cat ? 'var(--primary-500)' : 'var(--border-primary)'}`, background: selectedCat === cat ? 'rgba(59,130,246,0.15)' : 'transparent', color: selectedCat === cat ? 'var(--primary-400)' : 'var(--text-muted)', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 500, transition: 'all 0.2s' }}>
                                    {CATEGORY_ICONS[cat] || '⭐'} {cat}
                                </button>
                            ))}
                        </div>

                        {/* Mobile Version: Dropdown */}
                        <div className="category-filter-mobile mobile-only" style={{ width: '100%' }}>
                            <select
                                className="form-control"
                                value={selectedCat}
                                onChange={(e) => setSelectedCat(e.target.value)}
                                style={{
                                    fontWeight: 700,
                                    borderRadius: '12px',
                                    border: '2px solid var(--border-primary)',
                                    padding: '0.8rem',
                                    width: '100%',
                                    background: 'var(--bg-secondary)',
                                    color: 'var(--text-primary)',
                                    appearance: 'none',
                                    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E")`,
                                    backgroundRepeat: 'no-repeat',
                                    backgroundPosition: 'right 1rem center',
                                    backgroundSize: '1.2em'
                                }}
                            >
                                <option value="">All Categories ({achievements.length})</option>
                                {categories.map(cat => (
                                    <option key={cat} value={cat}>{CATEGORY_ICONS[cat] || '⭐'} {cat}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                )}

                {filtered.length === 0 ? (
                    <div className="empty-state">
                        <Trophy /><h3>No verified achievements yet</h3><p>Achievements will appear here once verified.</p>
                    </div>
                ) : (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.25rem' }}>
                        {filtered.map(a => (
                            <div key={a._id} className="card card-body" style={{ transition: 'all 0.25s' }}
                                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-5px)'; e.currentTarget.style.borderColor = (LEVEL_COLORS[a.level] || 'var(--primary-500)') + '66'; }}
                                onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.borderColor = 'var(--border-primary)'; }}>
                                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.875rem' }}>
                                    <div style={{ fontSize: '2rem', flexShrink: 0 }}>{CATEGORY_ICONS[a.category] || '⭐'}</div>
                                    <div style={{ flex: 1, minWidth: 0 }}>
                                        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '0.5rem', marginBottom: '0.5rem' }}>
                                            <h4 style={{ fontSize: '1rem', lineHeight: 1.3, color: 'var(--text-primary)' }}>{a.title}</h4>
                                            <span style={{ fontSize: '0.7rem', fontWeight: 700, color: LEVEL_COLORS[a.level] || '#64748b', background: (LEVEL_COLORS[a.level] || '#64748b') + '20', padding: '0.2rem 0.5rem', borderRadius: 'var(--radius-full)', flexShrink: 0 }}>{a.level}</span>
                                        </div>
                                        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '0.625rem' }}>
                                            <span className="badge badge-approved" style={{ fontSize: '0.65rem' }}><CheckCircle size={9} /> Verified</span>
                                            <span className="badge badge-primary" style={{ fontSize: '0.65rem' }}>{a.category}</span>
                                        </div>
                                        <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', lineHeight: 1.6, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{a.description}</p>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginTop: '0.875rem', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                                            {a.date && <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}><Calendar size={12} />{format(new Date(a.date), 'MMM yyyy')}</span>}
                                            {a.institution && <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}><Building size={12} />{a.institution}</span>}
                                            <span style={{ marginLeft: 'auto', fontWeight: 700, color: '#f59e0b' }}>+{a.points} pts</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default PublicPortfolioPage;
