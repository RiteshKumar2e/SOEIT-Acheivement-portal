import React, { useState, useEffect, useCallback } from 'react';
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  RefreshControl,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS } from '../../constants/colors';
import api from '../../services/api';
import { format } from 'date-fns';

const EventsPage = () => {
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchNotices = useCallback(async () => {
    try {
      const res = await api.get('/notices');
      setNotices(res.data.data || []);
    } catch (error) {
      console.warn('Notices API unavailable:', error.message);
      setNotices([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchNotices();
  }, [fetchNotices]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchNotices();
  };

  const renderNotice = ({ item }) => (
    <View style={styles.noticeCard}>
      <View style={styles.priorityIndicator(item.priority)} />
      <View style={styles.noticeHeader}>
        <View style={[styles.typeBadge, { backgroundColor: item.type === 'Event' ? COLORS.primary + '20' : COLORS.secondary + '20' }]}>
          <Text style={[styles.typeText, { color: item.type === 'Event' ? COLORS.primary : COLORS.secondary }]}>
            {item.type.toUpperCase()}
          </Text>
        </View>
        <Text style={styles.timeText}>
          {format(new Date(item.createdAt), 'MMM dd, hh:mm a')}
        </Text>
      </View>
      <Text style={styles.noticeTitle}>{item.title}</Text>
      <Text style={styles.noticeContent}>{item.content}</Text>
      <TouchableOpacity style={styles.readMore}>
        <Text style={styles.readMoreText}>Mark as Read</Text>
        <Ionicons name="checkmark-done" size={16} color={COLORS.textMuted} />
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color={COLORS.primary} style={{ marginTop: 50 }} />
      ) : (
        <FlatList
          data={notices}
          renderItem={renderNotice}
          keyExtractor={item => item.id.toString()}
          contentContainerStyle={styles.list}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={COLORS.primary} />
          }
          ListHeaderComponent={
            <View style={styles.header}>
              <Text style={styles.headerSubtitle}>Official Broadcasts from Faculty</Text>
            </View>
          }
          ListEmptyComponent={
            <View style={{ alignItems: 'center', marginTop: 60 }}>
              <Ionicons name="notifications-off-outline" size={60} color={COLORS.border} />
              <Text style={{ color: COLORS.textPrimary, fontSize: 18, fontWeight: '700', marginTop: 16 }}>No Notices Yet</Text>
              <Text style={{ color: COLORS.textMuted, fontSize: 14, marginTop: 4, textAlign: 'center', paddingHorizontal: 40 }}>Faculty will post official notices and announcements here.</Text>
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
  headerSubtitle: { color: COLORS.textSecondary, fontSize: 14, fontWeight: '500' },
  noticeCard: {
    backgroundColor: COLORS.bgCard,
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    overflow: 'hidden',
  },
  priorityIndicator: (priority) => ({
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 4,
    backgroundColor: priority === 'high' ? COLORS.danger : priority === 'urgent' ? COLORS.warning : COLORS.primary,
  }),
  noticeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  typeBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  typeText: { fontSize: 11, fontWeight: '800', letterSpacing: 0.5 },
  timeText: { color: COLORS.textMuted, fontSize: 11 },
  noticeTitle: { color: COLORS.textPrimary, fontSize: 18, fontWeight: '700', marginBottom: 8 },
  noticeContent: { color: COLORS.textSecondary, fontSize: 14, lineHeight: 20, marginBottom: 16 },
  readMore: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    gap: 6,
  },
  readMoreText: { color: COLORS.textMuted, fontSize: 13, fontWeight: '600' },
});

export default EventsPage;
