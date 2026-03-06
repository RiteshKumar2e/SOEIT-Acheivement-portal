import { useState, useEffect } from 'react';
import '../../styles/LandingPage.css';
import { Link } from 'react-router-dom';
import PublicNavbar from '../../components/common/PublicNavbar';
import Footer from '../../components/common/Footer';
import {
    Trophy, Shield, BarChart3, CircleCheck,
    Users, Star, ArrowRight, ArrowLeft, Zap, Globe, Award, BookOpen, Clock, GraduationCap, FileCheck, Briefcase, ChevronDown,
    Github, Linkedin, Code, Library, Terminal, CircleHelp, MessageSquare
} from 'lucide-react';

const quickLinks = [
    { title: 'Hackathons', icon: Trophy, color: '#ff6b6b' },
    { title: 'Coding', icon: Terminal, color: '#4facfe' },
    { title: 'Internships', icon: Briefcase, color: '#00f2fe' },
    { title: 'Mentorship', icon: Users, color: '#f093fb' },
    { title: 'Courses', icon: BookOpen, color: '#43e97b' },
    { title: 'Practice', icon: Code, color: '#fa709a' },
];

const liveChallenges = [
    {
        title: 'Smart India Hackathon 2026',
        type: 'SIH | Govt of India',
        img: 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&q=80&w=800',
        prize: '₹1,00,000 Per Theme',
        stats: { students: '25k+', days: 'Aug – Sept 2026' },
        badge: 'Premier'
    },
    {
        title: 'Google Solution Challenge 2026',
        type: 'GDSC | Global',
        img: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80&w=800',
        prize: '$12,000 + Mentorship',
        stats: { students: '15k+', days: 'Jan – Mar 2026' },
        badge: 'Elite'
    },
    {
        title: 'HackWithInfy 2026',
        type: 'Infosys | National',
        img: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&q=80&w=800',
        prize: '₹2,00,000 + Pre-Placement',
        stats: { students: '18k+', days: 'Apr – June 2026' },
        badge: 'Top Tier'
    },
    {
        title: 'Amazon ML Challenge 2026',
        type: 'Machine Learning | Amazon',
        img: 'https://images.unsplash.com/photo-1527474305487-b87b222841cc?auto=format&fit=crop&q=80&w=800',
        prize: '₹10L + PPO Opportunities',
        stats: { students: '12k+', days: 'July – Aug 2026' },
        badge: 'High Impact'
    },
];


const faqs = [
    {
        question: 'Who can access the SOEIT Achievement Portal?',
        answer: 'Currently, the portal is restricted to active students and faculty members of the School of Engineering & IT. Each user is provided with unique credentials by the department.'
    },
    {
        question: 'How does the verification process work?',
        answer: 'Once a student submits a record, it enters the faculty dashboard. A designated subject matter expert reviews the attached documents and either approves or requests refinements.'
    },
    {
        question: 'Are the digital certificates official?',
        answer: 'Yes, every achievement verified on this platform carries the institutional weight of SOEIT and can be included in official university dossiers for NAAC/NIRF audits.'
    },
    {
        question: 'Can I link my external profiles?',
        answer: 'Students can link their GitHub, LinkedIn, and Portfolio sites to their profile, creating a centralized hub for their professional engineering identity.'
    }
];

