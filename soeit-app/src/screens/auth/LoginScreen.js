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
import { SPACING, getResponsiveFontSize } from '../../utils/responsive';

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const { login, loginDemo } = useAuth();

  const validateForm = () => {
    const newErrors = {};
    if (!email) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = 'Please enter a valid email';
    }
    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async () => {
    if (!validateForm()) {
      Alert.alert('Validation Error', 'Please correct the errors in the form');
      return;
    }

    setLoading(true);
    try {
      await login(email, password);
    } catch (error) {
      const msg = error.response?.data?.message || 'Login failed. Please check your credentials.';
      Alert.alert('Login Failed', msg);
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = async (role) => {
    setLoading(true);
    try {
      await loginDemo(role);
    } catch (error) {
      Alert.alert('Demo Error', 'Could not start demo');
    } finally {
      setLoading(false);
    }
  };

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
          showsVerticalScrollIndicator={false}
          scrollEnabled={true}
        >
          <TouchableOpacity
            style={styles.backBtn}
            onPress={() => navigation.goBack()}
            accessible
            accessibilityRole="button"
            accessibilityLabel="Go back"
            accessibilityHint="Returns to the welcome screen"
          >
            <Ionicons name="arrow-back" size={24} color={COLORS.textPrimary} />
          </TouchableOpacity>

          <View style={styles.header}>
            <LinearGradient
              colors={COLORS.gradientPrimary}
              style={styles.logoContainer}
            >
              <Ionicons name="school" size={40} color="#fff" />
            </LinearGradient>
            <Text
              style={styles.title}
              allowFontScaling
              maxFontSizeMultiplier={1.3}
            >
              SoEIT Portal
            </Text>
            <Text
              style={styles.subtitle}
              allowFontScaling
              maxFontSizeMultiplier={1.2}
            >
              Achievement & Management System
            </Text>
          </View>

          <View style={styles.card}>
            <Text
              style={styles.cardTitle}
              accessible
              accessibilityRole="header"
              allowFontScaling
              maxFontSizeMultiplier={1.3}
            >
              Sign In
            </Text>

            <View style={styles.formContainer}>
              <Input
                label="Email Address"
                placeholder="e.g. john@university.ac.in"
                value={email}
                onChangeText={(value) => {
                  setEmail(value);
                  if (errors.email) setErrors({ ...errors, email: null });
                }}
                keyboardType="email-address"
                autoCapitalize="none"
                error={errors.email}
                icon={<Ionicons name="mail-outline" size={20} color={COLORS.textSecondary} />}
                accessibilityLabel="Email address input"
                accessibilityHint="Enter your university email address"
                testID="emailInput"
                required
              />

              <Input
                label="Password"
                placeholder="••••••••"
                value={password}
                onChangeText={(value) => {
                  setPassword(value);
                  if (errors.password) setErrors({ ...errors, password: null });
                }}
                secureTextEntry
                error={errors.password}
                icon={<Ionicons name="lock-closed-outline" size={20} color={COLORS.textSecondary} />}
                accessibilityLabel="Password input"
                accessibilityHint="Enter your password. At least 6 characters"
                testID="passwordInput"
                required
              />

              <TouchableOpacity
                style={styles.forgotPass}
                onPress={() => Alert.alert('Info', 'Password reset feature coming soon')}
                accessible
                accessibilityRole="button"
                accessibilityLabel="Forgot password"
                accessibilityHint="Opens the password reset screen"
              >
                <Text style={styles.forgotPassText}>Forgot Password?</Text>
              </TouchableOpacity>

              <Button
                title="Sign In"
                onPress={handleLogin}
                loading={loading}
                style={styles.loginBtn}
                accessibilityLabel="Sign in to your account"
                accessibilityHint="Submits the login form"
                accessibilityState={{ disabled: loading }}
                testID="loginButton"
              />
            </View>

            <View style={styles.demoSection}>
              <Text
                style={styles.demoTitle}
                accessible
                accessibilityRole="header"
                allowFontScaling
                maxFontSizeMultiplier={1.2}
              >
                Quick Demo Access
              </Text>
              <View
                style={styles.demoButtons}
                accessible
                accessibilityRole="group"
                accessibilityLabel="Demo login options"
              >
                <TouchableOpacity
                  style={[styles.demoBtn, { backgroundColor: COLORS.success + '20' }]}
                  onPress={() => handleDemoLogin('student')}
                  accessible
                  accessibilityRole="button"
                  accessibilityLabel="Login as student (demo)"
                  accessibilityHint="Opens student demo dashboard"
                >
                  <Ionicons name="person" size={18} color={COLORS.success} />
                  <Text style={[styles.demoBtnText, { color: COLORS.success }]}>Student</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.demoBtn, { backgroundColor: COLORS.secondary + '20' }]}
                  onPress={() => handleDemoLogin('admin')}
                  accessible
                  accessibilityRole="button"
                  accessibilityLabel="Login as admin (demo)"
                  accessibilityHint="Opens admin demo dashboard"
                >
                  <Ionicons name="shield" size={18} color={COLORS.secondary} />
                  <Text style={[styles.demoBtnText, { color: COLORS.secondary }]}>Admin</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.demoBtn, { backgroundColor: '#8b5cf620' }]}
                  onPress={() => handleDemoLogin('faculty')}
                  accessible
                  accessibilityRole="button"
                  accessibilityLabel="Login as faculty (demo)"
                  accessibilityHint="Opens faculty demo dashboard"
                >
                  <Ionicons name="school" size={18} color="#8b5cf6" />
                  <Text style={[styles.demoBtnText, { color: '#8b5cf6' }]}>Faculty</Text>
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.footer}>
              <Text
                style={styles.footerText}
                allowFontScaling
                maxFontSizeMultiplier={1.2}
              >
                Don't have an account?{' '}
              </Text>
              <TouchableOpacity
                onPress={() => navigation.navigate('Register')}
                accessible
                accessibilityRole="button"
                accessibilityLabel="Create a new account"
              >
                <Text style={styles.registerLink}>Register</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.universityBranding}>
            <Text
              style={styles.brandingText}
              allowFontScaling
              maxFontSizeMultiplier={1.1}
            >
              Arka Jain University
            </Text>
            <Text
              style={styles.brandingSubtext}
              allowFontScaling
              maxFontSizeMultiplier={1.1}
            >
              School of Engineering & IT
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: SPACING.xl,
    paddingTop: Platform.OS === 'ios' ? SPACING.xxxl + 20 : SPACING.xxxl,
    flexGrow: 1,
    justifyContent: 'flex-start',
  },
  backBtn: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 50 : 30,
    left: SPACING.lg,
    zIndex: 10,
    padding: SPACING.md,
    borderRadius: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
  },
  header: {
    alignItems: 'center',
    marginBottom: SPACING.xxxl,
  },
  logoContainer: {
    width: 80,
    height: 80,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.lg,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  title: {
    fontSize: getResponsiveFontSize(32),
    fontWeight: '800',
    color: COLORS.textPrimary,
    fontFamily: 'System',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: getResponsiveFontSize(16),
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginTop: SPACING.sm,
  },
  card: {
    backgroundColor: COLORS.bgCard,
    borderRadius: 24,
    padding: SPACING.xl,
    borderWidth: 1,
    borderColor: COLORS.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.08,
    shadowRadius: 24,
    elevation: 8,
    marginBottom: SPACING.xl,
  },
  cardTitle: {
    fontSize: getResponsiveFontSize(24),
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginBottom: SPACING.xl,
  },
  formContainer: {
    marginBottom: SPACING.xl,
  },
  loginBtn: {
    marginTop: SPACING.lg,
    marginBottom: 0,
  },
  demoSection: {
    marginTop: SPACING.xxxl,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    paddingTop: SPACING.xl,
  },
  demoTitle: {
    fontSize: getResponsiveFontSize(14),
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginBottom: SPACING.lg,
    fontWeight: '600',
  },
  demoButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: SPACING.md,
  },
  demoBtn: {
    flex: 1,
    flexDirection: 'row',
    height: 56,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.sm,
    paddingHorizontal: SPACING.sm,
  },
  demoBtnText: {
    fontSize: getResponsiveFontSize(13),
    fontWeight: '700',
  },
  forgotPass: {
    alignSelf: 'flex-end',
    marginBottom: SPACING.lg,
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.md,
  },
  forgotPassText: {
    color: COLORS.primary,
    fontSize: getResponsiveFontSize(14),
    fontWeight: '600',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: SPACING.xl,
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
    flexWrap: 'wrap',
  },
  footerText: {
    color: COLORS.textSecondary,
    fontSize: getResponsiveFontSize(14),
  },
  registerLink: {
    color: COLORS.primary,
    fontSize: getResponsiveFontSize(14),
    fontWeight: '700',
  },
  universityBranding: {
    marginTop: SPACING.xxxl,
    paddingVertical: SPACING.xxxl,
    alignItems: 'center',
  },
  brandingText: {
    color: COLORS.textMuted,
    fontSize: getResponsiveFontSize(14),
    fontWeight: '700',
    letterSpacing: 1,
  },
  brandingSubtext: {
    color: COLORS.textMuted,
    fontSize: getResponsiveFontSize(12),
    marginTop: SPACING.xs,
  },
});

export default LoginScreen;
