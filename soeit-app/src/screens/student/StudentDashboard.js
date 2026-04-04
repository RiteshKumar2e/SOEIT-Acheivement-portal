import React, { useState, useEffect, useCallback } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
  Dimensions,
  Image,
  FlatList,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';
import { useAuth } from '../../context/AuthContext';
import { SPACING, getResponsiveFontSize, percentWidth } from '../../utils/responsive';
import api from '../../services/api';

const { width } = Dimensions.get('window');

const StudentDashboard = ({ navigation }) => {
  const { user } = useAuth();
  const [refreshing, setRefreshing] = useState(false);
  const [stats, setStats] = useState({ verified: 0, pending: 0, total: 0 });
  const [trending, setTrending] = useState([]);
  const [leaderboard, setLeaderboard] = useState([]);

  const fetchStats = useCallback(async () => {
    try {
      const res = await api.get('/achievements/my');
      const achs = res.data.data || [];
      setStats({
        verified: achs.filter(a => a.status === 'approved' || a.status === 'verified').length,
        pending: achs.filter(a => a.status === 'pending').length,
        total: achs.length,
      });
    } catch (error) {
      console.warn('Dashboard stats fetch failed:', error.message);
      if (stats.total === 0) setStats({ verified: 0, pending: 0, total: 0 });
    }
  }, []);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchStats();
    setRefreshing(false);
  };

  const renderLeaderboardMini = () => {
    if (leaderboard.length === 0) return null;
    return (
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text
            style={styles.sectionTitle}
            accessible
            accessibilityRole="header"
            allowFontScaling
            maxFontSizeMultiplier={1.3}
          >
            🏆 Hall of Fame
          </Text>
          <TouchableOpacity
            onPress={() => navigation.navigate('History')}
            accessible
            accessibilityRole="button"
            accessibilityLabel="View full leaderboard"
          >
            <Text style={styles.seeAll}>Leaderboard</Text>
          </TouchableOpacity>
        </View>
        <View
          style={styles.leaderboardPreview}
          accessible
          accessibilityRole="list"
        >
          {leaderboard.map((item, idx) => (
            <View
              key={idx}
              style={styles.leaderItem}
              accessible
              accessibilityRole="listitem"
              accessibilityLabel={`${item.name}: ${item.points} points, Rank #${item.rank}`}
            >
              <View
                style={[styles.miniAvatar, { backgroundColor: COLORS.primary + '20' }]}
              >
                <Text style={styles.miniAvatarText}>{item.avatar}</Text>
              </View>
              <View style={{ flex: 1, marginLeft: SPACING.md }}>
                <Text style={styles.leaderName}>{item.name}</Text>
                <Text style={styles.leaderPoints}>{item.points} Points</Text>
              </View>
              <View style={styles.rankBadge}>
                <Text style={styles.rankText}>#{item.rank}</Text>
              </View>
            </View>
          ))}
        </View>
      </View>
    );
  };

  return (
    <ScrollView
      style={styles.container}
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          tintColor={COLORS.primary}
        />
      }
    >
      {/* Alert Banner - Academic Profile Incomplete */}
      <View style={styles.alertBanner}>
        <View style={styles.alertContent}>
          <Ionicons name="alert-circle" size={20} color="#1f2937" />
          <View style={styles.alertText}>
            <Text style={styles.alertTitle}>Academic Profile Incomplete</Text>
            <Text style={styles.alertDesc}>
              Please update your 10th, 12th, and CGPA details for accurate resume generation.
            </Text>
          </View>
        </View>
        <TouchableOpacity
          style={styles.completeBtn}
          onPress={() => navigation.navigate('Profile')}
        >
          <Text style={styles.completeBtnText}>Complete Now</Text>
        </TouchableOpacity>
      </View>

      {/* Page Title */}
      <View style={styles.pageHeader}>
        <View>
          <Text style={styles.pageTitle}>Student Performance Dashboard</Text>
          <Text style={styles.pageDesc}>
            Track your achievements, certifications, and academic progress here.
          </Text>
        </View>
        <TouchableOpacity
          style={styles.uploadBtn}
          onPress={() => navigation.navigate('Upload')}
        >
          <Ionicons name="arrow-up" size={16} color="#fff" />
          <Text style={styles.uploadBtnText}>Upload New</Text>
        </TouchableOpacity>
      </View>

      {/* Welcome Card with Student Info */}
      <View style={styles.welcomeCard}>
        <LinearGradient
          colors={['#eff6ff', '#dbeafe']}
          style={styles.welcomeGradient}
        >
          <View style={styles.welcomeContent}>
            <LinearGradient
              colors={['#1e3a8a', '#1e40af']}
              style={styles.welcomeIcon}
            >
              <Ionicons name="school" size={24} color="#fff" />
            </LinearGradient>
            <View style={styles.welcomeInfo}>
              <Text style={styles.welcomeName}>Welcome back, {user?.name}</Text>
              <View style={styles.infoRow}>
                <View style={styles.infoBadge}>
                  <Text style={styles.infoBadgeText}>● {user?.department || 'CSE DEPARTMENT'}</Text>
                </View>
                <Text style={styles.infoText}>BATCH: 2022-26</Text>
                <Text style={styles.infoText}>SEMESTER: 8</Text>
              </View>
            </View>
          </View>
        </LinearGradient>
      </View>

      {/* Stats Grid */}
      <View style={styles.statsGrid}>
        <View style={styles.statBox}>
          <View style={styles.statIconBox}>
            <Ionicons name="trophy" size={24} color="#1e40af" />
          </View>
          <Text style={styles.statValue}>{stats.total}</Text>
          <Text style={styles.statLabel}>TOTAL</Text>
          <Text style={styles.statLabel}>ACHIEVEMENTS</Text>
          <TouchableOpacity>
            <Text style={styles.statLink}>Total Records</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.statBox}>
          <View style={[styles.statIconBox, { backgroundColor: '#dcfce7' }]}>
            <Ionicons name="checkmark-circle" size={24} color="#22c55e" />
          </View>
          <Text style={styles.statValue}>{stats.verified}</Text>
          <Text style={styles.statLabel}>APPROVED</Text>
          <Text style={styles.statLabel}>ACHIEVEMENTS</Text>
          <Text style={styles.statMeta}>Verified by Faculty</Text>
        </View>

        <View style={styles.statBox}>
          <View style={[styles.statIconBox, { backgroundColor: '#fef3c7' }]}>
            <Ionicons name="time" size={24} color="#f59e0b" />
          </View>
          <Text style={styles.statValue}>{stats.pending}</Text>
          <Text style={styles.statLabel}>PENDING</Text>
          <Text style={styles.statLabel}>VERIFICATION</Text>
          <Text style={styles.statMeta}>Awaiting Review</Text>
        </View>


      </View>

      {/* Campus Events Section */}
      <View style={styles.eventsSection}>
        <View style={styles.sectionHeader}>
          <View>
            <Text style={styles.sectionTitle}>Campus Events</Text>
            <Text style={styles.sectionDesc}>
              View all upcoming workshops, seminars, and fests on campus.
            </Text>
          </View>
        </View>

        {/* Event Category Filters */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.filterScroll}
          contentContainerStyle={styles.filterContainer}
        >
          {['All', 'Technical', 'Cultural', 'Sports', 'Workshop', 'Seminar', 'Other'].map((cat, idx) => (
            <TouchableOpacity
              key={idx}
              style={[styles.filterBtn, idx === 0 && styles.filterBtnActive]}
            >
              <Text style={[styles.filterText, idx === 0 && styles.filterTextActive]}>
                {cat}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <View style={{ height: SPACING.xxxl }} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.bgPrimary,
  },
  header: {
    paddingTop: SPACING.xxxl + SPACING.lg,
    paddingHorizontal: SPACING.xl,
    paddingBottom: SPACING.xxxl,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.lg,
    marginBottom: SPACING.xxxl,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarChar: {
    color: '#fff',
    fontSize: getResponsiveFontSize(22),
    fontWeight: '800',
  },
  headerInfo: {
    flex: 1,
  },
  welcomeText: {
    color: COLORS.textPrimary,
    fontSize: getResponsiveFontSize(20),
    fontWeight: '800',
  },
  statusText: {
    color: COLORS.textSecondary,
    fontSize: getResponsiveFontSize(13),
    marginTop: SPACING.xs,
  },
  notifBtn: {
    width: 44,
    height: 44,
    borderRadius: 15,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 2,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
      },
      web: {
        boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
      }
    }),
  },
  notifDot: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.secondary,
    borderWidth: 2,
    borderColor: '#fff',
  },
  statsContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 24,
    padding: SPACING.xl,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
    borderWidth: 1,
    borderColor: COLORS.border,
    elevation: 4,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
      },
      web: {
        boxShadow: '0 4px 10px rgba(0, 0, 0, 0.05)',
      }
    }),
  },
  statBox: {
    flex: 1,
    alignItems: 'center',
  },
  statLabel: {
    color: COLORS.textMuted,
    fontSize: getResponsiveFontSize(11),
    fontWeight: '700',
    textTransform: 'uppercase',
    marginBottom: SPACING.sm,
  },
  statValue: {
    fontSize: getResponsiveFontSize(22),
    fontWeight: '900',
  },
  divider: {
    width: 1,
    height: 30,
    backgroundColor: COLORS.border,
  },
  trendingContainer: {
    marginTop: -SPACING.xl,
  },
  trendingScroll: {
    paddingHorizontal: SPACING.xl,
    gap: SPACING.lg,
  },
  trendingCard: {
    backgroundColor: COLORS.bgCard,
    padding: SPACING.lg,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    borderLeftWidth: 4,
    borderWidth: 1,
    borderColor: COLORS.border,
    minWidth: 260,
  },
  trendIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  trendTitle: {
    color: COLORS.textPrimary,
    fontSize: getResponsiveFontSize(14),
    fontWeight: '700',
  },
  trendSub: {
    color: COLORS.textMuted,
    fontSize: getResponsiveFontSize(11),
    marginTop: SPACING.xs,
  },
  section: {
    padding: SPACING.xl,
    marginTop: SPACING.lg,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.xl,
  },
  sectionTitle: {
    fontSize: getResponsiveFontSize(19),
    fontWeight: '800',
    color: COLORS.textPrimary,
  },
  seeAll: {
    color: COLORS.primary,
    fontWeight: '700',
    fontSize: getResponsiveFontSize(13),
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.lg,
  },
  gridItem: {
    width: percentWidth(50) - SPACING.xl,
    backgroundColor: COLORS.bgCard,
    padding: SPACING.xl,
    borderRadius: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  gridIconBox: {
    width: 56,
    height: 56,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.lg,
  },
  gridLabel: {
    color: COLORS.textPrimary,
    fontSize: getResponsiveFontSize(14),
    fontWeight: '700',
    textAlign: 'center',
  },
  leaderboardPreview: {
    backgroundColor: COLORS.bgCard,
    borderRadius: 24,
    padding: SPACING.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  leaderItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  miniAvatar: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  miniAvatarText: {
    color: COLORS.primary,
    fontWeight: '800',
  },
  leaderName: {
    color: COLORS.textPrimary,
    fontSize: getResponsiveFontSize(14),
    fontWeight: '700',
  },
  leaderPoints: {
    color: COLORS.textMuted,
    fontSize: getResponsiveFontSize(12),
  },
  rankBadge: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    backgroundColor: COLORS.bgSecondary,
    borderRadius: 8,
  },
  rankText: {
    color: COLORS.textSecondary,
    fontSize: getResponsiveFontSize(11),
    fontWeight: '800',
  },
  promoBanner: {
    margin: SPACING.xl,
    height: 200,
    borderRadius: 24,
    overflow: 'hidden',
  },
  promoBg: {
    ...StyleSheet.absoluteFillObject,
  },
  promoOverlay: {
    ...StyleSheet.absoluteFillObject,
    padding: SPACING.xl,
    justifyContent: 'flex-end',
  },
  promoTag: {
    color: COLORS.secondary,
    fontWeight: '900',
    fontSize: getResponsiveFontSize(10),
    letterSpacing: 2,
    marginBottom: SPACING.md,
  },
  promoTitle: {
    color: '#fff',
    fontSize: getResponsiveFontSize(24),
    fontWeight: '800',
  },
  promoDesc: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: getResponsiveFontSize(13),
    marginTop: SPACING.sm,
    marginBottom: SPACING.lg,
  },
  promoBtn: {
    backgroundColor: '#fff',
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.lg,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  promoBtnText: {
    color: '#000',
    fontWeight: '800',
    fontSize: getResponsiveFontSize(13),
  },
  // New Styles for Professional Dashboard
  alertBanner: {
    marginHorizontal: SPACING.lg,
    marginTop: SPACING.lg,
    marginBottom: SPACING.lg,
    backgroundColor: '#eff6ff',
    borderRadius: 12,
    padding: SPACING.lg,
    borderLeftWidth: 4,
    borderLeftColor: '#3b82f6',
    elevation: 2,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 5,
      },
      web: {
        boxShadow: '0 2px 5px rgba(0, 0, 0, 0.05)',
      }
    }),
  },
  alertContent: {
    flexDirection: 'row',
    gap: SPACING.md,
  },
  alertText: {
    flex: 1,
  },
  alertTitle: {
    fontSize: getResponsiveFontSize(14),
    fontWeight: '700',
    color: '#1f2937',
    marginBottom: SPACING.xs,
  },
  alertDesc: {
    fontSize: getResponsiveFontSize(12),
    color: '#6b7280',
    lineHeight: 18,
  },
  completeBtn: {
    backgroundColor: '#1e3a8a',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.sm,
    borderRadius: 6,
    alignSelf: 'flex-start',
    marginTop: SPACING.md,
  },
  completeBtnText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: getResponsiveFontSize(11),
  },
  pageHeader: {
    paddingHorizontal: SPACING.lg,
    marginBottom: SPACING.xl,
  },
  pageTitle: {
    fontSize: getResponsiveFontSize(24),
    fontWeight: '800',
    color: '#1f2937',
    marginBottom: SPACING.sm,
  },
  pageDesc: {
    fontSize: getResponsiveFontSize(13),
    color: '#6b7280',
    marginBottom: SPACING.md,
  },
  uploadBtn: {
    backgroundColor: '#1e40af',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    alignSelf: 'flex-start',
  },
  uploadBtnText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: getResponsiveFontSize(12),
  },
  welcomeCard: {
    marginHorizontal: SPACING.lg,
    marginBottom: SPACING.xl,
    borderRadius: 16,
    overflow: 'hidden',
  },
  welcomeGradient: {
    padding: SPACING.xl,
  },
  welcomeContent: {
    flexDirection: 'row',
    gap: SPACING.lg,
    alignItems: 'flex-start',
  },
  welcomeIcon: {
    width: 56,
    height: 56,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  welcomeInfo: {
    flex: 1,
  },
  welcomeName: {
    fontSize: getResponsiveFontSize(18),
    fontWeight: '800',
    color: '#1f2937',
    marginBottom: SPACING.sm,
  },
  infoRow: {
    flexDirection: 'row',
    gap: SPACING.md,
    alignItems: 'center',
    flexWrap: 'wrap',
    marginTop: SPACING.sm,
  },
  infoBadge: {
    backgroundColor: '#dcfce7',
    paddingHorizontal: SPACING.sm,
    paddingVertical: 4,
    borderRadius: 4,
  },
  infoBadgeText: {
    fontSize: getResponsiveFontSize(12),
    fontWeight: '600',
    color: '#166534',
  },
  infoText: {
    fontSize: getResponsiveFontSize(12),
    fontWeight: '600',
    color: '#4b5563',
  },
  statsGrid: {
    paddingHorizontal: SPACING.lg,
    marginBottom: SPACING.xl,
    gap: SPACING.md,
  },
  statBox: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: SPACING.lg,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    alignItems: 'flex-start',
    marginBottom: SPACING.md,
  },
  statIconBox: {
    backgroundColor: '#e0f2fe',
    width: 44,
    height: 44,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.md,
  },
  statValue: {
    fontSize: getResponsiveFontSize(28),
    fontWeight: '900',
    color: '#1f2937',
    marginBottom: SPACING.xs,
  },
  statLabel: {
    fontSize: getResponsiveFontSize(10),
    fontWeight: '700',
    color: '#6b7280',
    textTransform: 'uppercase',
    lineHeight: 14,
  },
  statLink: {
    fontSize: getResponsiveFontSize(12),
    fontWeight: '600',
    color: '#1e40af',
    marginTop: SPACING.md,
  },
  statMeta: {
    fontSize: getResponsiveFontSize(11),
    color: '#6b7280',
    marginTop: SPACING.sm,
  },
  eventsSection: {
    paddingHorizontal: SPACING.lg,
    marginBottom: SPACING.xl,
  },
  sectionHeader: {
    marginBottom: SPACING.lg,
  },
  sectionTitle: {
    fontSize: getResponsiveFontSize(18),
    fontWeight: '800',
    color: '#1f2937',
    marginBottom: SPACING.sm,
  },
  sectionDesc: {
    fontSize: getResponsiveFontSize(13),
    color: '#6b7280',
  },
  filterScroll: {
    marginHorizontal: -SPACING.lg,
  },
  filterContainer: {
    paddingHorizontal: SPACING.lg,
    gap: SPACING.md,
  },
  filterBtn: {
    backgroundColor: '#f3f4f6',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  filterBtnActive: {
    backgroundColor: '#1e3a8a',
    borderColor: '#1e3a8a',
  },
  filterText: {
    fontSize: getResponsiveFontSize(12),
    fontWeight: '600',
    color: '#4b5563',
  },
  filterTextActive: {
    color: '#fff',
  },
});

export default StudentDashboard;
