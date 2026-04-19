import React, { useState, useEffect, useCallback } from 'react';
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
  RefreshControl,
  Dimensions,
  Linking,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS } from '../../constants/colors';
import { SPACING, getResponsiveFontSize } from '../../utils/responsive';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import { format } from 'date-fns';

const { width } = Dimensions.get('window');

const PublicPortfolioScreen = ({ navigation, route }) => {
  const { user: currentUser } = useAuth();
  // If viewing someone else's portfolio via route params, use that ID. Otherwise use currentUser.id
  const userId = route?.params?.userId || currentUser?.id;
  
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [data, setData] = useState(null);
  const [badges, setBadges] = useState([]);

  const fetchData = useCallback(async () => {
    try {
      const portfolioRes = await api.get(`/achievements/portfolio/${userId}`);
      setData(portfolioRes.data);
      
      // Try fetching badges - don't fail if badges fail
      try {
        const studentId = portfolioRes.data.student.id || portfolioRes.data.student._id;
        const badgesRes = await api.get(`/badges/student/${studentId}`);
        setBadges(badgesRes.data.data || []);
      } catch (e) {
        setBadges([]);
      }
    } catch (error) {
      console.error('Portfolio fetch error:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchData();
  };

  const handleShare = async () => {
    const student = data?.student;
    if (!student) return;
    
    try {
      await Share.share({
        message: `Check out ${student.name}'s professional portfolio on SOEIT Portal! Achievements: ${data.stats.total}, Points: ${data.stats.totalPoints}`,
        url: `https://soeit-acheivement-portal.onrender.com/portfolio/${student.id || student._id}`,
      });
    } catch (error) {
      console.log(error.message);
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  if (!data) {
    return (
      <View style={styles.center}>
        <Ionicons name="alert-circle-outline" size={60} color={COLORS.textMuted} />
        <Text style={styles.errorText}>Portfolio not found</Text>
        <TouchableOpacity style={styles.backBtnAction} onPress={() => navigation.goBack()}>
          <Text style={styles.backBtnText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const { student, achievements, stats, courses = [], internships = [], projects = [] } = data;

  const renderStat = (value, label, icon) => (
    <View style={styles.statItem}>
      <View style={styles.statHeader}>
        <Ionicons name={icon} size={16} color={COLORS.primary} />
        <Text style={styles.statValue}>{value}</Text>
      </View>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <ScrollView 
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={COLORS.primary} />
        }
      >
        {/* Header Section */}
        <LinearGradient
          colors={['#1e3a8a', '#1e40af', '#3b82f6']}
          style={styles.header}
        >
          <TouchableOpacity 
            style={styles.backBtn} 
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>

          <View style={styles.profileContent}>
            <View style={styles.avatarContainer}>
              {student.profileImage ? (
                <Image 
                  source={{ uri: student.profileImage.startsWith('http') ? student.profileImage : `https://soeit-acheivement-portal.onrender.com${student.profileImage}` }} 
                  style={styles.avatar} 
                />
              ) : (
                <View style={styles.avatarPlaceholder}>
                  <Text style={styles.avatarText}>{student.name?.[0] || 'S'}</Text>
                </View>
              )}
            </View>
            <Text style={styles.name}>{student.name}</Text>
            <Text style={styles.dept}>
              {student.department} Engineering • Enrollment: {student.enrollmentNo || 'N/A'}
            </Text>
            {student.bio && <Text style={styles.bio}>{student.bio}</Text>}

            {/* Badges */}
            {badges.length > 0 && (
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.badgeScroll}>
                {badges.map((b, idx) => (
                  <View key={idx} style={[styles.badgeItem, { backgroundColor: b.badge_type === 'Platinum' ? '#e2e8f0' : b.badge_type === 'Gold' ? '#fef08a' : '#f1f5f9' }]}>
                    <Ionicons name="medal" size={12} color="#1e293b" />
                    <Text style={styles.badgeText}>{b.badge_type}</Text>
                  </View>
                ))}
              </ScrollView>
            )}

            {/* Social Links */}
            <View style={styles.socialRow}>
              {student.linkedIn && (
                <TouchableOpacity 
                  style={styles.socialBtn}
                  onPress={() => {
                    const url = student.linkedIn.startsWith('http') ? student.linkedIn : `https://${student.linkedIn}`;
                    Linking.openURL(url).catch(err => console.error("Couldn't load page", err));
                  }}
                >
                  <Ionicons name="logo-linkedin" size={18} color="#fff" />
                </TouchableOpacity>
              )}
              {student.github && (
                <TouchableOpacity 
                  style={styles.socialBtn}
                  onPress={() => {
                    const url = student.github.startsWith('http') ? student.github : `https://${student.github}`;
                    Linking.openURL(url).catch(err => console.error("Couldn't load page", err));
                  }}
                >
                  <Ionicons name="logo-github" size={18} color="#fff" />
                </TouchableOpacity>
              )}
              <TouchableOpacity style={styles.shareBtn} onPress={handleShare}>
                <Ionicons name="share-social" size={18} color="#fff" />
                <Text style={styles.shareText}>Share Portfolio</Text>
              </TouchableOpacity>
            </View>
          </View>
        </LinearGradient>

        {/* Stats Strip */}
        <View style={styles.statsStrip}>
          {renderStat(stats.total, 'Achievements', 'trophy-outline')}
          {renderStat(stats.totalPoints, 'Merit Points', 'star-outline')}
          {renderStat(stats.courses, 'Certifications', 'school-outline')}
        </View>

        {/* Content */}
        <View style={styles.content}>
          {/* Skill Development Ledger */}
          {courses.length > 0 && (
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Skill Development Ledger</Text>
                <MaterialCommunityIcons name="auto-fix" size={16} color={COLORS.primary} />
              </View>
              {courses.map((course, idx) => (
                <View key={idx} style={styles.courseCard}>
                  <View style={styles.courseHeader}>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.courseName}>{course.course_name}</Text>
                      <Text style={styles.coursePlatform}>{course.platform}</Text>
                    </View>
                    <View style={[styles.courseStatus, { backgroundColor: course.status === 'Completed' ? '#dcfce7' : '#eff6ff' }]}>
                      <Text style={[styles.courseStatusText, { color: course.status === 'Completed' ? '#166534' : '#1e40af' }]}>
                        {course.status.toUpperCase()}
                      </Text>
                    </View>
                  </View>
                  <View style={styles.progressBar}>
                    <View style={[styles.progressFill, { width: `${course.progress}%` }]} />
                  </View>
                  <View style={styles.progressTextRow}>
                    <Text style={styles.progressLabel}>PROGRESS</Text>
                    <Text style={styles.progressVal}>{course.progress}%</Text>
                  </View>
                </View>
              ))}
            </View>
          )}

          {/* Achievements Record */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Verified Accomplishments</Text>
              <Ionicons name="checkmark-circle" size={16} color="#10b981" />
            </View>
            {achievements.length === 0 ? (
              <View style={styles.emptyBox}>
                <Text style={styles.emptyText}>No verified achievements yet</Text>
              </View>
            ) : (
              achievements.map((ach, idx) => (
                <View key={idx} style={styles.achCard}>
                  <View style={styles.achHeader}>
                    <View style={styles.achIconBox}>
                      <Text style={styles.achEmoji}>🏆</Text>
                    </View>
                    <View style={{ flex: 1 }}>
                      <View style={styles.achTitleRow}>
                        <Text style={styles.achTitle}>{ach.title}</Text>
                        <View style={styles.levelBadge}>
                          <Text style={styles.levelText}>{ach.level}</Text>
                        </View>
                      </View>
                      <View style={styles.achMetaRow}>
                        <View style={styles.verifyBadge}>
                          <Ionicons name="checkmark-circle" size={10} color="#059669" />
                          <Text style={styles.verifyText}>VERIFIED</Text>
                        </View>
                        <Text style={styles.achCategory}>{ach.category}</Text>
                        <Text style={styles.achPoints}>+{ach.points} PTS</Text>
                      </View>
                      <Text style={styles.achDesc} numberOfLines={2}>{ach.description}</Text>
                      <View style={styles.achFooter}>
                        {ach.date && (
                          <View style={styles.footerItem}>
                            <Ionicons name="calendar-outline" size={12} color={COLORS.textMuted} />
                            <Text style={styles.footerVal}>{format(new Date(ach.date), 'MMM yyyy')}</Text>
                          </View>
                        )}
                        {ach.institution && (
                          <View style={styles.footerItem}>
                            <Ionicons name="business-outline" size={12} color={COLORS.textMuted} />
                            <Text style={styles.footerVal} numberOfLines={1}>{ach.institution}</Text>
                          </View>
                        )}
                      </View>
                    </View>
                  </View>
                </View>
              ))
            )}
          </View>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bgPrimary },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: COLORS.bgPrimary },
  header: {
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingBottom: 40,
    paddingHorizontal: 24,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  profileContent: { alignItems: 'center' },
  avatarContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 4,
    borderColor: 'rgba(255,255,255,0.3)',
    marginBottom: 16,
    overflow: 'hidden',
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  avatar: { width: '100%', height: '100%' },
  avatarPlaceholder: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  avatarText: { color: '#fff', fontSize: 40, fontWeight: '800' },
  name: { color: '#fff', fontSize: 24, fontWeight: '800', marginBottom: 4 },
  dept: { color: 'rgba(255,255,255,0.8)', fontSize: 13, marginBottom: 12, textAlign: 'center' },
  bio: { color: 'rgba(255,255,255,0.7)', fontSize: 12, lineHeight: 18, textAlign: 'center', maxWidth: '90%', marginBottom: 16 },
  badgeScroll: { flexDirection: 'row', marginBottom: 20 },
  badgeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 8,
  },
  badgeText: { fontSize: 11, fontWeight: '800', color: '#1e293b' },
  socialRow: { flexDirection: 'row', gap: 12, alignItems: 'center' },
  socialBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  shareBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: 'rgba(255,255,255,0.25)',
    borderRadius: 12,
  },
  shareText: { color: '#fff', fontWeight: '700', fontSize: 14 },
  statsStrip: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    marginHorizontal: 20,
    marginTop: -25,
    borderRadius: 16,
    padding: 16,
    elevation: 4,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  statItem: { flex: 1, alignItems: 'center' },
  statHeader: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 2 },
  statValue: { fontSize: 18, fontWeight: '800', color: COLORS.textPrimary },
  statLabel: { fontSize: 10, color: COLORS.textMuted, textTransform: 'uppercase', fontWeight: '600' },
  content: { padding: 20 },
  section: { marginBottom: 30 },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 16 },
  sectionTitle: { fontSize: 18, fontWeight: '800', color: COLORS.textPrimary },
  courseCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    marginBottom: 12,
  },
  courseHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
  courseName: { fontSize: 14, fontWeight: '800', color: COLORS.textPrimary },
  coursePlatform: { fontSize: 11, color: COLORS.primary, fontWeight: '700' },
  courseStatus: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 6 },
  courseStatusText: { fontSize: 9, fontWeight: '800' },
  progressBar: { height: 6, backgroundColor: '#f1f5f9', borderRadius: 3, overflow: 'hidden', marginBottom: 8 },
  progressFill: { height: '100%', backgroundColor: COLORS.primary },
  progressTextRow: { flexDirection: 'row', justifyContent: 'space-between' },
  progressLabel: { fontSize: 9, color: COLORS.textMuted, fontWeight: '700' },
  progressVal: { fontSize: 10, fontWeight: '800', color: COLORS.textPrimary },
  achCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    marginBottom: 12,
  },
  achHeader: { flexDirection: 'row', gap: 12 },
  achIconBox: { width: 44, height: 44, borderRadius: 12, backgroundColor: '#f8fafc', alignItems: 'center', justifyContent: 'center' },
  achEmoji: { fontSize: 20 },
  achTitleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  achTitle: { fontSize: 14, fontWeight: '800', color: COLORS.textPrimary, flex: 1, marginRight: 8 },
  levelBadge: { backgroundColor: '#f0f9ff', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4 },
  levelText: { fontSize: 9, color: '#0369a1', fontWeight: '800' },
  achMetaRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 4, marginBottom: 8 },
  verifyBadge: { flexDirection: 'row', alignItems: 'center', gap: 3, backgroundColor: '#ecfdf5', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4 },
  verifyText: { fontSize: 8, fontWeight: '800', color: '#059669' },
  achCategory: { fontSize: 10, color: COLORS.textMuted, fontWeight: '600' },
  achPoints: { fontSize: 10, color: '#f59e0b', fontWeight: '800' },
  achDesc: { fontSize: 12, color: COLORS.textSecondary, lineHeight: 18 },
  achFooter: { flexDirection: 'row', gap: 12, marginTop: 12, paddingTop: 8, borderTopWidth: 1, borderTopColor: '#f1f5f9' },
  footerItem: { flexDirection: 'row', alignItems: 'center', gap: 4, flex: 1 },
  footerVal: { fontSize: 10, color: COLORS.textMuted, fontWeight: '600' },
  emptyBox: { padding: 30, alignItems: 'center' },
  emptyText: { color: COLORS.textMuted, fontSize: 14 },
  errorText: { color: COLORS.textPrimary, fontSize: 18, fontWeight: '700', marginTop: 16, marginBottom: 20 },
  backBtnAction: { paddingHorizontal: 24, paddingVertical: 12, backgroundColor: COLORS.primary, borderRadius: 12 },
  backBtnText: { color: '#fff', fontWeight: '700' },
});

export default PublicPortfolioScreen;
