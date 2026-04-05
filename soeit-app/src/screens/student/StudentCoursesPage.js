import React, { useState, useEffect, useCallback } from 'react';
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  Modal,
  TextInput,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';
import { SPACING, getResponsiveFontSize } from '../../utils/responsive';
import api from '../../services/api';

const CourseCard = ({ item, onDelete }) => (
  <View style={styles.card}>
    <View style={styles.cardHeader}>
      <View style={styles.iconBox}>
        <Ionicons name="book-outline" size={24} color={COLORS.primary} />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={styles.title}>{item.name || item.courseName}</Text>
        <Text style={styles.instructor}>{item.instructor || item.platform || 'Learning Platform'}</Text>
      </View>
      <TouchableOpacity
        style={styles.deleteBtn}
        onPress={() => onDelete(item.id)}
      >
        <Ionicons name="trash-outline" size={18} color="#ef4444" />
      </TouchableOpacity>
    </View>

    <View style={styles.progressContainer}>
      <View style={styles.progressMeta}>
        <Text style={styles.progressLabel}>Progress</Text>
        <Text style={styles.progressValue}>{item.progress || 0}%</Text>
      </View>
      <View style={styles.progressBar}>
        <View style={[styles.progressFill, { width: `${item.progress || 0}%` }]} />
      </View>
    </View>

    <View style={styles.footer}>
      <View style={styles.meta}>
        <Ionicons name="code-outline" size={14} color={COLORS.textMuted} />
        <Text style={styles.metaText}>{item.category || item.modules || 'Technical'}</Text>
      </View>
      <View style={styles.meta}>
        <Ionicons name="calendar-outline" size={14} color={COLORS.textMuted} />
        <Text style={styles.metaText}>{item.code || new Date().getFullYear()}</Text>
      </View>
    </View>
  </View>
);

