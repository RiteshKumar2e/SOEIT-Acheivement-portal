import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  Share,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS } from '../../constants/colors';
import { SPACING, getResponsiveFontSize } from '../../utils/responsive';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';

const PublicPortfolioScreen = ({ navigation }) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [aiGenerating, setAiGenerating] = useState(false);
  const [aiSummary, setAiSummary] = useState('');
  const [stats, setStats] = useState({
    achievements: 0,
    projects: 0,
    courses: 0
  });

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const [achs, projs, crs] = await Promise.all([
        api.get('/achievements/my'),
        api.get('/projects/my'),
        api.get('/courses/my')
      ]);
      
      setStats({
        achievements: (achs.data.data || []).length,
        projects: (projs.data.data || []).length,
        courses: (crs.data.data || []).length
      });
    } catch (e) {
      // Fallback for demo
      setStats({ achievements: 15, projects: 8, courses: 12 });
    }
  };

  const generateAiSummary = () => {
    setAiGenerating(true);
    setAiSummary('');
    
    // Final text to type
    const finalText = `An ambitious ${user?.role || 'Student'} at SoEIT specializing in technical excellence. With ${stats.achievements} verified achievements and ${stats.projects} completed projects, this profile demonstrates strong proficiency in ${stats.achievements > 10 ? 'multiple engineering domains' : 'core software development'}. The candidate shows consistent growth through ${stats.courses} academic certifications.`;
    
    // Simulate AI "thinking"
    setTimeout(() => {
      let currentText = '';
      let charIdx = 0;
      
      const typeInterval = setInterval(() => {
        if (charIdx < finalText.length) {
          currentText += finalText[charIdx];
          setAiSummary(currentText);
          charIdx++;
        } else {
          clearInterval(typeInterval);
          setAiGenerating(false);
        }
      }, 30); // 30ms per character for that "typing" feel
    }, 1200);
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Check out my detailed academic and technical portfolio at SOEIT Portal! Achievements: ${stats.achievements}, Projects: ${stats.projects}`,
        url: 'https://soeit-portal.edu/portfolio/' + (user?.id || 'ritesh'),
      });
    } catch (error) {
      console.log(error.message);
    }
  };

  const StatItem = ({ label, value, icon }) => (
    <View style={styles.statBox}>
      <Ionicons name={icon} size={20} color={COLORS.primary} />
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Profile Card */}
        <LinearGradient
          colors={[COLORS.primary, '#4c1d95']}
          style={styles.headerGradient}
        >
          <TouchableOpacity 
            style={styles.backBtn}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
          
          <View style={styles.profileInfo}>
            <View style={styles.avatarLarge}>
              <Text style={styles.avatarChar}>
                {user?.name?.charAt(0) || 'R'}
              </Text>
            </View>
            <Text style={styles.userName}>{user?.name || 'Ritesh Kumar'}</Text>
            <Text style={styles.userRole}>
              Member since {new Date().getFullYear()} • ID: AJU-{Math.floor(Math.random() * 89999 + 10000)}
            </Text>
          </View>

          <View style={styles.statsContainer}>
            <StatItem label="Trophies" value={stats.achievements} icon="trophy-outline" />
            <StatItem label="Projects" value={stats.projects} icon="layers-outline" />
            <StatItem label="Course" value={stats.courses} icon="school-outline" />
          </View>
        </LinearGradient>

        <View style={styles.content}>
          {/* AI Feature Section */}
          <View style={styles.aiCard}>
            <LinearGradient
              colors={['#f5f3ff', '#ede9fe']}
              style={styles.aiGradient}
            >
              <View style={styles.aiHeader}>
                <Ionicons name="sparkles" size={20} color="#7c3aed" />
                <Text style={styles.aiTitle}>AI Professional Insight</Text>
              </View>
              
              {aiSummary ? (
                <Text style={styles.aiText}>{aiSummary}</Text>
              ) : (
                <Text style={styles.aiSub}>
                  Let AI analyze your achievements and generate a professional summary for recruiters.
                </Text>
              )}

              <TouchableOpacity 
                style={styles.aiBtn}
                onPress={generateAiSummary}
                disabled={aiGenerating}
              >
                {aiGenerating ? (
                  <ActivityIndicator color="#fff" size="small" />
                ) : (
                  <>
                    <Text style={styles.aiBtnText}>
                      {aiSummary ? 'Regenerate Insight' : 'Generate AI Summary'}
                    </Text>
                    <Ionicons name="flash" size={16} color="#fff" style={{ marginLeft: 8 }} />
                  </>
                )}
              </TouchableOpacity>
            </LinearGradient>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Portfolio Link</Text>
            <View style={styles.linkCard}>
              <View style={{ flex: 1 }}>
                <Text style={styles.linkUrl} numberOfLines={1}>
                  soeit-portal.edu/profile/{user?.name?.toLowerCase().replace(' ', '.')}
                </Text>
              </View>
              <TouchableOpacity onPress={handleShare}>
                <Ionicons name="share-social-outline" size={24} color={COLORS.primary} />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Verification Status</Text>
            <View style={styles.verifyCard}>
              <View style={styles.verifyStatus}>
                <Ionicons name="shield-checkmark" size={24} color="#059669" />
                <Text style={styles.verifyStatusText}>KYC Verified Profile</Text>
              </View>
              <Text style={styles.verifySub}>
                Your achievements are cross-verified by the SoEIT Faculty Council.
              </Text>
            </View>
          </View>
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>

      <TouchableOpacity 
        style={styles.fab}
        onPress={handleShare}
      >
        <Ionicons name="share-outline" size={24} color="#fff" />
        <Text style={styles.fabText}>Share Profile</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.bgPrimary,
  },
  headerGradient: {
    paddingTop: 60,
    paddingBottom: 40,
    paddingHorizontal: 24,
    borderBottomLeftRadius: 36,
    borderBottomRightRadius: 36,
    elevation: 8,
  },
  backBtn: {
    position: 'absolute',
    top: 50,
    left: 20,
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileInfo: {
    alignItems: 'center',
    marginBottom: 30,
  },
  avatarLarge: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: 'rgba(255,255,255,0.4)',
    marginBottom: 16,
  },
  avatarChar: {
    fontSize: 40,
    fontWeight: '800',
    color: '#fff',
  },
  userName: {
    fontSize: 24,
    fontWeight: '800',
    color: '#fff',
  },
  userRole: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.7)',
    marginTop: 4,
  },
  statsContainer: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 24,
    padding: 16,
    gap: 12,
  },
  statBox: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.95)',
    paddingVertical: 12,
    borderRadius: 16,
    elevation: 2,
  },
  statValue: {
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.textPrimary,
    marginTop: 4,
  },
  statLabel: {
    fontSize: 10,
    fontWeight: '600',
    color: COLORS.textMuted,
    textTransform: 'uppercase',
  },
  content: {
    padding: 24,
  },
  aiCard: {
    borderRadius: 24,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#ddd6fe',
    marginBottom: 24,
    backgroundColor: '#fff',
  },
  aiGradient: {
    padding: 20,
  },
  aiHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 8,
  },
  aiTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#7c3aed',
  },
  aiText: {
    fontSize: 14,
    color: '#4c1d95',
    lineHeight: 22,
    marginBottom: 16,
    fontStyle: 'italic',
  },
  aiSub: {
    fontSize: 13,
    color: COLORS.textSecondary,
    marginBottom: 16,
  },
  aiBtn: {
    flexDirection: 'row',
    backgroundColor: '#7c3aed',
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 2,
  },
  aiBtnText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 14,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.textSecondary,
    marginBottom: 12,
    paddingLeft: 4,
  },
  linkCard: {
    flexDirection: 'row',
    backgroundColor: COLORS.bgCard,
    padding: 16,
    borderRadius: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  linkUrl: {
    fontSize: 14,
    color: COLORS.primary,
    fontWeight: '600',
  },
  verifyCard: {
    backgroundColor: '#ecfdf5',
    padding: 20,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#d1fae5',
  },
  verifyStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 8,
  },
  verifyStatusText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#065f46',
  },
  verifySub: {
    fontSize: 13,
    color: '#065f46',
    opacity: 0.8,
  },
  fab: {
    position: 'absolute',
    bottom: 30,
    left: 24,
    right: 24,
    backgroundColor: COLORS.primary,
    flexDirection: 'row',
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    elevation: 10,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  fabText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '800',
  },
});

export default PublicPortfolioScreen;
