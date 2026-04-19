import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS } from '../../constants/colors';
import api from '../../services/api';
import { ROUTES } from '../../constants/api';
import Button from '../../components/common/Button';

const BroadcastNoticeScreen = ({ navigation }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [target, setTarget] = useState('all'); // all, students, faculty
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!title || !content) {
      Alert.alert('Error', 'Title and Content are required');
      return;
    }

    setLoading(true);
    try {
      await api.post(ROUTES.NOTICES, { title, content, target });
      Alert.alert('Success', 'Notice broadcasted successfully');
      navigation.goBack();
    } catch (error) {
      console.error('Broadcast error:', error);
      Alert.alert('Error', 'Failed to send broadcast. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      style={{ flex: 1 }} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView style={styles.container} contentContainerStyle={{ padding: 20 }}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Broadcast Center</Text>
          <Text style={styles.headerSub}>Send official notifications to the institution</Text>
        </View>

        <View style={styles.form}>
          <Text style={styles.label}>Target Audience</Text>
          <View style={styles.targetContainer}>
            {['all', 'students', 'faculty'].map((t) => (
              <TouchableOpacity
                key={t}
                style={[styles.targetBtn, target === t && styles.targetBtnActive]}
                onPress={() => setTarget(t)}
              >
                <Text style={[styles.targetText, target === t && styles.targetTextActive]}>
                  {t.toUpperCase()}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={styles.label}>Notice Title</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g. End Semester Examination Schedule"
            placeholderTextColor={COLORS.textMuted}
            value={title}
            onChangeText={setTitle}
          />

          <Text style={styles.label}>Notice Content</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Write your detailed notice here..."
            placeholderTextColor={COLORS.textMuted}
            multiline
            numberOfLines={10}
            textAlignVertical="top"
            value={content}
            onChangeText={setContent}
          />

          <Button 
            title="Broadcast Now" 
            onPress={handleSubmit} 
            loading={loading}
            style={styles.submitBtn}
          />
        </View>

        <View style={styles.tips}>
          <Ionicons name="information-circle-outline" size={20} color={COLORS.primary} />
          <Text style={styles.tipsText}>
            This notice will be sent via Push Notification and Email to the selected audience.
          </Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bgPrimary },
  header: { marginBottom: 30 },
  headerTitle: { color: COLORS.textPrimary, fontSize: 24, fontWeight: '800' },
  headerSub: { color: COLORS.textSecondary, fontSize: 14, marginTop: 4 },
  form: { gap: 15 },
  label: { color: COLORS.textPrimary, fontSize: 14, fontWeight: '700', marginBottom: 5 },
  targetContainer: { flexDirection: 'row', gap: 10, marginBottom: 10 },
  targetBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: COLORS.bgCard,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: 'center',
  },
  targetBtnActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  targetText: { color: COLORS.textSecondary, fontSize: 11, fontWeight: '800' },
  targetTextActive: { color: '#fff' },
  input: {
    backgroundColor: COLORS.bgCard,
    borderRadius: 15,
    padding: 15,
    color: COLORS.textPrimary,
    borderWidth: 1,
    borderColor: COLORS.border,
    fontSize: 16,
  },
  textArea: {
    height: 200,
    paddingTop: 15,
  },
  submitBtn: { marginTop: 10 },
  tips: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 30,
    padding: 15,
    backgroundColor: COLORS.primary + '10',
    borderRadius: 15,
    borderWidth: 1,
    borderColor: COLORS.primary + '20',
  },
  tipsText: { color: COLORS.textSecondary, fontSize: 12, flex: 1, lineHeight: 18 },
});

export default BroadcastNoticeScreen;