const testimonials = [
    {
        quote: "The ability to track every technical milestone in a centralized repository has revolutionized how we prepare for accreditation and showcase our students' true potential.",
        author: "Dean's Office",
        role: "School of Engineering & IT",
        initial: "D"
    },
    {
        quote: "This portal has streamlined our documentation process significantly. It ensures that every student's achievement is recognized and verified with high precision.",
        author: "Rakhi Jha",
        role: "Assistant Professor, CSE",
        initial: "R"
    },
    {
        quote: "For students, this is more than a portal—it's a digital resume that grows with every project they complete. It bridges the gap between academics and industry.",
        author: "Placement Cell",
        role: "Industry Relations",
        initial: "P"
    },
    {
        quote: "We've observed a marked increase in students' participation in research and certifications since the launch of this achievement portal.",
        author: "Mamatha V",
        role: "Assistant Professor, IT",
        initial: "M"
    },
    {
        quote: "Mapping student achievements to academic credits has become seamless. It encourages a healthy competitive spirit among our budding engineers.",
        author: "HOD Computer Science",
        role: "Department Management",
        initial: "H"
    },
    {
        quote: "The transparency offered by this system allows us to mentor students more effectively based on their real-time growth and technical interests.",
        author: "Saayantani De",
        role: "Assistant Professor, CSE",
        initial: "S"
    },
    {
        quote: "The automated verification workflow ensures that no fake certifications enter the system, maintaining the high integrity of our institutional records.",
        author: "Registrar Office",
        role: "Academic Records",
        initial: "R"
    },
    {
        quote: "Digital preservation of student achievements is crucial for future-proofing their careers. This portal manages it exceptionally well.",
        author: "Syed Rashid Anwar",
        role: "Assistant Professor, ECE",
        initial: "S"
    },
    {
        quote: "Integrating global achievements from platforms like GitHub and LeetCode into one portal is exactly what a modern engineering school needs.",
        author: "Innovation Lab",
        role: "Research & Development",
        initial: "I"
    },
    {
        quote: "Mentoring students on their technical journey is much more data-driven now. We can see exactly where each student is excelling.",
        author: "Dr Nidhi Dua",
        role: "Associate Professor, CSE",
        initial: "N"
    },
    {
        quote: "The public portfolio feature has been a game changer. Recruiters can directly verify our students' accomplishments without any manual paperwork.",
        author: "Training & Placement",
        role: "Corporate Connect",
        initial: "T"
    },
    {
        quote: "As a student, seeing my dashboard grow with verified badges motivates me to participate in more hackathons and technical certifications.",
        author: "Final Year Student",
        role: "Student Community",
        initial: "S"
    },
    {
        quote: "We now have real-time analytics on which skills are trending in our student body, allowing us to align our curriculum with industry demands.",
        author: "Academic Council",
        role: "Curriculum Design",
        initial: "A"
    },
    {
        quote: "I submitted my national-level coding competition win and it was verified within 24 hours. The process is fast, transparent, and incredibly reliable.",
        author: "Ankit Kumar",
        role: "3rd Year Student, CSE",
        initial: "A"
    },
    {
        quote: "Having a centralized platform to monitor all departmental achievements has drastically improved our NIRF submission quality and turnaround time.",
        author: "NIRF Coordination Cell",
        role: "Institutional Rankings",
        initial: "N"
    },
    {
        quote: "The merit point system has brought a new level of engagement. Students are proactively seeking certifications to climb the leaderboard.",
        author: "Faculty Coordinator",
        role: "Student Affairs",
        initial: "F"
    },
    {
        quote: "This portal reflects SOEIT's commitment to digital excellence. Every verified achievement here tells a story of perseverance.",
        author: "Principal",
        role: "School of Engineering & IT",
        initial: "P"
    },
    {
        quote: "The portal's ability to categorize achievements by skill sets helps us identify the diverse talents within our student groups.",
        author: "Laboratory In-charge",
        role: "Department of IT",
        initial: "L"
    },
    {
        quote: "Verified dossiers from this portal have become a standard part of our student evaluation and recommendation process.",
        author: "Evaluation Committee",
        role: "Academic Audit",
        initial: "E"
    },
    {
        quote: "It's heartening to see our students so enthusiastic about building their digital portfolios through this achievement tracking system.",
        author: "Alumni Relations",
        role: "Institutional Growth",
        initial: "A"
    }
];

