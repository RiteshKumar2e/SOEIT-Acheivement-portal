import React, { useState, useEffect, useCallback } from 'react';
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  TextInput,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';
import api from '../../services/api';
import { ROUTES } from '../../constants/api';

const FacultyManagementScreen = () => {
  const [faculty, setFaculty] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [search, setSearch] = useState('');

  const fetchFaculty = useCallback(async () => {
    try {
      const res = await api.get(ROUTES.ADMIN_FACULTY, { params: { search } });
      setFaculty(res.data.data || []);
    } catch (error) {
      console.error('Fetch faculty error:', error);
      setFaculty([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [search]);

  useEffect(() => {
    fetchFaculty();
  }, [fetchFaculty]);

  const toggleStatus = async (item) => {
    try {
      await api.put(`${ROUTES.ADMIN_USERS}/${item.id}`, { isActive: !item.isActive });
      Alert.alert('Success', `Access ${!item.isActive ? 'granted' : 'revoked'} for ${item.name}`);
      fetchFaculty();
    } catch (_) {
      Alert.alert('Error', 'Failed to update status');
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{item.name[0]}</Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.name}>{item.name}</Text>
          <Text style={styles.email}>{item.email}</Text>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: item.isActive ? COLORS.success + '15' : COLORS.danger + '15' }]}>
          <Text style={[styles.statusText, { color: item.isActive ? COLORS.success : COLORS.danger }]}>
            {item.isActive ? 'ACTIVE' : 'INACTIVE'}
          </Text>
        </View>
      </View>
      <View style={styles.cardActions}>
        <View style={styles.deptBadge}>
          <Text style={styles.deptText}>Dept: {item.department || 'General'}</Text>
        </View>
        <TouchableOpacity 
          style={[styles.toggleBtn, { backgroundColor: item.isActive ? COLORS.danger : COLORS.success }]}
          onPress={() => toggleStatus(item)}
        >
          <Ionicons name={item.isActive ? 'lock-closed' : 'lock-open'} size={16} color="#fff" />
          <Text style={styles.toggleText}>{item.isActive ? 'Disable' : 'Enable'}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.searchBox}>
          <Ionicons name="search" size={20} color={COLORS.textMuted} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search faculty..."
            placeholderTextColor={COLORS.textMuted}
            value={search}
            onChangeText={setSearch}
          />
        </View>
      </View>

      <FlatList
        data={faculty}
        renderItem={renderItem}
        keyExtractor={item => (item.id || item._id).toString()}
        contentContainerStyle={styles.list}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={fetchFaculty} tintColor={COLORS.primary} />}
        ListEmptyComponent={
          !loading && (
            <View style={{ alignItems: 'center', marginTop: 60 }}>
              <Ionicons name="school-outline" size={60} color={COLORS.border} />
              <Text style={{ color: COLORS.textPrimary, fontSize: 18, fontWeight: '700', marginTop: 16 }}>No Faculty Registered</Text>
              <Text style={{ color: COLORS.textMuted, fontSize: 14, marginTop: 4, textAlign: 'center', paddingHorizontal: 40 }}>Faculty accounts will appear here once they register.</Text>
            </View>
          )
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bgPrimary },
  header: { padding: 20 },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.bgCard,
    paddingHorizontal: 15,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: COLORS.border,
    height: 50,
  },
  searchInput: { flex: 1, color: COLORS.textPrimary, marginLeft: 10, fontSize: 16 },
  list: { padding: 20, paddingTop: 0 },
  card: {
    backgroundColor: COLORS.bgCard,
    borderRadius: 24,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  cardHeader: { flexDirection: 'row', alignItems: 'center' },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: COLORS.secondary + '15',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 15,
  },
  avatarText: { color: COLORS.secondary, fontSize: 20, fontWeight: '800' },
  name: { color: COLORS.textPrimary, fontSize: 16, fontWeight: '700' },
  email: { color: COLORS.textMuted, fontSize: 12, marginTop: 2 },
  statusBadge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
  statusText: { fontSize: 10, fontWeight: '900' },
  cardActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 20,
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  deptBadge: { backgroundColor: COLORS.bgSecondary, paddingHorizontal: 10, paddingVertical: 5, borderRadius: 8 },
  deptText: { color: COLORS.textSecondary, fontSize: 12, fontWeight: '700' },
  toggleBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 10,
  },
  toggleText: { color: '#fff', fontWeight: '800', fontSize: 13 },
});

export default FacultyManagementScreen;
