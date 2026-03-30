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
      const achs = res.data.achievements || [];
      setStats({
        verified: achs.filter(a => a.status === 'verified').length,
        pending: achs.filter(a => a.status === 'pending').length,
        total: achs.length,
      });
    } catch (error) {
      // Silent fail, keep empty state
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
      <LinearGradient
        colors={['#eef2ff', '#f8fafc']}
        style={styles.header}
      >
        <View style={styles.topBar}>
          <TouchableOpacity
            onPress={() => navigation.navigate('Profile')}
            accessible
            accessibilityRole="button"
            accessibilityLabel="Go to profile"
          >
            <LinearGradient
              colors={COLORS.gradientPrimary}
              style={styles.avatar}
            >
              <Text style={styles.avatarChar}>{user?.name[0]}</Text>
            </LinearGradient>
          </TouchableOpacity>
          <View style={styles.headerInfo}>
            <Text
              style={styles.welcomeText}
              allowFontScaling
              maxFontSizeMultiplier={1.3}
            >
              Welcome, {user?.name.split(' ')[0]}
            </Text>
            <Text
              style={styles.statusText}
              allowFontScaling
              maxFontSizeMultiplier={1.1}
            >
              {user?.enrollmentNo || 'Student Portal'}
            </Text>
          </View>
          <TouchableOpacity
            style={styles.notifBtn}
            onPress={() => navigation.navigate('Broadcasts')}
            accessible
            accessibilityRole="button"
            accessibilityLabel="Notifications"
            accessibilityHint="View broadcast messages"
          >
            <Ionicons
              name="notifications-outline"
              size={24}
              color={COLORS.textPrimary}
            />
            <View style={styles.notifDot} />
          </TouchableOpacity>
        </View>

        <View
          style={styles.statsContainer}
          accessible
          accessibilityRole="group"
          accessibilityLabel="Achievement statistics"
        >
          <View style={styles.statBox}>
            <Text style={styles.statLabel}>Verified</Text>
            <Text style={[styles.statValue, { color: COLORS.success }]}>
              {stats.verified}
            </Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.statBox}>
            <Text style={styles.statLabel}>Pending</Text>
            <Text style={[styles.statValue, { color: COLORS.warning }]}>
              {stats.pending}
            </Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.statBox}>
            <Text style={styles.statLabel}>Total</Text>
            <Text style={[styles.statValue, { color: COLORS.primary }]}>
              {stats.total}
            </Text>
          </View>
        </View>
      </LinearGradient>

      {/* Trending Section */}
      {trending.length > 0 && (
        <View style={styles.trendingContainer}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.trendingScroll}
            scrollEnabled={true}
          >
            {trending.map(item => (
              <TouchableOpacity
                key={item.id}
                style={[
                  styles.trendingCard,
                  { borderLeftColor: item.color },
                ]}
                accessible
                accessibilityRole="button"
                accessibilityLabel={item.title}
                accessibilityHint={item.subtitle}
              >
                <View
                  style={[
                    styles.trendIcon,
                    { backgroundColor: item.color + '20' },
                  ]}
                >
                  <Ionicons name={item.icon} size={20} color={item.color} />
                </View>
                <View style={{ marginLeft: SPACING.md }}>
                  <Text style={styles.trendTitle}>{item.title}</Text>
                  <Text style={styles.trendSub}>{item.subtitle}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}

      <View style={styles.section}>
        <Text
          style={styles.sectionTitle}
          accessible
          accessibilityRole="header"
          allowFontScaling
          maxFontSizeMultiplier={1.3}
        >
          🎯 Power Actions
        </Text>
        <View
          style={styles.grid}
          accessible
          accessibilityRole="group"
          accessibilityLabel="Action buttons"
        >
          {[
            {
              label: 'Upload',
              icon: 'add-circle-outline',
              color: '#10b981',
              route: 'Upload',
              hint: 'Upload a new achievement',
            },
            {
              label: 'Achievements',
              icon: 'trophy-outline',
              color: '#8b5cf6',
              route: 'Achievements',
              hint: 'View your achievements',
            },
            {
              label: 'Events',
              icon: 'flash-outline',
              color: '#f59e0b',
              route: 'Hackathons',
              hint: 'Explore events and hackathons',
            },
            {
              label: 'Internships',
              icon: 'briefcase-outline',
              color: '#06b6d4',
              route: 'Internships',
              hint: 'Browse internship opportunities',
            },
          ].map((action, idx) => (
            <TouchableOpacity
              key={idx}
              style={styles.gridItem}
              onPress={() => navigation.navigate(action.route)}
              accessible
              accessibilityRole="button"
              accessibilityLabel={action.label}
              accessibilityHint={action.hint}
            >
              <LinearGradient
                colors={[action.color + '20', 'transparent']}
                style={styles.gridIconBox}
              >
                <Ionicons
                  name={action.icon}
                  size={28}
                  color={action.color}
                />
              </LinearGradient>
              <Text
                style={styles.gridLabel}
                allowFontScaling
                maxFontSizeMultiplier={1.2}
              >
                {action.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {renderLeaderboardMini()}

      <TouchableOpacity
        style={styles.promoBanner}
        onPress={() => navigation.navigate('Hackathons')}
        accessible
        accessibilityRole="button"
        accessibilityLabel="Explore hackathons"
        accessibilityHint="View available hackathon opportunities"
      >
        <Image
          source={{
            uri: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800',
          }}
          style={styles.promoBg}
          accessible={false}
        />
        <LinearGradient
          colors={['rgba(0,0,0,0.2)', 'rgba(0,0,0,0.8)']}
          style={styles.promoOverlay}
        >
          <Text style={styles.promoTag}>DISCOVER</Text>
          <Text
            style={styles.promoTitle}
            allowFontScaling
            maxFontSizeMultiplier={1.3}
          >
            91+ Hackathons Waiting
          </Text>
          <Text
            style={styles.promoDesc}
            allowFontScaling
            maxFontSizeMultiplier={1.2}
          >
            Filter by categories and apply directly from your portal.
          </Text>
          <View style={styles.promoBtn}>
            <Text style={styles.promoBtnText}>Explore Now</Text>
          </View>
        </LinearGradient>
      </TouchableOpacity>

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
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
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
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 10,
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
});

export default StudentDashboard;
