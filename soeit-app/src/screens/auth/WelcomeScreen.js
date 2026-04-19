import React, { useState, useEffect, useRef } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Dimensions,
  ScrollView,
  Image,
  Animated,
  ImageBackground,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS } from '../../constants/colors';

const { width, height } = Dimensions.get('window');

// ── data ────────────────────────────────────────────────────────────────────

const HERO_GRADIENT = ['#fff5f0', '#fee2d5', '#ffffff']; // Light Peach Shades

const QUICK_LINKS = [
  { title: 'Hackathons', icon: 'trophy', color: '#ff6b6b' },
  { title: 'Coding', icon: 'terminal', color: '#4facfe' },
  { title: 'Internships', icon: 'briefcase', color: '#00f2fe' },
  { title: 'Mentorship', icon: 'people', color: '#f093fb' },
  { title: 'Courses', icon: 'book', color: '#43e97b' },
  { title: 'Practice', icon: 'code-slash', color: '#fa709a' },
];


const TESTIMONIALS = [
  { quote: "The ability to track every technical milestone in a centralized repository has revolutionized how we prepare for accreditation.", author: "Dean's Office", role: "School of Engineering & IT", initial: "D", day: 0 },
  { quote: "This portal has streamlined our documentation process significantly. Every student's achievement is recognized and verified with high precision.", author: "Rakhi Jha", role: "Assistant Professor, CSE", initial: "R", day: 0 },
  { quote: "For students, this is more than a portal—it's a digital resume that grows with every project they complete.", author: "Placement Cell", role: "Industry Relations", initial: "P", day: 0 },
  { quote: "We've observed a marked increase in students' participation in research and certifications since launch.", author: "Mamatha V", role: "Assistant Professor, IT", initial: "M", day: 0 },
  { quote: "Mapping student achievements to academic credits has become seamless. It encourages a healthy competitive spirit.", author: "HOD Computer Science", role: "Department Management", initial: "H", day: 0 },
  { quote: "The transparency offered by this system allows us to mentor students more effectively.", author: "Saayantani De", role: "Assistant Professor, CSE", initial: "S", day: 0 },
  { quote: "The automated verification workflow ensures no fake certifications enter the system.", author: "Registrar Office", role: "Academic Records", initial: "R", day: 0 },
  { quote: "Integrating global achievements from GitHub and LeetCode into one portal is exactly what a modern school needs.", author: "Innovation Lab", role: "Research & Development", initial: "I", day: 0 },
  { quote: "Mentoring students is much more data-driven now. We can see exactly where each student excels.", author: "Dr Nidhi Dua", role: "Associate Professor, CSE", initial: "N", day: 0 },
  { quote: "The public portfolio feature has been a game changer. Recruiters verify our students' accomplishments without paperwork.", author: "Training & Placement", role: "Corporate Connect", initial: "T", day: 0 },
  { quote: "Seeing my dashboard grow with verified badges motivates me to participate in more hackathons.", author: "Ritesh Kumar", role: "Final Year, CCS Club President", initial: "R", day: 0 },
  { quote: "I submitted my national-level coding competition win and it was verified within 24 hours. Fast, transparent, reliable.", author: "Gourav Kumar Pandey", role: "Final Year, Tech Lead, GDG", initial: "G", day: 0 },
  { quote: "The merit point system has brought a new level of engagement. Students proactively seek certifications.", author: "Faculty Coordinator", role: "Student Affairs", initial: "F", day: 0 },
  { quote: "This portal reflects SoEIT's commitment to digital excellence. Every verified achievement tells a story.", author: "Principal", role: "School of Engineering & IT", initial: "P", day: 0 },
  { quote: "Monday motivation starts here. Seeing the weekend project verified is the best way to start the week.", author: "Aniket Singh", role: "3rd Year, CSE", initial: "A", day: 1 },
  { quote: "Accreditation audits are no longer a nightmare. The portal provides instant access to all verified credentials.", author: "IQAC Cell", role: "Quality Assurance", initial: "I", day: 1 },
  { quote: "Students are now more focused on long-term skill acquisition. This portal is a catalyst for change.", author: "Dr. Arvind Parihar", role: "Professor, IT", initial: "A", day: 1 },
  { quote: "We've seen a 40% increase in Cloud Certification completions this semester alone.", author: "Cloud Computing Lead", role: "AWS Academy", initial: "C", day: 1 },
  { quote: "The leaderboard has created a healthy competitive environment. Everyone wants to be Top Contributor.", author: "Warden Office", role: "Student Welfare", initial: "W", day: 1 },
  { quote: "The portal bridges the gap between theoretical knowledge and practical application.", author: "Workshop In-charge", role: "Innovation Lab", initial: "W", day: 1 },
  { quote: "Tuesday is for Deep Tech. Highlighting research papers in AI is a priority.", author: "Research Dean", role: "R&D Department", initial: "R", day: 2 },
  { quote: "The merit points aren't just numbers; they represent the blood, sweat, and code of our students.", author: "Faculty Mentor", role: "Coding Club Coordinator", initial: "F", day: 2 },
  { quote: "The public profile link is the new resume. Recruiters now ask for the SOEIT Portal link.", author: "HR Consultant", role: "Talent Acquisition", initial: "H", day: 2 },
  { quote: "Even small achievements, like passing a basic quiz, are recognized, building confidence from day one.", author: "Junior Faculty", role: "First Year Engineering", initial: "J", day: 2 },
  { quote: "Mid-week check-in. The Gazette is buzzing with students who just cleared the Google Cloud Associate exam.", author: "Cloud Mentor", role: "Google Cloud Academy", initial: "C", day: 3 },
  { quote: "The 'Night Coder' award for 24-hour hackathon participants has become a badge of honor.", author: "Hackathon Lead", role: "Technical Society", initial: "H", day: 3 },
  { quote: "The dashboard is the first thing I check every morning to see my progress.", author: "Nitesh Kumar", role: "3rd Year, IT", initial: "N", day: 3 },
  { quote: "The portal has helped us secure high-value industrial partnerships by showcasing capabilities.", author: "Director of Outreach", role: "Corporate Relations", initial: "D", day: 3 },
  { quote: "Throwback Thursday to our first hackathon. Seeing the archive reminds us how far we've come.", author: "Alumni President", role: "SOEIT Batch of 2022", initial: "A", day: 4 },
  { quote: "The digital dossiers generated by the portal are accepted by foreign universities for higher studies.", author: "International Dean", role: "Global Admissions", initial: "I", day: 4 },
  { quote: "The merit point system has brought remarkable engagement. Students proactively seek certifications.", author: "Faculty Senate", role: "Academic Relations", initial: "F", day: 4 },
  { quote: "Final Friday. The rush to get certificates verified before the weekend shows student dedication.", author: "Verification Desk", role: "CSE Office", initial: "V", day: 5 },
  { quote: "The portal's data is used to award 'Semester Excellence' scholarships to the most productive students.", author: "Scholarship Dean", role: "Finance Dept", initial: "S", day: 5 },
  { quote: "The portal is the ultimate proof that our students are ready for the challenges of Industry 4.0.", author: "IT HOD", role: "School of Engineering & IT", initial: "I", day: 5 },
  { quote: "Saturday Sprint. Hackathons are at peak, and the portal's activity log is full of amazing updates.", author: "Hackathon Organizer", role: "Tech Events Wing", initial: "H", day: 6 },
  { quote: "The portal has enabled our students to build a global personal brand before they even graduate.", author: "Branding Expert", role: "Industry Relations", initial: "B", day: 6 },
  { quote: "We are documenting a revolution in engineering education, one verified achievement at a time.", author: "Principal SOEIT", role: "NAAC A Accredited University", initial: "P", day: 6 },
];