const StudentCoursesPage = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    courseName: '',
    platform: '',
    category: '',
    progress: '0',
  });

  const loadInitialData = useCallback(async () => {
    try {
      const res = await api.get('/courses/my');
      if (res.data?.data && res.data.data.length > 0) {
        setCourses(res.data.data);
      } else {
        setCourses([]);
      }
    } catch (error) {
      console.warn('Courses fetch failed:', error.message);
      setCourses([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadInitialData();
  }, [loadInitialData]);

  const onRefresh = () => {
    setRefreshing(true);
    loadInitialData();
  };

  const handleAddCourse = async () => {
    if (!formData.courseName || !formData.platform) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    try {
      const newCourse = {
        id: Date.now(),
        ...formData,
        progress: parseInt(formData.progress),
      };
      
      setCourses([...courses, newCourse]);
      setShowModal(false);
      setFormData({
        courseName: '',
        platform: '',
        category: '',
        progress: '0',
      });
      Alert.alert('Success', 'Course added successfully!');
    } catch (error) {
      Alert.alert('Error', 'Failed to add course');
    }
  };

  const handleDeleteCourse = (id) => {
    Alert.alert(
      'Delete Course',
      'Are you sure you want to remove this course?',
      [
        { text: 'Cancel', onPress: () => {} },
        {
          text: 'Delete',
          onPress: () => {
            setCourses(courses.filter(c => c.id !== id));
            Alert.alert('Success', 'Course removed!');
          },
          style: 'destructive',
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color={COLORS.primary} style={{ marginTop: 50 }} />
      ) : (
        <FlatList
          data={courses}
          renderItem={({ item }) => <CourseCard item={item} onDelete={handleDeleteCourse} />}
          keyExtractor={(item, index) => item.id?.toString() || index.toString()}
          contentContainerStyle={styles.list}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={COLORS.primary} />
          }
          ListHeaderComponent={
            <View>
              <View style={styles.header}>
                <View>
                  <Text style={styles.headerTitle}>Academic Courses</Text>
                  <Text style={styles.headerSub}>Track your current semester learning path</Text>
                </View>
                <TouchableOpacity
                  style={styles.addBtn}
                  onPress={() => setShowModal(true)}
                >
                  <Ionicons name="add" size={24} color="#fff" />
                </TouchableOpacity>
              </View>
            </View>
          }
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Ionicons name="book-outline" size={64} color={COLORS.textMuted + '40'} />
              <Text style={styles.emptyText}>No courses yet</Text>
              <Text style={styles.emptySubtext}>Add a course to get started</Text>
            </View>
          }
        />
      )}

      {/* Add Course Modal */}
      <Modal
        visible={showModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Add New Course</Text>
              <TouchableOpacity onPress={() => setShowModal(false)}>
                <Ionicons name="close" size={24} color={COLORS.textPrimary} />
              </TouchableOpacity>
            </View>

            <View style={styles.modalBody}>
              <Text style={styles.label}>Course Name *</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g. Advanced Web Architecture"
                placeholderTextColor={COLORS.textMuted}
                value={formData.courseName}
                onChangeText={(text) => setFormData({ ...formData, courseName: text })}
              />

              <Text style={styles.label}>Platform *</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g. Udemy, Coursera, NPTEL"
                placeholderTextColor={COLORS.textMuted}
                value={formData.platform}
                onChangeText={(text) => setFormData({ ...formData, platform: text })}
              />

              <Text style={styles.label}>Category</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g. Technical, Soft Skills"
                placeholderTextColor={COLORS.textMuted}
                value={formData.category}
                onChangeText={(text) => setFormData({ ...formData, category: text })}
              />

              <Text style={styles.label}>Progress (%)</Text>
              <TextInput
                style={styles.input}
                placeholder="0-100"
                placeholderTextColor={COLORS.textMuted}
                keyboardType="numeric"
                value={formData.progress}
                onChangeText={(text) => setFormData({ ...formData, progress: text })}
              />

              <View style={styles.buttonGroup}>
                <TouchableOpacity
                  style={[styles.button, styles.cancelBtn]}
                  onPress={() => setShowModal(false)}
                >
                  <Text style={styles.cancelText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.button, styles.submitBtn]}
                  onPress={handleAddCourse}
                >
                  <Text style={styles.submitText}>Add Course</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.bgPrimary,
  },
  list: {
    padding: SPACING.lg,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: SPACING.xxl,
  },
  headerTitle: {
    color: COLORS.textPrimary,
    fontSize: getResponsiveFontSize(24),
    fontWeight: '800',
  },
  headerSub: {
    color: COLORS.textSecondary,
    fontSize: getResponsiveFontSize(14),
    marginTop: SPACING.xs,
  },
  addBtn: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 3,
  },
  card: {
    backgroundColor: COLORS.bgCard,
    borderRadius: 20,
    padding: SPACING.lg,
    marginBottom: SPACING.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  iconBox: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: COLORS.primary + '15',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.md,
  },
  title: {
    color: COLORS.textPrimary,
    fontSize: getResponsiveFontSize(16),
    fontWeight: '700',
  },
  instructor: {
    color: COLORS.textSecondary,
    fontSize: getResponsiveFontSize(12),
    marginTop: SPACING.xs,
  },
  deleteBtn: {
    padding: SPACING.sm,
    marginLeft: SPACING.md,
  },
  progressContainer: {
    marginBottom: SPACING.lg,
  },
  progressMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SPACING.sm,
  },
  progressLabel: {
    color: COLORS.textMuted,
    fontSize: getResponsiveFontSize(12),
    fontWeight: '600',
  },
  progressValue: {
    color: COLORS.primary,
    fontSize: getResponsiveFontSize(12),
    fontWeight: '800',
  },
  progressBar: {
    height: 6,
    backgroundColor: COLORS.border,
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
    gap: SPACING.md,
    paddingTop: SPACING.md,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  meta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
  },
  metaText: {
    color: COLORS.textMuted,
    fontSize: getResponsiveFontSize(12),
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    color: COLORS.textPrimary,
    fontSize: getResponsiveFontSize(18),
    fontWeight: '700',
    marginTop: SPACING.lg,
  },
  emptySubtext: {
    color: COLORS.textMuted,
    fontSize: getResponsiveFontSize(14),
    marginTop: SPACING.sm,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: COLORS.bgPrimary,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '90%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: SPACING.lg,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  modalTitle: {
    color: COLORS.textPrimary,
    fontSize: getResponsiveFontSize(18),
    fontWeight: '700',
  },
  modalBody: {
    padding: SPACING.lg,
  },
  label: {
    color: COLORS.textPrimary,
    fontSize: getResponsiveFontSize(14),
    fontWeight: '600',
    marginBottom: SPACING.xs,
    marginTop: SPACING.md,
  },
  input: {
    backgroundColor: COLORS.bgCard,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 12,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.md,
    color: COLORS.textPrimary,
    fontSize: getResponsiveFontSize(14),
  },
  buttonGroup: {
    flexDirection: 'row',
    gap: SPACING.md,
    marginTop: SPACING.xxl,
    marginBottom: SPACING.lg,
  },
  button: {
    flex: 1,
    paddingVertical: SPACING.md,
    borderRadius: 12,
    alignItems: 'center',
  },
  cancelBtn: {
    backgroundColor: COLORS.bgCard,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  cancelText: {
    color: COLORS.textPrimary,
    fontWeight: '700',
  },
  submitBtn: {
    backgroundColor: COLORS.primary,
  },
  submitText: {
    color: '#fff',
    fontWeight: '700',
  },
});

export default StudentCoursesPage;