const LandingPage = () => {
    const [activeFaq, setActiveFaq] = useState(null);
    const [activeTestimonial, setActiveTestimonial] = useState(0);
    const [isPaused, setIsPaused] = useState(false);

    const toggleFaq = (idx) => {
        setActiveFaq(activeFaq === idx ? null : idx);
    };

    // Randomly rotate testimonials every 4s
    useEffect(() => {
        if (isPaused) return;
        const timer = setInterval(() => {
            let nextIdx;
            do {
                nextIdx = Math.floor(Math.random() * testimonials.length);
            } while (nextIdx === activeTestimonial && testimonials.length > 1);
            setActiveTestimonial(nextIdx);
        }, 1000);
        return () => clearInterval(timer);
    }, [isPaused, activeTestimonial]);

    return (
        <div className="landing-page">
            <PublicNavbar />

            {/* Hero Section - Split Layout (Devpost Style) */}
            <section className="hero-section">
                <div className="hero-mesh" />

                <div className="container hero-container">
                    <div className="hero-content">
                        <div className="hero-badge">
                            <Shield size={14} />
                            <span className="hero-badge-text">Official SOEIT Technical Ecosystem</span>
                        </div>

                        <h1 className="hero-title">
                            Empowering <br />
                            <span className="text-brand-emphasized">Engineering Excellence</span>
                        </h1>

                        <p className="hero-subtitle">
                            Arka Jain University's (NAAC A Accredited) premier hub for tracking academic milestones, technical certifications, and global competition wins.
                        </p>

                        <div className="flex gap-4">
                            <Link to="/login" className="btn btn-primary btn-lg rounded-xl px-10 shadow-2xl hover:scale-105 transition-transform bg-brand-600 border-none">
                                Explore Opportunities
                            </Link>
                            <Link to="/register" className="btn btn-secondary btn-lg rounded-xl px-10 border-gray-200">
                                Register Now
                            </Link>
                        </div>
                    </div>

                    <div className="hero-visual desktop-only-hero">
                        <div className="hero-main-card">
                            <div className="flex items-center justify-between mb-8">
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 rounded-full bg-brand-50 flex items-center justify-center text-brand-600 font-bold border border-brand-100">RK</div>
                                    <div>
                                        <div className="font-bold text-gray-900">Ritesh Kumar</div>
                                        <div className="text-xs text-gray-500">B.Tech | 4th Year</div>
                                    </div>
                                </div>
                                <Award className="text-accent-gold" size={24} />
                            </div>
                            <div className="space-y-5">
                                <div className="flex justify-between items-end">
                                    <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Level 12 Architect</span>
                                    <span className="text-brand-600 font-black">2,450 XP</span>
                                </div>
                                <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                                    <div className="h-full bg-brand-600 rounded-full" style={{ width: '75%' }}></div>
                                </div>
                                <div className="grid grid-cols-2 gap-4 pt-2">
                                    <div className="p-3 bg-gray-50 rounded-xl border border-gray-100">
                                        <div className="text-[10px] text-gray-400 font-bold uppercase">Hackathons</div>
                                        <div className="text-lg font-black text-gray-900">08</div>
                                    </div>
                                    <div className="p-3 bg-gray-50 rounded-xl border border-gray-100">
                                        <div className="text-[10px] text-gray-400 uppercase">Projects</div>
                                        <div className="text-lg font-black text-gray-900">14</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Quick Access Section (Unstop Style) */}
            <section className="quick-access-section">
                <div className="container">
                    <div className="quick-access-grid">
                        {quickLinks.map((link, idx) => {
                            const Icon = link.icon;
                            return (
                                <div key={idx} className="quick-card">
                                    <div className="quick-icon" style={{ background: `${link.color}10`, color: link.color }}>
                                        <Icon size={24} />
                                    </div>
                                    <span className="quick-label">{link.title}</span>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            <section className="marquee-container">
                <div className="marquee-content">
                    {/* Real ARKA JAIN University Data 2024-25 */}
                    <div className="marquee-item">
                        <span className="marquee-val">2800+</span>
                        <span className="marquee-label">PLACEMENTS TO DATE</span>
                        <Briefcase size={16} />
                    </div>
                    <div className="marquee-item">
                        <span className="marquee-val">₹23 LPA</span>
                        <span className="marquee-label">HIGHEST PACKAGE</span>
                        <Trophy size={16} />
                    </div>
                    <div className="marquee-item">
                        <span className="marquee-val">7,000+</span>
                        <span className="marquee-label">ENROLLED STUDENTS</span>
                        <Users size={16} />
                    </div>
                    <div className="marquee-item">
                        <span className="marquee-val">500+</span>
                        <span className="marquee-label">PLACEMENTS OFFERS (2024)</span>
                        <Award size={16} />
                    </div>
                    <div className="marquee-item">
                        <span className="marquee-val">NAAC 'A'</span>
                        <span className="marquee-label">ACCREDITED UNIVERSITY</span>
                        <GraduationCap size={16} />
                    </div>
                    {/* Duplicate for seamless loop */}
                    <div className="marquee-item">
                        <span className="marquee-val">2800+</span>
                        <span className="marquee-label">PLACEMENTS TO DATE</span>
                        <Briefcase size={16} />
                    </div>
                    <div className="marquee-item">
                        <span className="marquee-val">₹23 LPA</span>
                        <span className="marquee-label">HIGHEST PACKAGE</span>
                        <Trophy size={16} />
                    </div>
                    <div className="marquee-item">
                        <span className="marquee-val">7,000+</span>
                        <span className="marquee-label">ENROLLED STUDENTS</span>
                        <Users size={16} />
                    </div>
                </div>
            </section>

            {/* Live Competitions Section (Devpost Style) */}
            <section className="py-16 bg-white">
                <div className="container">
                    <div className="section-header mb-8">
                        <span className="section-tag">Ongoing Challenges</span>
                        <h2 className="text-2xl md:text-3xl font-black text-gray-900">Explore <span className="text-brand-600">Opportunities</span></h2>
                    </div>

                    <div className="flex flex-wrap justify-center gap-6 md:gap-10">
                        {liveChallenges.map((comp, idx) => (
                            <div key={idx} className="comp-card snap-center mb-4">
                                <div className="comp-image">
                                    <img src={comp.img} alt={comp.title} />
                                    <div className="comp-badge">{comp.badge}</div>
                                </div>
                                <div className="comp-content">
                                    <span className="comp-type">{comp.type}</span>
                                    <h3 className="comp-title">{comp.title}</h3>
                                    <div className="comp-meta">
                                        <span><Users size={14} /> {comp.stats.students}</span>
                                        <span><Clock size={14} /> {comp.stats.days} Left</span>
                                    </div>
                                    <Link to="/register" className="btn btn-primary w-full rounded-lg bg-brand-600 border-none py-2 font-bold text-sm">Apply Now</Link>
                                </div>
                                <div className="comp-footer">
                                    <div className="text-gray-500">Prize Pool</div>
                                    <div className="prize-pool">{comp.prize}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>


            {/* Testimonials — The SOEIT Gazette */}
            <section className="gazette-section">
                <div className="container">

                    {/* Masthead */}
                    <div className="gazette-masthead">
                        <div className="gazette-rule" />
                        <div className="gazette-masthead-inner">
                            <div className="gazette-edition">
                                Vol. {new Date().getFullYear()} · Issue {activeTestimonial + 1}
                            </div>
                            <h2 className="gazette-title">THE SOEIT GAZETTE</h2>
                            <div className="gazette-tagline">Voices · Achievements · Excellence</div>
                        </div>
                        <div className="gazette-rule" />
                        <div className="gazette-subline">
                            <span>VERIFIED TESTIMONIALS</span>
                            <span className="gazette-dot">◆</span>
                            <span>FACULTY, STUDENTS &amp; ADMINISTRATION</span>
                            <span className="gazette-dot">◆</span>
                            <span>{new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                        </div>
                        <div className="gazette-rule gazette-rule-thin" />
                    </div>

                    {/* Newspaper Grid */}
                    <div
                        className="gazette-grid"
                        onMouseEnter={() => setIsPaused(true)}
                        onMouseLeave={() => setIsPaused(false)}
                    >
                        {/* Featured Column */}
                        <div className="gazette-feature-col">
                            <div className="gazette-label">FEATURED VOICE</div>
                            <div className="gazette-big-q">❝</div>
                            <p className="gazette-feature-quote" key={activeTestimonial}>
                                {testimonials[activeTestimonial].quote}
                            </p>
                            <div className="gazette-byline">
                                <div className="gazette-byline-avatar">
                                    {testimonials[activeTestimonial].initial}
                                </div>
                                <div>
                                    <div className="gazette-byline-name">— {testimonials[activeTestimonial].author}</div>
                                    <div className="gazette-byline-role">{testimonials[activeTestimonial].role}</div>
                                </div>
                            </div>
                            {/* Nav arrows */}
                            <div className="gazette-nav">
                                <button className="gazette-nav-btn" onClick={() => setActiveTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length)}>
                                    ← Prev
                                </button>
                                <span className="gazette-nav-count">
                                    {String(activeTestimonial + 1).padStart(2, '0')} of {String(testimonials.length).padStart(2, '0')}
                                </span>
                                <button className="gazette-nav-btn" onClick={() => setActiveTestimonial((prev) => (prev + 1) % testimonials.length)}>
                                    Next →
                                </button>
                            </div>
                        </div>

                        {/* Column Divider */}
                        <div className="gazette-col-divider" />

                        {/* Sidebar Column */}
                        <div className="gazette-sidebar-col">
                            <div className="gazette-label">MORE VOICES</div>
                            {[1, 2, 3].map((offset) => {
                                const idx = (activeTestimonial + offset) % testimonials.length;
                                return (
                                    <div key={idx} className="gazette-snippet" onClick={() => setActiveTestimonial(idx)}>
                                        <div className="gazette-snippet-q">"</div>
                                        <p className="gazette-snippet-text">
                                            {testimonials[idx].quote.slice(0, 100)}…
                                        </p>
                                        <div className="gazette-snippet-author">
                                            — {testimonials[idx].author}
                                            <span className="gazette-snippet-role">, {testimonials[idx].role}</span>
                                        </div>
                                        {offset < 3 && <div className="gazette-snippet-divider" />}
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                </div>
            </section>

            {/* Questions Section */}
            <section className="py-24 bg-white">
                <div className="container-small">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold mb-4 text-gray-900">Frequently Asked <span className="text-brand-600">Questions</span></h2>
                        <p className="text-gray-500">Everything you need to know about the portal and its operations.</p>
                    </div>
                    <div className="faq-grid">
                        {faqs.map((faq, idx) => (
                            <div key={idx} className={`faq-item ${activeFaq === idx ? 'active' : ''}`}>
                                <button className="faq-question" onClick={() => toggleFaq(idx)}>
                                    <span className="faq-q-prefix">Q.</span>
                                    <span className="faq-q-text">{faq.question}</span>
                                    <ChevronDown className="faq-chevron" size={20} />
                                </button>
                                <div className="faq-answer-wrapper">
                                    <p className="faq-answer">
                                        {faq.answer}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Ecosystem Section */}
            <section className="ecosystem-section py-24 bg-gray-50 border-t">
                <div className="container">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold mb-4 text-gray-900">Connected to the <span className="text-brand-600">Global Tech Ecosystem</span></h2>
                        <p className="text-gray-500 max-w-2xl mx-auto">We integrate with industry-leading platforms to ensure your achievements are recognized beyond the university campus.</p>
                    </div>
                    <div className="ecosystem-grid">
                        <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="ecosystem-item text-github">
                            <Github size={24} />
                            <span>GitHub</span>
                        </a>
                        <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="ecosystem-item text-linkedin">
                            <Linkedin size={24} />
                            <span>LinkedIn</span>
                        </a>
                        <a href="https://leetcode.com" target="_blank" rel="noopener noreferrer" className="ecosystem-item text-leetcode">
                            <Code size={24} />
                            <span>LeetCode</span>
                        </a>
                        <a href="https://coursera.org" target="_blank" rel="noopener noreferrer" className="ecosystem-item text-coursera">
                            <GraduationCap size={24} />
                            <span>Coursera</span>
                        </a>
                        <a href="https://hackerrank.com" target="_blank" rel="noopener noreferrer" className="ecosystem-item text-hackerrank">
                            <Terminal size={24} />
                            <span>HackerRank</span>
                        </a>
                    </div>
                </div>
            </section>

            {/* Support & Manual CTA */}
            <section className="py-20 bg-white">
                <div className="container">
                    <div className="cta-support-card">
                        {/* Decorative Circles */}
                        <div className="cta-circle-top"></div>
                        <div className="cta-circle-bottom"></div>

                        <div className="relative z-10">
                            <div className="cta-support-badge">
                                <CircleHelp size={16} /> Need Assistance?
                            </div>
                            <h2 className="cta-support-title">
                                New to the <span className="text-brand-100">SOEIT Portal?</span>
                            </h2>
                            <p className="cta-support-desc">
                                Explore our comprehensive user guide to master the achievement verification workflow or reach out to our support team for any technical help.
                            </p>
                            <div className="flex justify-center">
                                <Link to="/manual" className="btn btn-secondary btn-lg rounded-md px-10 bg-white text-brand-600 border-none hover:bg-brand-50 shadow-lg flex items-center gap-3 font-bold text-lg">
                                    <BookOpen size={22} /> View User Guide
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
};

export default LandingPage;
