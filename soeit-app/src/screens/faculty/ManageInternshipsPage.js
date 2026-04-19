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
  ScrollView,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS } from '../../constants/colors';
import api from '../../services/api';
import { ROUTES } from '../../constants/api';
import Button from '../../components/common/Button';

const ManageInternshipsPage = () => {
  const [postings, setPostings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [formData, setFormData] = useState({
    companyName: '',
    role: '',
    location: '',
    stipend: '',
    deadline: '',
    description: '',
    requirements: '',
    applyLink: ''
  });

  const fetchPostings = useCallback(async () => {
    try {
      const res = await api.get(ROUTES.INTERNSHIP_POSTINGS);
      setPostings(res.data.data || []);
    } catch (error) {
      console.error('Fetch postings error:', error);
      setPostings([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchPostings();
  }, [fetchPostings]);

  const handleSubmit = async () => {
    if (!formData.companyName || !formData.role) {
      Alert.alert('Error', 'Company and Role are required');
      return;
    }
    try {
      await api.post(ROUTES.INTERNSHIP_POSTINGS, formData);
      Alert.alert('Success', 'Internship posted successfully');
      setModalVisible(false);
      setFormData({ companyName: '', role: '', location: '', stipend: '', deadline: '', description: '', requirements: '', applyLink: '' });
      fetchPostings();
    } catch (error) {
      console.error('Submit error:', error);
      Alert.alert('Error', 'Failed to post internship');
    }
  };

  const deletePosting = (id) => {
    Alert.alert('Delete', 'Are you sure?', [
      { text: 'Cancel' },
      { text: 'Delete', style: 'destructive', onPress: async () => {
        try {
          await api.delete(`${ROUTES.INTERNSHIP_POSTINGS}/${id}`);
          fetchPostings();
        } catch (_) { Alert.alert('Error', 'Failed to delete'); }
      }}
    ]);
  };

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={styles.iconBox}>
          <Ionicons name="briefcase-outline" size={24} color={COLORS.primary} />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.title}>{item.role}</Text>
          <Text style={styles.company}>{item.company_name}</Text>
        </View>
        <TouchableOpacity onPress={() => deletePosting(item.id)}>
          <Ionicons name="trash-outline" size={24} color={COLORS.danger} />
        </TouchableOpacity>
      </View>
      <View style={styles.metaRow}>
        <View style={styles.metaBox}>
          <Ionicons name="calendar-outline" size={14} color={COLORS.textSecondary} />
          <Text style={styles.metaText}>{item.deadline || 'No Deadline'}</Text>
        </View>
        <View style={styles.metaBox}>
          <Ionicons name="cash-outline" size={14} color={COLORS.success} />
          <Text style={[styles.metaText, { color: COLORS.success }]}>{item.stipend || 'Unpaid'}</Text>
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={postings}
        renderItem={renderItem}
        keyExtractor={item => item.id.toString()}
        contentContainerStyle={styles.list}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={fetchPostings} tintColor={COLORS.primary} />}
        ListHeaderComponent={
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Posted Opportunities</Text>
            <Text style={styles.headerSub}>Manage your internship listings</Text>
          </View>
        }
        ListEmptyComponent={
          !loading && (
            <View style={{ alignItems: 'center', marginTop: 60 }}>
              <Ionicons name="briefcase-outline" size={60} color={COLORS.border} />
              <Text style={{ color: COLORS.textPrimary, fontSize: 18, fontWeight: '700', marginTop: 16 }}>No Postings Yet</Text>
              <Text style={{ color: COLORS.textMuted, fontSize: 14, marginTop: 4, textAlign: 'center', paddingHorizontal: 40 }}>Tap the + button to post a new internship opportunity for students.</Text>
            </View>
          )
        }
      />

      <TouchableOpacity 
        style={styles.fab}
        onPress={() => setModalVisible(true)}
      >
        <LinearGradient
          colors={['#06b6d4', '#3b82f6']}
          style={styles.fabGradient}
        >
          <Ionicons name="add" size={30} color="#fff" />
        </LinearGradient>
      </TouchableOpacity>

      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Post Internship</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Ionicons name="close" size={24} color={COLORS.textPrimary} />
              </TouchableOpacity>
            </View>
            <ScrollView showsVerticalScrollIndicator={false}>
              <TextInput 
                style={styles.input} 
                placeholder="Company Name" 
                placeholderTextColor={COLORS.textMuted}
                value={formData.companyName}
                onChangeText={(t) => setFormData({...formData, companyName: t})}
              />
              <TextInput 
                style={styles.input} 
                placeholder="Role (e.g. Web Dev)" 
                placeholderTextColor={COLORS.textMuted}
                value={formData.role}
                onChangeText={(t) => setFormData({...formData, role: t})}
              />
              <TextInput 
                style={styles.input} 
                placeholder="Location (City or Remote)" 
                placeholderTextColor={COLORS.textMuted}
                value={formData.location}
                onChangeText={(t) => setFormData({...formData, location: t})}
              />
              <TextInput 
                style={styles.input} 
                placeholder="Stipend (e.g. ₹10,000)" 
                placeholderTextColor={COLORS.textMuted}
                value={formData.stipend}
                onChangeText={(t) => setFormData({...formData, stipend: t})}
              />
              <TextInput 
                style={styles.input} 
                placeholder="Deadline (YYYY-MM-DD)" 
                placeholderTextColor={COLORS.textMuted}
                value={formData.deadline}
                onChangeText={(t) => setFormData({...formData, deadline: t})}
              />
              <TextInput 
                style={[styles.input, { height: 100 }]} 
                placeholder="Job Description" 
                placeholderTextColor={COLORS.textMuted}
                multiline
                value={formData.description}
                onChangeText={(t) => setFormData({...formData, description: t})}
              />
            </ScrollView>
            <Button title="Submit Opportunity" onPress={handleSubmit} style={styles.submitBtn} />
          </View>
        </View>
      </Modal>
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
    marginBottom: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  cardHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 15 },
  iconBox: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: COLORS.primary + '15',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 15,
  },
  title: { color: COLORS.textPrimary, fontSize: 16, fontWeight: '700' },
  company: { color: COLORS.textSecondary, fontSize: 13 },
  metaRow: { flexDirection: 'row', gap: 15 },
  metaBox: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  metaText: { color: COLORS.textSecondary, fontSize: 12, fontWeight: '600' },
  fab: {
    position: 'absolute',
    bottom: 30,
    right: 25,
    borderRadius: 30,
    elevation: 5,
    boxShadow: '0 4px 10px rgba(0, 0, 0, 0.3)',
  },
  fabGradient: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: COLORS.bgSecondary,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: 25,
    maxHeight: '90%',
  },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 25 },
  modalTitle: { color: COLORS.textPrimary, fontSize: 20, fontWeight: '800' },
  input: {
    backgroundColor: COLORS.bgCard,
    borderRadius: 15,
    padding: 15,
    color: COLORS.textPrimary,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  submitBtn: { marginTop: 20 },
});

export default ManageInternshipsPage;
