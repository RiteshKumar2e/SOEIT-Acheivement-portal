import React, { useState, useEffect, useCallback } from 'react';
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  ProgressBarAndroid, // For Android progress or custom for both
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS } from '../../constants/colors';
import api from '../../services/api';

const CourseCard = ({ item }) => (
  <TouchableOpacity style={styles.card} activeOpacity={0.8}>
    <View style={styles.cardHeader}>
      <View style={styles.iconBox}>
        <Ionicons name="book-outline" size={24} color={COLORS.primary} />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={styles.title}>{item.name}</Text>
        <Text style={styles.instructor}>{item.instructor || 'Dr. Arjun Dev'}</Text>
      </View>
      <View style={styles.typeBadge}>
        <Text style={styles.typeText}>{item.code || 'CS50'}</Text>
      </View>
    </View>

    <View style={styles.progressContainer}>
      <View style={styles.progressMeta}>
        <Text style={styles.progressLabel}>Course Progress</Text>
        <Text style={styles.progressValue}>{item.progress || 65}%</Text>
      </View>
      <View style={styles.progressBar}>
        <View style={[styles.progressFill, { width: `${item.progress || 65}%` }]} />
      </View>
    </View>

    <View style={styles.footer}>
      <View style={styles.meta}>
        <Ionicons name="documents-outline" size={14} color={COLORS.textMuted} />
        <Text style={styles.metaText}>{item.modules || 12} Modules</Text>
      </View>
      <View style={styles.meta}>
        <Ionicons name="time-outline" size={14} color={COLORS.textMuted} />
        <Text style={styles.metaText}>{item.credits || 4} Credits</Text>
      </View>
      <TouchableOpacity style={styles.continueBtn}>
        <Text style={styles.continueText}>Resume</Text>
        <Ionicons name="chevron-forward" size={14} color={COLORS.primary} />
      </TouchableOpacity>
    </View>
  </TouchableOpacity>
);

const StudentCoursesPage = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchCourses = useCallback(async () => {
    try {
      const res = await api.get('/courses');
      setCourses(res.data.data || res.data.courses || []);
    } catch (error) {
      // API connection failed silently - show empty state
      setCourses([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchCourses();
  }, [fetchCourses]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchCourses();
  };

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color={COLORS.primary} style={{ marginTop: 50 }} />
      ) : (
        <FlatList
          data={courses}
          renderItem={({ item }) => <CourseCard item={item} />}
          keyExtractor={item => item.id.toString()}
          contentContainerStyle={styles.list}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={COLORS.primary} />
          }
          ListHeaderComponent={
            <View style={styles.header}>
              <Text style={styles.headerTitle}>Academic Courses</Text>
              <Text style={styles.headerSub}>Track your current semester learning path</Text>
            </View>
          }
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bgPrimary },
  list: { padding: 20 },
  header: { marginBottom: 20 },
  headerTitle: { color: COLORS.textPrimary, fontSize: 24, fontWeight: '800' },
  headerSub: { color: COLORS.textSecondary, fontSize: 14, marginTop: 4 },
  card: {
    backgroundColor: COLORS.bgCard,
    borderRadius: 24,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  cardHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
  iconBox: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: COLORS.primary + '15',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  title: { color: COLORS.textPrimary, fontSize: 17, fontWeight: '700' },
  instructor: { color: COLORS.textSecondary, fontSize: 13, marginTop: 2 },
  typeBadge: {
    backgroundColor: COLORS.bgSecondary,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  typeText: { color: COLORS.primary, fontSize: 11, fontWeight: '800' },
  progressContainer: { marginBottom: 20 },
  progressMeta: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  progressLabel: { color: COLORS.textMuted, fontSize: 12, fontWeight: '600' },
  progressValue: { color: COLORS.primary, fontSize: 12, fontWeight: '800' },
  progressBar: {
    height: 6,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: COLORS.primary,
    borderRadius: 3,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  meta: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  metaText: { color: COLORS.textMuted, fontSize: 12 },
  continueBtn: {
    marginLeft: 'auto',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  continueText: { color: COLORS.primary, fontSize: 13, fontWeight: '700' },
});

export default StudentCoursesPage;
