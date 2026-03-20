import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';
import { useAuth } from '../../context/AuthContext';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';

const RegisterScreen = ({ navigation }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    enrollmentNo: '',
    department: '',
    batch: '',
    semester: '',
  });
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();

  const handleRegister = async () => {
    const { name, email, password, enrollmentNo, department, batch, semester } = formData;
    if (!name || !email || !password || !enrollmentNo || !department || !batch || !semester) {
      Alert.alert('Missing Fields', 'Please fill in all details');
      return;
    }

    setLoading(true);
    try {
      await register(formData);
      Alert.alert('Registration Successful', 'Welcome to the SOEIT Portal. Your account has been created.', [
        { text: 'Log In', onPress: () => navigation.navigate('Login') }
      ]);
    } catch (error) {
      const msg = error.response?.data?.message || 'Registration failed. Check your details or try again.';
      Alert.alert('Registration Failed', msg);
    } finally {
      setLoading(false);
    }
  };

  const updateForm = (key, value) => setFormData(prev => ({ ...prev, [key]: value }));

  return (
    <LinearGradient
      colors={[COLORS.bgPrimary, COLORS.bgSecondary]}
      style={styles.container}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <TouchableOpacity 
            style={styles.backBtn} 
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color={COLORS.textPrimary} />
          </TouchableOpacity>

          <View style={styles.header}>
            <Text style={styles.title}>Create Account</Text>
            <Text style={styles.subtitle}>Join the SOEIT Achievement Portal</Text>
          </View>

          <View style={styles.card}>
            <Input
              label="Full Name"
              placeholder="e.g. Rahul Sharma"
              value={formData.name}
              onChangeText={(v) => updateForm('name', v)}
              icon={<Ionicons name="person-outline" size={20} color={COLORS.textSecondary} />}
            />

            <Input
              label="Enrollment Number"
              placeholder="e.g. AJU/22xxxx"
              value={formData.enrollmentNo}
              onChangeText={(v) => updateForm('enrollmentNo', v)}
              icon={<Ionicons name="id-card-outline" size={20} color={COLORS.textSecondary} />}
            />

            <Input
              label="AJU Email ID"
              placeholder="e.g. rahul22xxxx@arkajainuniversity.ac.in"
              value={formData.email}
              onChangeText={(v) => updateForm('email', v)}
              keyboardType="email-address"
              autoCapitalize="none"
              icon={<Ionicons name="mail-outline" size={20} color={COLORS.textSecondary} />}
            />

            <Input
              label="Create Password"
              placeholder="Minimum 6 characters"
              value={formData.password}
              onChangeText={(v) => updateForm('password', v)}
              secureTextEntry
              icon={<Ionicons name="lock-closed-outline" size={20} color={COLORS.textSecondary} />}
            />

            <Input
              label="Department"
              placeholder="e.g. CSE, B.Tech"
              value={formData.department}
              onChangeText={(v) => updateForm('department', v)}
              icon={<Ionicons name="business-outline" size={20} color={COLORS.textSecondary} />}
            />

            <View style={{ flexDirection: 'row', gap: 15 }}>
              <View style={{ flex: 1 }}>
                <Input
                  label="Batch"
                  placeholder="2022-2026"
                  value={formData.batch}
                  onChangeText={(v) => updateForm('batch', v)}
                  icon={<Ionicons name="calendar-outline" size={20} color={COLORS.textSecondary} />}
                />
              </View>
              <View style={{ flex: 1 }}>
                <Input
                  label="Semester"
                  placeholder="e.g. 4"
                  value={formData.semester}
                  onChangeText={(v) => updateForm('semester', v)}
                  keyboardType="numeric"
                  icon={<Ionicons name="list-outline" size={20} color={COLORS.textSecondary} />}
                />
              </View>
            </View>

            <Button
              title="Register Now"
              onPress={handleRegister}
              loading={loading}
              style={styles.regBtn}
            />

            <View style={styles.footer}>
              <Text style={styles.footerText}>Already have an account? </Text>
              <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                <Text style={styles.loginLink}>Sign In</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: {
    padding: 24,
    paddingTop: Platform.OS === 'ios' ? 70 : 50,
  },
  backBtn: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: COLORS.bgCard,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  header: {
    marginBottom: 32,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: COLORS.textPrimary,
  },
  subtitle: {
    fontSize: 15,
    color: COLORS.textSecondary,
    marginTop: 6,
  },
  card: {
    backgroundColor: COLORS.bgCard,
    borderRadius: 24,
    padding: 24,
    borderWidth: 1,
    borderColor: COLORS.border,
    elevation: 10,
  },
  regBtn: { marginTop: 16 },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 24,
    alignItems: 'center',
  },
  footerText: {
    color: COLORS.textSecondary,
    fontSize: 14,
  },
  loginLink: {
    color: COLORS.primary,
    fontSize: 14,
    fontWeight: '700',
  },
});

export default RegisterScreen;
