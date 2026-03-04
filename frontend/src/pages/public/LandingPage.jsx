import { useState } from 'react';
import '../../styles/LandingPage.css';
import { Link } from 'react-router-dom';
import PublicNavbar from '../../components/common/PublicNavbar';
import Footer from '../../components/common/Footer';
import {
    Trophy, Shield, BarChart3, CheckCircle,
    Users, Star, ArrowRight, ArrowLeft, Zap, Globe, Award, BookOpen, Clock, GraduationCap, FileCheck, Briefcase, ChevronDown,
    Github, Linkedin, Code, Library, Terminal
} from 'lucide-react';

const stats = [
    { value: '4,200+', label: 'Technical Records' },
    { value: '1,250+', label: 'Engineer Dossiers' },
    { value: '100%', label: 'Skill Validation' },
    { value: '24/7', label: 'Faculty Verification' },
];

const features = [
    { icon: Shield, title: 'Project Verification', desc: 'Every technical project and certificate is vetted through a faculty workflow ensuring 100% industry-ready validation.', color: 'var(--brand-600)' },
    { icon: FileCheck, title: 'Engineer Portfolios', desc: 'Students generate tamper-proof project dossiers for top tech recruiters, verified by the SOEIT faculty.', color: 'var(--brand-600)' },
    { icon: BarChart3, title: 'Compliance Analytics', desc: 'Real-time monitoring of departmental achievements for NAAC, NIRF, and other institutional audits.', color: 'var(--brand-600)' },
    { icon: Users, title: 'Faculty Oversight', desc: 'Dedicated administrative tools for department heads to monitor student growth and career milestones.', color: 'var(--brand-600)' },
    { icon: Award, title: 'Excellence Tiering', desc: 'Automated point calculations based on national and international achievement standards and weights.', color: 'var(--brand-600)' },
    { icon: Globe, title: 'Universal Export', desc: 'Export verified records directly to LinkedIn or download as official university-branded PDF certificates.', color: 'var(--brand-600)' },
];

const categoriesData = [
    { name: 'Technical Projects', icon: Briefcase },
    { name: 'Coding Challenges', icon: Zap },
    { name: 'Industrial Training', icon: Shield },
    { name: 'Web/App Innovations', icon: Globe },
    { name: 'Hardware Prototypes', icon: Trophy },
    { name: 'Skill Certifications', icon: BookOpen },
    { name: 'Cultural Events', icon: Star },
    { name: 'Team Leadership', icon: Users }
];

const workflowSteps = [
    {
        title: 'Submit Achievement',
        desc: 'Students upload their technical milestones, project documentation, and valid certificates through their dedicated portal.',
        icon: GraduationCap
    },
    {
        title: 'Faculty Verification',
        desc: 'Appointed faculty coordinators review the submissions against institutional standards to ensure authenticity.',
        icon: FileCheck
    },
    {
        title: 'Global Recognition',
        desc: 'Verified achievements are instantly added to the public dossier, ready for placement drives and recruiter reviews.',
        icon: Award
    }
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
        quote: "This portal has streamlined our NAAC documentation process significantly. What used to take weeks now takes only a few clicks with verified data.",
        author: "Quality Assurance Cell",
        role: "Institutional Coordination",
        initial: "Q"
    },
    {
        quote: "For students, this is more than a portal—it's a digital resume that grows with every project they complete. Industry partners love the verified dossiers.",
        author: "Placement Cell",
        role: "Industry Relations",
        initial: "P"
    },
    {
        quote: "A significant step toward a paperless, transparent ecosystem where every student's hard work is digitally preserved and faculty-vetted.",
        author: "Vice Chancellor",
        role: "Executive Administration",
        initial: "V"
    },
    {
        quote: "Mapping student achievements to academic credits has become seamless. It encourages a healthy competitive spirit among our budding engineers.",
        author: "HOD Computer Science",
        role: "Department Management",
        initial: "H"
    },
    {
        quote: "The automated verification workflow ensures that no fake certifications enter the system, maintaining the high integrity of our institutional records.",
        author: "Registrar Office",
        role: "Academic Records",
        initial: "R"
    },
    {
        quote: "As a student, seeing my dashboard grow with verified badges motivates me to participate in more hackathons and technical certifications.",
        author: "Final Year Student",
        role: "Student Community",
        initial: "S"
    },
    {
        quote: "The ability to export a faculty-verified achievement dossier gives our students a massive edge during high-stakes technical interviews.",
        author: "Career Development",
        role: "Skill Advancement",
        initial: "C"
    },
    {
        quote: "Integrating global achievements from platforms like GitHub and LeetCode into one portal is exactly what a modern engineering school needs.",
        author: "Innovation Lab",
        role: "Research & Development",
        initial: "I"
    },
    {
        quote: "We now have real-time analytics on which skills are trending in our student body, allowing us to align our curriculum with industry demands.",
        author: "Academic Council",
        role: "Curriculum Design",
        initial: "A"
    }
];

