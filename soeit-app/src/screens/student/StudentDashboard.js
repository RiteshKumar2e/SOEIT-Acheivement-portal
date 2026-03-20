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
import api from '../../services/api';

const { width } = Dimensions.get('window');

const StudentDashboard = ({ navigation }) => {
  const { user } = useAuth();
  const [refreshing, setRefreshing] = useState(false);
  const [stats, setStats] = useState({ verified: 12, pending: 3, total: 15 });
  const [trending, setTrending] = useState([
    { id: 1, title: 'Summer Internships Open', subtitle: 'Arka Tech, Google, Microsoft', icon: 'briefcase', color: '#3b82f6' },
    { id: 2, title: 'Code AJU Hackathon', subtitle: 'Registration ends soon', icon: 'code-working', color: '#ec4899' },
  ]);

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
       // Keep demo if offline
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

  const renderLeaderboardMini = () => (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>🏆 Hall of Fame</Text>
        <TouchableOpacity onPress={() => navigation.navigate('History')}>
          <Text style={styles.seeAll}>Leaderboard</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.leaderboardPreview}>
        {[
          { name: 'Rahul Sharma', points: 4250, rank: 1, avatar: 'R' },
          { name: 'Aditi Ray', points: 3820, rank: 2, avatar: 'A' },
          { name: 'Vikram Singh', points: 3100, rank: 3, avatar: 'V' },
        ].map((item, idx) => (
          <View key={idx} style={styles.leaderItem}>
            <View style={[styles.miniAvatar, { backgroundColor: COLORS.primary + '20' }]}>
               <Text style={styles.miniAvatarText}>{item.avatar}</Text>
            </View>
            <View style={{ flex: 1, marginLeft: 10 }}>
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

  return (
    <ScrollView
      style={styles.container}
      showsVerticalScrollIndicator={false}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={COLORS.primary} />}
    >
      <LinearGradient colors={['#1e1b4b', '#000']} style={styles.header}>
        <View style={styles.topBar}>
          <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
            <LinearGradient colors={['#818cf8', '#4f46e5']} style={styles.avatar}>
              <Text style={styles.avatarChar}>{user?.name[0]}</Text>
            </LinearGradient>
          </TouchableOpacity>
          <View style={styles.headerInfo}>
            <Text style={styles.welcomeText}>Welcome, {user?.name.split(' ')[0]}</Text>
            <Text style={styles.statusText}>{user?.enrollmentNo || 'Student Portal'}</Text>
          </View>
          <TouchableOpacity style={styles.notifBtn} onPress={() => navigation.navigate('Events')}>
            <Ionicons name="notifications-outline" size={24} color="#fff" />
            <View style={styles.notifDot} />
          </TouchableOpacity>
        </View>

        <View style={styles.statsContainer}>
          <View style={styles.statBox}>
             <Text style={styles.statLabel}>Verified</Text>
             <Text style={[styles.statValue, { color: COLORS.success }]}>{stats.verified}</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.statBox}>
             <Text style={styles.statLabel}>Pending</Text>
             <Text style={[styles.statValue, { color: COLORS.warning }]}>{stats.pending}</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.statBox}>
             <Text style={styles.statLabel}>Rank</Text>
             <Text style={[styles.statValue, { color: COLORS.secondary }]}>14</Text>
          </View>
        </View>
      </LinearGradient>

      {/* Trending Section */}
      <View style={styles.trendingContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.trendingScroll}>
          {trending.map(item => (
            <TouchableOpacity key={item.id} style={[styles.trendingCard, { borderLeftColor: item.color }]}>
               <View style={[styles.trendIcon, { backgroundColor: item.color + '20' }]}>
                 <Ionicons name={item.icon} size={20} color={item.color} />
               </View>
               <View style={{ marginLeft: 12 }}>
                 <Text style={styles.trendTitle}>{item.title}</Text>
                 <Text style={styles.trendSub}>{item.subtitle}</Text>
               </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>🎯 Power Actions</Text>
        <View style={styles.grid}>
          {[
            { label: 'Upload', icon: 'add-circle-outline', color: '#10b981', route: 'Upload' },
            { label: 'Certificate', icon: 'trophy-outline', color: '#8b5cf6', route: 'Achievements' },
            { label: 'Events', icon: 'flash-outline', color: '#f59e0b', route: 'Hackathons' },
            { label: 'Jobs', icon: 'briefcase-outline', color: '#06b6d4', route: 'Internships' },
          ].map((action, idx) => (
            <TouchableOpacity 
              key={idx} 
              style={styles.gridItem} 
              onPress={() => navigation.navigate(action.route)}
            >
              <LinearGradient colors={[action.color + '20', 'transparent']} style={styles.gridIconBox}>
                 <Ionicons name={action.icon} size={28} color={action.color} />
              </LinearGradient>
              <Text style={styles.gridLabel}>{action.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {renderLeaderboardMini()}

      <TouchableOpacity 
        style={styles.promoBanner}
        onPress={() => navigation.navigate('Hackathons')}
      >
        <Image 
          source={{ uri: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800' }} 
          style={styles.promoBg} 
        />
        <LinearGradient colors={['rgba(0,0,0,0.2)', 'rgba(0,0,0,0.8)']} style={styles.promoOverlay}>
           <Text style={styles.promoTag}>DISCOVER</Text>
           <Text style={styles.promoTitle}>91+ Hackathons Waiting</Text>
           <Text style={styles.promoDesc}>Filter by categories and apply directly from your portal.</Text>
           <View style={styles.promoBtn}>
              <Text style={styles.promoBtnText}>Explore Now</Text>
           </View>
        </LinearGradient>
      </TouchableOpacity>

      <View style={{ height: 100 }} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bgPrimary },
  header: {
    paddingTop: 50,
    paddingHorizontal: 20,
    paddingBottom: 40,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
  },
  topBar: { flexDirection: 'row', alignItems: 'center', gap: 15, marginBottom: 30 },
  avatar: { width: 50, height: 50, borderRadius: 18, alignItems: 'center', justifyContent: 'center' },
  avatarChar: { color: '#fff', fontSize: 22, fontWeight: '800' },
  headerInfo: { flex: 1 },
  welcomeText: { color: '#fff', fontSize: 20, fontWeight: '800' },
  statusText: { color: 'rgba(255,255,255,0.6)', fontSize: 13, marginTop: 2 },
  notifBtn: { width: 44, height: 44, borderRadius: 15, backgroundColor: 'rgba(255,255,255,0.1)', alignItems: 'center', justifyContent: 'center' },
  notifDot: { position: 'absolute', top: 12, right: 12, width: 8, height: 8, borderRadius: 4, backgroundColor: COLORS.secondary, borderWidth: 2, borderColor: '#1e1b4b' },
  statsContainer: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 24,
    padding: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  statBox: { flex: 1, alignItems: 'center' },
  statLabel: { color: 'rgba(255,255,255,0.5)', fontSize: 11, fontWeight: '700', textTransform: 'uppercase', marginBottom: 5 },
  statValue: { fontSize: 22, fontWeight: '900' },
  divider: { width: 1, height: 30, backgroundColor: 'rgba(255,255,255,0.1)' },
  trendingContainer: { marginTop: -25 },
  trendingScroll: { paddingHorizontal: 20, gap: 15 },
  trendingCard: {
    backgroundColor: COLORS.bgCard,
    padding: 15,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    borderLeftWidth: 4,
    borderWidth: 1,
    borderColor: COLORS.border,
    minWidth: 260,
  },
  trendIcon: { width: 40, height: 40, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  trendTitle: { color: COLORS.textPrimary, fontSize: 14, fontWeight: '700' },
  trendSub: { color: COLORS.textMuted, fontSize: 11, marginTop: 2 },
  section: { padding: 20, marginTop: 10 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  sectionTitle: { fontSize: 19, fontWeight: '800', color: COLORS.textPrimary },
  seeAll: { color: COLORS.primary, fontWeight: '700', fontSize: 13 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 15 },
  gridItem: { 
    width: (width - 55) / 2, 
    backgroundColor: COLORS.bgCard, 
    padding: 20, 
    borderRadius: 24, 
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  gridIconBox: { width: 56, height: 56, borderRadius: 18, alignItems: 'center', justifyContent: 'center', marginBottom: 12 },
  gridLabel: { color: COLORS.textPrimary, fontSize: 14, fontWeight: '700' },
  leaderboardPreview: { backgroundColor: COLORS.bgCard, borderRadius: 24, padding: 15, borderWidth: 1, borderColor: COLORS.border },
  leaderItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: COLORS.border },
  miniAvatar: { width: 40, height: 40, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  miniAvatarText: { color: COLORS.primary, fontWeight: '800' },
  leaderName: { color: COLORS.textPrimary, fontSize: 14, fontWeight: '700' },
  leaderPoints: { color: COLORS.textMuted, fontSize: 12 },
  rankBadge: { paddingHorizontal: 10, paddingVertical: 4, backgroundColor: COLORS.bgSecondary, borderRadius: 8 },
  rankText: { color: COLORS.textSecondary, fontSize: 11, fontWeight: '800' },
  promoBanner: { margin: 20, height: 200, borderRadius: 24, overflow: 'hidden' },
  promoBg: { ...StyleSheet.absoluteFillObject },
  promoOverlay: { ...StyleSheet.absoluteFillObject, padding: 25, justifyContent: 'flex-end' },
  promoTag: { color: COLORS.secondary, fontWeight: '900', fontSize: 10, letterSpacing: 2, marginBottom: 8 },
  promoTitle: { color: '#fff', fontSize: 24, fontWeight: '800' },
  promoDesc: { color: 'rgba(255,255,255,0.7)', fontSize: 13, marginTop: 5, marginBottom: 15 },
  promoBtn: { backgroundColor: '#fff', paddingVertical: 10, paddingHorizontal: 20, borderRadius: 12, alignSelf: 'flex-start' },
  promoBtnText: { color: '#000', fontWeight: '800', fontSize: 13 },
});

export default StudentDashboard;
