import React, { useState, useEffect, useCallback } from 'react';
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  Platform,
  TextInput,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS } from '../../constants/colors';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { format } from 'date-fns';

const STATUSES = ['All', 'pending', 'approved', 'rejected'];
const CATEGORIES = ['All', 'Academic', 'Sports', 'Cultural', 'Technical', 'Research', 'Internship', 'Certification', 'Competition', 'Other'];

const StatusBadge = ({ status }) => {
  const isVerified = status === 'verified' || status === 'approved';
  const isPending = status === 'pending';
  const isRejected = status === 'rejected';

  return (
    <View style={[
      styles.badge, 
      isVerified && styles.badgeVerified,
      isPending && styles.badgePending,
      isRejected && styles.badgeRejected
    ]}>
      <Ionicons 
        name={isVerified ? 'checkmark-circle' : isPending ? 'time' : 'close-circle'} 
        size={14} 
        color={isVerified ? '#10b981' : isPending ? '#f59e0b' : '#ef4444'} 
      />
      <Text style={[
        styles.badgeText,
        isVerified && { color: '#10b981' },
        isPending && { color: '#f59e0b' },
        isRejected && { color: '#ef4444' },
      ]}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Text>
    </View>
  );
};

const MyAchievements = ({ navigation, route }) => {
  const { user } = useAuth();
  const [achievements, setAchievements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Determine if this is the "All Achievements" view (faculty/admin)
  const isAllView = route?.name === 'AllAchievements';
  const isStaff = user?.role === 'admin' || user?.role === 'faculty';
  const showAllAchievements = isAllView && isStaff;

  // Filters for All Achievements view
  const [statusFilter, setStatusFilter] = useState('All');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const fetchAchievements = useCallback(async () => {
    try {
      if (showAllAchievements) {
        // Faculty/Admin: fetch all student achievements
        const params = { limit: 50 };
        if (statusFilter !== 'All') params.status = statusFilter;
        if (categoryFilter !== 'All') params.category = categoryFilter;
        if (searchQuery.trim()) params.search = searchQuery.trim();
        const res = await api.get('/admin/achievements', { params });
        setAchievements(res.data.data || []);
      } else {
        // Student: fetch own achievements
        const res = await api.get('/achievements/my');
        setAchievements(res.data.data || []);
      }
    } catch (error) {
      console.warn('Achievements API:', error.message);
      setAchievements([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [showAllAchievements, statusFilter, categoryFilter]);

  useEffect(() => {
    setLoading(true);
    fetchAchievements();
  }, [fetchAchievements]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchAchievements();
  };

  const handleSearch = () => {
    setLoading(true);
    fetchAchievements();
  };

  const getCategoryGradient = (category) => {
    const cat = category?.toLowerCase();
    if (COLORS.categoryColors[cat]) {
      return [COLORS.categoryColors[cat], COLORS.categoryColors[cat] + 'CC'];
    }
    return COLORS.gradientPrimary;
  };

  // --- Render: Student's own achievement card ---
  const renderStudentCard = ({ item }) => (
    <TouchableOpacity 
      style={styles.achievementCard}
      activeOpacity={0.7}
      onPress={() => {/* View Details */}}
    >
      <View style={styles.cardHeader}>
        <View style={styles.iconContainer}>
          <LinearGradient 
            colors={getCategoryGradient(item.category)}
            style={styles.categoryIcon}
          >
            <Ionicons name="trophy" size={24} color="#fff" />
          </LinearGradient>
        </View>
        <View style={styles.headerContent}>
          <Text style={styles.achTitle} numberOfLines={1}>{item.title}</Text>
          <Text style={styles.achSub}>{item.level} Achievement</Text>
        </View>
        <StatusBadge status={item.status} />
      </View>
      
      <View style={styles.cardFooter}>
        <View style={styles.footerInfo}>
          <Ionicons name="calendar-outline" size={14} color={COLORS.textMuted} />
          <Text style={styles.footerText}>
            {item.date ? format(new Date(item.date), 'MMMM dd, yyyy') : 'No Date'}
          </Text>
        </View>
        <View style={styles.footerInfo}>
          <Ionicons name="bookmark-outline" size={14} color={COLORS.textMuted} />
          <Text style={styles.footerText}>{item.category}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  // --- Render: All Achievements card (faculty/admin view) ---
  const renderAllCard = ({ item }) => {
    const studentName = item.student?.name || item.user?.name || 'Unknown';
    const studentId = item.student?.idNumber || item.student?.enrollmentNo || item.user?.enrollmentNo || '';
    const department = item.student?.department || item.user?.department || '';
    const points = item.status === 'approved' ? item.points : 0;

    return (
      <View style={styles.allCard}>
        {/* Priority strip */}
        <View style={[
          styles.statusStrip,
          item.status === 'approved' && { backgroundColor: '#10b981' },
          item.status === 'pending' && { backgroundColor: '#f59e0b' },
          item.status === 'rejected' && { backgroundColor: '#ef4444' },
        ]} />

        <View style={styles.allCardBody}>
          {/* Top row: Title + Status */}
          <View style={styles.allCardTop}>
            <View style={{ flex: 1 }}>
              <Text style={styles.allCardTitle} numberOfLines={2}>{item.title}</Text>
              <View style={styles.levelBadge}>
                <Ionicons name="ribbon-outline" size={12} color={COLORS.primary} />
                <Text style={styles.levelText}>{item.level} • {item.category}</Text>
              </View>
            </View>
            <StatusBadge status={item.status} />
          </View>

          {/* Student info */}
          <View style={styles.studentRow}>
            <View style={styles.studentAvatar}>
              <Text style={styles.studentAvatarText}>{studentName.charAt(0)}</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.studentName}>{studentName}</Text>
              {studentId ? <Text style={styles.studentId}>#{studentId}</Text> : null}
            </View>
            {department ? (
              <View style={styles.deptBadge}>
                <Text style={styles.deptBadgeText}>{department}</Text>
              </View>
            ) : null}
          </View>

          {/* Bottom row: Date + Points */}
          <View style={styles.allCardBottom}>
            <View style={styles.footerInfo}>
              <Ionicons name="calendar-outline" size={13} color={COLORS.textMuted} />
              <Text style={styles.footerText}>
                {item.createdAt ? format(new Date(item.createdAt), 'MMM dd, yyyy') : item.date ? format(new Date(item.date), 'MMM dd, yyyy') : '-'}
              </Text>
            </View>
            <View style={styles.pointsBadge}>
              <Ionicons name="star" size={13} color={points > 0 ? COLORS.primary : COLORS.textMuted} />
              <Text style={[styles.pointsText, points > 0 && { color: COLORS.primary }]}>
                {points > 0 ? `+${points} pts` : '0 pts'}
              </Text>
            </View>
          </View>
        </View>
      </View>
    );
  };

  // --- Header for All Achievements view ---
  const renderAllHeader = () => (
    <View style={styles.allHeader}>
      <Text style={styles.allHeaderSubtitle}>
        View and manage all uploaded achievements.
      </Text>

      {/* Search */}
      <View style={styles.searchContainer}>
        <Ionicons name="search-outline" size={18} color={COLORS.textMuted} style={{ marginLeft: 14 }} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search name, enrollment..."
          placeholderTextColor={COLORS.textMuted}
          value={searchQuery}
          onChangeText={setSearchQuery}
          onSubmitEditing={handleSearch}
          returnKeyType="search"
        />
        {searchQuery ? (
          <TouchableOpacity onPress={() => { setSearchQuery(''); setTimeout(handleSearch, 100); }} style={{ marginRight: 10 }}>
            <Ionicons name="close-circle" size={18} color={COLORS.textMuted} />
          </TouchableOpacity>
        ) : null}
      </View>

      {/* Status Filter */}
      <Text style={styles.filterLabel}>Status</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipRow}>
        {STATUSES.map((s) => (
          <TouchableOpacity
            key={s}
            style={[styles.filterChip, statusFilter === s && styles.filterChipActive]}
            onPress={() => setStatusFilter(s)}
          >
            <Text style={[styles.filterChipText, statusFilter === s && styles.filterChipTextActive]}>
              {s === 'All' ? 'All' : s.charAt(0).toUpperCase() + s.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Category Filter */}
      <Text style={styles.filterLabel}>Category</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipRow}>
        {CATEGORIES.map((c) => (
          <TouchableOpacity
            key={c}
            style={[styles.filterChip, categoryFilter === c && styles.filterChipActive]}
            onPress={() => setCategoryFilter(c)}
          >
            <Text style={[styles.filterChipText, categoryFilter === c && styles.filterChipTextActive]}>
              {c}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Results count */}
      <View style={styles.resultsBar}>
        <Text style={styles.resultsText}>
          Showing <Text style={{ fontWeight: '800', color: COLORS.textPrimary }}>{achievements.length}</Text> achievements
        </Text>
      </View>
    </View>
  );

  // --- Header for Student view ---
  const renderStudentHeader = () => null;

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={achievements}
        renderItem={showAllAchievements ? renderAllCard : renderStudentCard}
        keyExtractor={item => (item._id || item.id)?.toString()}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={COLORS.primary} />
        }
        ListHeaderComponent={showAllAchievements ? renderAllHeader : renderStudentHeader}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <View style={styles.emptyIconWrap}>
              <Ionicons name={showAllAchievements ? 'trophy-outline' : 'document-text-outline'} size={50} color={COLORS.border} />
            </View>
            <Text style={styles.emptyTitle}>
              {showAllAchievements ? 'No Records Found' : 'No Achievements Yet'}
            </Text>
            <Text style={styles.emptyDesc}>
              {showAllAchievements
                ? 'Try changing filters or search query.'
                : 'Start by uploading your first achievement certificate'}
            </Text>
            {!showAllAchievements && (
              <TouchableOpacity 
                style={styles.emptyBtn}
                onPress={() => navigation.navigate('Upload')}
              >
                <Text style={styles.emptyBtnText}>Upload Now</Text>
              </TouchableOpacity>
            )}
          </View>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bgPrimary },
  center: { flex: 1, backgroundColor: COLORS.bgPrimary, alignItems: 'center', justifyContent: 'center' },
  listContent: { padding: 16, paddingBottom: 40 },

  // === Student Card Styles ===
  achievementCard: {
    backgroundColor: COLORS.bgCard,
    borderRadius: 20,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    elevation: 4,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
      },
      web: {
        boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
      },
    }),
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  iconContainer: {
    marginRight: 12,
  },
  categoryIcon: {
    width: 48,
    height: 48,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerContent: { flex: 1 },
  achTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  achSub: {
    fontSize: 12,
    color: COLORS.textMuted,
    marginTop: 2,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    backgroundColor: 'rgba(255,255,255,0.05)',
  },
  badgeVerified: { backgroundColor: 'rgba(16, 185, 129, 0.1)' },
  badgePending: { backgroundColor: 'rgba(245, 158, 11, 0.1)' },
  badgeRejected: { backgroundColor: 'rgba(239, 68, 68, 0.1)' },
  badgeText: {
    fontSize: 11,
    fontWeight: '700',
    marginLeft: 4,
    textTransform: 'uppercase',
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  footerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  footerText: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginLeft: 6,
  },

  // === All Achievements Header ===
  allHeader: {
    marginBottom: 8,
  },
  allHeaderSubtitle: {
    fontSize: 14,
    color: COLORS.textSecondary,
    fontWeight: '500',
    marginBottom: 16,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.bgCard,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: 16,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 10,
    fontSize: 14,
    color: COLORS.textPrimary,
  },
  filterLabel: {
    fontSize: 12,
    fontWeight: '800',
    color: COLORS.textMuted,
    letterSpacing: 0.5,
    marginBottom: 8,
    marginTop: 4,
  },
  chipRow: {
    gap: 8,
    paddingBottom: 12,
  },
  filterChip: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 18,
    backgroundColor: COLORS.bgCard,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  filterChipActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  filterChipText: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.textSecondary,
  },
  filterChipTextActive: {
    color: '#fff',
  },
  resultsBar: {
    marginTop: 4,
    marginBottom: 12,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  resultsText: {
    fontSize: 13,
    color: COLORS.textMuted,
    fontWeight: '600',
  },

  // === All Card (Faculty/Admin view) ===
  allCard: {
    backgroundColor: COLORS.bgCard,
    borderRadius: 18,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: COLORS.border,
    overflow: 'hidden',
    flexDirection: 'row',
  },
  statusStrip: {
    width: 4,
    backgroundColor: COLORS.textMuted,
  },
  allCardBody: {
    flex: 1,
    padding: 16,
    gap: 12,
  },
  allCardTop: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
  },
  allCardTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.textPrimary,
    lineHeight: 21,
    marginBottom: 4,
  },
  levelBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  levelText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.textMuted,
  },
  studentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: COLORS.borderLight,
  },
  studentAvatar: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: COLORS.primary + '15',
    alignItems: 'center',
    justifyContent: 'center',
  },
  studentAvatarText: {
    fontSize: 13,
    fontWeight: '800',
    color: COLORS.primary,
  },
  studentName: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  studentId: {
    fontSize: 11,
    color: COLORS.textMuted,
    fontWeight: '600',
  },
  deptBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    backgroundColor: COLORS.primary + '12',
  },
  deptBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: COLORS.primary,
    letterSpacing: 0.3,
  },
  allCardBottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  pointsBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  pointsText: {
    fontSize: 13,
    fontWeight: '800',
    color: COLORS.textMuted,
  },

  // === Empty State ===
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 80,
  },
  emptyIconWrap: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: COLORS.primary + '08',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginTop: 4,
  },
  emptyDesc: {
    fontSize: 14,
    color: COLORS.textMuted,
    marginTop: 6,
    textAlign: 'center',
    paddingHorizontal: 40,
  },
  emptyBtn: {
    marginTop: 24,
    backgroundColor: COLORS.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },
  emptyBtnText: {
    color: '#fff',
    fontWeight: '700',
  },
});

export default MyAchievements;
