import React, { useState, useEffect, useCallback } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  FlatList,
  Alert,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS } from '../../constants/colors';
import api from '../../services/api';
import { ROUTES } from '../../constants/api';

const { width } = Dimensions.get('window');

const FacultyDashboard = ({ navigation }) => {
  const [stats, setStats] = useState({ totalStudents: 156, pendingCount: 12, approvedCount: 450 });
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchData = useCallback(async () => {
    try {
      const [statsRes, studentsRes] = await Promise.all([
        api.get(ROUTES.ADMIN_STATS),
        api.get(ROUTES.ADMIN_STUDENTS, { params: { limit: 10 } })
      ]);
      setStats(statsRes.data.stats || stats);
      setStudents(studentsRes.data.data || []);
    } catch (error) {
       // Keep demo if offline
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchData();
  };

  const renderStudentItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.studentCard}
      onPress={() => Alert.alert('Student Profile', `${item.name}\n${item.achievementCounts?.points} Total Achievement Points`)}
    >
      <LinearGradient colors={[COLORS.primary + '30', 'transparent']} style={styles.miniAvatar}>
        <Text style={styles.miniAvatarText}>{item.name[0]}</Text>
      </LinearGradient>
      <View style={{ flex: 1, marginLeft: 15 }}>
        <Text style={styles.studentName}>{item.name}</Text>
        <Text style={styles.studentDetail}>{item.enrollmentNo || 'SOEIT/22/001'}</Text>
      </View>
      <View style={styles.pointChip}>
        <Ionicons name="flash" size={12} color={COLORS.secondary} />
        <Text style={styles.pointText}>{item.achievementCounts?.points || 0}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <ScrollView 
      style={styles.container}
      showsVerticalScrollIndicator={false}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={COLORS.primary} />}
    >
      <LinearGradient colors={['#0f172a', '#1e293b']} style={styles.header}>
        <View style={styles.headerTop}>
          <View>
             <Text style={styles.badge}>FACULTY PORTAL</Text>
             <Text style={styles.greeting}>Insight Dashboard</Text>
          </View>
          <TouchableOpacity style={styles.profileBtn} onPress={() => navigation.navigate('Profile')}>
            <Ionicons name="person-circle" size={40} color="#fff" />
          </TouchableOpacity>
        </View>

        <View style={styles.heroStats}>
           <View style={styles.heroStatItem}>
              <Text style={styles.heroStatValue}>{stats.totalStudents}</Text>
              <Text style={styles.heroStatLabel}>Students</Text>
           </View>
           <View style={styles.heroDivider} />
           <View style={styles.heroStatItem}>
              <Text style={styles.heroStatValue}>{stats.pendingCount}</Text>
              <Text style={styles.heroStatLabel}>Pending</Text>
           </View>
           <View style={styles.heroDivider} />
           <View style={styles.heroStatItem}>
              <Text style={styles.heroStatValue}>{stats.approvedCount}</Text>
              <Text style={styles.heroStatLabel}>Approved</Text>
           </View>
        </View>
      </LinearGradient>

      <View style={styles.content}>
        <View style={styles.actionGrid}>
          <TouchableOpacity style={styles.actionCard} onPress={() => navigation.navigate('VerifyDetail')}>
             <View style={[styles.actionIcon, { backgroundColor: '#8b5cf620' }]}>
               <Ionicons name="shield-checkmark" size={26} color="#8b5cf6" />
             </View>
             <Text style={styles.actionTitle}>Verification</Text>
             <Text style={styles.actionSub}>Review pipeline</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionCard} onPress={() => navigation.navigate('BroadcastNotice')}>
             <View style={[styles.actionIcon, { backgroundColor: '#ec489920' }]}>
               <Ionicons name="megaphone" size={26} color="#ec4899" />
             </View>
             <Text style={styles.actionTitle}>Announcements</Text>
             <Text style={styles.actionSub}>Broadcast info</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.sectionHeader}>
           <Text style={styles.sectionTitle}>Recent Student Activity</Text>
           <TouchableOpacity onPress={() => navigation.navigate('StudentManagement')}>
             <Text style={styles.seeAll}>Students</Text>
           </TouchableOpacity>
        </View>

        {loading ? (
          <ActivityIndicator size="small" color={COLORS.primary} style={{ marginTop: 20 }} />
        ) : (
          <FlatList
            data={students}
            renderItem={renderStudentItem}
            keyExtractor={item => (item.id || item._id).toString()}
            scrollEnabled={false}
            ListEmptyComponent={<Text style={styles.emptyText}>No active students found</Text>}
          />
        )}
      </View>
      
      <View style={{ height: 100 }} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bgPrimary },
  header: { padding: 25, paddingTop: 60, paddingBottom: 40, borderBottomLeftRadius: 32, borderBottomRightRadius: 32 },
  headerTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 30 },
  badge: { color: COLORS.secondary, fontSize: 10, fontWeight: '900', letterSpacing: 2, marginBottom: 5 },
  greeting: { color: '#fff', fontSize: 26, fontWeight: '800' },
  profileBtn: { padding: 2 },
  heroStats: { flexDirection: 'row', backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: 24, padding: 20, borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)' },
  heroStatItem: { flex: 1, alignItems: 'center' },
  heroStatValue: { color: '#fff', fontSize: 20, fontWeight: '900' },
  heroStatLabel: { color: 'rgba(255,255,255,0.6)', fontSize: 11, fontWeight: '700', marginTop: 4 },
  heroDivider: { width: 1, height: 25, backgroundColor: 'rgba(255,255,255,0.1)', alignSelf: 'center' },
  content: { padding: 20 },
  actionGrid: { flexDirection: 'row', gap: 15, marginBottom: 30 },
  actionCard: { flex: 1, backgroundColor: COLORS.bgCard, padding: 20, borderRadius: 24, borderWidth: 1, borderColor: COLORS.border },
  actionIcon: { width: 48, height: 48, borderRadius: 16, alignItems: 'center', justifyContent: 'center', marginBottom: 12 },
  actionTitle: { color: COLORS.textPrimary, fontSize: 14, fontWeight: '800' },
  actionSub: { color: COLORS.textMuted, fontSize: 10, marginTop: 2, fontWeight: '700' },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 },
  sectionTitle: { color: COLORS.textPrimary, fontSize: 18, fontWeight: '800' },
  seeAll: { color: COLORS.primary, fontSize: 13, fontWeight: '700' },
  studentCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.bgCard, padding: 15, borderRadius: 24, marginBottom: 12, borderWidth: 1, borderColor: COLORS.border },
  miniAvatar: { width: 44, height: 44, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  miniAvatarText: { color: COLORS.primary, fontWeight: '900', fontSize: 16 },
  studentName: { color: COLORS.textPrimary, fontSize: 15, fontWeight: '800' },
  studentDetail: { color: COLORS.textMuted, fontSize: 12, marginTop: 2, fontWeight: '600' },
  pointChip: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: COLORS.bgSecondary, paddingHorizontal: 10, paddingVertical: 5, borderRadius: 10 },
  pointText: { color: COLORS.textPrimary, fontSize: 13, fontWeight: '900' },
  emptyText: { color: COLORS.textMuted, textAlign: 'center', marginTop: 20, fontWeight: '700' },
});

export default FacultyDashboard;
