import React, { useState, useEffect, useCallback } from 'react';
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  Linking,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS } from '../../constants/colors';
import api from '../../services/api';

const ProjectCard = ({ item }) => (
  <TouchableOpacity style={styles.card} activeOpacity={0.8}>
    <View style={styles.cardHeader}>
      <View style={styles.iconBox}>
        <Ionicons name="code-working" size={24} color={COLORS.primary} />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.techStack}>{item.techStack || 'React, Node.js, MongoDB'}</Text>
      </View>
      <TouchableOpacity 
        style={styles.linkBtn}
        onPress={() => item.githubLink && Linking.openURL(item.githubLink)}
      >
        <Ionicons name="logo-github" size={24} color={COLORS.textPrimary} />
      </TouchableOpacity>
    </View>

    <Text style={styles.description} numberOfLines={3}>
      {item.description || 'No description available for this project. This is a placeholder for development purposes.'}
    </Text>

    <View style={styles.statusRow}>
      <View style={[styles.statusBadge, { backgroundColor: item.status === 'Completed' ? '#10b981' + '20' : '#3b82f6' + '20' }]}>
        <Text style={[styles.statusText, { color: item.status === 'Completed' ? '#10b981' : '#3b82f6' }]}>
          {item.status || 'Active'}
        </Text>
      </View>
      <View style={styles.metaRow}>
        <Ionicons name="calendar-outline" size={14} color={COLORS.textMuted} />
        <Text style={styles.metaText}>{item.year || '2024'}</Text>
      </View>
      <TouchableOpacity style={styles.viewDetails}>
        <Text style={styles.viewText}>Full Case Study</Text>
        <Ionicons name="chevron-forward" size={12} color={COLORS.primary} />
      </TouchableOpacity>
    </View>
  </TouchableOpacity>
);

const StudentProjectsPage = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchProjects = useCallback(async () => {
    try {
      const res = await api.get('/projects');
      setProjects(res.data.data || res.data.projects || []);
    } catch (error) {
      // API connection failed silently - show empty state
      setProjects([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchProjects();
  };

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color={COLORS.primary} style={{ marginTop: 50 }} />
      ) : (
        <FlatList
          data={projects}
          renderItem={({ item }) => <ProjectCard item={item} />}
          keyExtractor={item => item.id.toString()}
          contentContainerStyle={styles.list}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={COLORS.primary} />
          }
          ListHeaderComponent={
            <View style={styles.header}>
              <Text style={styles.headerTitle}>Professional Projects</Text>
              <Text style={styles.headerSub}>Technical portfolio built during your course</Text>
            </View>
          }
          ListEmptyComponent={
            <View style={styles.empty}>
              <Ionicons name="code-slash" size={80} color={COLORS.border} />
              <Text style={styles.emptyTitle}>Project Galaxy is empty</Text>
              <Text style={styles.emptyDesc}>Launch your first project today!</Text>
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
  cardHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  iconBox: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: COLORS.primary + '15',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  title: { color: COLORS.textPrimary, fontSize: 18, fontWeight: '800' },
  techStack: { color: COLORS.primary, fontSize: 12, fontWeight: '600', marginTop: 2 },
  description: { color: COLORS.textSecondary, fontSize: 13, lineHeight: 18, marginBottom: 20 },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    gap: 16,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 8,
  },
  statusText: { fontSize: 11, fontWeight: '800' },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  metaText: { color: COLORS.textMuted, fontSize: 12, fontWeight: '600' },
  viewDetails: {
    marginLeft: 'auto',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  viewText: { color: COLORS.primary, fontSize: 12, fontWeight: '700' },
  empty: { alignItems: 'center', marginTop: 100 },
  emptyTitle: { color: COLORS.textPrimary, fontSize: 20, fontWeight: '700', marginTop: 20 },
  emptyDesc: { color: COLORS.textMuted, fontSize: 14, marginTop: 6 },
});

export default StudentProjectsPage;
