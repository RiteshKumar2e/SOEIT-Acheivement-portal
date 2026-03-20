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
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';
import api from '../../services/api';

const { width } = Dimensions.get('window');

const AdminDashboard = ({ navigation }) => {
  const [stats, setStats] = useState({
    totalStudents: 1250,
    pendingVerifications: 42,
    totalAchievements: 850,
    activeInternships: 15,
  });
  const [refreshing, setRefreshing] = useState(false);

  const fetchStats = useCallback(async () => {
    try {
      const res = await api.get('/admin/stats');
      if (res.data.stats) setStats(res.data.stats);
    } catch (error) {
       // Keep demo if offline
    } finally {
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

  const renderAction = (title, sub, icon, color, route) => (
    <TouchableOpacity 
      style={styles.actionCard} 
      onPress={() => navigation.navigate(route)}
      activeOpacity={0.7}
    >
      <LinearGradient colors={[color + '20', 'transparent']} style={styles.actionIconBox}>
        <Ionicons name={icon} size={28} color={color} />
      </LinearGradient>
      <View style={styles.actionTextContent}>
        <Text style={styles.actionTitle}>{title}</Text>
        <Text style={styles.actionSub}>{sub}</Text>
      </View>
      <Ionicons name="chevron-forward" size={20} color={COLORS.textMuted} />
    </TouchableOpacity>
  );

  return (
    <ScrollView 
      style={styles.container} 
      showsVerticalScrollIndicator={false}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={COLORS.primary} />}
    >
      <LinearGradient colors={['#1e1b4b', '#312e81']} style={styles.header}>
        <View style={styles.headerTop}>
           <View>
              <Text style={styles.headerTag}>INSTITUTIONAL ADMIN</Text>
              <Text style={styles.headerTitle}>Operational Hub</Text>
           </View>
           <TouchableOpacity style={styles.profileBtn} onPress={() => navigation.navigate('Profile')}>
              <View style={styles.avatarMini}>
                 <Text style={styles.avatarText}>A</Text>
              </View>
           </TouchableOpacity>
        </View>

        <View style={styles.statsGrid}>
           <View style={styles.statItem}>
              <Text style={styles.statValue}>{stats.totalStudents}</Text>
              <Text style={styles.statLabel}>Students</Text>
           </View>
           <View style={styles.statDivider} />
           <View style={styles.statItem}>
              <Text style={[styles.statValue, { color: COLORS.warning }]}>{stats.pendingVerifications}</Text>
              <Text style={styles.statLabel}>Pending</Text>
           </View>
           <View style={styles.statDivider} />
           <View style={styles.statItem}>
              <Text style={styles.statValue}>{stats.totalAchievements}</Text>
              <Text style={styles.statLabel}>Achievements</Text>
           </View>
        </View>
      </LinearGradient>

      <View style={styles.content}>
        <Text style={styles.sectionTitle}>System Controls</Text>
        
        {renderAction('Verification Engine', 'Review pending student evidence', 'shield-checkmark', COLORS.primary, 'Verify')}
        {renderAction('Student Management', 'Browse directories and points', 'people', '#10b981', 'StudentManagement')}
        {renderAction('Faculty Registry', 'Manage authorized educators', 'school', '#818cf8', 'FacultyManagement')}
        {renderAction('Broadcast Center', 'Send announcements instantly', 'megaphone', COLORS.secondary, 'BroadcastNotice')}
        {renderAction('Audit & Reports', 'Export institutional analytics', 'bar-chart', '#ec4899', 'Reports')}

        <TouchableOpacity 
          style={styles.aiBanner}
          onPress={() => navigation.navigate('Reports')}
        >
           <LinearGradient colors={['#4338ca', '#1e1b4b']} style={styles.aiGradient}>
              <View style={styles.aiContent}>
                 <Text style={styles.aiTitle}>Advanced Analytics</Text>
                 <Text style={styles.aiSub}>View visual breakdowns of achievement trends across departments.</Text>
                 <View style={styles.aiBtn}>
                    <Text style={styles.aiBtnText}>Open Audit</Text>
                 </View>
              </View>
              <Ionicons name="analytics" size={70} color="rgba(255,255,255,0.1)" style={styles.aiIcon} />
           </LinearGradient>
        </TouchableOpacity>
      </View>

      <View style={{ height: 100 }} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bgPrimary },
  header: { padding: 25, paddingTop: 60, paddingBottom: 40, borderBottomLeftRadius: 36, borderBottomRightRadius: 36 },
  headerTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 35 },
  headerTag: { color: COLORS.secondary, fontSize: 11, fontWeight: '900', letterSpacing: 2, marginBottom: 5 },
  headerTitle: { color: '#fff', fontSize: 28, fontWeight: '800' },
  avatarMini: { width: 44, height: 44, borderRadius: 15, backgroundColor: 'rgba(255,255,255,0.1)', alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: 'rgba(255,255,255,0.2)' },
  avatarText: { color: '#fff', fontWeight: '800', fontSize: 18 },
  statsGrid: { flexDirection: 'row', backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: 24, padding: 20, borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)' },
  statItem: { flex: 1, alignItems: 'center' },
  statValue: { color: '#fff', fontSize: 20, fontWeight: '900' },
  statLabel: { color: 'rgba(255,255,255,0.5)', fontSize: 10, fontWeight: '800', marginTop: 4, textTransform: 'uppercase' },
  statDivider: { width: 1, height: 25, backgroundColor: 'rgba(255,255,255,0.1)', alignSelf: 'center' },
  content: { padding: 20 },
  sectionTitle: { color: COLORS.textPrimary, fontSize: 18, fontWeight: '800', marginBottom: 20, marginLeft: 5 },
  actionCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.bgCard, padding: 15, borderRadius: 24, marginBottom: 15, borderWidth: 1, borderColor: COLORS.border },
  actionIconBox: { width: 52, height: 52, borderRadius: 18, alignItems: 'center', justifyContent: 'center' },
  actionTextContent: { flex: 1, marginLeft: 15 },
  actionTitle: { color: COLORS.textPrimary, fontSize: 16, fontWeight: '800' },
  actionSub: { color: COLORS.textMuted, fontSize: 12, marginTop: 2, fontWeight: '600' },
  aiBanner: { marginTop: 20, borderRadius: 28, overflow: 'hidden' },
  aiGradient: { padding: 25, flexDirection: 'row', alignItems: 'center' },
  aiContent: { flex: 1, zIndex: 1 },
  aiTitle: { color: '#fff', fontSize: 20, fontWeight: '800' },
  aiSub: { color: 'rgba(255,255,255,0.7)', fontSize: 13, marginTop: 5, marginBottom: 15, lineHeight: 18 },
  aiBtn: { backgroundColor: COLORS.secondary, paddingVertical: 8, paddingHorizontal: 16, borderRadius: 12, alignSelf: 'flex-start' },
  aiBtnText: { color: '#1e1b4b', fontWeight: '800', fontSize: 13 },
  aiIcon: { position: 'absolute', right: -10, bottom: -10, transform: [{ rotate: '-15deg' }] },
});

export default AdminDashboard;
