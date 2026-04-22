import { useState, useEffect } from 'react';
import '../../styles/pages/public/LandingPage.css';
import { Link } from 'react-router-dom';
import PublicNavbar from '../../components/common/PublicNavbar';
import Footer from '../../components/common/Footer';
import ScrollToTopButton from '../../components/common/ScrollToTopButton';
import {
    Trophy, Shield, BarChart3, CircleCheck,
    Users, Star, ArrowRight, ArrowLeft, Zap, Globe, Award, BookOpen, Clock, GraduationCap, FileCheck, Briefcase, ChevronDown,
    Github, Linkedin, Code, Library, Terminal, CircleHelp, MessageSquare, Plus
} from 'lucide-react';

const quickLinks = [
    { title: 'Hackathons', icon: 'https://img.icons8.com/?size=100&id=wgH2Qk7mFnEl&format=png&color=ff6b6b', color: '#ff6b6b' },
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
    // Day 0: Sunday (Index 0-19)
    { quote: "The ability to track every technical milestone in a centralized repository has revolutionized how we prepare for accreditation and showcase our students' true potential.", author: "Dean's Office", role: "School of Engineering & IT", initial: "D" },
    { quote: "This portal has streamlined our documentation process significantly. It ensures that every student's achievement is recognized and verified with high precision.", author: "Rakhi Jha", role: "Assistant Professor, CSE", initial: "R" },
    { quote: "For students, this is more than a portal—it's a digital resume that grows with every project they complete. It bridges the gap between academics and industry.", author: "Placement Cell", role: "Industry Relations", initial: "P" },
    { quote: "We've observed a marked increase in students' participation in research and certifications since the launch of this achievement portal.", author: "Mamatha V", role: "Assistant Professor, IT", initial: "M" },
    { quote: "Mapping student achievements to academic credits has become seamless. It encourages a healthy competitive spirit among our budding engineers.", author: "HOD Computer Science", role: "Department Management", initial: "H" },
    { quote: "The transparency offered by this system allows us to mentor students more effectively based on their real-time growth and technical interests.", author: "Saayantani De", role: "Assistant Professor, CSE", initial: "S" },
    { quote: "The automated verification workflow ensures that no fake certifications enter the system, maintaining the high integrity of our institutional records.", author: "Registrar Office", role: "Academic Records", initial: "R" },
    { quote: "Digital preservation of student achievements is crucial for future-proofing their careers. This portal manages it exceptionally well.", author: "Syed Rashid Anwar", role: "Assistant Professor, ECE", initial: "S" },
    { quote: "Integrating global achievements from platforms like GitHub and LeetCode into one portal is exactly what a modern engineering school needs.", author: "Innovation Lab", role: "Research & Development", initial: "I" },
    { quote: "Mentoring students on their technical journey is much more data-driven now. We can see exactly where each student is excelling.", author: "Dr Nidhi Dua", role: "Associate Professor, CSE", initial: "N" },
    { quote: "The public portfolio feature has been a game changer. Recruiters can directly verify our students' accomplishments without any manual paperwork.", author: "Training & Placement", role: "Corporate Connect", initial: "T" },
    { quote: "As a student, seeing my dashboard grow with verified badges motivates me to participate in more hackathons and technical certifications.", author: "Ritesh Kumar", role: "Final Year Student , CCS Club President", initial: "R" },
    { quote: "We now have real-time analytics on which skills are trending in our student body, allowing us to align our curriculum with industry demands.", author: "Academic Council", role: "Curriculum Design", initial: "A" },
    { quote: "I submitted my national-level coding competition win and it was verified within 24 hours. The process is fast, transparent, and incredibly reliable.", author: "Gourav Kumar Pandey", role: "Final Year Student , Techinal Lead , GDG", initial: "G" },
    { quote: "Having a centralized platform to monitor all departmental achievements has drastically improved our NIRF submission quality and turnaround time.", author: "NIRF Coordination Cell", role: "Institutional Rankings", initial: "N" },
    { quote: "The merit point system has brought a new level of engagement. Students are proactively seeking certifications to climb the leaderboard.", author: "Faculty Coordinator", role: "Student Affairs", initial: "F" },
    { quote: "This portal reflects SOEIT's commitment to digital excellence. Every verified achievement here tells a story of perseverance.", author: "Principal", role: "School of Engineering & IT", initial: "P" },
    { quote: "The portal's ability to categorize achievements by skill sets helps us identify the diverse talents within our student groups.", author: "Laboratory In-charge", role: "Department of IT", initial: "L" },
    { quote: "Verified dossiers from this portal have become a standard part of our student evaluation and recommendation process.", author: "Evaluation Committee", role: "Academic Audit", initial: "E" },
    { quote: "It's heartening to see our students so enthusiastic about building their digital portfolios through this achievement tracking system.", author: "Alumni Relations", role: "Institutional Growth", initial: "A" },

    // Day 1: Monday (Index 20-39)
    { quote: "Monday motivation starts here. Seeing the weekend's coding project verified and live on my portfolio is the best way to start the week.", author: "Aniket Singh", role: "3rd Year, CSE", initial: "A" },
    { quote: "Accreditation audits are no longer a nightmare. The portal provides instant access to all verified student credentials.", author: "IQAC Cell", role: "Quality Assurance", initial: "I" },
    { quote: "The internship tracking feature helps us ensure that every student gets meaningful industrial exposure during their summer breaks.", author: "Internship Coordinator", role: "Department of ECE", initial: "I" },
    { quote: "Students are now more focused on long-term skill acquisition rather than just passing exams. This portal is a catalyst for change.", author: "Dr. Arvind Parihar", role: "Professor, IT", initial: "A" },
    { quote: "The technical blogs and projects section allows students to showcase their thought process, not just the final result.", author: "Web Master", role: "SOEIT IT Hub", initial: "W" },
    { quote: "We've seen a 40% increase in Cloud Certification completions this semester alone, thanks to the merit point incentives.", author: "Cloud Computing Lead", role: "AWS Academy", initial: "C" },
    { quote: "The leaderboard has created a healthy competitive environment in the dorms. Everyone wants to be the Top Contributor.", author: "Warden Office", role: "Student Welfare", initial: "W" },
    { quote: "Faculty members can now provide targeted mentorship by viewing a student's entire achievement history in one click.", author: "Mentor Council", role: "Academic Support", initial: "M" },
    { quote: "The portal's integration with LinkedIn makes it so easy for students to share their verified badges with their network.", author: "Social Media Manager", role: "University Branding", initial: "S" },
    { quote: "Every line of code committed to GitHub during our hackathons is a testament to the students' hard work, now verified here.", author: "GitHub Campus Expert", role: "Student Community", initial: "G" },
    { quote: "Smart India Hackathon winners from our college are now celebrated in a dedicated section, inspiring juniors to step up.", author: "Events Head", role: "Technical Cultural Commitee", initial: "E" },
    { quote: "The digital archive of achievements ensures that alumni can always access their verified records for further studies.", author: "Registrar Backup", role: "Data Security", initial: "R" },
    { quote: "The UI/UX of the portal itself has been used as a case study in our design classes. It's built for engineers, by engineers.", author: "Design Lead", role: "Front-end Guild", initial: "D" },
    { quote: "The API-first architecture of this system allows us to easily integrate with other university management tools.", author: "System Architect", role: "IT Infrastructure", initial: "S" },
    { quote: "We've observed students taking more ownership of their learning journeys since they can see their progress in real-time.", author: "Student Counselor", role: "Psychological Support", initial: "S" },
    { quote: "The portal bridges the gap between theoretical knowledge and practical application by highlighting real-world projects.", author: "Workshop In-charge", role: "Innovation Lab", initial: "W" },
    { quote: "Departmental rankings are now based on actual achievements rather than just academic grades, fostering all-round growth.", author: "Ranking Committee", role: "NIRF Strategy", initial: "R" },
    { quote: "The 'Certificate of Excellence' issued through the portal is becoming a symbol of trust among local industry partners.", author: "Industry Liaison", role: "AJU Corporate Cell", initial: "A" },
    { quote: "Students from all branches, including Mechanical and Civil, are now using the portal to document their interdisciplinary projects.", author: "Branch Coordinator", role: "Multi-Disciplinary Studies", initial: "B" },
    { quote: "The portal's performance has been flawless despite thousands of concurrent users during the peak submission season.", author: "DevOps Engineer", role: "Platform Stability", initial: "D" },

    // Day 2: Tuesday (Index 40-59)
    { quote: "Tuesday is for Deep Tech. Highlighting our students' research papers in AI is a priority for the Gazette today.", author: "Research Dean", role: "R&D Department", initial: "R" },
    { quote: "The portal's clean interface makes it accessible for everyone, from first-year students to senior faculty members.", author: "UI Researcher", role: "HCI Lab", initial: "U" },
    { quote: "We've integrated the portal with our library resources to recommend courses based on a student's achievement gaps.", author: "Librarian", role: "Information Resource Centre", initial: "L" },
    { quote: "The skill-heat-map feature is helping HODs identify which technology stacks are most popular among students.", author: "Data Analyst", role: "Academic Intelligence", initial: "D" },
    { quote: "Every achievement verified adds another layer of credibility to our department's standing in the national rankings.", author: "NAAC Coordinator", role: "Quality Control", initial: "N" },
    { quote: "Students are now participating in more global competitions because the portal makes it easy to track and report them.", author: "Global Outreach", role: "International Relations", initial: "G" },
    { quote: "The portal's security protocols ensure that second-party verifications are tamper-proof and fully authentic.", author: "Security Officer", role: "Cyber Security Wing", initial: "S" },
    { quote: "We've noticed a significant drop in manual documentation efforts, saving thousands of faculty hours per year.", author: "Admin Office", role: "Operations Management", initial: "A" },
    { quote: "The merit points aren't just numbers; they represent the blood, sweat, and code of our most dedicated students.", author: "Faculty Mentor", role: "Coding Club Coordinator", initial: "F" },
    { quote: "The public profile link is the new resume. Recruiters now ask for the SOEIT Portal link during on-campus interviews.", author: "HR Consultant", role: "Talent Acquisition", initial: "H" },
    { quote: "Collaborating on projects is easier now that we can see our classmates' verified skills and previous work history.", author: "Project Lead", role: "Final Year Student", initial: "P" },
    { quote: "The automated reminders for pending verifications help maintain a fast and efficient workflow for all users.", author: "Workflow Designer", role: "Process Optimization", initial: "W" },
    { quote: "Students' innovation in solving real-world challenges is what drives the content for the SOEIT Gazette.", author: "Chief Editor", role: "University Press", initial: "C" },
    { quote: "The portal is a reflection of our university's vision to be a leader in technology-driven human resource development.", author: "BoC Member", role: "University Governance", initial: "B" },
    { quote: "Even small achievements, like passing a basic Python quiz, are recognized, building confidence from day one.", author: "Junior Faculty", role: "First Year Engineering", initial: "J" },
    { quote: "The integration of sports and cultural achievements alongside technical ones ensures a holistic view of the student.", author: "Sports Officer", role: "Extra-Curricular Dept", initial: "S" },
    { quote: "We are building a legacy of excellence, one verified achievement at a time, stored forever in this digital vault.", author: "Archive Manager", role: "Institutional Heritage", initial: "A" },
    { quote: "The portal's search functionality allows students to find peers with specific skill sets for collaboration on startup ideas.", author: "Incubation Lead", role: "E-Cell AJU", initial: "I" },
    { quote: "Every verified internship record is a step closer to a successful placement. We track them with rigorous detail.", author: "TPO Assistant", role: "Placement Wing", initial: "T" },
    { quote: "The joy on a student's face when they see their 'Master' badge live on the portal is why we do what we do.", author: "Academic Dean", role: "SOEIT Administration", initial: "A" },

    // Day 3: Wednesday (Index 60-79)
    { quote: "Mid-week check-in. The Gazette is buzzing with stories of students who just cleared the Google Cloud Associate exam.", author: "Cloud Mentor", role: "Google Cloud Academy", initial: "C" },
    { quote: "The portal has transformed our department into a data-driven ecosystem where every decision is backed by analytics.", author: "Systems Analyst", role: "Institutional Research", initial: "S" },
    { quote: "We've seen students helping each other more often, as they can now identify who has mastered which technology.", author: "Peer Mentor", role: "Student Council", initial: "P" },
    { quote: "Technical certification is the backbone of employability. This portal ensures every certification is authentic.", author: "Employability Expert", role: "Skills Development", initial: "E" },
    { quote: "The 'Night Coder' award for participants in 24-hour hackathons has become a badge of honor among CSE students.", author: "Hackathon Lead", role: "Technical Society", initial: "H" },
    { quote: "The portal's backend is optimized for lightning-fast certificate generation and PDF exports for official use.", author: "Backend Developer", role: "Infrastructure Team", initial: "B" },
    { quote: "The feedback loop between students and faculty during the verification process has improved student-mentor relations.", author: "Faculty Senate", role: "Academic Relations", initial: "F" },
    { quote: "The student-led development of this portal's latest features shows our commitment to 'Learning by Doing'.", author: "Principal Intern", role: "Dev Team Lead", initial: "P" },
    { quote: "Tracking soft skills like leadership and team management is now possible through verified role-based achievements.", author: "HR Specialist", role: "Personality Development", initial: "H" },
    { quote: "The Gazette edition today focuses on 'Women in Engineering' and their record-breaking participation in cybersecurity.", author: "WIE Chair", role: "IEEE Branch AJU", initial: "W" },
    { quote: "The portal's mobile responsiveness ensures that students can upload proof of achievement right after the event.", author: "Mobile Dev", role: "App Development Cell", initial: "M" },
    { quote: "We've created a seamless integration for students to port their achievements to their personal websites directly.", author: "Web Tech Lead", role: "Full Stack Lab", initial: "W" },
    { quote: "The transparency in merit point calculation has removed any bias in the selection of 'Student of the Year'.", author: "Awards Committee", role: "Student Excellence", initial: "A" },
    { quote: "Every verified project on the portal is a potential startup. We use this data to scout talent for our incubator.", author: "Incubator Manager", role: "AJU Startup Hub", initial: "I" },
    { quote: "The portal's dashboard is the first thing I check every morning to see my progress and pending tasks.", author: "Nitesh Kumar", role: "3rd Year, IT", initial: "N" },
    { quote: "The documentation of student achievements is no longer a chore but a celebration of their hard work.", author: "Department Secretary", role: "CSE Department", initial: "D" },
    { quote: "The portal has helped us secure several high-value industrial partnerships by showcasing our students' capabilities.", author: "Director of Outreach", role: "Corporate Relations", initial: "D" },
    { quote: "Our students are not just engineers; they are innovators, and this portal is the gallery of their innovations.", author: "Innovation HOD", role: "R&D Cell", initial: "I" },
    { quote: "The Gazette ensures that the most inspiring stories of perseverance reach every corner of the university.", author: "Media Head", role: "AJU Times", initial: "M" },
    { quote: "The security and privacy of student data are our top priorities, and the portal follows the highest standards.", author: "CISO", role: "Information Security", initial: "C" },

    // Day 4: Thursday (Index 80-99)
    { quote: "Throwback Thursday to our first hackathon. Seeing the archive in the portal reminds us how far we've come.", author: "Alumni President", role: "SOEIT Batch of 2022", initial: "A" },
    { quote: "The portal is a goldmine for educational researchers studying the impact of extracurriculars on career success.", author: "Edu-Analyst", role: "Research Wing", initial: "E" },
    { quote: "We've gamified parts of the portal to keep students engaged and motivated to learn new core engineering skills.", author: "Gaming Lab", role: "Interactive Media Dept", initial: "G" },
    { quote: "The 'Alumni Connect' feature allows current students to see the success paths of their seniors via the portal.", author: "Alumni Coordinator", role: "Career Services", initial: "A" },
    { quote: "The portal's ability to sync with LeetCode profiles has made technical interview preparation a community event.", author: "Competitive Coder", role: "CCS Club", initial: "C" },
    { quote: "Faculty members are now creating 'Skill Challenges' on the portal to test students' practical knowledge.", author: "Senior Professor", role: "Mechanical Engineering", initial: "S" },
    { quote: "The digital dossiers generated by the portal are now accepted by several foreign universities for higher studies.", author: "International Dean", role: "Global Admissions", initial: "I" },
    { quote: "The Gazette's Thursday edition is dedicated to 'Research Pioneers'—students with verified paper publications.", author: "Publication In-charge", role: "Scientific Council", initial: "P" },
    { quote: "The portal has brought a sense of pride to our students, seeing their hard work officially recognized by the university.", author: "Parents Association", role: "Student Support", initial: "P" },
    { quote: "Integrating IoT project data from our labs directly into the portal is our next major milestone.", author: "IoT Specialist", role: "Lab Infrastructure", initial: "I" },
    { quote: "The portal's 'Verification History' provides a transparent trail for any academic audit, ensuring 100% compliance.", author: "Compliance Officer", role: "Legal & Regulatory", initial: "C" },
    { quote: "Monitoring internships across 200+ companies is now a simple task thanks to the centralized portal.", author: "Corporate TPO", role: "Relations Office", initial: "C" },
    { quote: "The portal's UI reflects the precision and discipline required in engineering, setting a standard for all our tools.", author: "Design Critic", role: "Creative Arts Dept", initial: "D" },
    { quote: "Students who excel in open-source contributions are now easily identifiable for special project grants.", author: "OS Outreach", role: "Open Source India", initial: "O" },
    { quote: "The Gazette highlights 'Underdog Stories'—students who overcame obstacles to achieve their technical goals.", author: "Journalist", role: "AJU Media", initial: "J" },
    { quote: "The portal is helping us build a 'Skills Inventory' for the entire School of Engineering & IT.", author: "HR Director", role: "University Administration", initial: "H" },
    { quote: "Every verified certificate of achievement is a brick in the wall of a student's future career.", author: "Career Counselor", role: "Guidance Wing", initial: "C" },
    { quote: "The portal has significantly reduced the carbon footprint of our department by eliminating paper-based registries.", author: "Eco-Ambassador", role: "Sustainability Cell", initial: "E" },
    { quote: "The 'Editor's Choice' award in the Gazette celebrates the most impactful student project of the week.", author: "Gazette Editor", role: "Content Management", initial: "G" },
    { quote: "The portal is more than just software; it's the digital pulse of our engineering community.", author: "Vice Chancellor", role: "University Leadership", initial: "V" },

    // Day 5: Friday (Index 100-119)
    { quote: "Final Friday. The rush to get certificates verified before the weekend shows how much students value the portal.", author: "Verification Desk", role: "CSE Office", initial: "V" },
    { quote: "The portal's integration with the departmental calendar ensures students never miss a major competition deadline.", author: "Schedule Manager", role: "Academic Calendar", initial: "S" },
    { quote: "Highlighting our students' work in rural technology and social impact is a key focus for Friday's Gazette.", author: "Social Impact Lead", role: "NSS Cell", initial: "S" },
    { quote: "The portal's data is used to award 'Semester Excellence' scholarships to the most productive students.", author: "Scholarship Dean", role: "Finance Dept", initial: "S" },
    { quote: "Every verified project is a testimony to the quality of teaching and guidance provided by our faculty members.", author: "Faculty Mentor", role: "Mechanical Dept", initial: "F" },
    { quote: "The portal's 'Knowledge Base' section provides resources to help students achieve higher-level certifications.", author: "Resource Lead", role: "Library Wing", initial: "R" },
    { quote: "The 'Friday Tech Talk' snippets in the Gazette are curated based on trending skills in the portal.", author: "Tech Talk Host", role: "Innovation Forum", initial: "T" },
    { quote: "The portal's ability to handle large quantities of multi-media evidence for achievements is impressive.", author: "Storage Architect", role: "Cloud Infra", initial: "S" },
    { quote: "Students are now more aware of global engineering standards thanks to the certification tracker.", author: "Global Std Officer", role: "International Relations", initial: "G" },
    { quote: "The Gazette's 'Student Spotlight' has become a massive hit on our university's social media channels.", author: "Engagement Lead", role: "Digital Media AJU", initial: "E" },
    { quote: "The portal is a powerful tool for self-evaluation. Students can see exactly where they stand in their learning path.", author: "Self-Review Board", role: "Student Affairs", initial: "S" },
    { quote: "Collaborating with local industries for internship verification through the portal has been a success.", author: "Industrial Liaison", role: "Placement Cell", initial: "I" },
    { quote: "The 'Friday Innovation Award' is given to the student with the most creative project documented on the portal.", author: "Innovation Lead", role: "R&D Lab", initial: "I" },
    { quote: "Tracking the professional growth of our faculty members through the portal is also a major feature.", author: "Faculty Dean", role: "Human Resources", initial: "F" },
    { quote: "The portal's API makes it easy to showcase our students' live achievements on the university's homepage.", author: "Front-end Architect", role: "Web Services", initial: "F" },
    { quote: "The Gazette ensures that the technical achievements of our students are known to every faculty member.", author: "Internal PR", role: "Communications Office", initial: "I" },
    { quote: "The portal has automated the generation of student recommendation letters, based on verified data.", author: "Placement Head", role: "Corporate Connect", initial: "P" },
    { quote: "Identifying talent for our university's technical teams for national events is now much more efficient.", author: "Tech Team Coach", role: "AJU Competitions", initial: "T" },
    { quote: "The portal is the ultimate proof that our students are ready for the challenges of Industry 4.0.", author: "IT HOD", role: "School of Engineering & IT", initial: "I" },
    { quote: "Every Friday, we celebrate the wins of the week, documenting our collective journey towards excellence.", author: "Student President", role: "SOEIT Student Body", initial: "S" },

    // Day 6: Saturday (Index 120-139)
    { quote: "Saturday Sprint. Hackathons are at their peak, and the portal's activity log is full of amazing updates.", author: "Hackathon Organizer", role: "Tech Events Wing", initial: "H" },
    { quote: "The Gazette's weekend edition is a bumper issue, catching up on all the major wins from the past week.", author: "Weekend Editor", role: "Gazette Team", initial: "W" },
    { quote: "Integrating the portal with local employment bureaus is helping our students find jobs faster.", author: "Employment Liaison", role: "Placement Cell", initial: "E" },
    { quote: "The Saturday Gazette's 'Coding Master' profile features the student with the most solved problems on LeetCode.", author: "Code Critic", role: "CCS Club", initial: "C" },
    { quote: "The portal helps us measure the ROI of our technical training programs by tracking student certification success.", author: "Training Dean", role: "Academic Planning", initial: "T" },
    { quote: "Weekend volunteer achievements and community service records add a vital dimension to the student profile.", author: "Voluntary Lead", role: "Social Services", initial: "V" },
    { quote: "The portal's downtime is virtually zero, making it a reliable partner for students working on their portfolios during weekends.", author: "NOC Engineer", role: "Server Operations", initial: "N" },
    { quote: "Mentorship sessions on Saturdays are now more productive as mentors review student dashboards beforehand.", author: "Mentor Lead", role: "Faculty Advising", initial: "M" },
    { quote: "The Gazette's 'Weekend Review' is the most awaited email by our students and their proud parents.", author: "Gazette PR", role: "Communications Wing", initial: "G" },
    { quote: "Tracked achievements during weekend workshops are instrumental in awarding professional development credits.", author: "Workshop Registrar", role: "Short Term Courses", initial: "W" },
    { quote: "The portal has enabled our students to build a global personal brand before they even graduate.", author: "Branding Expert", role: "Industry Relations", initial: "B" },
    { quote: "Identifying top talent for weekend research projects is now data-driven, thanks to the skills matrix on the portal.", author: "Research Lead", role: "Dept Lab", initial: "R" },
    { quote: "The Saturday Gazette's 'Innovation Corner' highlights patents filed and prototypes built by our students.", author: "Patent Officer", role: "IPR Cell", initial: "P" },
    { quote: "Students from our rural campuses are also utilizing the portal to bridge the digital divide in achievement tracking.", author: "Rural Outreach", role: "Institutional Access", initial: "R" },
    { quote: "The beauty of the portal is in its simplicity—complex verification logic hidden behind an elegant dashboard.", author: "Lead Architect", role: "Platform Dev", initial: "L" },
    { quote: "Tracking the professional achievements of our alumni helps us maintain a strong and active alumni network.", author: "Alumni Manager", role: "Institutional Growth", initial: "A" },
    { quote: "The portal is a living document of the School of Engineering & IT's progress towards becoming a global hub of excellence.", author: "University Director", role: "Executive Board", initial: "U" },
    { quote: "Every verified achievement on a Saturday is a building block for a successful career tomorrow.", author: "Dean of Students", role: "SOEIT Management", initial: "D" },
    { quote: "The Gazette's Saturday issue celebrates not just the winners, but every student who showed up and participated.", author: "Gazette Founder", role: "Media & Branding", initial: "G" },
    { quote: "We are documenting a revolution in engineering education, one verified achievement at a time.", author: "Principal SOEIT", role: "NAAC A Accredited University", initial: "P" }
];

