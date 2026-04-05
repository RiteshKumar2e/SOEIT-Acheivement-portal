import React, { useState, useEffect, useCallback } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';
import api from '../../services/api';
import { ROUTES } from '../../constants/api';
import { useAuth } from '../../context/AuthContext';

const { width } = Dimensions.get('window');

const AdminDashboard = ({ navigation }) => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalFaculties: 0,
    pendingCount: 0,
    totalAchievements: 0,
    approvedCount: 0,
    rejectedCount: 0
  });
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchStats = useCallback(async () => {
    try {
      const res = await api.get(ROUTES.ADMIN_STATS);
      if (res.data.success) {
        setStats(res.data.stats);
      }
    } catch (error) {
       console.error('Admin Stats Fetch Error:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchStats();
  };

  const StatCard = ({ label, value, icon, color, subValue, subLabel }) => (
    <View style={styles.statCard}>
      <View style={styles.statCardHeader}>
        <View style={[styles.statIconContainer, { backgroundColor: color + '15' }]}>
          <Ionicons name={icon} size={24} color={color} />
        </View>
        <Ionicons name="ellipsis-horizontal" size={20} color={COLORS.textMuted} />
      </View>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
      {subValue !== undefined && (
        <View style={styles.statSubRow}>
          <Text style={[styles.statSubValue, { color }]}>{subValue}</Text>
          <Text style={styles.statSubLabel}> {subLabel}</Text>
        </View>
      )}
    </View>
  );

  const ActionRow = ({ title, sub, icon, color, route }) => (
    <TouchableOpacity 
      style={styles.actionRow}
      onPress={() => navigation.navigate(route)}
    >
      <View style={[styles.actionIconBox, { backgroundColor: color + '15' }]}>
        <Ionicons name={icon} size={22} color={color} />
      </View>
      <View style={styles.actionTextContent}>
        <Text style={styles.actionTitle}>{title}</Text>
        <Text style={styles.actionSub}>{sub}</Text>
      </View>
      <Ionicons name="chevron-forward" size={18} color={COLORS.textMuted} />
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <ScrollView 
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={COLORS.primary} />}
      >
        <LinearGradient colors={['#1e293b', '#0f172a']} style={styles.header}>
          <View style={styles.headerTop}>
             <View>
                <Text style={styles.headerTag}>SYSTEM ADMINISTRATOR</Text>
                <Text style={styles.headerTitle}>Welcome, {user?.name?.split(' ')[0]}</Text>
                <Text style={styles.headerSub}>Institution Operational Control</Text>
             </View>
             <TouchableOpacity style={styles.profileBtn} onPress={() => navigation.navigate('Profile')}>
                <View style={styles.avatarMini}>
                   <Text style={styles.avatarText}>A</Text>
                </View>
             </TouchableOpacity>
          </View>

          <View style={styles.statsSummary}>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryValue}>{stats.totalStudents + stats.totalFaculties}</Text>
              <Text style={styles.summaryLabel}>Total Users</Text>
            </View>
            <View style={styles.summaryDivider} />
            <View style={styles.summaryItem}>
              <Text style={styles.summaryValue}>{stats.totalAchievements}</Text>
              <Text style={styles.summaryLabel}>Achievements</Text>
            </View>
            <View style={styles.summaryDivider} />
            <View style={styles.summaryItem}>
              <Text style={styles.summaryValue}>{stats.pendingCount}</Text>
              <Text style={[styles.summaryLabel, { color: '#f59e0b' }]}>Pending</Text>
            </View>
          </View>
        </LinearGradient>

        <View style={styles.content}>
          <View style={styles.statsGrid}>
            <StatCard label="Students" value={stats.totalStudents} icon="people" color="#3b82f6" subValue="+12" subLabel="this month" />
            <StatCard label="Faculty" value={stats.totalFaculties} icon="school" color="#8b5cf6" subValue="Active" subLabel="Status" />
            <StatCard label="Approved" value={stats.approvedCount} icon="checkmark-circle" color="#10b981" subValue={stats.totalAchievements} subLabel="Total" />
            <StatCard label="Rejected" value={stats.rejectedCount} icon="close-circle" color="#ef4444" subValue="Audit" subLabel="Needed" />
          </View>

          <Text style={styles.sectionTitle}>Administrative Controls</Text>
          
          <ActionRow title="Verification Center" sub="Review pending student evidence" icon="shield-checkmark" color={COLORS.primary} route="Verify" />
          <ActionRow title="Student Directory" sub="Manage scholar enrollment and points" icon="people" color="#10b981" route="StudentManagement" />
          <ActionRow title="Faculty Registry" sub="Authorized educator profiles" icon="school" color="#8b5cf6" route="FacultyManagement" />
          <ActionRow title="Institution Broadcast" sub="Send notices to all stakeholders" icon="megaphone" color={COLORS.secondary} route="BroadcastNotice" />
          <ActionRow title="Analytics & Reports" sub="Export institutional data" icon="bar-chart" color="#ec4899" route="Reports" />

          <TouchableOpacity style={styles.analyticsBanner} onPress={() => navigation.navigate('Reports')}>
            <LinearGradient colors={['#4f46e5', '#3730a3']} style={styles.bannerGradient}>
              <View style={styles.bannerContent}>
                <Text style={styles.bannerTitle}>Advanced Analytics</Text>
                <Text style={styles.bannerSub}>View trends and department performances.</Text>
                <View style={styles.bannerBadge}>
                  <Text style={styles.bannerBadgeText}>Open Reports</Text>
                </View>
              </View>
              <Ionicons name="analytics" size={60} color="rgba(255,255,255,0.15)" style={styles.bannerIcon} />
            </LinearGradient>
          </TouchableOpacity>
        </View>
        <View style={{ height: 100 }} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },
  header: { padding: 25, paddingTop: 60, paddingBottom: 40, borderBottomLeftRadius: 35, borderBottomRightRadius: 35 },
  headerTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 35 },
  headerTag: { color: COLORS.secondary, fontSize: 10, fontWeight: '900', letterSpacing: 2, marginBottom: 5 },
  headerTitle: { color: '#fff', fontSize: 24, fontWeight: '800' },
  headerSub: { color: 'rgba(255,255,255,0.6)', fontSize: 12, marginTop: 2 },
  avatarMini: { width: 44, height: 44, borderRadius: 15, backgroundColor: 'rgba(255,255,255,0.1)', alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)' },
  avatarText: { color: '#fff', fontWeight: '800', fontSize: 18 },
  statsSummary: { flexDirection: 'row', backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 20, padding: 20, marginTop: 10, borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)' },
  summaryItem: { flex: 1, alignItems: 'center' },
  summaryValue: { color: '#fff', fontSize: 20, fontWeight: '900' },
  summaryLabel: { color: 'rgba(255,255,255,0.5)', fontSize: 10, fontWeight: '700', marginTop: 4 },
  summaryDivider: { width: 1, height: 25, backgroundColor: 'rgba(255,255,255,0.1)', alignSelf: 'center' },
  content: { padding: 20 },
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 15, marginBottom: 30 },
  statCard: { width: (width - 55) / 2, backgroundColor: '#fff', padding: 15, borderRadius: 24, borderWidth: 1, borderColor: '#e2e8f0', elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 5 },
  statCardHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
  statIconContainer: { width: 40, height: 40, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  statValue: { color: '#1e293b', fontSize: 22, fontWeight: '900' },
  statLabel: { color: '#64748b', fontSize: 12, fontWeight: '700', marginTop: 2 },
  statSubRow: { flexDirection: 'row', alignItems: 'center', marginTop: 8 },
  statSubValue: { fontSize: 10, fontWeight: '900' },
  statSubLabel: { color: '#94a3b8', fontSize: 10, fontWeight: '700' },
  sectionTitle: { color: '#1e293b', fontSize: 18, fontWeight: '800', marginBottom: 20, marginLeft: 5 },
  actionRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', padding: 15, borderRadius: 20, marginBottom: 15, borderWidth: 1, borderColor: '#e2e8f0' },
  actionIconBox: { width: 44, height: 44, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  actionTextContent: { flex: 1, marginLeft: 15 },
  actionTitle: { color: '#1e293b', fontSize: 15, fontWeight: '800' },
  actionSub: { color: '#64748b', fontSize: 12, marginTop: 2, fontWeight: '600' },
  analyticsBanner: { marginTop: 10, borderRadius: 25, overflow: 'hidden' },
  bannerGradient: { padding: 25, flexDirection: 'row', alignItems: 'center' },
  bannerContent: { flex: 1, zIndex: 1 },
  bannerTitle: { color: '#fff', fontSize: 18, fontWeight: '800' },
  bannerSub: { color: 'rgba(255,255,255,0.7)', fontSize: 12, marginTop: 5, marginBottom: 15 },
  bannerBadge: { backgroundColor: 'rgba(255,255,255,0.2)', paddingVertical: 6, paddingHorizontal: 12, borderRadius: 8, alignSelf: 'flex-start' },
  bannerBadgeText: { color: '#fff', fontWeight: '800', fontSize: 11 },
  bannerIcon: { position: 'absolute', right: -10, bottom: -10 },
});

export default AdminDashboard;
