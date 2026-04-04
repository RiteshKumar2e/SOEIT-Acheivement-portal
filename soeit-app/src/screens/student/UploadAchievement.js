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
import { COLORS } from '../../constants/colors';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
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
  });
  const [certificate, setCertificate] = useState(null);
  const [loading, setLoading] = useState(false);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaType.Images,
      allowsEditing: true,
      quality: 0.7,
    });

    if (!result.canceled) {
      setCertificate(result.assets[0]);
    }
  };

  const handleUpload = async () => {
    if (!formData.title || !certificate) {
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
      data.append('description', formData.description);
      
      data.append('certificate', {
        uri: certificate.uri,
        name: certificate.fileName || 'certificate.jpg',
        type: certificate.mimeType || 'image/jpeg',
      });

      await api.post('/achievements/upload', data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      Alert.alert('Success', 'Achievement uploaded successfully and is pending verification.', [
        { text: 'View All', onPress: () => navigation.navigate('Achievements') }
      ]);
    } catch (error) {
      console.error('Upload error:', error);
      Alert.alert('Upload Failed', 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
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
            label="Date of Achievement"
            placeholder="YYYY-MM-DD"
            value={formData.date}
            onChangeText={(v) => updateForm('date', v)}
          />

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
            onPress={pickImage}
            activeOpacity={0.8}
          >
            {certificate ? (
              <View style={styles.previewContainer}>
                <Image source={{ uri: certificate.uri }} style={styles.preview} />
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
                  <Text style={styles.uploadSub}>PNG, JPG are supported</Text>
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
});

export default UploadAchievement;
