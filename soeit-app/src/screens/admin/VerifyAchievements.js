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
  Alert,
  Modal,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS } from '../../constants/colors';
import api from '../../services/api';
import Button from '../../components/common/Button';

const VerifyAchievements = () => {
  const [pending, setPending] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedAch, setSelectedAch] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [verifying, setVerifying] = useState(false);

  const fetchPending = useCallback(async () => {
    try {
      // In the backend, there's usually a route for pending achievements
      // Using /admin/achievements or similar. Let's assume based on backend analysis
      const res = await api.get('/admin/achievements?status=pending');
      setPending(res.data.data || []);
    } catch (error) {
      console.error('Fetch pending error:', error);
      setPending([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchPending();
  }, [fetchPending]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchPending();
  };

  const handleAction = async (id, status) => {
    setVerifying(true);
    try {
      await api.put(`/admin/achievements/${id}/verify`, { action: status });
      Alert.alert('Success', `Achievement ${status === 'approved' ? 'Approved' : 'Rejected'}`);
      setModalVisible(false);
      fetchPending();
    } catch (error) {
      Alert.alert('Error', 'Verification failed');
    } finally {
      setVerifying(false);
    }
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.card}
      onPress={() => {
        setSelectedAch(item);
        setModalVisible(true);
      }}
    >
      <View style={styles.cardHeader}>
        <View style={styles.userInfo}>
          <View style={styles.userAvatar}>
            <Text style={styles.avatarText}>{item.user?.name?.[0] || 'S'}</Text>
          </View>
          <View>
            <Text style={styles.studentName}>{item.user?.name || 'Student'}</Text>
            <Text style={styles.studentId}>{item.user?.enrollmentNo || 'No ID'}</Text>
          </View>
        </View>
        <LinearGradient 
          colors={['#f59e0b', '#d97706']} 
          style={styles.pendingBadge}
        >
          <Text style={styles.badgeText}>PENDING</Text>
        </LinearGradient>
      </View>

      <View style={styles.achInfo}>
        <Text style={styles.achTitle}>{item.title}</Text>
        <Text style={styles.achMeta}>{item.category} • {item.level}</Text>
      </View>

      <TouchableOpacity 
        style={styles.viewBtn}
        onPress={() => {
          setSelectedAch(item);
          setModalVisible(true);
        }}
      >
        <Text style={styles.viewBtnText}>Review Certificate</Text>
        <Ionicons name="eye-outline" size={16} color={COLORS.primary} />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color={COLORS.primary} style={{ marginTop: 50 }} />
      ) : (
        <FlatList
          data={pending}
          renderItem={renderItem}
          keyExtractor={item => item.id.toString()}
          contentContainerStyle={styles.list}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={COLORS.primary} />
          }
          ListEmptyComponent={
            <View style={styles.empty}>
              <Ionicons name="checkmark-done-circle-outline" size={80} color={COLORS.border} />
              <Text style={styles.emptyTitle}>All Caught Up!</Text>
              <Text style={styles.emptySub}>No pending achievements to verify.</Text>
            </View>
          }
        />
      )}

      {/* Verification Modal */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Verify Achievement</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Ionicons name="close" size={24} color={COLORS.textPrimary} />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              <View style={styles.certificatePreview}>
                {selectedAch?.certificateUrl ? (
                  <Image 
                    source={{ uri: selectedAch.certificateUrl }} 
                    style={styles.certificateImage} 
                    resizeMode="contain"
                  />
                ) : (
                  <View style={styles.noCert}>
                    <Ionicons name="image-outline" size={50} color={COLORS.textMuted} />
                    <Text style={styles.noCertText}>Certificate Preview Not Available</Text>
                  </View>
                )}
              </View>

              <View style={styles.detailSection}>
                <Text style={styles.detailLabel}>Achievement Title</Text>
                <Text style={styles.detailValue}>{selectedAch?.title}</Text>
                
                <Text style={styles.detailLabel}>Student Details</Text>
                <Text style={styles.detailValue}>{selectedAch?.user?.name} ({selectedAch?.user?.enrollmentNo})</Text>
                
                <Text style={styles.detailLabel}>Category & Level</Text>
                <Text style={styles.detailValue}>{selectedAch?.category} | {selectedAch?.level}</Text>
                
                {selectedAch?.description && (
                  <>
                    <Text style={styles.detailLabel}>Description</Text>
                    <Text style={styles.detailValue}>{selectedAch?.description}</Text>
                  </>
                )}
              </View>

              <View style={styles.actionRow}>
                <Button 
                  title="Reject" 
                  variant="outline" 
                  style={styles.rejectBtn}
                  textStyle={{ color: COLORS.danger }}
                  onPress={() => handleAction(selectedAch.id, 'rejected')}
                  loading={verifying}
                  disabled={verifying}
                />
                <Button 
                  title="Approve & Verify" 
                  style={styles.approveBtn}
                  onPress={() => handleAction(selectedAch.id, 'verified')}
                  loading={verifying}
                  disabled={verifying}
                />
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bgPrimary },
  list: { padding: 20 },
  card: {
    backgroundColor: COLORS.bgCard,
    borderRadius: 20,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  userInfo: { flexDirection: 'row', alignItems: 'center' },
  userAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.primary + '30',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  avatarText: { color: COLORS.primary, fontWeight: '700' },
  studentName: { color: COLORS.textPrimary, fontWeight: '700', fontSize: 14 },
  studentId: { color: COLORS.textMuted, fontSize: 12 },
  pendingBadge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
  badgeText: { color: '#fff', fontSize: 10, fontWeight: '800' },
  achInfo: { marginBottom: 16 },
  achTitle: { color: COLORS.textPrimary, fontSize: 16, fontWeight: '700' },
  achMeta: { color: COLORS.textSecondary, fontSize: 12, marginTop: 4 },
  viewBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    backgroundColor: COLORS.primary + '10',
    borderRadius: 10,
    gap: 8,
  },
  viewBtnText: { color: COLORS.primary, fontWeight: '700', fontSize: 14 },
  empty: { alignItems: 'center', marginTop: 100 },
  emptyTitle: { color: COLORS.textPrimary, fontSize: 20, fontWeight: '700', marginTop: 16 },
  emptySub: { color: COLORS.textMuted, fontSize: 14, marginTop: 4 },
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.85)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: COLORS.bgSecondary,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    height: '90%',
    padding: 24,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: { color: COLORS.textPrimary, fontSize: 20, fontWeight: '800' },
  certificatePreview: {
    width: '100%',
    height: 250,
    backgroundColor: '#000',
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 20,
  },
  certificateImage: { width: '100%', height: '100%' },
  noCert: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  noCertText: { color: COLORS.textMuted, marginTop: 10 },
  detailSection: { marginBottom: 30 },
  detailLabel: { color: COLORS.textMuted, fontSize: 12, marginBottom: 4, textTransform: 'uppercase' },
  detailValue: { color: COLORS.textPrimary, fontSize: 16, fontWeight: '600', marginBottom: 16 },
  actionRow: { flexDirection: 'row', gap: 12 },
  rejectBtn: { flex: 1, borderColor: COLORS.danger },
  approveBtn: { flex: 2 },
});

export default VerifyAchievements;
