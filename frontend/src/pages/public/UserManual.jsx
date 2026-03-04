import { useState } from 'react';
import PublicNavbar from '../../components/common/PublicNavbar';
import Footer from '../../components/common/Footer';
import {
    BookOpen, UserPlus, Upload, ShieldCheck,
    Share2, ChevronRight, CheckCircle2, AlertCircle, Info,
    ArrowLeft, ArrowRight, GraduationCap, Users, FileCheck, Layers, Award
} from 'lucide-react';
import '../../styles/UserManual.css';

const UserManual = () => {
    const [studentFlipped, setStudentFlipped] = useState([false, false, false, false]);
    const [facultyFlipped, setFacultyFlipped] = useState([false, false, false, false]);

    const toggleStudentPage = (index) => {
        const newFlipped = [...studentFlipped];
        if (!newFlipped[index]) {
            for (let i = 0; i <= index; i++) newFlipped[i] = true;
        } else {
            for (let i = index; i < newFlipped.length; i++) newFlipped[i] = false;
        }
        setStudentFlipped(newFlipped);
    };

    const toggleFacultyPage = (index) => {
        const newFlipped = [...facultyFlipped];
        if (!newFlipped[index]) {
            for (let i = 0; i <= index; i++) newFlipped[i] = true;
        } else {
            for (let i = index; i < newFlipped.length; i++) newFlipped[i] = false;
        }
        setFacultyFlipped(newFlipped);
    };

    return (
        <div style={{ minHeight: '100vh', background: 'var(--bg-primary)' }}>
            <PublicNavbar />

            <section style={{ paddingTop: '120px', paddingBottom: '5rem' }}>
                <div className="container">
                    <div style={{ textAlign: 'center', marginBottom: '5rem' }}>
                        <div style={{ padding: '0.5rem 1rem', background: 'var(--brand-50)', color: 'var(--brand-600)', borderRadius: '99px', fontSize: '0.8rem', fontWeight: 800, display: 'inline-block', marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                            Interactive Learning
                        </div>
                        <h1 style={{ fontSize: '2.5rem', fontWeight: 950, letterSpacing: '-0.02em', color: 'var(--gray-900)' }}>Portal <span className="text-gradient">Knowledge Base</span></h1>
                        <p style={{ color: 'var(--gray-500)', fontSize: '1.1rem', maxWidth: '600px', margin: '1rem auto' }}>
                            Flip through our dedicated guides to master the SOEIT Achievement Portal workflow and maximize your portfolio potential.
                        </p>
                    </div>

                    <div className="manual-viewport">

                        {/* BOOK 1: STUDENT GUIDE */}
                        <div className="book-wrapper">
                            <h2 style={{ fontSize: '1.75rem', fontWeight: 900, color: 'var(--brand-600)', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                <Users size={28} /> Student Portfolio Guide
                            </h2>
                            <div className="book-container">
                                {/* Page 4: Final */}
                                <div className={`book-page ${studentFlipped[3] ? 'flipped' : ''}`} style={{ zIndex: studentFlipped[3] ? 13 : 1 }} onClick={() => toggleStudentPage(3)}>
                                    <div className="page-front">
                                        <div className="page-inner-border">
                                            <div className="content-header">
                                                <Award size={24} color="var(--brand-600)" />
                                                <h3>Public Portfolio</h3>
                                                <div className="decorative-line"></div>
                                            </div>
                                            <div className="page-content">
                                                <p>Generated a unique shareable URL for recruiters. Only "Verified" achievements are visible publicly.</p>
                                                <div className="stat-box">
                                                    <Info size={16} /> Use link in LinkedIn Featured section.
                                                </div>
                                            </div>
                                        </div>
                                        <span className="book-page-number">PAGE 07</span>
                                    </div>
                                    <div className="page-back book-cover student">
                                        <Award size={80} style={{ opacity: 0.3 }} />
                                        <h2 style={{ color: 'white' }}>Build Your Legend</h2>
                                        <p style={{ opacity: 0.7 }}>SOEIT Ecosystem</p>
                                    </div>
                                </div>

                                {/* Page 3: Verification */}
                                <div className={`book-page ${studentFlipped[2] ? 'flipped' : ''}`} style={{ zIndex: studentFlipped[2] ? 12 : 2 }} onClick={() => toggleStudentPage(2)}>
                                    <div className="page-front">
                                        <div className="page-inner-border">
                                            <div className="content-header">
                                                <ShieldCheck size={24} color="var(--brand-600)" />
                                                <h3>Tracking Status</h3>
                                                <div className="decorative-line"></div>
                                            </div>
                                            <div className="page-content">
                                                <p>Monitor your submission. If rejected, faculty will provide feedback. Edit and resubmit for verification.</p>
                                            </div>
                                        </div>
                                        <span className="book-page-number">PAGE 05</span>
                                    </div>
                                    <div className="page-back">
                                        <div className="page-inner-border">
                                            <div className="content-header">
                                                <Layers size={24} color="var(--brand-600)" />
                                                <h3>Category Levels</h3>
                                                <div className="decorative-line"></div>
                                            </div>
                                            <div className="page-content">
                                                <p>Gold, Silver, and Bronze badges are awarded based on the impact factor of your achievement.</p>
                                            </div>
                                        </div>
                                        <span className="book-page-number">PAGE 06</span>
                                    </div>
                                </div>

                                {/* Page 2: Upload */}
                                <div className={`book-page ${studentFlipped[1] ? 'flipped' : ''}`} style={{ zIndex: studentFlipped[1] ? 11 : 3 }} onClick={() => toggleStudentPage(1)}>
                                    <div className="page-front">
                                        <div className="page-inner-border">
                                            <div className="content-header">
                                                <UserPlus size={24} color="var(--brand-600)" />
                                                <h3>Join the Portal</h3>
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
                                                <Upload size={24} color="var(--brand-600)" />
                                                <h3>Upload Merit</h3>
                                                <div className="decorative-line"></div>
                                            </div>
                                            <div className="page-content">
                                                <p>Upload certificates in portrait PDF for best results. Add descriptive links to live projects or codebases.</p>
                                            </div>
                                        </div>
                                        <span className="book-page-number">PAGE 04</span>
                                    </div>
                                </div>

                                {/* Page 1 (Cover) */}
                                <div className={`book-page ${studentFlipped[0] ? 'flipped' : ''}`} style={{ zIndex: studentFlipped[0] ? 10 : 4 }} onClick={() => toggleStudentPage(0)}>
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
                                            <div style={{ textAlign: 'center', marginTop: '30%' }}>
                                                <BookOpen size={48} color="var(--brand-200)" />
                                                <h3 style={{ marginTop: '1.5rem' }}>Foreword</h3>
                                                <p style={{ marginTop: '1rem' }}>This guide contains essential steps for building your verified digital achievement record.</p>
                                            </div>
                                        </div>
                                        <span className="book-page-number">PAGE 02</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* BOOK 2: FACULTY GUIDE */}
                        <div className="book-wrapper">
                            <h2 style={{ fontSize: '1.75rem', fontWeight: 900, color: '#064e3b', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                <ShieldCheck size={28} /> Faculty  Guide
                            </h2>
                            <div className="book-container">
                                {/* Page 4: Final */}
                                <div className={`book-page ${facultyFlipped[3] ? 'flipped' : ''}`} style={{ zIndex: facultyFlipped[3] ? 13 : 1 }} onClick={() => toggleFacultyPage(3)}>
                                    <div className="page-front">
                                        <div className="page-inner-border">
                                            <div className="content-header">
                                                <CheckCircle2 size={24} color="#064e3b" />
                                                <h3>System Sealed</h3>
                                                <div className="decorative-line"></div>
                                            </div>
                                            <div className="page-content">
                                                <p>Approved achievement is permanently added to the student's blockchain-ready ledger.</p>
                                            </div>
                                        </div>
                                        <span className="book-page-number">PAGE 07</span>
                                    </div>
                                    <div className="page-back book-cover faculty">
                                        <ShieldCheck size={80} style={{ opacity: 0.3 }} />
                                        <h2 style={{ color: 'white' }}>Trust & Accuracy</h2>
                                        <p style={{ opacity: 0.7 }}>SOEIT Coordinator Board</p>
                                    </div>
                                </div>

                                {/* Page 3: Integrity */}
                                <div className={`book-page ${facultyFlipped[2] ? 'flipped' : ''}`} style={{ zIndex: facultyFlipped[2] ? 12 : 2 }} onClick={() => toggleFacultyPage(2)}>
                                    <div className="page-front">
                                        <div className="page-inner-border">
                                            <div className="content-header">
                                                <AlertCircle size={24} color="#064e3b" />
                                                <h3>Integrity Check</h3>
                                                <div className="decorative-line"></div>
                                            </div>
                                            <div className="page-content">
                                                <p>Verify certificate serial numbers with the issuing body if authenticity is in question.</p>
                                            </div>
                                        </div>
                                        <span className="book-page-number">PAGE 05</span>
                                    </div>
                                    <div className="page-back">
                                        <div className="page-inner-border">
                                            <div className="content-header">
                                                <FileCheck size={24} color="#064e3b" />
                                                <h3>Record Locking</h3>
                                                <div className="decorative-line"></div>
                                            </div>
                                            <div className="page-content">
                                                <p>Verified records cannot be deleted by students, ensuring the ultimate source of truth.</p>
                                            </div>
                                        </div>
                                        <span className="book-page-number">PAGE 06</span>
                                    </div>
                                </div>

                                {/* Page 2: Queue */}
                                <div className={`book-page ${facultyFlipped[1] ? 'flipped' : ''}`} style={{ zIndex: facultyFlipped[1] ? 11 : 3 }} onClick={() => toggleFacultyPage(1)}>
                                    <div className="page-front">
                                        <div className="page-inner-border">
                                            <div className="content-header">
                                                <Layers size={24} color="#064e3b" />
                                                <h3>Dashboard View</h3>
                                                <div className="decorative-line"></div>
                                            </div>
                                            <div className="page-content">
                                                <p>Filter by branch, year, or achievement category to streamline the verification process.</p>
                                            </div>
                                        </div>
                                        <span className="book-page-number">PAGE 03</span>
                                    </div>
                                    <div className="page-back">
                                        <div className="page-inner-border">
                                            <div className="content-header">
                                                <BookOpen size={24} color="#064e3b" />
                                                <h3>Validation</h3>
                                                <div className="decorative-line"></div>
                                            </div>
                                            <div className="page-content">
                                                <p>Examine the PDF proof. Cross-check with university event participation records if necessary.</p>
                                            </div>
                                        </div>
                                        <span className="book-page-number">PAGE 04</span>
                                    </div>
                                </div>

                                {/* Page 1 (Cover) */}
                                <div className={`book-page ${facultyFlipped[0] ? 'flipped' : ''}`} style={{ zIndex: facultyFlipped[0] ? 10 : 4 }} onClick={() => toggleFacultyPage(0)}>
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
                                            <div style={{ textAlign: 'center', marginTop: '30%' }}>
                                                <Info size={48} color="#dcfce7" />
                                                <h3 style={{ marginTop: '1.5rem' }}>Overview</h3>
                                                <p style={{ marginTop: '1rem' }}>Protocol for faculty members to ensure the validity and quality of institutional records.</p>
                                            </div>
                                        </div>
                                        <span className="book-page-number">PAGE 02</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
};

export default UserManual;
