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
  Linking,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';
import { SPACING, getResponsiveFontSize } from '../../utils/responsive';
import api from '../../services/api';

const ProjectCard = ({ item, onDelete }) => (
  <View style={styles.card}>
    <View style={styles.cardHeader}>
      <View style={styles.iconBox}>
        <Ionicons name="code-working" size={24} color={COLORS.primary} />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.techStack}>{item.techStack || 'React, Node.js'}</Text>
      </View>
      <TouchableOpacity
        style={styles.deleteBtn}
        onPress={() => onDelete(item.id)}
      >
        <Ionicons name="trash-outline" size={18} color="#ef4444" />
      </TouchableOpacity>
    </View>

    <Text style={styles.description} numberOfLines={3}>
      {item.description}
    </Text>

    <View style={styles.statusRow}>
      <View style={[styles.statusBadge, { 
        backgroundColor: item.status === 'Completed' ? '#10b981' + '20' : '#3b82f6' + '20' 
      }]}>
        <Text style={[styles.statusText, { 
          color: item.status === 'Completed' ? '#10b981' : '#3b82f6' 
        }]}>
          {item.status || 'Active'}
        </Text>
      </View>
      <View style={styles.links}>
        {item.githubLink && (
          <TouchableOpacity
            style={styles.linkBtn}
            onPress={() => Linking.openURL(item.githubLink)}
          >
            <Ionicons name="logo-github" size={18} color={COLORS.primary} />
          </TouchableOpacity>
        )}
        {item.liveLink && (
          <TouchableOpacity
            style={styles.linkBtn}
            onPress={() => Linking.openURL(item.liveLink)}
          >
            <Ionicons name="open" size={18} color={COLORS.primary} />
          </TouchableOpacity>
        )}
      </View>
    </View>
  </View>
);

