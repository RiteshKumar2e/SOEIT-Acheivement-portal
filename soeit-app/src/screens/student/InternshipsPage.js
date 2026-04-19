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
  Modal,
  TextInput,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Linking,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS } from '../../constants/colors';
import api from '../../services/api';

// ─── Filter types ──────────────────────────────────────────────────────────────
const FILTERS = ['All', 'Remote', 'On-site', 'Hybrid', 'In-office'];

// ─── Empty form state ──────────────────────────────────────────────────────────
const EMPTY_FORM = {
  title: '',
  company: '',
  location: '',
  stipend: '',
  type: 'Remote',
  duration: '',
  applyLink: '',
  description: '',
};

// ─── Type options ──────────────────────────────────────────────────────────────
const TYPE_OPTIONS = ['Remote', 'On-site', 'Hybrid', 'In-office'];

const InternshipsPage = () => {
  const [internships, setInternships]     = useState([]);
  const [loading, setLoading]             = useState(true);
  const [refreshing, setRefreshing]       = useState(false);
  const [activeFilter, setActiveFilter]   = useState('All');

  // Modal states
  const [showModal, setShowModal]         = useState(false);
  const [editItem, setEditItem]           = useState(null);   // if set → edit mode
  const [formData, setFormData]           = useState(EMPTY_FORM);
  const [submitting, setSubmitting]       = useState(false);

  // Options popup (3-dot menu)
  const [optionsVisible, setOptionsVisible] = useState(false);
  const [optionsItem, setOptionsItem]       = useState(null);

  // ── Fetch ──────────────────────────────────────────────────────────────────
  const fetchInternships = useCallback(async () => {
    try {
      const res = await api.get('/internships/my');
      if (res.data && (res.data.internships || res.data.data)) {
        setInternships(res.data.internships || res.data.data || []);
      } else {
        setInternships([]);
      }
    } catch {
      setInternships([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => { fetchInternships(); }, [fetchInternships]);

  const onRefresh = () => { setRefreshing(true); fetchInternships(); };

  // ── Filtered data ──────────────────────────────────────────────────────────
  const filtered = activeFilter === 'All'
    ? internships
    : internships.filter(i => i.type === activeFilter);

  // ── Open Add Modal ─────────────────────────────────────────────────────────
  const openAddModal = () => {
    setEditItem(null);
    setFormData(EMPTY_FORM);
    setShowModal(true);
  };

  // ── Open Edit Modal ────────────────────────────────────────────────────────
  const openEditModal = (item) => {
    setOptionsVisible(false);
    setEditItem(item);
    setFormData({
      title:       item.title       || '',
      company:     item.company     || '',
      location:    item.location    || '',
      stipend:     item.stipend     || '',
      type:        item.type        || 'Remote',
      duration:    item.duration    || '',
      applyLink:   item.applyLink   || '',
      description: item.description || '',
    });
    setShowModal(true);
  };

  // ── Submit (Add / Edit) ────────────────────────────────────────────────────
  const handleSubmit = async () => {
    if (!formData.title.trim() || !formData.company.trim()) {
      Alert.alert('Required', 'Please fill in Role/Position and Company name.');
      return;
    }
    setSubmitting(true);
    try {
      if (editItem) {
        // Edit
        await api.put(`/internships/${editItem.id || editItem._id}`, formData);
        Alert.alert('Updated', 'Internship updated successfully.');
      } else {
        // Add
        await api.post('/internships', formData);
        Alert.alert('Added', 'Internship added to your profile!');
      }
      setShowModal(false);
      fetchInternships();
    } catch {
      // Optimistic local update if API not connected
      if (editItem) {
        setInternships(prev =>
          prev.map(i => (i.id === editItem.id ? { ...i, ...formData } : i))
        );
      } else {
        const newItem = { id: Date.now().toString(), ...formData };
        setInternships(prev => [newItem, ...prev]);
      }
      setShowModal(false);
      Alert.alert('Saved Locally', editItem ? 'Internship updated.' : 'Internship added to your profile!');
    } finally {
      setSubmitting(false);
    }
  };

  // ── Delete ─────────────────────────────────────────────────────────────────
  const handleDelete = (item) => {
    setOptionsVisible(false);
    Alert.alert(
      'Delete Internship',
      `Remove "${item.title}" from your profile?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete', style: 'destructive',
          onPress: async () => {
            try {
              await api.delete(`/internships/${item.id || item._id}`);
            } catch { /* optimistic */ }
            setInternships(prev => prev.filter(i => i.id !== item.id && i._id !== item._id));
          }
        }
      ]
    );
  };

  // ── Card ───────────────────────────────────────────────────────────────────
  const renderItem = ({ item }) => {
    const typeColor =
      item.type === 'Remote'    ? '#10b981' :
      item.type === 'On-site'   ? '#3b82f6' :
      item.type === 'Hybrid'    ? '#8b5cf6' : '#f59e0b';

    return (
      <View style={styles.card}>
        {/* Header */}
        <View style={styles.cardHeader}>
          <View style={styles.logoBox}>
            {item.logo ? (
              <Image source={{ uri: item.logo }} style={styles.logoImg} />
            ) : (
              <LinearGradient colors={['#1e3a8a', '#3b82f6']} style={styles.logoGradient}>
                <Text style={styles.logoChar}>
                  {(item.company || 'I').charAt(0).toUpperCase()}
                </Text>
              </LinearGradient>
            )}
          </View>

          <View style={{ flex: 1 }}>
            <Text style={styles.cardTitle} numberOfLines={1}>{item.title}</Text>
            <Text style={styles.cardCompany}>{item.company}</Text>
          </View>

          {/* 3-dot Options */}
          <TouchableOpacity
            style={styles.optionsBtn}
            onPress={() => { setOptionsItem(item); setOptionsVisible(true); }}
          >
            <Ionicons name="ellipsis-vertical" size={20} color={COLORS.textMuted} />
          </TouchableOpacity>
        </View>

        {/* Meta chips */}
        <View style={styles.metaRow}>
          <View style={styles.metaChip}>
            <Ionicons name="location-outline" size={13} color={COLORS.textMuted} />
            <Text style={styles.metaText}>{item.location || 'N/A'}</Text>
          </View>
          <View style={styles.metaChip}>
            <Ionicons name="cash-outline" size={13} color="#10b981" />
            <Text style={[styles.metaText, { color: '#10b981' }]}>{item.stipend || 'Unpaid'}</Text>
          </View>
          <View style={styles.metaChip}>
            <Ionicons name="time-outline" size={13} color={COLORS.textMuted} />
            <Text style={styles.metaText}>{item.duration || '—'}</Text>
          </View>
        </View>

        {/* Description */}
        {item.description ? (
          <Text style={styles.cardDesc} numberOfLines={2}>{item.description}</Text>
        ) : null}

        {/* Footer */}
        <View style={styles.cardFooter}>
          <View style={[styles.typeBadge, { backgroundColor: typeColor + '18', borderColor: typeColor + '40' }]}>
            <View style={[styles.typeDot, { backgroundColor: typeColor }]} />
            <Text style={[styles.typeText, { color: typeColor }]}>{item.type || 'Remote'}</Text>
          </View>

          {item.applyLink ? (
            <TouchableOpacity
              style={styles.applyBtn}
              onPress={() => Linking.openURL(item.applyLink)}
            >
              <Text style={styles.applyBtnText}>Apply Now</Text>
              <Ionicons name="arrow-forward" size={13} color="#fff" />
            </TouchableOpacity>
          ) : null}
        </View>
      </View>
    );
  };

  // ── Options Popup ──────────────────────────────────────────────────────────
  const OptionsPopup = () => (
    <Modal
      visible={optionsVisible}
      transparent
      animationType="fade"
      onRequestClose={() => setOptionsVisible(false)}
    >
      <TouchableOpacity
        style={styles.optionsOverlay}
        activeOpacity={1}
        onPress={() => setOptionsVisible(false)}
      >
        <View style={styles.optionsSheet}>
          <Text style={styles.optionsTitle} numberOfLines={1}>
            {optionsItem?.title || 'Internship'}
          </Text>
          <View style={styles.optionsDivider} />

          <TouchableOpacity
            style={styles.optionRow}
            onPress={() => openEditModal(optionsItem)}
          >
            <View style={[styles.optionIcon, { backgroundColor: '#3b82f6' + '18' }]}>
              <Ionicons name="pencil" size={18} color="#3b82f6" />
            </View>
            <Text style={styles.optionLabel}>Edit Internship</Text>
            <Ionicons name="chevron-forward" size={16} color={COLORS.textMuted} />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.optionRow}
            onPress={() => handleDelete(optionsItem)}
          >
            <View style={[styles.optionIcon, { backgroundColor: '#ef4444' + '18' }]}>
              <Ionicons name="trash-outline" size={18} color="#ef4444" />
            </View>
            <Text style={[styles.optionLabel, { color: '#ef4444' }]}>Delete</Text>
            <Ionicons name="chevron-forward" size={16} color={COLORS.textMuted} />
          </TouchableOpacity>

          {optionsItem?.applyLink ? (
            <TouchableOpacity
              style={styles.optionRow}
              onPress={() => { setOptionsVisible(false); Linking.openURL(optionsItem.applyLink); }}
            >
              <View style={[styles.optionIcon, { backgroundColor: '#10b981' + '18' }]}>
                <Ionicons name="open-outline" size={18} color="#10b981" />
              </View>
              <Text style={styles.optionLabel}>Open Apply Link</Text>
              <Ionicons name="chevron-forward" size={16} color={COLORS.textMuted} />
            </TouchableOpacity>
          ) : null}

          <TouchableOpacity
            style={[styles.optionRow, { borderTopWidth: 1, borderTopColor: COLORS.border, marginTop: 8 }]}
            onPress={() => setOptionsVisible(false)}
          >
            <Text style={[styles.optionLabel, { textAlign: 'center', color: COLORS.textMuted, flex: 1 }]}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </Modal>
  );

  // ── Add/Edit Modal ─────────────────────────────────────────────────────────
  const AddEditModal = () => (
    <Modal
      visible={showModal}
      animationType="slide"
      transparent
      onRequestClose={() => !submitting && setShowModal(false)}
    >
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalSheet}>
            {/* Modal Header */}
            <View style={styles.modalHeader}>
              <View>
                <Text style={styles.modalTitle}>
                  {editItem ? 'Edit Internship' : 'Add Internship'}
                </Text>
                <Text style={styles.modalSub}>
                  {editItem ? 'Update your internship details' : 'Log an internship to your profile'}
                </Text>
              </View>
              <TouchableOpacity
                onPress={() => !submitting && setShowModal(false)}
                style={styles.modalCloseBtn}
              >
                <Ionicons name="close" size={22} color={COLORS.textPrimary} />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 30 }}>
              {/* Role / Position */}
              <Text style={styles.fieldLabel}>Role / Position *</Text>
              <View style={styles.inputWrapper}>
                <Ionicons name="briefcase-outline" size={16} color={COLORS.textMuted} style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="e.g. Software Development Intern"
                  placeholderTextColor={COLORS.textMuted}
                  value={formData.title}
                  onChangeText={t => setFormData({ ...formData, title: t })}
                />
              </View>

              {/* Company */}
              <Text style={styles.fieldLabel}>Company *</Text>
              <View style={styles.inputWrapper}>
                <Ionicons name="business-outline" size={16} color={COLORS.textMuted} style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="e.g. Google, Microsoft, TCS"
                  placeholderTextColor={COLORS.textMuted}
                  value={formData.company}
                  onChangeText={t => setFormData({ ...formData, company: t })}
                />
              </View>

              {/* Location */}
              <Text style={styles.fieldLabel}>Location</Text>
              <View style={styles.inputWrapper}>
                <Ionicons name="location-outline" size={16} color={COLORS.textMuted} style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="e.g. Bangalore, India"
                  placeholderTextColor={COLORS.textMuted}
                  value={formData.location}
                  onChangeText={t => setFormData({ ...formData, location: t })}
                />
              </View>

              {/* Stipend */}
              <Text style={styles.fieldLabel}>Stipend / Salary</Text>
              <View style={styles.inputWrapper}>
                <Ionicons name="cash-outline" size={16} color={COLORS.textMuted} style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="e.g. ₹25,000 / month"
                  placeholderTextColor={COLORS.textMuted}
                  value={formData.stipend}
                  onChangeText={t => setFormData({ ...formData, stipend: t })}
                />
              </View>

              {/* Duration */}
              <Text style={styles.fieldLabel}>Duration</Text>
              <View style={styles.inputWrapper}>
                <Ionicons name="time-outline" size={16} color={COLORS.textMuted} style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="e.g. 3 Months, 6 Months"
                  placeholderTextColor={COLORS.textMuted}
                  value={formData.duration}
                  onChangeText={t => setFormData({ ...formData, duration: t })}
                />
              </View>

              {/* Type Selector */}
              <Text style={styles.fieldLabel}>Work Type</Text>
              <View style={styles.typeGroup}>
                {TYPE_OPTIONS.map(t => (
                  <TouchableOpacity
                    key={t}
                    style={[styles.typeOption, formData.type === t && styles.typeOptionActive]}
                    onPress={() => setFormData({ ...formData, type: t })}
                  >
                    <Text style={[styles.typeOptionText, formData.type === t && styles.typeOptionTextActive]}>
                      {t}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              {/* Apply Link */}
              <Text style={styles.fieldLabel}>Apply / Job Link</Text>
              <View style={styles.inputWrapper}>
                <Ionicons name="link-outline" size={16} color={COLORS.textMuted} style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="https://..."
                  placeholderTextColor={COLORS.textMuted}
                  keyboardType="url"
                  autoCapitalize="none"
                  value={formData.applyLink}
                  onChangeText={t => setFormData({ ...formData, applyLink: t })}
                />
              </View>

              {/* Description */}
              <Text style={styles.fieldLabel}>Description (optional)</Text>
              <View style={[styles.inputWrapper, { alignItems: 'flex-start', paddingTop: 10 }]}>
                <Ionicons name="document-text-outline" size={16} color={COLORS.textMuted} style={[styles.inputIcon, { marginTop: 2 }]} />
                <TextInput
                  style={[styles.input, { height: 90, textAlignVertical: 'top' }]}
                  placeholder="Brief about your role, technologies used..."
                  placeholderTextColor={COLORS.textMuted}
                  multiline
                  value={formData.description}
                  onChangeText={t => setFormData({ ...formData, description: t })}
                />
              </View>

              {/* Submit Button */}
              <TouchableOpacity
                style={[styles.submitBtn, submitting && { opacity: 0.7 }]}
                onPress={handleSubmit}
                disabled={submitting}
              >
                <LinearGradient colors={['#1e3a8a', '#3b82f6']} style={styles.submitGradient}>
                  {submitting ? (
                    <ActivityIndicator color="#fff" size="small" />
                  ) : (
                    <>
                      <Ionicons name={editItem ? 'checkmark-circle' : 'add-circle'} size={20} color="#fff" />
                      <Text style={styles.submitText}>
                        {editItem ? 'Save Changes' : 'Add Internship'}
                      </Text>
                    </>
                  )}
                </LinearGradient>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );

  // ── Main Render ────────────────────────────────────────────────────────────
  return (
    <View style={styles.container}>
      {/* Filter bar */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.filterScroll}
        contentContainerStyle={styles.filterContent}
      >
        {FILTERS.map(f => (
          <TouchableOpacity
            key={f}
            style={[styles.filterBtn, activeFilter === f && styles.filterBtnActive]}
            onPress={() => setActiveFilter(f)}
          >
            <Text style={[styles.filterText, activeFilter === f && styles.filterTextActive]}>
              {f}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {loading ? (
        <ActivityIndicator size="large" color={COLORS.primary} style={{ marginTop: 60 }} />
      ) : (
        <FlatList
          data={filtered}
          renderItem={renderItem}
          keyExtractor={(item, idx) => (item.id || item._id || idx).toString()}
          contentContainerStyle={styles.list}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={COLORS.primary} />
          }
          ListHeaderComponent={
            <View style={styles.pageHeader}>
              <Text style={styles.pageTitle}>My Internships</Text>
              <Text style={styles.pageSub}>
                {internships.length > 0
                  ? `${internships.length} internship${internships.length !== 1 ? 's' : ''} on your profile`
                  : 'Log internships you have done or are doing'}
              </Text>
            </View>
          }
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <View style={styles.emptyIconBox}>
                <Ionicons name="briefcase-outline" size={40} color="#3b82f6" />
              </View>
              <Text style={styles.emptyTitle}>No Internships Yet</Text>
              <Text style={styles.emptyDesc}>
                Tap the{' '}
                <Text style={{ fontWeight: '800', color: COLORS.primary }}>+ Add</Text>
                {' '}button to log an internship to your profile.
              </Text>
            </View>
          }
        />
      )}

      {/* Floating Add Button */}
      <TouchableOpacity style={styles.fab} onPress={openAddModal} activeOpacity={0.85}>
        <LinearGradient colors={['#1e3a8a', '#3b82f6']} style={styles.fabGradient}>
          <Ionicons name="add" size={28} color="#fff" />
        </LinearGradient>
      </TouchableOpacity>

      <AddEditModal />
      <OptionsPopup />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bgPrimary },

  // ── Filter bar ──────────────────────────────────────────────────────────────
  filterScroll: { maxHeight: 52, borderBottomWidth: 1, borderBottomColor: COLORS.border },
  filterContent: { paddingHorizontal: 16, alignItems: 'center', gap: 8 },
  filterBtn: {
    paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20,
    backgroundColor: COLORS.bgCard, borderWidth: 1, borderColor: COLORS.border,
  },
  filterBtnActive: { backgroundColor: '#1e3a8a', borderColor: '#1e3a8a' },
  filterText: { color: COLORS.textSecondary, fontWeight: '700', fontSize: 13 },
  filterTextActive: { color: '#fff' },

  // ── List ────────────────────────────────────────────────────────────────────
  list: { padding: 16, paddingBottom: 100 },
  pageHeader: { marginBottom: 20, paddingTop: 6 },
  pageTitle: { color: COLORS.textPrimary, fontSize: 22, fontWeight: '800' },
  pageSub: { color: COLORS.textSecondary, fontSize: 13, marginTop: 2 },

  // ── Card ────────────────────────────────────────────────────────────────────
  card: {
    backgroundColor: COLORS.bgCard, borderRadius: 20, padding: 18,
    marginBottom: 14, borderWidth: 1, borderColor: COLORS.border,
  },
  cardHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 14 },
  logoBox: { width: 48, height: 48, borderRadius: 14, overflow: 'hidden', marginRight: 14 },
  logoGradient: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  logoImg: { width: '100%', height: '100%' },
  logoChar: { color: '#fff', fontWeight: '900', fontSize: 20 },
  cardTitle: { color: COLORS.textPrimary, fontSize: 16, fontWeight: '700' },
  cardCompany: { color: COLORS.textSecondary, fontSize: 13, marginTop: 2 },
  optionsBtn: { padding: 6 },

  metaRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 12 },
  metaChip: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  metaText: { color: COLORS.textSecondary, fontSize: 12, fontWeight: '500' },

  cardDesc: { color: COLORS.textMuted, fontSize: 13, lineHeight: 19, marginBottom: 14 },

  cardFooter: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingTop: 12, borderTopWidth: 1, borderTopColor: COLORS.border },
  typeBadge: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 10, paddingVertical: 5, borderRadius: 8, borderWidth: 1 },
  typeDot: { width: 7, height: 7, borderRadius: 4 },
  typeText: { fontSize: 12, fontWeight: '700' },
  applyBtn: { flexDirection: 'row', alignItems: 'center', gap: 5, backgroundColor: '#1e3a8a', paddingHorizontal: 14, paddingVertical: 8, borderRadius: 10 },
  applyBtnText: { color: '#fff', fontWeight: '700', fontSize: 13 },

  // ── Empty state ─────────────────────────────────────────────────────────────
  emptyContainer: { alignItems: 'center', marginTop: 70 },
  emptyIconBox: { width: 80, height: 80, borderRadius: 24, backgroundColor: '#eff6ff', alignItems: 'center', justifyContent: 'center', marginBottom: 16 },
  emptyTitle: { color: COLORS.textPrimary, fontSize: 20, fontWeight: '800', marginBottom: 8 },
  emptyDesc: { color: COLORS.textMuted, fontSize: 14, textAlign: 'center', paddingHorizontal: 40, lineHeight: 20 },

  // ── FAB ─────────────────────────────────────────────────────────────────────
  fab: { position: 'absolute', bottom: 28, right: 22, borderRadius: 32, elevation: 8, shadowColor: '#1e3a8a', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.35, shadowRadius: 10 },
  fabGradient: { width: 60, height: 60, borderRadius: 30, alignItems: 'center', justifyContent: 'center' },

  // ── Options popup ────────────────────────────────────────────────────────────
  optionsOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.45)', justifyContent: 'flex-end' },
  optionsSheet: { backgroundColor: COLORS.bgCard, borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 20, paddingBottom: 36 },
  optionsTitle: { color: COLORS.textPrimary, fontWeight: '800', fontSize: 16, marginBottom: 12 },
  optionsDivider: { height: 1, backgroundColor: COLORS.border, marginBottom: 8 },
  optionRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 14 },
  optionIcon: { width: 38, height: 38, borderRadius: 12, alignItems: 'center', justifyContent: 'center', marginRight: 14 },
  optionLabel: { flex: 1, color: COLORS.textPrimary, fontSize: 15, fontWeight: '700' },

  // ── Add/Edit Modal ───────────────────────────────────────────────────────────
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalSheet: {
    backgroundColor: COLORS.bgCard, borderTopLeftRadius: 28, borderTopRightRadius: 28,
    maxHeight: '93%', paddingHorizontal: 20, paddingTop: 20,
  },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 },
  modalTitle: { color: COLORS.textPrimary, fontSize: 20, fontWeight: '800' },
  modalSub: { color: COLORS.textMuted, fontSize: 13, marginTop: 2 },
  modalCloseBtn: { width: 36, height: 36, borderRadius: 10, backgroundColor: COLORS.bgSecondary, alignItems: 'center', justifyContent: 'center' },

  fieldLabel: { color: COLORS.textPrimary, fontSize: 13, fontWeight: '700', marginBottom: 6, marginTop: 14 },
  inputWrapper: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.bgPrimary, borderRadius: 12, borderWidth: 1, borderColor: COLORS.border, paddingHorizontal: 12 },
  inputIcon: { marginRight: 8 },
  input: { flex: 1, color: COLORS.textPrimary, fontSize: 14, paddingVertical: 12 },

  typeGroup: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 4 },
  typeOption: { paddingHorizontal: 14, paddingVertical: 9, borderRadius: 10, borderWidth: 1, borderColor: COLORS.border, backgroundColor: COLORS.bgPrimary },
  typeOptionActive: { backgroundColor: '#1e3a8a', borderColor: '#1e3a8a' },
  typeOptionText: { color: COLORS.textSecondary, fontWeight: '700', fontSize: 13 },
  typeOptionTextActive: { color: '#fff' },

  submitBtn: { marginTop: 24, borderRadius: 16, overflow: 'hidden' },
  submitGradient: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10, paddingVertical: 16 },
  submitText: { color: '#fff', fontWeight: '800', fontSize: 16 },
});

export default InternshipsPage;
