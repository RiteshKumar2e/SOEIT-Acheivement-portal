import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Image,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';
import { useAuth } from '../../context/AuthContext';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, loginDemo } = useAuth();

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please enter email and password');
      return;
    }

    setLoading(true);
    try {
      await login(email, password);
      // AuthProvider automatically updates state, AppNavigator will switch
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
        >
          <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color={COLORS.textPrimary} />
          </TouchableOpacity>
          <View style={styles.header}>
            <LinearGradient
              colors={COLORS.gradientPrimary}
              style={styles.logoContainer}
            >
              <Ionicons name="school" size={40} color="#fff" />
            </LinearGradient>
            <Text style={styles.title}>SOEIT Portal</Text>
            <Text style={styles.subtitle}>Achievement & Management System</Text>
          </View>

          <View style={styles.card}>
            <Text style={styles.cardTitle}>Login</Text>
            
            <Input
              label="Email Address"
              placeholder="e.g. john@university.ac.in"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              icon={<Ionicons name="mail-outline" size={20} color={COLORS.textSecondary} />}
            />

            <Input
              label="Password"
              placeholder="••••••••"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              icon={<Ionicons name="lock-closed-outline" size={20} color={COLORS.textSecondary} />}
            />

            <TouchableOpacity style={styles.forgotPass}>
              <Text style={styles.forgotPassText}>Forgot Password?</Text>
            </TouchableOpacity>

            <Button
              title="Sign In"
              onPress={handleLogin}
              loading={loading}
              style={styles.loginBtn}
            />

            <View style={styles.demoSection}>
              <Text style={styles.demoTitle}>Quick Demo Access</Text>
              <View style={styles.demoButtons}>
                <TouchableOpacity 
                  style={[styles.demoBtn, { backgroundColor: COLORS.success + '20' }]} 
                  onPress={() => handleDemoLogin('student')}
                >
                  <Ionicons name="person" size={18} color={COLORS.success} />
                  <Text style={[styles.demoBtnText, { color: COLORS.success }]}>Student</Text>
                </TouchableOpacity>

                <TouchableOpacity 
                  style={[styles.demoBtn, { backgroundColor: COLORS.secondary + '20' }]}
                  onPress={() => handleDemoLogin('admin')}
                >
                  <Ionicons name="shield" size={18} color={COLORS.secondary} />
                  <Text style={[styles.demoBtnText, { color: COLORS.secondary }]}>Admin</Text>
                </TouchableOpacity>

                <TouchableOpacity 
                  style={[styles.demoBtn, { backgroundColor: '#8b5cf620' }]}
                  onPress={() => handleDemoLogin('faculty')}
                >
                  <Ionicons name="school" size={18} color="#8b5cf6" />
                  <Text style={[styles.demoBtnText, { color: '#8b5cf6' }]}>Faculty</Text>
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.footer}>
              <Text style={styles.footerText}>Don't have an account? </Text>
              <TouchableOpacity onPress={() => navigation.navigate('Register')}>
                <Text style={styles.registerLink}>Register</Text>
              </TouchableOpacity>
            </View>
          </View>
          
          <View style={styles.universityBranding}>
            <Text style={styles.brandingText}>Arka Jain University</Text>
            <Text style={styles.brandingSubtext}>School of Engineering & IT</Text>
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
    paddingTop: Platform.OS === 'ios' ? 80 : 60,
    flexGrow: 1,
  },
  backBtn: {
    position: 'absolute',
    top: 10,
    left: 0,
    zIndex: 10,
    padding: 10,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logoContainer: {
    width: 80,
    height: 80,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: COLORS.textPrimary,
    fontFamily: 'System',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginTop: 4,
  },
  card: {
    backgroundColor: COLORS.bgCard,
    borderRadius: 24,
    padding: 24,
    borderWidth: 1,
    borderColor: COLORS.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 30,
    elevation: 15,
  },
  cardTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginBottom: 24,
  },
  loginBtn: { marginTop: 10 },
  demoSection: {
    marginTop: 32,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    paddingTop: 24,
  },
  demoTitle: {
    fontSize: 14,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginBottom: 16,
    fontWeight: '600',
  },
  demoButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  demoBtn: {
    flex: 1,
    flexDirection: 'row',
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  demoBtnText: {
    fontSize: 14,
    fontWeight: '700',
  },
  forgotPass: {
    alignSelf: 'flex-end',
    marginBottom: 20,
  },
  forgotPassText: {
    color: COLORS.primary,
    fontSize: 14,
    fontWeight: '600',
  },
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
  registerLink: {
    color: COLORS.primary,
    fontSize: 14,
    fontWeight: '700',
  },
  universityBranding: {
    marginTop: 'auto',
    paddingVertical: 32,
    alignItems: 'center',
  },
  brandingText: {
    color: COLORS.textMuted,
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 1,
  },
  brandingSubtext: {
    color: COLORS.textMuted,
    fontSize: 12,
    marginTop: 2,
  },
});

export default LoginScreen;
