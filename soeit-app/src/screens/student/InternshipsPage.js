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
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS } from '../../constants/colors';
import api from '../../services/api';
import { INTERNSHIPS as DEMO_INTERNSHIPS } from '../../constants/internships';

const InternshipsPage = () => {
  const [internships, setInternships] = useState(DEMO_INTERNSHIPS);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchInternships = useCallback(async () => {
    try {
      const res = await api.get('/internships');
      if (res.data && res.data.internships) {
        setInternships(res.data.internships);
      }
    } catch (error) {
      console.warn('Internships fetch failed:', error.message);
      // Fallback to demo data if the API fails (especially for 401 in demo mode)
      if (internships.length === 0) setInternships(DEMO_INTERNSHIPS);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [internships.length]);

  useEffect(() => {
    fetchInternships();
  }, [fetchInternships]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchInternships();
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity style={styles.card} activeOpacity={0.8}>
      <View style={styles.cardHeader}>
        <View style={styles.logoContainer}>
          <Image source={{ uri: item.logo || 'https://via.placeholder.com/60' }} style={styles.logo} />
        </View>
        <View style={styles.headerInfo}>
          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.company}>{item.company}</Text>
        </View>
        <TouchableOpacity style={styles.bookmark}>
          <Ionicons name="bookmark-outline" size={20} color={COLORS.textMuted} />
        </TouchableOpacity>
      </View>

      <View style={styles.metaRow}>
        <View style={styles.metaBox}>
          <Ionicons name="location-outline" size={14} color={COLORS.textSecondary} />
          <Text style={styles.metaText}>{item.location}</Text>
        </View>
        <View style={styles.metaBox}>
          <Ionicons name="cash-outline" size={14} color={COLORS.textSecondary} />
          <Text style={styles.metaText}>{item.stipend}</Text>
        </View>
      </View>

      <View style={styles.typeRow}>
        <View style={styles.typeBadge}>
          <Text style={styles.typeText}>{item.type}</Text>
        </View>
        <View style={styles.typeBadge}>
          <Text style={styles.typeText}>{item.duration}</Text>
        </View>
        <TouchableOpacity style={styles.applyBtn}>
          <Text style={styles.applyBtnText}>Apply Now</Text>
          <Ionicons name="arrow-forward" size={14} color="#fff" />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color={COLORS.primary} style={{ marginTop: 50 }} />
      ) : (
        <FlatList
          data={internships}
          renderItem={renderItem}
          keyExtractor={item => item.id.toString()}
          contentContainerStyle={styles.list}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={COLORS.primary} />
          }
          ListHeaderComponent={
            <View style={styles.header}>
              <Text style={styles.headerTitle}>Student Internships Hub</Text>
              <Text style={styles.headerSub}>Exclusive opportunities for SOEIT students</Text>
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
  header: { marginBottom: 24, paddingTop: 10 },
  headerTitle: { color: COLORS.textPrimary, fontSize: 24, fontWeight: '800' },
  headerSub: { color: COLORS.textSecondary, fontSize: 14, marginTop: 4 },
  card: {
    backgroundColor: COLORS.bgCard,
    borderRadius: 24,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  cardHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  logoContainer: {
    width: 50,
    height: 50,
    borderRadius: 14,
    backgroundColor: '#fff',
    padding: 4,
    marginRight: 16,
  },
  logo: { width: '100%', height: '100%', borderRadius: 10 },
  headerInfo: { flex: 1 },
  title: { color: COLORS.textPrimary, fontSize: 17, fontWeight: '700' },
  company: { color: COLORS.textSecondary, fontSize: 13, marginTop: 2 },
  bookmark: { padding: 4 },
  metaRow: { flexDirection: 'row', marginBottom: 20, gap: 16 },
  metaBox: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  metaText: { color: COLORS.textSecondary, fontSize: 12 },
  typeRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  typeBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  typeText: { color: COLORS.textSecondary, fontSize: 12, fontWeight: '600' },
  applyBtn: {
    marginLeft: 'auto',
    backgroundColor: COLORS.primary,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 10,
    gap: 6,
  },
  applyBtnText: { color: '#fff', fontSize: 12, fontWeight: '700' },
});

export default InternshipsPage;
