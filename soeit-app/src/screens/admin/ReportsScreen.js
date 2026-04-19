import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  FlatList,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS } from '../../constants/colors';
import api from '../../services/api';

const ReportsScreen = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const res = await api.get('/admin/reports');
        setData(res.data);
      } catch (error) {
        console.error('Fetch reports error:', error);
        // Show empty data on error
        setData({ topPerformers: [], categoryStats: [] });
      } finally {
        setLoading(false);
      }
    };
    fetchReports();
  }, []);

  const renderLeaderboardItem = ({ item, index }) => (
    <View style={styles.leaderboardCard}>
      <View style={[styles.rankBadge, { backgroundColor: index < 3 ? COLORS.primary : COLORS.bgSecondary }]}>
        <Text style={[styles.rankText, { color: index < 3 ? '#fff' : COLORS.textMuted }]}>{index + 1}</Text>
      </View>
      <View style={{ flex: 1, marginLeft: 15 }}>
        <Text style={styles.studentName}>{item.student?.name}</Text>
        <Text style={styles.studentDept}>{item.student?.department} • ID: {item.student?.studentId}</Text>
      </View>
      <View style={styles.pointsBox}>
        <Text style={styles.pointsValue}>{item.totalPoints}</Text>
        <Text style={styles.pointsLabel}>Pts</Text>
      </View>
    </View>
  );

  if (loading) return <ActivityIndicator size="large" color={COLORS.primary} style={{ flex: 1 }} />;

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Reports & Analytics</Text>
        <Text style={styles.subtitle}>Institutional performance overview</Text>
      </View>

      <View style={styles.statsGrid}>
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>Total Points</Text>
          <Text style={styles.statValue}>
            {data?.topPerformers?.reduce((acc, p) => acc + p.totalPoints, 0) || 0}
          </Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>Top Score</Text>
          <Text style={[styles.statValue, { color: COLORS.secondary }]}>
            {data?.topPerformers?.[0]?.totalPoints || 0}
          </Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Performance Leaderboard</Text>
        <FlatList
          data={data?.topPerformers}
          renderItem={renderLeaderboardItem}
          keyExtractor={(item, index) => index.toString()}
          scrollEnabled={false}
          contentContainerStyle={{ marginTop: 15 }}
          ListEmptyComponent={
            <View style={{ alignItems: 'center', paddingVertical: 40 }}>
              <Ionicons name="bar-chart-outline" size={48} color={COLORS.border} />
              <Text style={{ color: COLORS.textMuted, marginTop: 12, fontWeight: '600' }}>No leaderboard data yet</Text>
              <Text style={{ color: COLORS.textMuted, fontSize: 12, marginTop: 4 }}>Data will appear once students have verified achievements</Text>
            </View>
          }
        />
      </View>

      <View style={styles.exportSection}>
        <TouchableOpacity style={styles.exportBtn} onPress={() => Alert.alert('Export', 'Generating PDF report...')}>
          <Ionicons name="download-outline" size={20} color="#fff" />
          <Text style={styles.exportText}>Download PDF Report</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.exportBtn, { backgroundColor: COLORS.bgCard, borderWidth: 1, borderColor: COLORS.border }]} onPress={() => Alert.alert('Export', 'Generating Excel report...')}>
          <Ionicons name="grid-outline" size={20} color={COLORS.textPrimary} />
          <Text style={[styles.exportText, { color: COLORS.textPrimary }]}>Export Excel</Text>
        </TouchableOpacity>
      </View>

      <View style={{ height: 40 }} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bgPrimary },
  header: { padding: 20, paddingTop: 30 },
  title: { fontSize: 26, fontWeight: '800', color: COLORS.textPrimary },
  subtitle: { fontSize: 14, color: COLORS.textSecondary, marginTop: 4 },
  statsGrid: { flexDirection: 'row', gap: 15, paddingHorizontal: 20, marginTop: 10 },
  statItem: {
    flex: 1,
    backgroundColor: COLORS.bgCard,
    padding: 20,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  statLabel: { fontSize: 12, fontWeight: '600', color: COLORS.textMuted, marginBottom: 5 },
  statValue: { fontSize: 24, fontWeight: '900', color: COLORS.primary },
  section: { paddingHorizontal: 20, marginTop: 30 },
  sectionTitle: { fontSize: 18, fontWeight: '800', color: COLORS.textPrimary },
  leaderboardCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.bgCard,
    padding: 15,
    borderRadius: 20,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  rankBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rankText: { fontWeight: '800', fontSize: 14 },
  studentName: { fontSize: 16, fontWeight: '700', color: COLORS.textPrimary },
  studentDept: { fontSize: 12, color: COLORS.textMuted, marginTop: 2 },
  pointsBox: { alignItems: 'flex-end', paddingLeft: 10 },
  pointsValue: { fontSize: 18, fontWeight: '900', color: COLORS.primary },
  pointsLabel: { fontSize: 10, color: COLORS.textMuted, fontWeight: '800', textTransform: 'uppercase' },
  exportSection: { padding: 20, gap: 12, marginTop: 20 },
  exportBtn: {
    backgroundColor: COLORS.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 15,
    gap: 10,
  },
  exportText: { color: '#fff', fontWeight: '800', fontSize: 15 },
});

export default ReportsScreen;