const LandingPage = () => {
    const [activeFaq, setActiveFaq] = useState(null);
    const [activeTestimonial, setActiveTestimonial] = useState(0);

    const toggleFaq = (idx) => {
        setActiveFaq(activeFaq === idx ? null : idx);
    };

    const nextTestimonial = () => {
        setActiveTestimonial((prev) => (prev + 1) % testimonials.length);
    };

    const prevTestimonial = () => {
        setActiveTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length);
    };

    return (
        <div className="landing-page">
            <PublicNavbar />

            {/* Hero Section */}
            <section className="hero-section">
                <div className="hero-mesh" />

                <div className="container hero-container">
                    <div className="hero-badge">
                        <Shield size={14} />
                        <span className="hero-badge-text">Official Academic Repository of SOEIT</span>
                    </div>

                    <h1 className="hero-title">
                        Centralizing <br />
                        <span className="text-gradient">Student Excellence</span>
                    </h1>

                    <p className="hero-subtitle">
                        The SOEIT Achievement Portal is the primary platform for documenting, verifying, and showcasing the technical projects, coding skills, and engineering milestones of our future innovators.
                    </p>

                    <div className="flex justify-center mt-8">
                        <Link to="/login" className="btn btn-primary btn-lg rounded-md px-12 bg-brand-600 border-none shadow-xl hover:bg-brand-700 transition-all flex items-center gap-3 font-bold text-lg">
                            Get Started <ArrowRight size={20} />
                        </Link>
                    </div>
                </div>
            </section>


            {/* Features Section */}
            <section className="py-24 bg-white">
                <div className="container">
                    <div className="text-center mb-20">
                        <div className="section-label mb-4">
                            <Shield size={14} className="text-brand-600" />
                            <span>Academic Governance</span>
                        </div>
                        <h2 className="text-4xl font-extrabold mb-4 text-gray-900">Engineered for <span className="text-brand-600">Institutional Success</span></h2>
                        <p className="text-gray-500 max-w-2xl mx-auto text-lg">
                            An end-to-end framework designed to streamline the lifecycle of student achievements, from initial submission to final verification.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {features.map((feature) => {
                            const FeatureIcon = feature.icon;
                            return (
                                <div key={feature.title} className="feature-card">
                                    <div className="feature-icon-wrapper" style={{ background: 'var(--bg-secondary)' }}>
                                        <FeatureIcon size={32} style={{ color: 'var(--brand-600)' }} />
                                    </div>
                                    <h3 className="text-xl font-bold mb-4 text-gray-800">{feature.title}</h3>
                                    <p className="text-gray-500 leading-relaxed text-sm">{feature.desc}</p>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* Categories Section */}
            <section className="py-24 bg-gray-50 border-y">
                <div className="container">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold mb-3 text-gray-900">Engineering <span className="text-brand-600">Skill Categories</span></h2>
                        <p className="text-gray-500 max-w-lg mx-auto">We provide a structured categorization for every student milestone, ensuring comprehensive performance reports.</p>
                    </div>
                    <div className="category-grid">
                        {categoriesData.map((cat) => {
                            const CatIcon = cat.icon;
                            return (
                                <div key={cat.name} className="category-card">
                                    <div className="category-icon" style={{ background: 'white' }}>
                                        <CatIcon size={20} />
                                    </div>
                                    <span style={{ fontSize: '0.85rem' }}>{cat.name}</span>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* Workflow Section */}
            <section className="py-24 bg-white border-y">
                <div className="container">
                    <div className="workflow-container">
                        <div className="workflow-text">
                            <h2 className="text-4xl font-extrabold mb-6 text-gray-900">A Structured Path to <span className="text-brand-600">Verification</span></h2>
                            <p className="text-gray-500 text-lg mb-8 leading-relaxed">
                                Our platform ensures that every achievement is more than just a line on a resume. We follow a rigorous verification cycle that maintains the integrity of the SOEIT brand while highlighting individual excellence.
                            </p>
                            <div className="workflow-steps">
                                {workflowSteps.map((step, idx) => {
                                    const StepIcon = step.icon;
                                    return (
                                        <div key={idx} className="workflow-step-item">
                                            <div className="workflow-step-icon">
                                                <StepIcon size={20} />
                                            </div>
                                            <div className="workflow-step-content">
                                                <h4 className="font-bold text-gray-900 mb-1">{step.title}</h4>
                                                <p className="text-sm text-gray-500">{step.desc}</p>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                        <div className="workflow-visual">
                            <div className="workflow-visual-inner">
                                <div className="workflow-visual-card">
                                    <div className="workflow-visual-icon">
                                        <Zap size={32} />
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-900 mb-2">Automated Audit System</h3>
                                    <p className="text-gray-500 text-sm">Real-time data synchronization with departmental databases for seamless administrative reporting.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Institutional Impact Section */}
            <section className="impact-section py-24 bg-gray-50 border-y">
                <div className="container">
                    <div className="impact-grid">
                        <div data-aos="fade-right">
                            <h2 className="text-4xl font-bold mb-6 text-gray-900 leading-tight">
                                Driving Institutional <br />
                                <span className="text-brand-600">Digital Transformation</span>
                            </h2>
                            <p className="text-gray-600 mb-10 text-lg">
                                We go beyond simple record-keeping. The SOEIT Achievement Portal is a strategic asset for the university, providing data-driven insights into student performance and departmental growth.
                            </p>
                            <div className="impact-stats">
                                <div>
                                    <div className="impact-stat-value text-brand-600">98%</div>
                                    <div className="impact-stat-label">Audit Data Readiness</div>
                                </div>
                                <div>
                                    <div className="impact-stat-value text-brand-600">15k+</div>
                                    <div className="impact-stat-label">Verified Milestone Records</div>
                                </div>
                            </div>
                        </div>

                        <div className="relative" data-aos="fade-left">
                            <div className="impact-testimonial light">
                                <p className="testimonial-quote">
                                    "{testimonials[activeTestimonial].quote}"
                                </p>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-6">
                                        <button onClick={prevTestimonial} className="testimonial-btn prev" aria-label="Previous Insight">
                                            <ArrowLeft size={18} />
                                        </button>
                                        <div className="testimonial-author">
                                            <div className="testimonial-avatar">
                                                {testimonials[activeTestimonial].initial}
                                            </div>
                                            <div>
                                                <div className="author-name text-gray-900">{testimonials[activeTestimonial].author}</div>
                                                <div className="author-role">{testimonials[activeTestimonial].role}</div>
                                            </div>
                                        </div>
                                    </div>
                                    <button onClick={nextTestimonial} className="testimonial-btn next" aria-label="Next Insight">
                                        <span>Next Insight</span>
                                        <ArrowRight size={18} />
                                    </button>
                                </div>
                            </div>
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


            <Footer />
        </div>
    );
};

export default LandingPage;
