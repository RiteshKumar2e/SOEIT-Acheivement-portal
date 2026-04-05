import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import * as DocumentPicker from 'expo-document-picker';
import { LinearGradient } from 'expo-linear-gradient';
import DateTimePicker from '@react-native-community/datetimepicker';
import { COLORS } from '../../constants/colors';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import { ROUTES } from '../../constants/api';
import api from '../../services/api';

const CATEGORIES = ['Technical', 'Sports', 'Cultural', 'Academic', 'Research', 'Other'];
const LEVELS = ['Institutional', 'Zonal', 'State', 'National', 'International'];

const UploadAchievement = ({ navigation }) => {
  const [formData, setFormData] = useState({
    title: '',
    category: 'Technical',
    level: 'Institutional',
    date: new Date().toISOString().split('T')[0],
    description: '',
    institution: '',
  });
  const [proofFile, setProofFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);

  const formatDateToDisplay = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  const handleDateChange = (event, selectedDate) => {
    if (Platform.OS === 'android') {
      setShowDatePicker(false);
    }
    if (selectedDate) {
      const dateString = selectedDate.toISOString().split('T')[0];
      updateForm('date', dateString);
    }
  };

  const handleDatePickerPress = () => {
    setShowDatePicker(true);
  };

  const pickFile = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ['image/*', 'application/pdf'],
        copyToCacheDirectory: true,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        setProofFile(result.assets[0]);
      }
    } catch (err) {
      console.error('Error picking document:', err);
      Alert.alert('Error', 'Could not access documents');
    }
  };

  const pickImage = async () => {
    if (Platform.OS !== 'web') {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission needed', 'We need access to your photos to upload certificates.');
        return;
      }
    }

    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 0.8,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        setProofFile(result.assets[0]);
      }
    } catch (err) {
      console.error('Error picking image:', err);
      Alert.alert('Error', 'Could not open image library');
    }
  };

  const handleUpload = async () => {
    if (!formData.title || !proofFile) {
      Alert.alert('Missing Info', 'Please provide a title and certificate file.');
      return;
    }

    setLoading(true);
    try {
      const data = new FormData();
      data.append('title', formData.title);
      data.append('category', formData.category);
      data.append('level', formData.level);
      data.append('date', formData.date);
      data.append('description', formData.description || '');
      data.append('institution', formData.institution || '');

      // Axios in RN requires this specific format for FormData fields containing files
      const fileUri = Platform.OS === 'ios' ? proofFile.uri.replace('file://', '') : proofFile.uri;

      data.append('proofFiles', {
        uri: proofFile.uri,
        name: proofFile.name || proofFile.fileName || `certificate_${Date.now()}.${proofFile.uri.split('.').pop()}`,
        type: proofFile.mimeType || proofFile.type || 'image/jpeg',
      });

      await api.post(ROUTES.UPLOAD_ACHIEVEMENT, data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      Alert.alert('Success', 'Achievement uploaded successfully and is pending verification.', [
        { text: 'View All', onPress: () => navigation.navigate('Achievements') }
      ]);
    } catch (error) {
      console.error('Upload error details:', error.response?.data || error.message);
      const errorMessage = error.response?.data?.message || 'Something went wrong. Please try again.';
      Alert.alert('Upload Failed', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleWebDateChange = (value) => {
    // For web date input, convert YYYY-MM-DD to same format
    if (value) {
      updateForm('date', value);
    }
  };

  const updateForm = (key, value) => setFormData(prev => ({ ...prev, [key]: value }));

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Achievement Details</Text>

          <Input
            label="Title"
            placeholder="e.g. Smart India Hackathon Winner"
            value={formData.title}
            onChangeText={(v) => updateForm('title', v)}
          />

          <Text style={styles.label}>Category</Text>
          <View style={styles.chipRow}>
            {CATEGORIES.map((cat) => (
              <TouchableOpacity
                key={cat}
                style={[styles.chip, formData.category === cat && styles.chipActive]}
                onPress={() => updateForm('category', cat)}
              >
                <Text style={[styles.chipText, formData.category === cat && styles.chipTextActive]}>
                  {cat}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={styles.label}>Level</Text>
          <View style={styles.chipRow}>
            {LEVELS.map((lvl) => (
              <TouchableOpacity
                key={lvl}
                style={[styles.chip, formData.level === lvl && styles.chipActive]}
                onPress={() => updateForm('level', lvl)}
              >
                <Text style={[styles.chipText, formData.level === lvl && styles.chipTextActive]}>
                  {lvl}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <Input
            label="Institution / Organization"
            placeholder="e.g. S.O.E.I.T, D.A.V.V"
            value={formData.institution}
            onChangeText={(v) => updateForm('institution', v)}
          />

          <Text style={styles.label}>Date of Achievement</Text>
          {Platform.OS === 'web' ? (
            <View style={styles.webDateInput}>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => handleWebDateChange(e.target.value)}
                max={new Date().toISOString().split('T')[0]}
                style={{
                  width: '100%',
                  padding: '12px 14px',
                  fontSize: '16px',
                  borderRadius: '8px',
                  borderWidth: '1.5px',
                  borderColor: '#e5e7eb',
                  backgroundColor: '#f9fafb',
                  borderStyle: 'solid',
                  fontFamily: 'inherit',
                  boxSizing: 'border-box',
                }}
              />
            </View>
          ) : (
            <>
              <TouchableOpacity 
                style={styles.dateInput}
                onPress={handleDatePickerPress}
                activeOpacity={0.7}
              >
                <Ionicons name="calendar-outline" size={20} color={COLORS.primary} style={styles.dateIcon} />
                <Text style={styles.dateText}>{formatDateToDisplay(formData.date)}</Text>
              </TouchableOpacity>

              {showDatePicker && (
                <DateTimePicker
                  value={new Date(formData.date)}
                  mode="date"
                  display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                  onChange={handleDateChange}
                  maximumDate={new Date()}
                />
              )}

              {Platform.OS === 'ios' && showDatePicker && (
                <View style={styles.datePickerButtons}>
                  <TouchableOpacity
                    style={styles.cancelBtn}
                    onPress={() => setShowDatePicker(false)}
                  >
                    <Text style={styles.cancelBtnText}>Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.confirmBtn}
                    onPress={() => setShowDatePicker(false)}
                  >
                    <Text style={styles.confirmBtnText}>Done</Text>
                  </TouchableOpacity>
                </View>
              )}
            </>
          )}
          <Input
            label="Additional Notes (Optional)"
            placeholder="Describe your achievement..."
            multiline
            numberOfLines={5}
            value={formData.description}
            onChangeText={(v) => updateForm('description', v)}
            inputStyle={{
              height: 120,
              textAlignVertical: 'top',
              paddingTop: 14,
              paddingBottom: 14,
              fontSize: 15,
              lineHeight: 22,
            }}
          />

          <Text style={styles.label}>Upload Certificate</Text>
          <TouchableOpacity
            style={styles.uploadBox}
            onPress={pickFile}
            activeOpacity={0.8}
          >
            {proofFile ? (
              <View style={styles.previewContainer}>
                {proofFile.mimeType?.includes('image') || proofFile.type?.includes('image') ? (
                  <Image source={{ uri: proofFile.uri }} style={styles.preview} />
                ) : (
                  <View style={styles.pdfPlaceholder}>
                    <Ionicons name="document-text" size={60} color={COLORS.primary} />
                    <Text style={styles.fileName}>{proofFile.name || proofFile.fileName}</Text>
                  </View>
                )}
                <View style={styles.changeOverlay}>
                  <Ionicons name="camera" size={24} color="#fff" />
                  <Text style={styles.changeText}>Change</Text>
                </View>
              </View>
            ) : (
              <View style={styles.placeholder}>
                <LinearGradient
                  colors={['rgba(59, 130, 246, 0.1)', 'rgba(139, 92, 246, 0.1)']}
                  style={styles.placeholderInner}
                >
                  <Ionicons name="cloud-upload-outline" size={40} color={COLORS.primary} />
                  <Text style={styles.uploadTitle}>Tap to select certificate</Text>
                  <Text style={styles.uploadSub}>PDF, PNG, JPG are supported</Text>
                </LinearGradient>
              </View>
            )}
          </TouchableOpacity>

          <Button
            title="Submit Achievement"
            onPress={handleUpload}
            loading={loading}
            style={styles.submitBtn}
          />
        </View>
        <View style={{ height: 100 }} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bgPrimary },
  scrollContent: { padding: 20 },
  card: {
    backgroundColor: COLORS.bgCard,
    borderRadius: 24,
    padding: 24,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginBottom: 20,
  },
  label: {
    color: COLORS.textSecondary,
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 10,
    marginTop: 10,
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  chipActive: {
    backgroundColor: COLORS.primary + '20',
    borderColor: COLORS.primary,
  },
  chipText: {
    color: COLORS.textSecondary,
    fontSize: 13,
    fontWeight: '600',
  },
  chipTextActive: {
    color: COLORS.primary,
  },
  dateInput: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: COLORS.border,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: COLORS.bgInput,
    marginBottom: 16,
  },
  webDateInput: {
    marginBottom: 16,
  },
  dateIcon: {
    marginRight: 12,
  },
  dateText: {
    fontSize: 16,
    color: COLORS.textPrimary,
    fontWeight: '500',
  },
  datePickerButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
    marginBottom: 16,
  },
  cancelBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: COLORS.border,
    alignItems: 'center',
  },
  cancelBtnText: {
    color: COLORS.textSecondary,
    fontWeight: '600',
    fontSize: 14,
  },
  confirmBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
  },
  confirmBtnText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
  uploadBox: {
    width: '100%',
    height: 180,
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: COLORS.border,
    marginBottom: 24,
  },
  previewContainer: {
    width: '100%',
    height: '100%',
  },
  preview: {
    width: '100%',
    height: '100%',
  },
  changeOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.4)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  changeText: {
    color: '#fff',
    fontWeight: '700',
    marginTop: 4,
  },
  placeholder: {
    flex: 1,
  },
  placeholderInner: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  uploadTitle: {
    color: COLORS.textPrimary,
    fontSize: 15,
    fontWeight: '700',
    marginTop: 12,
  },
  uploadSub: {
    color: COLORS.textMuted,
    fontSize: 12,
    marginTop: 4,
  },
  submitBtn: { marginTop: 10 },
  pdfPlaceholder: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.05)',
  },
  fileName: {
    fontSize: 14,
    color: COLORS.textPrimary,
    marginTop: 10,
    fontWeight: '600',
    paddingHorizontal: 20,
    textAlign: 'center',
  },
});

export default UploadAchievement;