const FAQS = [
  { q: 'Who can access the SOEIT Achievement Portal?', a: "Currently restricted to active students and faculty of School of Engineering & IT. Each user gets unique credentials from the department." },
  { q: 'How does the verification process work?', a: "Once a student submits a record, it enters the faculty dashboard. A designated expert reviews the attached documents and approves or requests refinements." },
  { q: 'Are the digital certificates official?', a: "Yes, every achievement verified carries the institutional weight of SOEIT and can be included in official university dossiers for NAAC/NIRF audits." },
  { q: 'Can I link my external profiles?', a: "Students can link GitHub, LinkedIn, and Portfolio sites to their profile, creating a centralized hub for their professional engineering identity." },
];

// ── helpers ──────────────────────────────────────────────────────────────────

const getDaySet = () => {
  const dayIdx = new Date().getDay(); // 0=Sun…6=Sat
  return TESTIMONIALS.filter(t => t.day === dayIdx % 7);
};

// ── component ────────────────────────────────────────────────────────────────

const WelcomeScreen = ({ navigation }) => {
  // hero image slider

  // gazette
  const daySet = useRef(getDaySet()).current;
  const [gazetteIdx, setGazetteIdx] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // faq
  const [activeFaq, setActiveFaq] = useState(null);

  // hero image auto-rotate

  // gazette auto-rotate
  useEffect(() => {
    if (isPaused || daySet.length === 0) return;
    const timer = setInterval(() => {
      setGazetteIdx(i => (i + 1) % daySet.length);
    }, 3500);
    return () => clearInterval(timer);
  }, [isPaused, daySet]);

  const current = daySet.length > 0 ? daySet[gazetteIdx] : TESTIMONIALS[0];
  const sideItems = daySet.length > 1
    ? [1, 2].map(offset => daySet[(gazetteIdx + offset) % daySet.length])
    : [];

  return (
    <ScrollView style={S.root} showsVerticalScrollIndicator={false} bounces={false}>

      {/* ── HERO ── */}
      <View style={S.heroWrap}>
        <LinearGradient
          colors={HERO_GRADIENT}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={S.heroImgWrap}
        />

        <SafeAreaView style={S.heroContent}>
          {/* logo row */}
          <View style={S.logoRow}>
            <View style={S.logoBadge}>
              <Ionicons name="school" size={22} color={COLORS.primary} />
            </View>
            <View>
              <Text style={S.logoText}>SoEIT</Text>
              <Text style={S.logoSub}>PORTAL</Text>
            </View>
          </View>

          <View style={{ flex: 1 }} />

          {/* official badge */}
          <View style={S.officialBadge}>
            <Ionicons name="shield-checkmark" size={13} color={COLORS.primary} />
            <Text style={S.badgeText}>OFFICIAL SoEIT PORTAL · NAAC A</Text>
          </View>

          {/* headline */}
          <Text style={S.heroTitle}>
            Empowering{'\n'}
            <Text style={S.heroAccent}>Engineering Excellence</Text>
          </Text>
          <Text style={S.heroSub}>
            Arka Jain University's premier hub for tracking academic milestones, global competition wins, and professional growth.
          </Text>

          {/* buttons */}
          <TouchableOpacity 
            style={S.primaryBtn} 
            onPress={() => navigation.navigate('Login')} 
            activeOpacity={0.88}
          >
            <LinearGradient 
              colors={[COLORS.primary, '#4f46e5']} 
              start={{ x: 0, y: 0 }} 
              end={{ x: 1, y: 1 }} 
              style={S.btnGrad}
            >
              <Text style={S.primaryBtnTxt}>Get Started</Text>
              <Ionicons name="arrow-forward" size={18} color="#fff" />
            </LinearGradient>
          </TouchableOpacity>

        </SafeAreaView>
      </View>

      {/* ── QUICK LINKS ── */}
      <View style={S.section}>
        <Text style={S.sectionTag}>OPPORTUNITIES</Text>
        <View style={S.tagLine} />
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={S.quickScroll}>
          {QUICK_LINKS.map((l, i) => (
            <View key={i} style={S.quickCard}>
              <View style={[S.quickIconBox, { backgroundColor: l.color + '18' }]}>
                <Ionicons name={l.icon} size={24} color={l.color} />
              </View>
              <Text style={S.quickLabel}>{l.title}</Text>
            </View>
          ))}
        </ScrollView>
      </View>




      {/* ── SOEIT GAZETTE ── */}
      <View style={S.gazetteSection}>
        {/* masthead */}
        <View style={S.gazetteRule} />
        <View style={S.gazetteMasthead}>
          <Text style={S.gazetteVol}>Vol. {new Date().getFullYear()}</Text>
          <Text style={S.gazetteTitle}>THE SoEIT GAZETTE</Text>
          <Text style={S.gazetteTagline}>Voices · Achievements · Excellence</Text>
        </View>
        <View style={S.gazetteRule} />
        <Text style={S.gazetteSubline}>
          DAILY EDITION ◆ {new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' })}
        </Text>
        <View style={[S.gazetteRule, { marginTop: 6 }]} />

        {/* featured quote */}
        <TouchableOpacity activeOpacity={1} onPressIn={() => setIsPaused(true)} onPressOut={() => setIsPaused(false)}>
          <View style={S.gazetteCard}>
            <Text style={S.gazetteFeatLabel}>FEATURED VOICE</Text>
            {current && (
              <>
                <Text style={S.gazetteQuote}>"{current.quote}"</Text>
                <View style={S.gazetteByline}>
                  <View style={S.gazetteAvatar}>
                    <Text style={S.gazetteAvatarTxt}>{current.initial}</Text>
                  </View>
                  <View>
                    <Text style={S.bylineName}>— {current.author}</Text>
                    <Text style={S.bylineRole}>{current.role}</Text>
                  </View>
                </View>
              </>
            )}
            {/* nav arrows */}
            <View style={S.gazetteNav}>
              <TouchableOpacity style={S.gazetteNavBtn}
                onPress={() => setGazetteIdx(i => (i - 1 + daySet.length) % daySet.length)}>
                <Ionicons name="arrow-back" size={14} color="#64748b" />
                <Text style={S.gazetteNavTxt}>Prev</Text>
              </TouchableOpacity>
              <Text style={S.gazetteCount}>
                {String(gazetteIdx + 1).padStart(2, '0')} of {String(daySet.length).padStart(2, '0')}
              </Text>
              <TouchableOpacity style={S.gazetteNavBtn}
                onPress={() => setGazetteIdx(i => (i + 1) % daySet.length)}>
                <Text style={S.gazetteNavTxt}>Next</Text>
                <Ionicons name="arrow-forward" size={14} color="#64748b" />
              </TouchableOpacity>
            </View>
          </View>
        </TouchableOpacity>

        {/* sidebar snippets */}
        {sideItems.length > 0 && (
          <View style={S.snippetsWrap}>
            <Text style={S.gazetteFeatLabel}>MORE VOICES</Text>
            {sideItems.map((s, i) => (
              <TouchableOpacity key={i} onPress={() => setGazetteIdx((gazetteIdx + i + 1) % daySet.length)}>
                <View style={S.snippet}>
                  <Text style={S.snippetText} numberOfLines={2}>
                    {s.quote.slice(0, 100)}…
                  </Text>
                  <Text style={S.snippetAuthor}>— {s.author} <Text style={S.snippetRole}>, {s.role}</Text></Text>
                  {i === 0 && <View style={S.snippetDivider} />}
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>

      {/* ── FAQ ── */}
      <View style={S.section}>
        <Text style={S.sectionTag}>FAQS</Text>
        <View style={S.tagLine} />
        <Text style={S.sectionTitle}>Frequently Asked <Text style={{ color: COLORS.primary }}>Questions</Text></Text>
        {FAQS.map((faq, i) => (
          <TouchableOpacity key={i} style={S.faqItem} onPress={() => setActiveFaq(activeFaq === i ? null : i)}>
            <View style={S.faqHeader}>
              <Text style={S.faqQ}>{faq.q}</Text>
              <Ionicons name={activeFaq === i ? 'remove' : 'add'} size={20} color={COLORS.primary} />
            </View>
            {activeFaq === i && <Text style={S.faqA}>{faq.a}</Text>}
          </TouchableOpacity>
        ))}
      </View>

      {/* ── FOOTER ── */}
      <View style={S.footer}>
        <View style={S.footerRule} />
        <Text style={S.footerLarge}>ARKA JAIN UNIVERSITY</Text>
        <Text style={S.footerSmall}>SCHOOL OF ENGINEERING & IT · ESTD 2017</Text>
        <Text style={S.footerSmall}>NAAC 'A' ACCREDITED · Jharkhand, India</Text>
      </View>

      <View style={{ height: 60 }} />
    </ScrollView>
  );
};

// ── styles ───────────────────────────────────────────────────────────────────

const S = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#ffffff' },

  // hero
  heroWrap: { height: height * 0.72, position: 'relative' },
  heroImgWrap: { ...StyleSheet.absoluteFillObject },
  heroImg: { width: '100%', height: '100%' },
  heroOverlay: { ...StyleSheet.absoluteFillObject },
  heroContent: { flex: 1, padding: 24, justifyContent: 'flex-start' },

  logoRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  logoBadge: { width: 44, height: 44, borderRadius: 12, backgroundColor: 'rgba(255,255,255,0.12)', alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: 'rgba(255,255,255,0.2)' },
  logoText: { color: COLORS.textPrimary, fontSize: 20, fontWeight: '900', letterSpacing: 0.5 },
  logoSub: { color: COLORS.primary, fontSize: 9, fontWeight: '800', letterSpacing: 3, marginTop: -3 },

  officialBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.primary + '15', alignSelf: 'flex-start', paddingHorizontal: 12, paddingVertical: 5, borderRadius: 20, marginBottom: 14, gap: 6, borderWidth: 1, borderColor: COLORS.primary + '33' },
  badgeText: { color: COLORS.primary, fontSize: 9, fontWeight: '900', letterSpacing: 1.2 },

  heroTitle: { color: COLORS.textPrimary, fontSize: 36, fontWeight: '900', lineHeight: 42 },
  heroAccent: { color: COLORS.primary },
  heroSub: { color: COLORS.textSecondary, fontSize: 15, marginTop: 12, lineHeight: 22, fontWeight: '500' },

  btnRow: { flexDirection: 'row', gap: 12, marginTop: 28 },
  primaryBtn: { 
    borderRadius: 16, 
    overflow: 'hidden', 
    marginTop: 24,
    width: '100%',
    ...Platform.select({
      ios: {
        shadowColor: COLORS.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
      },
      android: {
        elevation: 6,
      },
    }),
  },
  btnGrad: { 
    paddingVertical: 18, 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'center', 
    gap: 10 
  },
  primaryBtnTxt: { color: '#fff', fontSize: 15, fontWeight: '800' },
  secondaryBtn: { flex: 1, paddingVertical: 16, borderRadius: 14, alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(255,255,255,0.12)', borderWidth: 1.5, borderColor: 'rgba(255,255,255,0.25)' },
  secondaryBtnTxt: { color: '#fff', fontSize: 14, fontWeight: '800' },

  dots: { flexDirection: 'row', gap: 6, marginTop: 18 },
  dot: { width: 6, height: 6, borderRadius: 3, backgroundColor: 'rgba(255,255,255,0.35)' },
  dotActive: { width: 18, backgroundColor: '#a5b4fc' },

  // quick links
  section: { padding: 24 },
  sectionTag: { color: '#64748b', fontSize: 11, fontWeight: '900', letterSpacing: 1.8 },
  tagLine: { height: 3, width: 28, backgroundColor: COLORS.primary, marginTop: 5, borderRadius: 2, marginBottom: 20 },
  sectionTitle: { fontSize: 22, fontWeight: '900', color: '#0f172a', marginBottom: 18 },

  quickScroll: { gap: 12, paddingRight: 24 },
  quickCard: { alignItems: 'center', gap: 10, width: 72 },
  quickIconBox: { width: 60, height: 60, borderRadius: 20, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: '#f1f5f9' },
  quickLabel: { color: '#1e293b', fontSize: 11, fontWeight: '800', textAlign: 'center' },




  // gazette
  gazetteSection: { paddingHorizontal: 24, paddingTop: 8, paddingBottom: 32, backgroundColor: '#fffdf9' },
  gazetteRule: { height: 1.5, backgroundColor: '#e2e8f0', marginVertical: 8 },
  gazetteMasthead: { alignItems: 'center', paddingVertical: 10 },
  gazetteVol: { color: '#64748b', fontSize: 11, fontWeight: '700', letterSpacing: 1 },
  gazetteTitle: { color: '#0f172a', fontSize: 24, fontWeight: '900', letterSpacing: 1.5, marginVertical: 2 },
  gazetteTagline: { color: '#64748b', fontSize: 11, fontWeight: '700', letterSpacing: 1 },
  gazetteSubline: { textAlign: 'center', color: '#94a3b8', fontSize: 10, fontWeight: '700', letterSpacing: 0.8, marginVertical: 4 },

  gazetteCard: { backgroundColor: '#fff', borderRadius: 4, padding: 22, borderWidth: 1, borderColor: '#ece7db', elevation: 3, marginTop: 16 },
  gazetteFeatLabel: { color: '#991b1b', fontSize: 11, fontWeight: '900', letterSpacing: 1, marginBottom: 14, borderBottomWidth: 1, borderBottomColor: '#ece7db', paddingBottom: 10 },
  gazetteQuote: { color: '#1e293b', fontSize: 16, fontStyle: 'italic', fontWeight: '700', lineHeight: 24, marginBottom: 20 },
  gazetteByline: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  gazetteAvatar: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#991b1b15', alignItems: 'center', justifyContent: 'center' },
  gazetteAvatarTxt: { color: '#991b1b', fontWeight: '900', fontSize: 18 },
  bylineName: { color: '#0f172a', fontSize: 14, fontWeight: '800' },
  bylineRole: { color: '#64748b', fontSize: 12, fontWeight: '600' },

  gazetteNav: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 20, paddingTop: 14, borderTopWidth: 1, borderTopColor: '#f1f5f9' },
  gazetteNavBtn: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  gazetteNavTxt: { color: '#64748b', fontSize: 12, fontWeight: '700' },
  gazetteCount: { color: '#94a3b8', fontSize: 11, fontWeight: '700' },

  snippetsWrap: { backgroundColor: '#fff', borderRadius: 4, padding: 20, borderWidth: 1, borderColor: '#ece7db', marginTop: 12, elevation: 2 },
  snippet: { paddingVertical: 10 },
  snippetText: { color: '#334155', fontSize: 13, fontStyle: 'italic', lineHeight: 19 },
  snippetAuthor: { color: '#64748b', fontSize: 12, fontWeight: '700', marginTop: 4 },
  snippetRole: { fontWeight: '400' },
  snippetDivider: { height: 1, backgroundColor: '#f1f5f9', marginTop: 12 },

  // faq
  faqItem: { backgroundColor: '#f8fafc', borderRadius: 12, padding: 16, marginBottom: 10, borderWidth: 1, borderColor: '#e2e8f0' },
  faqHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 12 },
  faqQ: { flex: 1, color: '#1e293b', fontSize: 14, fontWeight: '700', lineHeight: 20 },
  faqA: { color: '#475569', fontSize: 13, lineHeight: 20, marginTop: 10, fontWeight: '500' },

  // footer
  footer: { alignItems: 'center', paddingVertical: 40, paddingHorizontal: 24, backgroundColor: '#f8fafc', borderTopWidth: 1, borderTopColor: '#e2e8f0' },
  footerRule: { height: 3, width: 36, backgroundColor: COLORS.primary, borderRadius: 2, marginBottom: 18 },
  footerLarge: { color: '#0f172a', fontSize: 16, fontWeight: '900', letterSpacing: 1.5 },
  footerSmall: { color: '#64748b', fontSize: 11, fontWeight: '700', marginTop: 6, letterSpacing: 0.8 },
});

export default WelcomeScreen;
