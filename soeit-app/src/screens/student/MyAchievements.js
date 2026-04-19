import React, { useState, useEffect, useCallback } from 'react';
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  Image,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS } from '../../constants/colors';
import api from '../../services/api';
import { format } from 'date-fns';

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
        {status.charAt(0) + status.slice(1)}
      </Text>
    </View>
  );
};

const MyAchievements = ({ navigation }) => {
  const [achievements, setAchievements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchAchievements = useCallback(async () => {
    try {
      const res = await api.get('/achievements/my');
      setAchievements(res.data.data || []);
    } catch (error) {
      // API connection failed silently - show cached or empty state
      setAchievements([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchAchievements();
  }, [fetchAchievements]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchAchievements();
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.achievementCard}
      activeOpacity={0.7}
      onPress={() => {/* View Details */}}
    >
      <View style={styles.cardHeader}>
        <View style={styles.iconContainer}>
          <LinearGradient 
            colors={COLORS.categoryColors[item.category.toLowerCase()] ? [COLORS.categoryColors[item.category.toLowerCase()], COLORS.categoryColors[item.category.toLowerCase()] + 'CC'] : COLORS.gradientPrimary} 
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
        renderItem={renderItem}
        keyExtractor={item => item.id.toString()}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={COLORS.primary} />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="document-text-outline" size={80} color={COLORS.border} />
            <Text style={styles.emptyTitle}>No Achievements Yet</Text>
            <Text style={styles.emptyDesc}>Start by uploading your first achievement certificate</Text>
            <TouchableOpacity 
              style={styles.emptyBtn}
              onPress={() => navigation.navigate('Upload')}
            >
              <Text style={styles.emptyBtnText}>Upload Now</Text>
            </TouchableOpacity>
          </View>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bgPrimary },
  center: { flex: 1, backgroundColor: COLORS.bgPrimary, alignItems: 'center', justifyContent: 'center' },
  listContent: { padding: 20 },
  achievementCard: {
    backgroundColor: COLORS.bgCard,
    borderRadius: 20,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
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
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 100,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginTop: 20,
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
