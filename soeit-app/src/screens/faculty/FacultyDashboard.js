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
  TextInput,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS } from '../../constants/colors';
import api from '../../services/api';
import { ROUTES } from '../../constants/api';
import { useAuth } from '../../context/AuthContext';

const { width } = Dimensions.get('window');

const FacultyDashboard = ({ navigation }) => {
  const { user } = useAuth();
  const [stats, setStats] = useState({ 
    totalStudents: 0, 
    pendingCount: 0, 
    approvedCount: 0,
    totalAchievements: 0 
  });
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [search, setSearch] = useState('');
  const [selectedSemester, setSelectedSemester] = useState('All');

  const fetchData = useCallback(async () => {
    try {
      const params = {
        limit: 50,
        search: search || undefined,
        semester: selectedSemester === 'All' ? undefined : selectedSemester
      };
      
      const [statsRes, studentsRes] = await Promise.all([
        api.get(ROUTES.ADMIN_STATS),
        api.get(ROUTES.ADMIN_STUDENTS, { params })
      ]);
      
      if (statsRes.data.success) {
        setStats(statsRes.data.stats);
      }
      
      if (studentsRes.data.success) {
        setStudents(studentsRes.data.data);
      }
    } catch (error) {
       console.error('Faculty Dashboard Fetch Error:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [search, selectedSemester]);

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
      onPress={() => navigation.navigate('StudentManagement', { studentId: item.id })}
    >
      <View style={styles.studentInfoLeft}>
        <LinearGradient colors={[COLORS.primary, '#1e293b']} style={styles.miniAvatar}>
          <Text style={styles.miniAvatarText}>{item.name[0]}</Text>
        </LinearGradient>
        <View style={{ marginLeft: 15 }}>
          <Text style={styles.studentName}>{item.name}</Text>
          <Text style={styles.studentDetail}>{item.enrollmentNo || 'SOEIT/22/001'}</Text>
          <Text style={styles.studentSubDetail}>Sem {item.semester} • {item.section}</Text>
        </View>
      </View>
      <View style={styles.studentStats}>
        <View style={styles.pointChip}>
          <Ionicons name="flash" size={12} color={COLORS.secondary} />
          <Text style={styles.pointText}>{item.achievementCounts?.points || 0}</Text>
        </View>
        <Text style={styles.verifiedText}>{item.achievementCounts?.approved || 0} Verify</Text>
      </View>
    </TouchableOpacity>
  );

  const StatBox = ({ label, value, icon, color }) => (
    <View style={styles.statBox}>
      <View style={[styles.statIcon, { backgroundColor: color + '15' }]}>
        <Ionicons name={icon} size={20} color={color} />
      </View>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <ScrollView 
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={COLORS.primary} />}
      >
        <LinearGradient colors={['#0f172a', '#1e293b']} style={styles.header}>
          <View style={styles.headerTop}>
            <View>
               <Text style={styles.badge}>SOEIT FACULTY</Text>
               <Text style={styles.greeting}>Hello, {user?.name?.split(' ')[0] || 'Faculty'}</Text>
               <Text style={styles.subGreeting}>Manage your student portfolios</Text>
            </View>
            <TouchableOpacity style={styles.profileBtn} onPress={() => navigation.navigate('Profile')}>
              <LinearGradient colors={['#ffffff20', '#ffffff10']} style={styles.avatarBorder}>
                <Ionicons name="person" size={24} color="#fff" />
              </LinearGradient>
            </TouchableOpacity>
          </View>

          <View style={styles.statsRow}>
            <StatBox label="Students" value={stats.totalStudents} icon="people" color="#3b82f6" />
            <StatBox label="Pending" value={stats.pendingCount} icon="time" color="#f59e0b" />
            <StatBox label="Approved" value={stats.approvedCount} icon="checkmark-circle" color="#10b981" />
          </View>
        </LinearGradient>

        <View style={styles.content}>
          <View style={styles.quickActions}>
            <TouchableOpacity 
              style={[styles.actionBtn, { backgroundColor: '#8b5cf6' }]}
              onPress={() => navigation.navigate('VerifyDetail')}
            >
              <Ionicons name="shield-checkmark" size={24} color="#fff" />
              <Text style={styles.actionBtnText}>Verify Queue</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.actionBtn, { backgroundColor: '#ec4899' }]}
              onPress={() => navigation.navigate('BroadcastNotice')}
            >
              <Ionicons name="megaphone" size={24} color="#fff" />
              <Text style={styles.actionBtnText}>Broadcast</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Student Directory</Text>
            <View style={styles.filterContainer}>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {['All', '1', '2', '3', '4', '5', '6', '7', '8'].map(sem => (
                  <TouchableOpacity 
                    key={sem} 
                    style={[styles.semFilter, selectedSemester === sem && styles.semFilterActive]}
                    onPress={() => setSelectedSemester(sem)}
                  >
                    <Text style={[styles.semFilterText, selectedSemester === sem && styles.semFilterTextActive]}>
                      {sem === 'All' ? 'All' : `Sem ${sem}`}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          </View>

          <View style={styles.searchBar}>
            <Ionicons name="search" size={20} color={COLORS.textMuted} />
            <TextInput
              placeholder="Search by name or enrollment..."
              placeholderTextColor={COLORS.textMuted}
              style={styles.searchInput}
              value={search}
              onChangeText={setSearch}
            />
          </View>

          {loading && !refreshing ? (
            <ActivityIndicator size="large" color={COLORS.primary} style={{ marginTop: 40 }} />
          ) : (
            <FlatList
              data={students}
              renderItem={renderStudentItem}
              keyExtractor={item => item.id}
              scrollEnabled={false}
              ListEmptyComponent={
                <View style={styles.emptyContainer}>
                  <Ionicons name="people-outline" size={48} color={COLORS.textMuted} />
                  <Text style={styles.emptyText}>No students found</Text>
                </View>
              }
            />
          )}
        </View>
        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Floating Export Button */}
      <TouchableOpacity style={styles.fab} onPress={() => Alert.alert('Export', 'Report generation started...')}>
        <Ionicons name="download" size={24} color="#fff" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },
  header: { padding: 25, paddingTop: 60, paddingBottom: 40, borderBottomLeftRadius: 35, borderBottomRightRadius: 35 },
  headerTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 30 },
  badge: { color: COLORS.secondary, fontSize: 10, fontWeight: '900', letterSpacing: 2, marginBottom: 5 },
  greeting: { color: '#fff', fontSize: 24, fontWeight: '800' },
  subGreeting: { color: 'rgba(255,255,255,0.6)', fontSize: 12, marginTop: 2 },
  avatarBorder: { width: 44, height: 44, borderRadius: 15, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: 'rgba(255,255,255,0.2)' },
  statsRow: { flexDirection: 'row', gap: 12 },
  statBox: { flex: 1, backgroundColor: 'rgba(255,255,255,0.1)', padding: 15, borderRadius: 20, alignItems: 'center', borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)' },
  statIcon: { width: 36, height: 36, borderRadius: 10, alignItems: 'center', justifyContent: 'center', marginBottom: 8 },
  statValue: { color: '#fff', fontSize: 18, fontWeight: '900' },
  statLabel: { color: 'rgba(255,255,255,0.5)', fontSize: 10, fontWeight: '700', marginTop: 2 },
  content: { padding: 20 },
  quickActions: { flexDirection: 'row', gap: 15, marginBottom: 30 },
  actionBtn: { flex: 1, padding: 18, borderRadius: 20, alignItems: 'center', flexDirection: 'row', justifyContent: 'center', gap: 8, elevation: 4, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 8 },
  actionBtnText: { color: '#fff', fontSize: 14, fontWeight: '800' },
  sectionHeader: { marginBottom: 20 },
  sectionTitle: { color: '#1e293b', fontSize: 18, fontWeight: '800', marginBottom: 15 },
  filterContainer: { marginBottom: 10 },
  semFilter: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 10, backgroundColor: '#fff', marginRight: 8, borderWidth: 1, borderColor: '#e2e8f0' },
  semFilterActive: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  semFilterText: { color: '#64748b', fontSize: 12, fontWeight: '700' },
  semFilterTextActive: { color: '#fff' },
  searchBar: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', paddingHorizontal: 15, borderRadius: 15, borderWidth: 1, borderColor: '#e2e8f0', marginBottom: 20 },
  searchInput: { flex: 1, paddingVertical: 12, marginLeft: 10, color: '#1e293b', fontWeight: '600' },
  studentCard: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#fff', padding: 15, borderRadius: 20, marginBottom: 12, borderWidth: 1, borderColor: '#e2e8f0' },
  studentInfoLeft: { flexDirection: 'row', alignItems: 'center' },
  miniAvatar: { width: 48, height: 48, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  miniAvatarText: { color: '#fff', fontWeight: '900', fontSize: 18 },
  studentName: { color: '#1e293b', fontSize: 15, fontWeight: '800' },
  studentDetail: { color: '#64748b', fontSize: 12, fontWeight: '600', marginTop: 2 },
  studentSubDetail: { color: COLORS.primary, fontSize: 11, fontWeight: '700', marginTop: 2 },
  studentStats: { alignItems: 'flex-end' },
  pointChip: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: '#fef3c7', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8, marginBottom: 5 },
  pointText: { color: '#92400e', fontSize: 12, fontWeight: '900' },
  verifiedText: { color: '#10b981', fontSize: 10, fontWeight: '800' },
  emptyContainer: { alignItems: 'center', marginTop: 50 },
  emptyText: { color: '#64748b', marginTop: 10, fontWeight: '700' },
  fab: { position: 'absolute', bottom: 30, right: 25, width: 56, height: 56, borderRadius: 28, backgroundColor: COLORS.primary, alignItems: 'center', justifyContent: 'center', elevation: 8, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 10 },
});

export default FacultyDashboard;
