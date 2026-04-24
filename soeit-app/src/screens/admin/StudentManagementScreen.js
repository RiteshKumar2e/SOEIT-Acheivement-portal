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
  ScrollView,
  Modal,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';
import api from '../../services/api';
import { ROUTES } from '../../constants/api';

const StudentManagementScreen = ({ navigation }) => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [search, setSearch] = useState('');
  const [semester, setSemester] = useState('all');

  // Edit Modal State
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [editForm, setEditForm] = useState({
    name: '',
    enrollmentNo: '',
    semester: '',
    section: '',
    department: '',
  });
  const [updating, setUpdating] = useState(false);

  const fetchStudents = useCallback(async () => {
    try {
      const params = {
        semester: semester === 'all' ? undefined : semester,
        search: search || undefined,
        limit: 100
      };
      const res = await api.get(ROUTES.ADMIN_STUDENTS, { params });
      setStudents(res.data.data || []);
    } catch (error) {
      console.error('Fetch students error:', error);
      setStudents([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [search, semester]);

  useEffect(() => {
    fetchStudents();
  }, [fetchStudents]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchStudents();
  };

  const handleView = (student) => {
    navigation.navigate('Portfolio', { userId: student.id || student._id });
  };

  const handleEdit = (student) => {
    setSelectedStudent(student);
    setEditForm({
      name: student.name || '',
      enrollmentNo: student.enrollmentNo || '',
      semester: student.semester?.toString() || '',
      section: student.section || '',
      department: student.department || '',
    });
    setEditModalVisible(true);
  };

  const handleUpdate = async () => {
    if (!editForm.name) {
      Alert.alert('Error', 'Name is required');
      return;
    }

    setUpdating(true);
    try {
      const studentId = selectedStudent.id || selectedStudent._id;
      // Using /admin/users/:id as seen in frontend adminAPI.manageUser
      await api.put(`/admin/users/${studentId}`, {
        name: editForm.name,
        enrollmentNo: editForm.enrollmentNo,
        semester: parseInt(editForm.semester),
        section: editForm.section,
        department: editForm.department,
      });

      Alert.alert('Success', 'Student information updated successfully');
      setEditModalVisible(false);
      fetchStudents(); // Refresh list
    } catch (error) {
      console.error('Update student error:', error);
      Alert.alert('Error', 'Failed to update student information');
    } finally {
      setUpdating(false);
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.cardContent}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{item.name?.[0] || 'S'}</Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.name}>{item.name}</Text>
          <Text style={styles.detail}>
            {item.enrollmentNo || 'ID: ' + (item.id || item._id).substring(0, 8)} • Sem {item.semester} {item.section ? `• ${item.section}` : ''}
          </Text>
        </View>
        <View style={styles.stats}>
          <Text style={styles.points}>{item.achievementCounts?.points || 0}</Text>
          <Text style={styles.statLabel}>Pts</Text>
        </View>
      </View>
      <View style={styles.cardFooter}>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{item.achievementCounts?.approved || 0} Approved</Text>
        </View>
        <View style={styles.actionRow}>
          <TouchableOpacity 
            style={styles.actionBtn}
            onPress={() => handleView(item)}
          >
            <Ionicons name="eye-outline" size={18} color={COLORS.primary} />
            <Text style={styles.actionText}>View</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <View style={styles.searchInputWrapper}>
          <Ionicons name="search" size={20} color={COLORS.textMuted} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search by name or ID..."
            placeholderTextColor={COLORS.textMuted}
            value={search}
            onChangeText={setSearch}
          />
          {search ? (
            <TouchableOpacity onPress={() => setSearch('')}>
              <Ionicons name="close-circle" size={20} color={COLORS.textMuted} />
            </TouchableOpacity>
          ) : null}
        </View>
      </View>

      <View style={styles.filterBar}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <TouchableOpacity 
            style={[styles.filterBtn, semester === 'all' && styles.filterBtnActive]} 
            onPress={() => setSemester('all')}
          >
            <Text style={[styles.filterText, semester === 'all' && styles.filterTextActive]}>All Semesters</Text>
          </TouchableOpacity>
          {[1, 2, 3, 4, 5, 6, 7, 8].map(s => (
            <TouchableOpacity 
              key={s}
              style={[styles.filterBtn, semester === s.toString() && styles.filterBtnActive]} 
              onPress={() => setSemester(s.toString())}
            >
              <Text style={[styles.filterText, semester === s.toString() && styles.filterTextActive]}>Sem {s}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <FlatList
        data={students}
        renderItem={renderItem}
        keyExtractor={item => (item.id || item._id).toString()}
        contentContainerStyle={styles.list}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={COLORS.primary} />}
        ListEmptyComponent={
          loading ? (
            <ActivityIndicator size="large" color={COLORS.primary} style={{ marginTop: 50 }} />
          ) : (
            <View style={styles.emptyContainer}>
              <Ionicons name="people-outline" size={60} color={COLORS.textMuted} />
              <Text style={styles.emptyTitle}>No Students Found</Text>
              <Text style={styles.emptySub}>Try adjusting your search or filters</Text>
            </View>
          )
        }
      />

      {/* Edit Student Modal */}
      <Modal
        visible={editModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setEditModalVisible(false)}
      >
        <KeyboardAvoidingView 
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.modalOverlay}
        >
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Edit Student Info</Text>
              <TouchableOpacity onPress={() => setEditModalVisible(false)}>
                <Ionicons name="close" size={24} color={COLORS.textPrimary} />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalBody} showsVerticalScrollIndicator={false}>
              <Text style={styles.label}>Full Name</Text>
              <TextInput
                style={styles.input}
                value={editForm.name}
                onChangeText={(text) => setEditForm({...editForm, name: text})}
                placeholder="Student Name"
                placeholderTextColor={COLORS.textMuted}
              />

              <Text style={styles.label}>Enrollment Number</Text>
              <TextInput
                style={styles.input}
                value={editForm.enrollmentNo}
                onChangeText={(text) => setEditForm({...editForm, enrollmentNo: text})}
                placeholder="AJU/..."
                placeholderTextColor={COLORS.textMuted}
              />

              <View style={styles.inputRow}>
                <View style={{ flex: 1, marginRight: 10 }}>
                  <Text style={styles.label}>Semester</Text>
                  <TextInput
                    style={styles.input}
                    value={editForm.semester}
                    onChangeText={(text) => setEditForm({...editForm, semester: text})}
                    placeholder="1-8"
                    placeholderTextColor={COLORS.textMuted}
                    keyboardType="numeric"
                  />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.label}>Section</Text>
                  <TextInput
                    style={styles.input}
                    value={editForm.section}
                    onChangeText={(text) => setEditForm({...editForm, section: text})}
                    placeholder="A, B, C..."
                    placeholderTextColor={COLORS.textMuted}
                    autoCapitalize="characters"
                  />
                </View>
              </View>

              <Text style={styles.label}>Department</Text>
              <TextInput
                style={styles.input}
                value={editForm.department}
                onChangeText={(text) => setEditForm({...editForm, department: text})}
                placeholder="CSE, ME, BCA..."
                placeholderTextColor={COLORS.textMuted}
                autoCapitalize="characters"
              />

              <TouchableOpacity 
                style={[styles.saveBtn, updating && styles.disabledBtn]}
                onPress={handleUpdate}
                disabled={updating}
              >
                {updating ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.saveBtnText}>Update Student Information</Text>
                )}
              </TouchableOpacity>
              
              <View style={{ height: 40 }} />
            </ScrollView>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bgPrimary },
  searchContainer: { padding: 20, paddingTop: 10 },
  searchInputWrapper: {
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
  filterBar: { paddingHorizontal: 15, marginBottom: 15 },
  filterBtn: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 10,
    marginHorizontal: 5,
    backgroundColor: COLORS.bgCard,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  filterBtnActive: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  filterText: { color: COLORS.textSecondary, fontWeight: '700', fontSize: 13 },
  filterTextActive: { color: '#fff' },
  list: { padding: 20, paddingTop: 0 },
  card: {
    backgroundColor: COLORS.bgCard,
    borderRadius: 24,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  cardContent: { flexDirection: 'row', alignItems: 'center' },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 15,
    backgroundColor: COLORS.primary + '15',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 15,
  },
  avatarText: { color: COLORS.primary, fontSize: 20, fontWeight: '800' },
  name: { color: COLORS.textPrimary, fontSize: 17, fontWeight: '700' },
  detail: { color: COLORS.textMuted, fontSize: 12, marginTop: 2 },
  stats: { alignItems: 'center', minWidth: 50 },
  points: { color: COLORS.primary, fontSize: 20, fontWeight: '900' },
  statLabel: { color: COLORS.textMuted, fontSize: 10, fontWeight: '800' },
  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 20,
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  actionRow: { flexDirection: 'row', gap: 15 },
  badge: {
    backgroundColor: COLORS.success + '15',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
  },
  badgeText: { color: COLORS.success, fontSize: 11, fontWeight: '800' },
  actionBtn: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  actionText: { color: COLORS.primary, fontSize: 13, fontWeight: '700' },
  emptyContainer: { alignItems: 'center', justifyContent: 'center', marginTop: 100 },
  emptyTitle: { color: COLORS.textPrimary, fontSize: 18, fontWeight: '800', marginTop: 20 },
  emptySub: { color: COLORS.textMuted, fontSize: 14, marginTop: 4 },
  
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: COLORS.bgPrimary,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    height: '80%',
    padding: 24,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: { color: COLORS.textPrimary, fontSize: 20, fontWeight: '800' },
  modalBody: { flex: 1 },
  label: { color: COLORS.textSecondary, fontSize: 13, fontWeight: '700', marginBottom: 8, marginTop: 15 },
  input: {
    backgroundColor: COLORS.bgCard,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 12,
    color: COLORS.textPrimary,
    fontSize: 15,
    fontWeight: '600',
  },
  inputRow: { flexDirection: 'row', gap: 10 },
  saveBtn: {
    backgroundColor: COLORS.primary,
    padding: 16,
    borderRadius: 15,
    alignItems: 'center',
    marginTop: 30,
    elevation: 4,
  },
  disabledBtn: { opacity: 0.7 },
  saveBtnText: { color: '#fff', fontSize: 16, fontWeight: '800' },
});

export default StudentManagementScreen;