const StudentProjectsPage = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    techStack: '',
    githubLink: '',
    liveLink: '',
    status: 'Completed',
  });

  const loadInitialData = useCallback(async () => {
    try {
      const res = await api.get('/projects/my');
      if (res.data?.data && res.data.data.length > 0) {
        setProjects(res.data.data);
      } else {
        setProjects([]);
      }
    } catch (error) {
      console.warn('Projects fetch failed:', error.message);
      setProjects([]);
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

  const handleAddProject = async () => {
    if (!formData.title || !formData.description) {
      Alert.alert('Error', 'Please fill in required fields (Title & Description)');
      return;
    }

    try {
      const newProject = {
        id: Date.now(),
        ...formData,
      };
      
      setProjects([newProject, ...projects]);
      setShowModal(false);
      setFormData({
        title: '',
        description: '',
        techStack: '',
        githubLink: '',
        liveLink: '',
        status: 'Completed',
      });
      Alert.alert('Success', 'Project added successfully!');
    } catch (error) {
      Alert.alert('Error', 'Failed to add project');
    }
  };

  const handleDeleteProject = (id) => {
    Alert.alert(
      'Delete Project',
      'Are you sure you want to remove this project?',
      [
        { text: 'Cancel', onPress: () => {} },
        {
          text: 'Delete',
          onPress: () => {
            setProjects(projects.filter(p => p.id !== id));
            Alert.alert('Success', 'Project removed!');
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
          data={projects}
          renderItem={({ item }) => <ProjectCard item={item} onDelete={handleDeleteProject} />}
          keyExtractor={(item, index) => item.id?.toString() || index.toString()}
          contentContainerStyle={styles.list}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={COLORS.primary} />
          }
          ListHeaderComponent={
            <View>
              <View style={styles.header}>
                <View>
                  <Text style={styles.headerTitle}>Professional Projects</Text>
                  <Text style={styles.headerSub}>Technical portfolio built during your course</Text>
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
              <Ionicons name="code-working" size={64} color={COLORS.textMuted + '40'} />
              <Text style={styles.emptyText}>No projects yet</Text>
              <Text style={styles.emptySubtext}>Showcase your best work</Text>
            </View>
          }
        />
      )}

      {/* Add Project Modal */}
      <Modal
        visible={showModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Add New Project</Text>
              <TouchableOpacity onPress={() => setShowModal(false)}>
                <Ionicons name="close" size={24} color={COLORS.textPrimary} />
              </TouchableOpacity>
            </View>

            <FlatList
              data={[1]} // Single item to enable scrolling in modal
              renderItem={() => (
                <View style={styles.modalBody}>
                  <Text style={styles.label}>Project Title *</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="e.g. E-Commerce Platform"
                    placeholderTextColor={COLORS.textMuted}
                    value={formData.title}
                    onChangeText={(text) => setFormData({ ...formData, title: text })}
                  />

                  <Text style={styles.label}>Description *</Text>
                  <TextInput
                    style={[styles.input, { height: 100 }]}
                    placeholder="Describe your project..."
                    placeholderTextColor={COLORS.textMuted}
                    multiline={true}
                    value={formData.description}
                    onChangeText={(text) => setFormData({ ...formData, description: text })}
                  />

                  <Text style={styles.label}>Tech Stack</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="e.g. React, Node.js, MongoDB"
                    placeholderTextColor={COLORS.textMuted}
                    value={formData.techStack}
                    onChangeText={(text) => setFormData({ ...formData, techStack: text })}
                  />

                  <Text style={styles.label}>GitHub Link</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="https://github.com/..."
                    placeholderTextColor={COLORS.textMuted}
                    keyboardType="url"
                    value={formData.githubLink}
                    onChangeText={(text) => setFormData({ ...formData, githubLink: text })}
                  />

                  <Text style={styles.label}>Live Demo Link</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="https://..."
                    placeholderTextColor={COLORS.textMuted}
                    keyboardType="url"
                    value={formData.liveLink}
                    onChangeText={(text) => setFormData({ ...formData, liveLink: text })}
                  />

                  <Text style={styles.label}>Status</Text>
                  <View style={styles.statusGroup}>
                    {['Completed', 'Ongoing'].map((status) => (
                      <TouchableOpacity
                        key={status}
                        style={[
                          styles.statusOption,
                          formData.status === status && styles.statusOptionActive,
                        ]}
                        onPress={() => setFormData({ ...formData, status })}
                      >
                        <Text
                          style={[
                            styles.statusOptionText,
                            formData.status === status && styles.statusOptionTextActive,
                          ]}
                        >
                          {status}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>

                  <View style={styles.buttonGroup}>
                    <TouchableOpacity
                      style={[styles.button, styles.cancelBtn]}
                      onPress={() => setShowModal(false)}
                    >
                      <Text style={styles.cancelText}>Cancel</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[styles.button, styles.submitBtn]}
                      onPress={handleAddProject}
                    >
                      <Text style={styles.submitText}>Add Project</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              )}
              keyExtractor={() => 'form'}
              scrollEnabled={true}
            />
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
  techStack: {
    color: COLORS.textSecondary,
    fontSize: getResponsiveFontSize(12),
    marginTop: SPACING.xs,
  },
  deleteBtn: {
    padding: SPACING.sm,
    marginLeft: SPACING.md,
  },
  description: {
    color: COLORS.textSecondary,
    fontSize: getResponsiveFontSize(13),
    lineHeight: 18,
    marginBottom: SPACING.lg,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: SPACING.md,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  statusBadge: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    borderRadius: 8,
  },
  statusText: {
    fontSize: getResponsiveFontSize(11),
    fontWeight: '700',
  },
  links: {
    flexDirection: 'row',
    gap: SPACING.md,
  },
  linkBtn: {
    padding: SPACING.sm,
    alignItems: 'center',
    justifyContent: 'center',
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
  statusGroup: {
    flexDirection: 'row',
    gap: SPACING.md,
    marginTop: SPACING.sm,
  },
  statusOption: {
    flex: 1,
    paddingVertical: SPACING.md,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.bgCard,
    alignItems: 'center',
  },
  statusOptionActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  statusOptionText: {
    color: COLORS.textPrimary,
    fontWeight: '600',
    fontSize: getResponsiveFontSize(13),
  },
  statusOptionTextActive: {
    color: '#fff',
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

export default StudentProjectsPage;