const heroImages = [
    "https://arkajainuniversity.ac.in/wp-content/uploads/2023/01/1-2.jpg",
    "https://arkajainuniversity.ac.in/wp-content/uploads/2023/05/9-3.jpg",
    "https://arkajainuniversity.ac.in/wp-content/uploads/2022/10/11.jpg",
    "https://arkajainuniversity.ac.in/wp-content/uploads/2022/10/13.jpg",
    "https://arkajainuniversity.ac.in/wp-content/uploads/2020/11/8-5.jpg",
    "https://arkajainuniversity.ac.in/wp-content/uploads/2022/05/9-2.jpg"
];

const LandingPage = () => {
    const [activeFaq, setActiveFaq] = useState(null);
    const [activeTestimonial, setActiveTestimonial] = useState(0);
    const [isPaused, setIsPaused] = useState(false);
    const [currentImg, setCurrentImg] = useState(0);

    // Auto-rotate hero images every 5s
    useEffect(() => {
        if (isPaused) return;
        const timer = setInterval(() => {
            setCurrentImg((prev) => (prev + 1) % heroImages.length);
        }, 5000);
        return () => clearInterval(timer);
    }, [isPaused]);

    // Conditional profile fetch for logged-in users
    useEffect(() => {
        const checkAuth = async () => {
            try {
                const token = sessionStorage.getItem('soeit_token');
                const isAuth = token && token !== 'null' && token !== 'undefined' && token.length > 10;

                if (isAuth) {
                    const { authAPI } = await import('../../services/api');
                    authAPI.getProfile().catch(() => { });
                }
            } catch (e) { /* ignore silently */ }
        };
        checkAuth();
    }, []);

    const toggleFaq = (idx) => {
        setActiveFaq(activeFaq === idx ? null : idx);
    };

    // Gazette Daily Rotation Logic
    const [currentSet, setCurrentSet] = useState([]);
    const [dayNum, setDayNum] = useState(1);

    useEffect(() => {
        const dayIdx = new Date().getDay(); // 0 (Sun) to 6 (Sat)
        setDayNum(dayIdx + 1);
        const setOf20 = testimonials.slice(dayIdx * 20, (dayIdx + 1) * 20);
        setCurrentSet(setOf20);
    }, []);

    // Randomly rotate testimonials within the daily set every 4s
    useEffect(() => {
        if (isPaused || currentSet.length === 0) return;
        const timer = setInterval(() => {
            let nextIdx;
            do {
                nextIdx = Math.floor(Math.random() * currentSet.length);
            } while (nextIdx === activeTestimonial && currentSet.length > 1);
            setActiveTestimonial(nextIdx);
        }, 1000);
        return () => clearInterval(timer);
    }, [isPaused, activeTestimonial, currentSet]);

    return (
        <div className="landing-page">
            <PublicNavbar />

            {/* Hero Section - Static Content + Visual Slideshow */}
            <section className="hero-section">
                <div className="hero-mesh" />
                <div className="hero-glow" />

                <div className="container hero-container">
                    <div className="hero-content">
                        <div className="hero-badge">
                            <Shield size={14} className="text-brand-600" />
                            <span className="hero-badge-text">Official SOEIT Student Portal</span>
                        </div>

                        <h1 className="hero-title">
                            Empowering <br />
                            <span className="text-brand-emphasized">Engineering Excellence</span>
                        </h1>

                        <p className="hero-subtitle">
                            The premier hub for School of Engineering & IT (NAAC A) to track academic milestones, global competition wins, and professional growth.
                        </p>

                        <div className="flex gap-4 items-center">
                            <Link to="/login" className="btn btn-gold btn-lg rounded-xl px-10 shadow-2xl hover:scale-105 transition-transform border-none flex items-center gap-2">
                                Explore Opportunities <ArrowRight size={18} />
                            </Link>
                            <Link to="/register" className="btn btn-secondary-yellow btn-lg rounded-xl px-10 border-gray-200 hover:bg-gray-50 font-bold">
                                Register Now
                            </Link>
                        </div>

                        <div className="mt-10 flex items-center gap-6">
                            <div className="flex -space-x-3">
                                {[1, 2, 3, 4].map((i) => (
                                    <div key={i} className="w-10 h-10 rounded-full border-2 border-white bg-gray-200 overflow-hidden">
                                        <img src={`https://i.pravatar.cc/100?img=${i + 15}`} alt="User" />
                                    </div>
                                ))}
                                <div className="w-10 h-10 rounded-full border-2 border-white badge-gold flex items-center justify-center text-[10px] font-bold">
                                    +5k
                                </div>
                            </div>
                            <div className="text-sm font-medium text-gray-500">
                                <span className="text-gray-900 font-bold">7,000+</span> Enrolled Students
                            </div>
                        </div>
                    </div>

                    <div className="hero-visual">
                        <div
                            className="hero-collage"
                            onMouseEnter={() => setIsPaused(true)}
                            onMouseLeave={() => setIsPaused(false)}
                        >
                            {/* Visual Slider - Nested in Collage Space */}
                            <div className="hero-main-img-slider">
                                {heroImages.map((img, idx) => (
                                    <img
                                        key={idx}
                                        src={img}
                                        alt={`University Preview ${idx + 1}`}
                                        className={`hero-main-img ${currentImg === idx ? 'active' : ''}`}
                                    />
                                ))}

                                {heroImages.length > 1 && (
                                    <div className="hero-img-indicators">
                                        {heroImages.map((_, idx) => (
                                            <div
                                                key={idx}
                                                className={`hero-img-dot ${currentImg === idx ? 'active' : ''}`}
                                                onClick={() => setCurrentImg(idx)}
                                            />
                                        ))}
                                    </div>
                                )}
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
                            const isUrlIcon = typeof link.icon === 'string';
                            const Icon = !isUrlIcon ? link.icon : null;
                            return (
                                <div key={idx} className="quick-card">
                                    <div className="quick-icon" style={{ background: `${link.color}10`, color: link.color }}>
                                        {isUrlIcon ? (
                                            <img
                                                src={link.icon}
                                                alt={link.title}
                                                className="quick-img-icon"
                                            />
                                        ) : (
                                            <Icon size={24} />
                                        )}
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
                                Vol. {new Date().getFullYear()}
                            </div>
                            <h2 className="gazette-title">THE SOEIT GAZETTE</h2>
                            <div className="gazette-tagline">Voices · Achievements · Excellence</div>
                        </div>
                        <div className="gazette-rule" />
                        <div className="gazette-subline">
                            <span>DAILY EDITION</span>
                            <span className="gazette-dot">◆</span>
                            <span>FACULTY, STUDENTS &amp; ADMINISTRATION</span>
                            <span className="gazette-dot">◆</span>
                            <span>{new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</span>
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

                            {currentSet.length > 0 && (
                                <>
                                    <p className="gazette-feature-quote" key={activeTestimonial}>
                                        {currentSet[activeTestimonial].quote}
                                    </p>
                                    <div className="gazette-byline">
                                        <div className="gazette-byline-avatar">
                                            {currentSet[activeTestimonial].initial}
                                        </div>
                                        <div>
                                            <div className="gazette-byline-name">— {currentSet[activeTestimonial].author}</div>
                                            <div className="gazette-byline-role">{currentSet[activeTestimonial].role}</div>
                                        </div>
                                    </div>
                                </>
                            )}
                            {/* Nav arrows */}
                            <div className="gazette-nav">
                                <button className="gazette-nav-btn" onClick={() => setActiveTestimonial((prev) => (prev - 1 + currentSet.length) % currentSet.length)}>
                                    ← Prev
                                </button>
                                <span className="gazette-nav-count">
                                    {String(activeTestimonial + 1).padStart(2, '0')} of {String(currentSet.length).padStart(2, '0')}
                                </span>
                                <button className="gazette-nav-btn" onClick={() => setActiveTestimonial((prev) => (prev + 1) % currentSet.length)}>
                                    Next →
                                </button>
                            </div>
                        </div>

                        {/* Column Divider */}
                        <div className="gazette-col-divider" />

                        {/* Sidebar Column */}
                        <div className="gazette-sidebar-col">
                            <div className="gazette-label">MORE VOICES</div>
                            {currentSet.length > 0 && [1, 2, 3].map((offset) => {
                                const idx = (activeTestimonial + offset) % currentSet.length;
                                return (
                                    <div key={idx} className="gazette-snippet" onClick={() => setActiveTestimonial(idx)}>

                                        <p className="gazette-snippet-text">
                                            {currentSet[idx].quote.slice(0, 100)}…
                                        </p>
                                        <div className="gazette-snippet-author">
                                            — {currentSet[idx].author}
                                            <span className="gazette-snippet-role">, {currentSet[idx].role}</span>
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

            {/* Ecosystem Section */}
            <section className="ecosystem-section py-24 bg-gray-50 border-t">
                <div className="container">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold mb-4 text-gray-900">Connected to the <span className="text-brand-600">Global Tech Ecosystem</span></h2>
                        <p className="text-gray-500 max-w-2xl mx-auto">We integrate with industry-leading platforms to ensure your achievements are recognized beyond the university campus.</p>
                    </div>
                </div>

                <div className="ecosystem-marquee-container">
                    <div className="ecosystem-reel">
                        {/* Original Set */}
                        <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="ecosystem-item" title="GitHub">
                            <img src="https://uxwing.com/wp-content/themes/uxwing/download/brands-and-social-media/github-icon.png" alt="GitHub" className="ecosystem-logo" />
                        </a>
                        <a href="https://leetcode.com" target="_blank" rel="noopener noreferrer" className="ecosystem-item" title="LeetCode">
                            <img src="https://upload.wikimedia.org/wikipedia/commons/8/8e/LeetCode_Logo_1.png" alt="LeetCode" className="ecosystem-logo" />
                        </a>

                        <a href="https://coursera.org" target="_blank" rel="noopener noreferrer" className="ecosystem-item" title="Coursera">
                            <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/5f/Coursera_logo_%282020%29.svg/3840px-Coursera_logo_%282020%29.svg.png" alt="Coursera" className="ecosystem-logo" />
                        </a>
                        <a href="https://hackerrank.com" target="_blank" rel="noopener noreferrer" className="ecosystem-item" title="HackerRank">
                            <img src="https://upload.wikimedia.org/wikipedia/commons/6/65/HackerRank_logo.png" alt="HackerRank" className="ecosystem-logo" />
                        </a>
                        <a href="https://geeksforgeeks.org" target="_blank" rel="noopener noreferrer" className="ecosystem-item" title="GeeksForGeeks">
                            <img src="https://upload.wikimedia.org/wikipedia/commons/e/eb/GeeksForGeeks_logo.png" alt="GeeksForGeeks" className="ecosystem-logo" />
                        </a>
                        {/* Duplicate Set for Infinite Scroll */}
                        <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="ecosystem-item" title="GitHub">
                            <img src="https://uxwing.com/wp-content/themes/uxwing/download/brands-and-social-media/github-icon.png" alt="GitHub" className="ecosystem-logo" />
                        </a>
                        <a href="https://leetcode.com" target="_blank" rel="noopener noreferrer" className="ecosystem-item" title="LinkedIn">
                            <img src="https://miro.medium.com/1*kBWo_GWrG58h28kDHwnBfg.png" alt="Leetcode" className="ecosystem-logo" />
                        </a>

                        <a href="https://coursera.org" target="_blank" rel="noopener noreferrer" className="ecosystem-item" title="Coursera">
                            <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/5f/Coursera_logo_%282020%29.svg/3840px-Coursera_logo_%282020%29.svg.png" alt="Coursera" className="ecosystem-logo" />
                        </a>
                        <a href="https://hackerrank.com" target="_blank" rel="noopener noreferrer" className="ecosystem-item" title="HackerRank">
                            <img src="https://upload.wikimedia.org/wikipedia/commons/6/65/HackerRank_logo.png" alt="HackerRank" className="ecosystem-logo" />
                        </a>
                        <a href="https://geeksforgeeks.org" target="_blank" rel="noopener noreferrer" className="ecosystem-item" title="GeeksForGeeks">
                            <img src="https://upload.wikimedia.org/wikipedia/commons/e/eb/GeeksForGeeks_logo.png" alt="GeeksForGeeks" className="ecosystem-logo" />
                        </a>
                    </div>
                </div>
            </section>

            {/* Highlight Achievements Section */}
            <section className="achievement-highlight-section py-24">
                <div className="container">
                    <div className="achievement-highlight-content-vertical">
                        {/* Quote & Description */}
                        <div className="achievement-highlight-text-full">

                            <h2 className="achievement-highlight-title">
                                Make Your <span className="text-brand-600">Achievement</span> a Highlight
                            </h2>
                            <p className="achievement-highlight-quote">
                                Every project you complete, every certificate you earn, and every milestone you achieve deserves to be recognized and celebrated. We don't just track your accomplishments—we validate them with official badges that tell your professional story.
                            </p>



                            <Link to="/register" className="btn btn-primary btn-lg rounded-lg mt-8 px-12 shadow-xl hover:scale-105 transition-transform" style={{ display: 'inline-block' }}>
                                Start Earning Badges Today
                            </Link>
                        </div>

                        {/* Badge Carousel - Horizontal Line */}
                        <div className="achievement-badges-carousel">
                            {[
                                { url: '/badge.png', label: 'Achievement' },
                                { url: '/education.png', label: 'Education' },
                                { url: '/hackathon.png', label: 'Hackathon' },
                                { url: '/technical.png', label: 'Technical' },
                                { url: '/workshop.png', label: 'Workshop' }
                            ].map((badge, idx) => (
                                <div key={idx} className="achievement-badge-item">
                                    <img
                                        src={badge.url}
                                        alt={`${badge.label} Badge`}
                                        className="achievement-badge-image"
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Support & Manual CTA */}
            <section className="py-20 bg-white">
                <div className="container">
                    <div className="cta-support-card cta-education-theme">
                        {/* Decorative Circles */}
                        <div className="cta-circle-top"></div>
                        <div className="cta-circle-bottom"></div>

                        <div className="relative z-10 text-center flex flex-col items-center">
                            <div className="cta-support-badge">
                                <CircleHelp size={16} /> Need Assistance?
                            </div>
                            <h2 className="cta-support-title">
                                New to the <span className="text-brand-100">SOEIT Portal?</span>
                            </h2>
                            <p className="cta-support-desc">
                                Explore our comprehensive user guide to master the achievement verification workflow or reach out to our support team for any technical help.
                            </p>
                            <div className="flex justify-center mt-8">
                                <Link to="/manual" className="btn btn-secondary btn-lg rounded-md px-10 bg-white text-brand-600 border-none hover:bg-brand-50 shadow-lg flex items-center gap-3 font-bold text-lg">
                                    <BookOpen size={22} /> View User Guide
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </section>


            {/* FAQ Section Redesign */}
            <section className="faq-section-new py-24">
                <div className="container faq-container">
                    <div className="faq-left">
                        <div className="faq-badge-minimal">
                            <CircleHelp size={14} className="faq-badge-icon" />
                            <span>FAQs</span>
                        </div>
                        <h2 className="faq-title-large">Frequently Asked Questions</h2>
                    </div>

                    <div className="faq-right">
                        <div className="faq-accordion-minimal">
                            {faqs.map((faq, idx) => (
                                <div key={idx} className={`faq-item-minimal ${activeFaq === idx ? 'active' : ''}`}>
                                    <button className="faq-question-minimal" onClick={() => toggleFaq(idx)}>
                                        <span className="faq-q-text-minimal">{faq.question}</span>
                                        <div className="faq-icon-minimal">
                                            <Plus size={20} className={activeFaq === idx ? 'rotate-45' : ''} />
                                        </div>
                                    </button>
                                    {activeFaq === idx && (
                                        <div className="faq-answer-minimal">
                                            <p>{faq.answer}</p>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>
            <Footer />
            <ScrollToTopButton />
        </div>
    );
};

export default LandingPage;
