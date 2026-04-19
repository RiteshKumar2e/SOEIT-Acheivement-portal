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
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';
import { useAuth } from '../../context/AuthContext';
import { SPACING, getResponsiveFontSize, percentWidth } from '../../utils/responsive';

const { width } = Dimensions.get('window');

// Generate random 4-digit numeric captcha code
const generateCaptcha = () => {
  let code = '';
  for (let i = 0; i < 4; i++) {
    code += Math.floor(Math.random() * 10);
  }
  return code;
};

const LoginScreen = ({ navigation }) => {
  const [enrollmentNo, setEnrollmentNo] = useState('');
  const [password, setPassword] = useState('');
  const [captcha, setCaptcha] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [captchaCode, setCaptchaCode] = useState(generateCaptcha());
  const { login, loginDemo } = useAuth();

  // Refresh captcha function
  const handleRefreshCaptcha = () => {
    const newCaptcha = generateCaptcha();
    setCaptchaCode(newCaptcha);
    setCaptcha(''); // Clear the input field
  };

  const validateForm = () => {
    if (!enrollmentNo.trim()) {
      Alert.alert('Required', 'Please enter enrollment number');
      return false;
    }
    if (!password.trim()) {
      Alert.alert('Required', 'Please enter password');
      return false;
    }
    if (!captcha.trim()) {
      Alert.alert('Required', 'Please enter captcha code');
      return false;
    }
    if (captcha !== captchaCode) {
      Alert.alert('Invalid', 'Captcha code is incorrect. Please try again.');
      return false;
    }
    return true;
  };

  const handleLogin = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      await login(enrollmentNo, password);
    } catch (error) {
      const msg = error.response?.data?.message || 'Login failed. Please check your credentials.';
      Alert.alert('Login Failed', msg);
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = async (role = 'student') => {
    setLoading(true);
    try {
      await loginDemo(role);
    } catch (error) {
      Alert.alert('Demo Error', 'Failed to use demo login.');
    } finally {
      setLoading(false);
    }
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
          </View>

          {/* Form Card */}
          <View style={styles.formCard}>
            {/* Enrollment No Field */}
            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>USERNAME / ENROLLMENT NO.</Text>
              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.input}
                  placeholder="e.g. AJU/221403"
                  placeholderTextColor="#b0bec5"
                  value={enrollmentNo}
                  onChangeText={setEnrollmentNo}
                  editable={!loading}
                  accessible
                  accessibilityLabel="Enrollment number"
                  accessibilityHint="Enter your enrollment number like AJU/221403"
                />
              </View>
            </View>

            {/* Password Field */}
            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>PASSWORD</Text>
              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.input}
                  placeholder="Enter your password"
                  placeholderTextColor="#b0bec5"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                  editable={!loading}
                  accessible
                  accessibilityLabel="Password"
                  accessibilityHint="Enter your password"
                />
                <TouchableOpacity
                  onPress={() => setShowPassword(!showPassword)}
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                  accessible
                  accessibilityRole="button"
                  accessibilityLabel={showPassword ? 'Hide password' : 'Show password'}
                >
                  <Ionicons
                    name={showPassword ? 'eye' : 'eye-off'}
                    size={20}
                    color="#90a4ae"
                  />
                </TouchableOpacity>
              </View>
            </View>

            {/* Captcha Field */}
            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>SECURITY CHECK</Text>
              <View style={styles.captchaContainer}>
                <View style={[styles.inputContainer, { flex: 1 }]}>
                  <TextInput
                    style={styles.input}
                    placeholder="Captcha code"
                    placeholderTextColor="#b0bec5"
                    value={captcha}
                    onChangeText={setCaptcha}
                    editable={!loading}
                    accessible
                    accessibilityLabel="Captcha code"
                    accessibilityHint="Enter the captcha code shown in the image"
                  />
                </View>
                <View style={styles.captchaBox}>
                  <Text style={styles.captchaText}>{captchaCode}</Text>
                </View>
                <TouchableOpacity
                  style={styles.refreshBtn}
                  onPress={handleRefreshCaptcha}
                  accessible
                  accessibilityRole="button"
                  accessibilityLabel="Refresh captcha"
                >
                  <MaterialCommunityIcons name="refresh" size={20} color="#666" />
                </TouchableOpacity>
              </View>
            </View>

            {/* Login Button */}
            <TouchableOpacity
              style={[styles.loginBtn, loading && styles.loginBtnDisabled]}
              onPress={handleLogin}
              disabled={loading}
              accessible
              accessibilityRole="button"
              accessibilityLabel="Login button"
              accessibilityState={{ disabled: loading }}
            >
              <Text style={styles.loginBtnText}>
                {loading ? 'LOGGING IN...' : 'LOGIN'}
              </Text>
            </TouchableOpacity>

            {/* Quick Demo Access */}
            <View style={styles.demoSection}>
              <Text style={styles.demoSectionTitle}>Quick Demo Access</Text>
              <View style={styles.demoBtnGroup}>
                <TouchableOpacity
                  style={[styles.demoBtn, styles.demoBtnStudent]}
                  onPress={() => handleDemoLogin('student')}
                  disabled={loading}
                  accessible
                  accessibilityRole="button"
                  accessibilityLabel="Demo student login"
                >
                  <Ionicons name="person-circle" size={18} color="#fff" style={{ marginRight: 8 }} />
                  <Text style={styles.demoBtnText}>Student</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.demoBtn, styles.demoBtnFaculty]}
                  onPress={() => handleDemoLogin('faculty')}
                  disabled={loading}
                  accessible
                  accessibilityRole="button"
                  accessibilityLabel="Demo faculty login"
                >
                  <Ionicons name="school" size={18} color="#fff" style={{ marginRight: 8 }} />
                  <Text style={styles.demoBtnText}>Faculty</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.demoBtn, styles.demoBtnAdmin]}
                  onPress={() => handleDemoLogin('admin')}
                  disabled={loading}
                  accessible
                  accessibilityRole="button"
                  accessibilityLabel="Demo admin login"
                >
                  <Ionicons name="shield-checkmark" size={18} color="#fff" style={{ marginRight: 8 }} />
                  <Text style={styles.demoBtnText}>Admin</Text>
                </TouchableOpacity>
              </View>
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
    flexGrow: 1,
    justifyContent: 'center',
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
    gap: SPACING.xs,
    width: '100%',
  },
  logoCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoText: {
    color: '#fff',
    fontSize: getResponsiveFontSize(18),
    fontWeight: 'bold',
  },
  universityInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
  },
  universityName: {
    color: '#8b0000',
    fontSize: getResponsiveFontSize(11),
    fontWeight: '800',
    letterSpacing: 0.6,
  },
  divider: {
    width: 2,
    height: 16,
    backgroundColor: '#8b0000',
  },
  universityLocation: {
    color: '#90a4ae',
    fontSize: getResponsiveFontSize(11),
    marginTop: 2,
  },
  naacBadge: {
    backgroundColor: '#8b0000',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.sm,
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
    fontSize: getResponsiveFontSize(11),
    fontWeight: '900',
  },
  formCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: SPACING.xl,
    elevation: 3,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: {
        elevation: 3,
      },
      web: {
        boxShadow: '0px 2px 8px rgba(0,0,0,0.1)',
      },
    }),
  },
  fieldGroup: {
    marginBottom: SPACING.xl,
  },
  fieldLabel: {
    color: '#455a64',
    fontSize: getResponsiveFontSize(10),
    fontWeight: '700',
    letterSpacing: 1.2,
    marginBottom: SPACING.sm,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    paddingHorizontal: SPACING.md,
    backgroundColor: '#fafafa',
  },
  input: {
    flex: 1,
    paddingVertical: SPACING.md,
    color: '#212121',
    fontSize: getResponsiveFontSize(14),
  },
  captchaContainer: {
    flexDirection: 'row',
    gap: SPACING.sm,
    alignItems: 'center',
  },
  captchaInput: {
    flex: 1,
  },
  captchaBox: {
    backgroundColor: '#eceff1',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: 6,
    minWidth: 80,
    alignItems: 'center',
    justifyContent: 'center',
  },
  captchaText: {
    color: '#1abc9c',
    fontSize: getResponsiveFontSize(18),
    fontWeight: '700',
    letterSpacing: 2,
  },
  refreshBtn: {
    padding: SPACING.sm,
  },
  loginBtn: {
    backgroundColor: '#2c3e50',
    paddingVertical: SPACING.lg,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: SPACING.lg,
    marginBottom: SPACING.lg,
  },
  loginBtnDisabled: {
    opacity: 0.6,
  },
  loginBtnText: {
    color: '#fff',
    fontSize: getResponsiveFontSize(14),
    fontWeight: '700',
    letterSpacing: 1,
  },
  demoBtn: {
    flexDirection: 'row',
    paddingVertical: SPACING.md,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  demoBtnStudent: {
    backgroundColor: '#0891b2',
  },
  demoBtnFaculty: {
    backgroundColor: '#8b5cf6',
  },
  demoBtnAdmin: {
    backgroundColor: '#dc2626',
  },
  demoBtnText: {
    color: '#fff',
    fontSize: getResponsiveFontSize(13),
    fontWeight: '600',
  },
  demoSection: {
    marginTop: SPACING.lg,
    marginBottom: SPACING.lg,
  },
  demoSectionTitle: {
    color: '#455a64',
    fontSize: getResponsiveFontSize(11),
    fontWeight: '700',
    letterSpacing: 1.2,
    marginBottom: SPACING.md,
  },
  demoBtnGroup: {
    flexDirection: 'row',
    gap: SPACING.sm,
    width: '100%',
  },
  signupContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  signupText: {
    color: '#78909c',
    fontSize: getResponsiveFontSize(12),
  },
  signupLink: {
    color: '#8b0000',
    fontSize: getResponsiveFontSize(12),
    fontWeight: '700',
  },
});

export default LoginScreen;
