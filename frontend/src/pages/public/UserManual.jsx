import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
    BookOpen, UserPlus, Upload, ShieldCheck,
    Share2, ChevronRight, CircleCheck as CheckCircle2, CircleAlert as AlertCircle, Info,
    ArrowLeft, ArrowRight, GraduationCap, Users, FileCheck, Layers, Award,
    FileDown, Layout, MessageSquare, Trophy, UserCheck, FileSearch, History,
    ClipboardList, BarChart3, Zap
} from 'lucide-react';
import '../../styles/UserManual.css';

const UserManual = () => {
    const [studentFlipped, setStudentFlipped] = useState(new Array(6).fill(false));
    const [facultyFlipped, setFacultyFlipped] = useState(new Array(6).fill(false));

    const getStudentProgress = () => studentFlipped.filter(p => p).length;
    const getFacultyProgress = () => facultyFlipped.filter(p => p).length;

    const toggleStudentPage = (index) => {
        const newFlipped = [...studentFlipped];
        if (index === studentFlipped.length - 1 && studentFlipped[index]) {
            setStudentFlipped(new Array(6).fill(false));
            return;
        }

        if (!newFlipped[index]) {
            for (let i = 0; i <= index; i++) newFlipped[i] = true;
        } else {
            for (let i = index; i < newFlipped.length; i++) newFlipped[i] = false;
        }
        setStudentFlipped(newFlipped);
    };

    const toggleFacultyPage = (index) => {
        const newFlipped = [...facultyFlipped];
        if (index === facultyFlipped.length - 1 && facultyFlipped[index]) {
            setFacultyFlipped(new Array(6).fill(false));
            return;
        }

        if (!newFlipped[index]) {
            for (let i = 0; i <= index; i++) newFlipped[i] = true;
        } else {
            for (let i = index; i < newFlipped.length; i++) newFlipped[i] = false;
        }
        setFacultyFlipped(newFlipped);
    };

    return (
        <div style={{ minHeight: '100vh', background: 'var(--bg-primary)' }}>
            <div style={{ position: 'fixed', top: '1.5rem', left: '1.5rem', zIndex: 100 }}>
                <Link to="/" className="btn btn-secondary" style={{ fontWeight: 700, borderRadius: '12px', boxShadow: '0 10px 30px rgba(0,0,0,0.1)', backdropFilter: 'blur(10px)', border: '1px solid var(--border-primary)', padding: '0.6rem 1.25rem' }}>
                    <ArrowLeft size={16} /> Back to Home
                </Link>
            </div>
            <section style={{ paddingTop: '100px', paddingBottom: '5rem' }}>
                <div className="container">
                    <div style={{ textAlign: 'center', marginBottom: '5rem' }}>
                        <div style={{ padding: '0.5rem 1rem', background: 'var(--brand-50)', color: 'var(--brand-600)', borderRadius: '99px', fontSize: '0.8rem', fontWeight: 800, display: 'inline-block', marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                            Interactive Learning
                        </div>
                        <h1 style={{ fontSize: '2.5rem', fontWeight: 950, letterSpacing: '-0.02em', color: 'var(--gray-900)' }}>Portal <span className="text-gradient">Knowledge Base</span></h1>
                        <p style={{ color: 'var(--gray-500)', fontSize: '1.1rem', maxWidth: '600px', margin: '1rem auto' }}>
                            Flip through our dedicated guides to master the SOEIT Achievement Portal workflow.
                        </p>
                    </div>

                    <div className="manual-viewport">

                        {/* BOOK 1: STUDENT MANUAL */}
                        <div className="book-wrapper">
                            <h2 style={{ fontSize: '1.75rem', fontWeight: 900, color: 'var(--brand-600)', display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '2rem' }}>
                                <Users size={28} /> Student Manual
                            </h2>

                            <div className="mobile-hint">
                                <Zap size={14} style={{ marginRight: '4px' }} /> Tap pages or buttons to flip
                            </div>

                            <div className="book-container">
                                {/* Page 6: Final/Back Cover */}
                                <div className={`book-page ${studentFlipped[5] ? 'flipped' : ''}`} style={{ zIndex: studentFlipped[5] ? 20 : 1 }} onClick={() => toggleStudentPage(5)}>
                                    <div className="page-front">
                                        <div className="page-inner-border">
                                            <div className="content-header">
                                                <Share2 size={24} color="var(--brand-600)" />
                                                <h3>Public Profile</h3>
                                                <div className="decorative-line"></div>
                                            </div>
                                            <div className="page-content">
                                                <p>Generated a unique shareable URL for recruiters. Only "Verified" achievements are visible publicly.</p>
                                                <div className="stat-box">
                                                    <Info size={16} /> Use link in LinkedIn Featured section.
                                                </div>
                                            </div>
                                        </div>
                                        <span className="book-page-number">PAGE 11</span>
                                    </div>
                                    <div className="page-back book-cover student">
                                        <Award size={60} style={{ opacity: 0.3 }} />
                                        <h2 style={{ color: 'white', marginTop: '1rem' }}>Build Your Legend</h2>
                                        <p style={{ opacity: 0.7, fontSize: '0.8rem' }}>SOEIT Ecosystem</p>
                                    </div>
                                </div>

                                {/* Page 5: Tracking & Export */}
                                <div className={`book-page ${studentFlipped[4] ? 'flipped' : ''}`} style={{ zIndex: studentFlipped[4] ? 19 : 2 }} onClick={() => toggleStudentPage(4)}>
                                    <div className="page-front">
                                        <div className="page-inner-border">
                                            <div className="content-header">
                                                <Trophy size={24} color="var(--brand-600)" />
                                                <h3>Rankings</h3>
                                                <div className="decorative-line"></div>
                                            </div>
                                            <div className="page-content">
                                                <p>View your progress across technical skills through the automated skills radar chart and grading system.</p>
                                            </div>
                                        </div>
                                        <span className="book-page-number">PAGE 09</span>
                                    </div>
                                    <div className="page-back">
                                        <div className="page-inner-border">
                                            <div className="content-header">
                                                <FileDown size={24} color="var(--brand-600)" />
                                                <h3>Export Data</h3>
                                                <div className="decorative-line"></div>
                                            </div>
                                            <div className="page-content">
                                                <p>Export your entire verified history as a professional PDF dossier for campus placement drives.</p>
                                            </div>
                                        </div>
                                        <span className="book-page-number">PAGE 10</span>
                                    </div>
                                </div>

                                {/* Page 4: Progress */}
                                <div className={`book-page ${studentFlipped[3] ? 'flipped' : ''}`} style={{ zIndex: studentFlipped[3] ? 18 : 3 }} onClick={() => toggleStudentPage(3)}>
                                    <div className="page-front">
                                        <div className="page-inner-border">
                                            <div className="content-header">
                                                <Info size={24} color="var(--brand-600)" />
                                                <h3>Live Status</h3>
                                                <div className="decorative-line"></div>
                                            </div>
                                            <div className="page-content">
                                                <p>Monitor your submission. If rejected, faculty will provide feedback. Edit and resubmit for verification.</p>
                                            </div>
                                        </div>
                                        <span className="book-page-number">PAGE 07</span>
                                    </div>
                                    <div className="page-back">
                                        <div className="page-inner-border">
                                            <div className="content-header">
                                                <ShieldCheck size={24} color="var(--brand-600)" />
                                                <h3>Trust Score</h3>
                                                <div className="decorative-line"></div>
                                            </div>
                                            <div className="page-content">
                                                <p>Maintain a high accuracy rate in your submissions to build a top-tier institutional trust score.</p>
                                            </div>
                                        </div>
                                        <span className="book-page-number">PAGE 08</span>
                                    </div>
                                </div>

                                {/* Page 3: Verification */}
                                <div className={`book-page ${studentFlipped[2] ? 'flipped' : ''}`} style={{ zIndex: studentFlipped[2] ? 17 : 4 }} onClick={() => toggleStudentPage(2)}>
                                    <div className="page-front">
                                        <div className="page-inner-border">
                                            <div className="content-header">
                                                <Upload size={24} color="var(--brand-600)" />
                                                <h3>Submission</h3>
                                                <div className="decorative-line"></div>
                                            </div>
                                            <div className="page-content">
                                                <p>Upload certificates in PDF for results. Add descriptive links to live projects or codebases.</p>
                                            </div>
                                        </div>
                                        <span className="book-page-number">PAGE 05</span>
                                    </div>
                                    <div className="page-back">
                                        <div className="page-inner-border">
                                            <div className="content-header">
                                                <FileCheck size={24} color="var(--brand-600)" />
                                                <h3>Data Quality</h3>
                                                <div className="decorative-line"></div>
                                            </div>
                                            <div className="page-content">
                                                <p>Ensure all dates and titles match your certificates. High-quality data ensures faster faculty approval.</p>
                                            </div>
                                        </div>
                                        <span className="book-page-number">PAGE 06</span>
                                    </div>
                                </div>

                                {/* Page 2: Profile */}
                                <div className={`book-page ${studentFlipped[1] ? 'flipped' : ''}`} style={{ zIndex: studentFlipped[1] ? 16 : 5 }} onClick={() => toggleStudentPage(1)}>
                                    <div className="page-front">
                                        <div className="page-inner-border">
                                            <div className="content-header">
                                                <UserPlus size={24} color="var(--brand-600)" />
                                                <h3>Join System</h3>
                                                <div className="decorative-line"></div>
                                            </div>
                                            <div className="page-content">
                                                <p>Register using official university credentials. Verification is automatic for active students.</p>
                                            </div>
                                        </div>
                                        <span className="book-page-number">PAGE 03</span>
                                    </div>
                                    <div className="page-back">
                                        <div className="page-inner-border">
                                            <div className="content-header">
                                                <UserCheck size={24} color="var(--brand-600)" />
                                                <h3>Portfolio Kit</h3>
                                                <div className="decorative-line"></div>
                                            </div>
                                            <div className="page-content">
                                                <p>Complete your profile details. Add your department, graduation year, and professional interests.</p>
                                            </div>
                                        </div>
                                        <span className="book-page-number">PAGE 04</span>
                                    </div>
                                </div>

                                {/* Page 1 (Cover) */}
                                <div className={`book-page ${studentFlipped[0] ? 'flipped' : ''}`} style={{ zIndex: studentFlipped[0] ? 15 : 6 }} onClick={() => toggleStudentPage(0)}>
                                    <div className="page-front book-cover student">
                                        <div style={{ transform: 'translateY(-10px)' }}>
                                            <GraduationCap size={50} style={{ marginBottom: '1rem', color: 'rgba(255,255,255,0.9)' }} />
                                            <h1>STUDENT <br />MANUAL</h1>
                                            <div style={{ height: '3px', width: '30px', background: 'white', margin: '1rem auto', opacity: 0.5 }}></div>
                                            <p style={{ fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.15em', opacity: 0.8 }}>ACADEMIC SYSTEM</p>
                                        </div>
                                    </div>
                                    <div className="page-back">
                                        <div className="page-inner-border">
                                            <div style={{ textAlign: 'center', marginTop: '25%' }}>
                                                <BookOpen size={40} color="var(--brand-200)" />
                                                <h3 style={{ marginTop: '1.2rem' }}>Foreword</h3>
                                                <p style={{ marginTop: '0.8rem' }}>This guide contains 12 essential steps for building your verified digital achievement record.</p>
                                            </div>
                                        </div>
                                        <span className="book-page-number">PAGE 02</span>
                                    </div>
                                </div>
                            </div>

                            <div className="book-controls">
                                <button className="control-btn" onClick={(e) => { e.stopPropagation(); toggleStudentPage(Math.max(0, getStudentProgress() - 1)); }} disabled={getStudentProgress() === 0}>
                                    <ArrowLeft size={20} />
                                </button>
                                <div className="page-indicator">
                                    {getStudentProgress() + 1} / {studentFlipped.length + 1}
                                </div>
                                <button className="control-btn" onClick={(e) => { e.stopPropagation(); toggleStudentPage(getStudentProgress()); }} disabled={getStudentProgress() === studentFlipped.length}>
                                    <ArrowRight size={20} />
                                </button>
                            </div>
                        </div>

                        {/* BOOK 2: FACULTY MANUAL */}
                        <div className="book-wrapper">
                            <h2 style={{ fontSize: '1.75rem', fontWeight: 900, color: '#064e3b', display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '2rem' }}>
                                <ShieldCheck size={28} /> Faculty Manual
                            </h2>

                            <div className="mobile-hint">
                                <Zap size={14} style={{ marginRight: '4px' }} /> Tap pages or buttons to flip
                            </div>

                            <div className="book-container">
                                {/* Page 6: Final/Back Cover */}
                                <div className={`book-page ${facultyFlipped[5] ? 'flipped' : ''}`} style={{ zIndex: facultyFlipped[5] ? 20 : 1 }} onClick={() => toggleFacultyPage(5)}>
                                    <div className="page-front">
                                        <div className="page-inner-border">
                                            <div className="content-header">
                                                <CheckCircle2 size={24} color="#064e3b" />
                                                <h3>Platform Sealed</h3>
                                                <div className="decorative-line"></div>
                                            </div>
                                            <div className="page-content">
                                                <p>Approved achievement is permanently added to the student's blockchain-ready ledger.</p>
                                            </div>
                                        </div>
                                        <span className="book-page-number">PAGE 11</span>
                                    </div>
                                    <div className="page-back book-cover faculty">
                                        <ShieldCheck size={60} style={{ opacity: 0.3 }} />
                                        <h2 style={{ color: 'white', marginTop: '1rem' }}>Trust & Accuracy</h2>
                                        <p style={{ opacity: 0.7, fontSize: '0.8rem' }}>SOEIT Coordinator Board</p>
                                    </div>
                                </div>

                                {/* Page 5: Reporting & History */}
                                <div className={`book-page ${facultyFlipped[4] ? 'flipped' : ''}`} style={{ zIndex: facultyFlipped[4] ? 19 : 2 }} onClick={() => toggleFacultyPage(4)}>
                                    <div className="page-front">
                                        <div className="page-inner-border">
                                            <div className="content-header">
                                                <ClipboardList size={24} color="#064e3b" />
                                                <h3>Dept. Reports</h3>
                                                <div className="decorative-line"></div>
                                            </div>
                                            <div className="page-content">
                                                <p>Generate monthly summaries for your department. Export data for NAAC or NIRF filings.</p>
                                            </div>
                                        </div>
                                        <span className="book-page-number">PAGE 09</span>
                                    </div>
                                    <div className="page-back">
                                        <div className="page-inner-border">
                                            <div className="content-header">
                                                <History size={24} color="#064e3b" />
                                                <h3>History</h3>
                                                <div className="decorative-line"></div>
                                            </div>
                                            <div className="page-content">
                                                <p>Review the end-to-end audit trail before the system locks the record for institutional reporting.</p>
                                            </div>
                                        </div>
                                        <span className="book-page-number">PAGE 10</span>
                                    </div>
                                </div>

                                {/* Page 4: Security */}
                                <div className={`book-page ${facultyFlipped[3] ? 'flipped' : ''}`} style={{ zIndex: facultyFlipped[3] ? 18 : 3 }} onClick={() => toggleFacultyPage(3)}>
                                    <div className="page-front">
                                        <div className="page-inner-border">
                                            <div className="content-header">
                                                <AlertCircle size={24} color="#064e3b" />
                                                <h3>Integrity</h3>
                                                <div className="decorative-line"></div>
                                            </div>
                                            <div className="page-content">
                                                <p>Verify certificate serial numbers with the issuing body if authenticity is in question.</p>
                                            </div>
                                        </div>
                                        <span className="book-page-number">PAGE 07</span>
                                    </div>
                                    <div className="page-back">
                                        <div className="page-inner-border">
                                            <div className="content-header">
                                                <FileCheck size={24} color="#064e3b" />
                                                <h3>Immutability</h3>
                                                <div className="decorative-line"></div>
                                            </div>
                                            <div className="page-content">
                                                <p>Verified records cannot be deleted, ensuring a permanent institutional source of truth.</p>
                                            </div>
                                        </div>
                                        <span className="book-page-number">PAGE 08</span>
                                    </div>
                                </div>

                                {/* Page 3: Queue */}
                                <div className={`book-page ${facultyFlipped[2] ? 'flipped' : ''}`} style={{ zIndex: facultyFlipped[2] ? 17 : 4 }} onClick={() => toggleFacultyPage(2)}>
                                    <div className="page-front">
                                        <div className="page-inner-border">
                                            <div className="content-header">
                                                <Layers size={24} color="#064e3b" />
                                                <h3>Smart Queue</h3>
                                                <div className="decorative-line"></div>
                                            </div>
                                            <div className="page-content">
                                                <p>Filter by branch, year, or category to streamline the verification process flow.</p>
                                            </div>
                                        </div>
                                        <span className="book-page-number">PAGE 05</span>
                                    </div>
                                    <div className="page-back">
                                        <div className="page-inner-border">
                                            <div className="content-header">
                                                <BookOpen size={24} color="#064e3b" />
                                                <h3>Evidence Lab</h3>
                                                <div className="decorative-line"></div>
                                            </div>
                                            <div className="page-content">
                                                <p>Examine the PDF proof. Cross-check with university participation records if necessary.</p>
                                            </div>
                                        </div>
                                        <span className="book-page-number">PAGE 06</span>
                                    </div>
                                </div>

                                {/* Page 2: Dashboard */}
                                <div className={`book-page ${facultyFlipped[1] ? 'flipped' : ''}`} style={{ zIndex: facultyFlipped[1] ? 16 : 5 }} onClick={() => toggleFacultyPage(1)}>
                                    <div className="page-front">
                                        <div className="page-inner-border">
                                            <div className="content-header">
                                                <Info size={24} color="#064e3b" />
                                                <h3>Admin Portal</h3>
                                                <div className="decorative-line"></div>
                                            </div>
                                            <div className="page-content">
                                                <p>Access the faculty dashboard to view pending requests from your assigned departments.</p>
                                            </div>
                                        </div>
                                        <span className="book-page-number">PAGE 03</span>
                                    </div>
                                    <div className="page-back">
                                        <div className="page-inner-border">
                                            <div className="content-header">
                                                <FileCheck size={24} color="#064e3b" />
                                                <h3>Actions</h3>
                                                <div className="decorative-line"></div>
                                            </div>
                                            <div className="page-content">
                                                <p>Use Approve/Reject actions. Always provide clear feedback for any rejected submissions.</p>
                                            </div>
                                        </div>
                                        <span className="book-page-number">PAGE 04</span>
                                    </div>
                                </div>

                                {/* Page 1 (Cover) */}
                                <div className={`book-page ${facultyFlipped[0] ? 'flipped' : ''}`} style={{ zIndex: facultyFlipped[0] ? 15 : 6 }} onClick={() => toggleFacultyPage(0)}>
                                    <div className="page-front book-cover faculty">
                                        <div style={{ transform: 'translateY(-10px)' }}>
                                            <ShieldCheck size={50} style={{ marginBottom: '1rem', color: 'rgba(255,255,255,0.9)' }} />
                                            <h1>FACULTY <br />MANUAL</h1>
                                            <div style={{ height: '3px', width: '30px', background: 'white', margin: '1rem auto', opacity: 0.5 }}></div>
                                            <p style={{ fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.15em', opacity: 0.8 }}>COORDINATOR PANEL</p>
                                        </div>
                                    </div>
                                    <div className="page-back">
                                        <div className="page-inner-border">
                                            <div style={{ textAlign: 'center', marginTop: '25%' }}>
                                                <Info size={40} color="#dcfce7" />
                                                <h3 style={{ marginTop: '1.2rem' }}>Core Mission</h3>
                                                <p style={{ marginTop: '0.8rem' }}>12-step protocol for faculty to ensure validity and quality of university records.</p>
                                            </div>
                                        </div>
                                        <span className="book-page-number">PAGE 02</span>
                                    </div>
                                </div>
                            </div>

                            <div className="book-controls">
                                <button className="control-btn" onClick={(e) => { e.stopPropagation(); toggleFacultyPage(Math.max(0, getFacultyProgress() - 1)); }} disabled={getFacultyProgress() === 0}>
                                    <ArrowLeft size={20} />
                                </button>
                                <div className="page-indicator">
                                    {getFacultyProgress() + 1} / {facultyFlipped.length + 1}
                                </div>
                                <button className="control-btn" onClick={(e) => { e.stopPropagation(); toggleFacultyPage(getFacultyProgress()); }} disabled={getFacultyProgress() === facultyFlipped.length}>
                                    <ArrowRight size={20} />
                                </button>
                            </div>
                        </div>

                    </div>
                </div>
            </section>
        </div>
    );
};

export default UserManual;
