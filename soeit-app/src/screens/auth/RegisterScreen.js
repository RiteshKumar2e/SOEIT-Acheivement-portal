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
  TextInput,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Picker } from '@react-native-picker/picker';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';
import { useAuth } from '../../context/AuthContext';
import { SPACING, getResponsiveFontSize } from '../../utils/responsive';

const { width } = Dimensions.get('window');

const RegisterScreen = ({ navigation }) => {
  const [userType, setUserType] = useState('student'); // 'student' or 'faculty'
  const [formData, setFormData] = useState({
    name: '',
    enrollmentNo: '',
    email: '',
    department: '',
    batch: '',
    semester: '',
    section: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [focusedField, setFocusedField] = useState(null);
  const { register } = useAuth();

  const departments = [
    'Select Department',
    // B.Tech
    'B.Tech - CSE',
    'B.Tech - AIDS (IBM)',
    'B.Tech - AIML',
    'B.Tech - ME',
    'B.Tech - EEE',
    // BCA
    'BCA - Regular',
    'BCA - AIDL',
    'BCA - Cybersecurity',
    // Diploma
    'Diploma - DCSE',
    'Diploma - DME',
    'Diploma - DEEE',
  ];

  const batches = [
    'Select Batch',
    '2022-26',
    '2023-27',
    '2024-28',
    '2025-29',
  ];

  const semesters = ['Select', '1', '2', '3', '4', '5', '6', '7', '8'];
  const sections = ['Select', 'A', 'B', 'C', 'D', 'E', 'F', 'G'];

  const validateForm = () => {
    if (!formData.name.trim()) {
      Alert.alert('Required', 'Please enter full name');
      return false;
    }
    if (!formData.enrollmentNo.trim()) {
      Alert.alert('Required', 'Please enter enrollment number');
      return false;
    }
    if (!formData.email.trim()) {
      Alert.alert('Required', 'Please enter email');
      return false;
    }
    if (!formData.email.includes('@')) {
      Alert.alert('Invalid', 'Please enter a valid email');
      return false;
    }
    if (userType === 'student') {
      if (formData.department === 'Select Department' || !formData.department) {
        Alert.alert('Required', 'Please select department');
        return false;
      }
      if (formData.batch === 'Select Batch' || !formData.batch) {
        Alert.alert('Required', 'Please select batch year');
        return false;
      }
    }
    if (!formData.password.trim()) {
      Alert.alert('Required', 'Please enter password');
      return false;
    }
    if (formData.password.length < 8) {
      Alert.alert('Invalid', 'Password must be at least 8 characters');
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      Alert.alert('Mismatch', 'Passwords do not match');
      return false;
    }
    return true;
  };

  const handleRegister = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      await register({
        ...formData,
        userType,
      });
      Alert.alert(
        'Success',
        'Registration successful! Please login with your credentials.',
        [{ text: 'Login', onPress: () => navigation.navigate('Login') }]
      );
    } catch (error) {
      const msg = error.response?.data?.message || 'Registration failed. Please try again.';
      Alert.alert('Registration Failed', msg);
    } finally {
      setLoading(false);
    }
  };

  const updateForm = (key, value) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#ffffff', '#f8f9fa']}
        style={styles.gradient}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Back to Home Button */}
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.navigate('Welcome')}
            accessible
            accessibilityRole="button"
            accessibilityLabel="Back to Home"
          >
            <Ionicons name="arrow-back" size={20} color="#455a64" />
            <Text style={styles.backButtonText}>Back to Home</Text>
          </TouchableOpacity>

          {/* Header with University Info */}
          <View style={styles.headerSection}>
            <View style={styles.headerTop}>
              {/* Logo */}
              <LinearGradient
                colors={['#2c3e50', '#34495e']}
                style={styles.logoCircle}
              >
                <Text style={styles.logoText}>JGi</Text>
              </LinearGradient>

              {/* University Name */}
              <View style={styles.universityInfo}>
                <View style={styles.nameRow}>
                  <Text style={styles.universityName}>ARKA JAIN UNIVERSITY</Text>
                  <View style={styles.divider} />
                </View>
                <Text style={styles.universityLocation}>Jharkhand</Text>
              </View>

              {/* NAAC Badge */}
              <View style={styles.naacBadge}>
                <Text style={styles.naacText}>NAAC GRADE A</Text>
              </View>
            </View>

            {/* Title */}
            <Text style={styles.pageTitle}>Student Registration</Text>
          </View>

          {/* Form Card */}
          <View style={styles.formCard}>
            {/* User Type Tabs */}
            <View style={styles.tabContainer}>
              <TouchableOpacity
                style={[styles.tab, userType === 'student' && styles.tabActive]}
                onPress={() => setUserType('student')}
                accessible
                accessibilityRole="tab"
                accessibilityLabel="Student registration"
                accessibilitySelected={userType === 'student'}
              >
                <Ionicons
                  name="person"
                  size={16}
                  color={userType === 'student' ? '#fff' : '#90a4ae'}
                />
                <Text
                  style={[
                    styles.tabText,
                    userType === 'student' && styles.tabTextActive,
                  ]}
                >
                  Student
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.tab, userType === 'faculty' && styles.tabActive]}
                onPress={() => setUserType('faculty')}
                accessible
                accessibilityRole="tab"
                accessibilityLabel="Faculty registration"
                accessibilitySelected={userType === 'faculty'}
              >
                <Ionicons
                  name="school"
                  size={16}
                  color={userType === 'faculty' ? '#fff' : '#90a4ae'}
                />
                <Text
                  style={[
                    styles.tabText,
                    userType === 'faculty' && styles.tabTextActive,
                  ]}
                >
                  Faculty
                </Text>
              </TouchableOpacity>
            </View>

            {/* Form Fields */}
            <View style={styles.formGroup}>
              {/* Full Name */}
              <View style={styles.fieldGroup}>
                <Text style={styles.fieldLabel}>Full Name *</Text>
                <View style={styles.inputContainer}>
                  <TextInput
                    style={styles.input}
                    placeholder="Full name"
                    placeholderTextColor="#b0bec5"
                    value={formData.name}
                    onChangeText={(value) => updateForm('name', value)}
                    editable={!loading}
                  />
                </View>
              </View>

              {/* Enrollment No & Email - Row */}
              <View style={styles.twoColumnRow}>
                <View style={[styles.fieldGroup, { flex: 1 }]}>
                  <Text style={styles.fieldLabel}>
                    {userType === 'faculty' ? 'University ID' : 'Enrollment No.'} *
                  </Text>
                  <View style={styles.inputContainer}>
                    <TextInput
                      style={styles.input}
                      placeholder={userType === 'faculty' ? 'ARKA/AJU/1234' : 'AJU/221403'}
                      placeholderTextColor="#b0bec5"
                      value={formData.enrollmentNo}
                      onChangeText={(value) => updateForm('enrollmentNo', value)}
                      editable={!loading}
                    />
                  </View>
                </View>
              </View>

              {/* Email */}
              <View style={styles.fieldGroup}>
                <Text style={styles.fieldLabel}>Email Address *</Text>
                <View style={styles.inputContainer}>
                  <TextInput
                    style={styles.input}
                    placeholder="example@arkajainuniversity.ac.in"
                    placeholderTextColor="#b0bec5"
                    value={formData.email}
                    onChangeText={(value) => updateForm('email', value)}
                    keyboardType="email-address"
                    editable={!loading}
                  />
                </View>
              </View>

              {/* Department */}
              {userType === 'student' && (
                <View style={styles.fieldGroup}>
                  <Text style={styles.fieldLabel}>Department *</Text>
                  <View style={[
                    styles.inputContainer,
                    styles.pickerContainer,
                    focusedField === 'department' && styles.inputContainerFocused
                  ]}>
                    <Picker
                      selectedValue={formData.department}
                      onValueChange={(value) => updateForm('department', value)}
                      onFocus={() => setFocusedField('department')}
                      onBlur={() => setFocusedField(null)}
                      style={styles.picker}
                      itemStyle={styles.pickerItem}
                      enabled={!loading}
                    >
                      {departments.map((dept, idx) => (
                        <Picker.Item key={idx} label={dept} value={dept} />
                      ))}
                    </Picker>
                  </View>
                </View>
              )}

              {/* Batch Year */}
              {userType === 'student' && (
                <View style={styles.fieldGroup}>
                  <Text style={styles.fieldLabel}>Batch Year *</Text>
                  <View style={[styles.inputContainer, styles.pickerContainer]}>
                    <TextInput
                      style={styles.input}
                      placeholder="e.g. 2022-26 or 2022-2026"
                      placeholderTextColor="#b0bec5"
                      value={formData.batch}
                      onChangeText={(value) => updateForm('batch', value)}
                    />
                  </View>
                </View>
              )}

              {/* Semester & Section Row */}
              {userType === 'student' && (
                <View style={styles.twoColumnRow}>
                  <View style={[styles.fieldGroup, { flex: 1 }]}>
                    <Text style={styles.fieldLabel}>Semester</Text>
                    <View style={[styles.inputContainer, styles.pickerContainer]}>
                      <Picker
                        selectedValue={formData.semester}
                        onValueChange={(value) => updateForm('semester', value)}
                        style={styles.picker}
                        enabled={!loading}
                      >
                        {semesters.map((sem, idx) => (
                          <Picker.Item key={idx} label={sem} value={sem} />
                        ))}
                      </Picker>
                    </View>
                  </View>

                  <View style={[styles.fieldGroup, { flex: 1 }]}>
                    <Text style={styles.fieldLabel}>Section</Text>
                    <View style={[styles.inputContainer, styles.pickerContainer]}>
                      <Picker
                        selectedValue={formData.section}
                        onValueChange={(value) => updateForm('section', value)}
                        style={styles.picker}
                        enabled={!loading}
                      >
                        {sections.map((sec, idx) => (
                          <Picker.Item key={idx} label={sec} value={sec} />
                        ))}
                      </Picker>
                    </View>
                  </View>
                </View>
              )}

              {/* Password */}
              <View style={styles.fieldGroup}>
                <Text style={styles.fieldLabel}>Password *</Text>
                <View style={styles.inputContainer}>
                  <TextInput
                    style={styles.input}
                    placeholder="Min 8 chars"
                    placeholderTextColor="#b0bec5"
                    value={formData.password}
                    onChangeText={(value) => updateForm('password', value)}
                    secureTextEntry={!showPassword}
                    editable={!loading}
                  />
                  <TouchableOpacity
                    onPress={() => setShowPassword(!showPassword)}
                    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                  >
                    <Ionicons
                      name={showPassword ? 'eye' : 'eye-off'}
                      size={20}
                      color="#90a4ae"
                    />
                  </TouchableOpacity>
                </View>
              </View>

              {/* Confirm Password */}
              <View style={styles.fieldGroup}>
                <Text style={styles.fieldLabel}>Confirm Password *</Text>
                <View style={styles.inputContainer}>
                  <TextInput
                    style={styles.input}
                    placeholder="Repeat password"
                    placeholderTextColor="#b0bec5"
                    value={formData.confirmPassword}
                    onChangeText={(value) => updateForm('confirmPassword', value)}
                    secureTextEntry={!showConfirmPassword}
                    editable={!loading}
                  />
                  <TouchableOpacity
                    onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                  >
                    <Ionicons
                      name={showConfirmPassword ? 'eye' : 'eye-off'}
                      size={20}
                      color="#90a4ae"
                    />
                  </TouchableOpacity>
                </View>
              </View>
            </View>

            {/* Sign Up Button */}
            <TouchableOpacity
              style={[styles.signupBtn, loading && styles.signupBtnDisabled]}
              onPress={handleRegister}
              disabled={loading}
              accessible
              accessibilityRole="button"
              accessibilityLabel="Sign up button"
              accessibilityState={{ disabled: loading }}
            >
              <Text style={styles.signupBtnText}>
                {loading ? 'SIGNING UP...' : 'SIGN UP'}
              </Text>
            </TouchableOpacity>

            {/* Login Link */}
            <View style={styles.loginContainer}>
              <Text style={styles.loginText}>Already have an account?{' '}</Text>
              <TouchableOpacity
                onPress={() => navigation.navigate('Login')}
                accessible
                accessibilityRole="button"
                accessibilityLabel="Sign in"
              >
                <Text style={styles.loginLink}>Sign in</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </LinearGradient>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  gradient: {
    flex: 1,
  },
  scrollContent: {
    padding: SPACING.lg,
    paddingTop: SPACING.sm,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    borderRadius: 8,
    alignSelf: 'flex-start',
    marginBottom: SPACING.xl,
    gap: SPACING.md,
  },
  backButtonText: {
    color: '#455a64',
    fontSize: getResponsiveFontSize(13),
    fontWeight: '600',
  },
  headerSection: {
    marginBottom: SPACING.xl,
    alignItems: 'center',
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.md,
    width: '100%',
    marginBottom: SPACING.xl,
  },
  logoCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoText: {
    color: '#fff',
    fontSize: getResponsiveFontSize(16),
    fontWeight: 'bold',
  },
  universityInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  universityName: {
    color: '#8b0000',
    fontSize: getResponsiveFontSize(12),
    fontWeight: '800',
    letterSpacing: 0.8,
  },
  divider: {
    width: 2,
    height: 20,
    backgroundColor: '#8b0000',
  },
  universityLocation: {
    color: '#90a4ae',
    fontSize: getResponsiveFontSize(10),
    marginTop: 2,
  },
  naacBadge: {
    backgroundColor: '#8b0000',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  naacText: {
    color: '#fff',
    fontSize: getResponsiveFontSize(11),
    fontWeight: '700',
    letterSpacing: 1.2,
  },
  naacGrade: {
    color: '#fff',
    fontSize: getResponsiveFontSize(10),
    fontWeight: '900',
  },
  pageTitle: {
    fontSize: getResponsiveFontSize(24),
    fontWeight: '800',
    color: '#212121',
    marginTop: SPACING.md,
  },
  formCard: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: SPACING.xl + SPACING.lg,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    borderWidth: 0.8,
    borderColor: '#f3f4f6',
  },
  tabContainer: {
    flexDirection: 'row',
    gap: SPACING.md,
    marginBottom: SPACING.xl,
    backgroundColor: '#f9fafb',
    padding: SPACING.sm,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.sm,
    paddingVertical: SPACING.md,
    borderRadius: 6,
  },
  tabActive: {
    backgroundColor: '#8b0000',
  },
  tabText: {
    color: '#6b7280',
    fontSize: getResponsiveFontSize(13),
    fontWeight: '600',
  },
  tabTextActive: {
    color: '#fff',
  },
  formGroup: {
    marginBottom: SPACING.lg,
  },
  fieldGroup: {
    marginBottom: SPACING.lg,
  },
  fieldLabel: {
    color: '#374151',
    fontSize: getResponsiveFontSize(12),
    fontWeight: '600',
    letterSpacing: 0.5,
    marginBottom: SPACING.md,
    textTransform: 'none',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 8,
    paddingHorizontal: SPACING.lg,
    backgroundColor: '#f9fafb',
    minHeight: 52,
  },
  input: {
    flex: 1,
    paddingVertical: SPACING.md,
    color: '#374151',
    fontSize: getResponsiveFontSize(14),
    fontWeight: '500',
  },
  inputContainerFocused: {
    borderColor: '#d1d5db',
    borderWidth: 1,
    backgroundColor: '#ffffff',
  },
  pickerContainer: {
    paddingHorizontal: SPACING.lg,
    paddingVertical: 0,
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 8,
    backgroundColor: '#f9fafb',
    minHeight: 52,
  },
  picker: {
    flex: 1,
    color: '#374151',
    height: 52,
    backgroundColor: 'transparent',
  },
  pickerItem: {
    fontSize: getResponsiveFontSize(14),
    fontWeight: '500',
    color: '#374151',
  },
  twoColumnRow: {
    flexDirection: 'row',
    gap: SPACING.lg,
    marginBottom: SPACING.lg,
  },
  signupBtn: {
    backgroundColor: '#2c3e50',
    paddingVertical: SPACING.lg,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: SPACING.xl,
    marginBottom: SPACING.lg,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  signupBtnDisabled: {
    opacity: 0.6,
  },
  signupBtnText: {
    color: '#fff',
    fontSize: getResponsiveFontSize(14),
    fontWeight: '700',
    letterSpacing: 1,
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loginText: {
    color: '#78909c',
    fontSize: getResponsiveFontSize(12),
  },
  loginLink: {
    color: '#8b0000',
    fontSize: getResponsiveFontSize(12),
    fontWeight: '700',
  },
});

export default RegisterScreen;
