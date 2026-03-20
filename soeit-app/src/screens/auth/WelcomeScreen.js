import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Dimensions,
  ImageBackground,
  SafeAreaView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';

const { width, height } = Dimensions.get('window');

const WelcomeScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <ImageBackground
        source={{ uri: 'https://images.unsplash.com/photo-1523050853064-85a17f2cc309?w=800' }}
        style={styles.heroImage}
        resizeMode="cover"
      >
        <LinearGradient
          colors={['transparent', 'rgba(0,0,0,0.8)', '#000']}
          style={styles.gradient}
        >
          <SafeAreaView style={styles.content}>
            <View style={styles.logoContainer}>
              <View style={styles.logoBadge}>
                <Ionicons name="school" size={40} color={COLORS.secondary} />
              </View>
              <Text style={styles.brandName}>SOEIT</Text>
              <Text style={styles.brandSub}>ACHIEVEMENT PORTAL</Text>
            </View>

            <View style={styles.textContainer}>
              <Text style={styles.title}>Ignite Your Academic Journey</Text>
              <Text style={styles.subtitle}>
                A unified platform to track achievements, manage internships, and showcase your professional portfolio.
              </Text>
            </View>

            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={styles.primaryBtn}
                onPress={() => navigation.navigate('Login')}
                activeOpacity={0.8}
              >
                <LinearGradient
                  colors={[COLORS.primary, '#4f46e5']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.btnGradient}
                >
                  <Text style={styles.primaryBtnText}>Sign In</Text>
                  <Ionicons name="arrow-forward" size={20} color="#fff" />
                </LinearGradient>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.secondaryBtn}
                onPress={() => navigation.navigate('Register')}
                activeOpacity={0.7}
              >
                <Text style={styles.secondaryBtnText}>Create New Account</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.footer}>
              <Text style={styles.footerText}>Powered by ARJU University</Text>
            </View>
          </SafeAreaView>
        </LinearGradient>
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  heroImage: { flex: 1, width: '100%', height: height * 0.7 },
  gradient: { flex: 1, justifyContent: 'flex-end' },
  content: { padding: 30, flex: 1, justifyContent: 'space-between' },
  logoContainer: { alignItems: 'center', marginTop: 50 },
  logoBadge: {
    width: 80,
    height: 80,
    borderRadius: 24,
    backgroundColor: 'rgba(255,255,255,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
    marginBottom: 15,
  },
  brandName: { color: '#fff', fontSize: 32, fontWeight: '900', letterSpacing: 2 },
  brandSub: { color: COLORS.secondary, fontSize: 12, fontWeight: '800', letterSpacing: 4, marginTop: 5 },
  textContainer: { marginBottom: 40 },
  title: {
    color: '#fff',
    fontSize: 38,
    fontWeight: '900',
    lineHeight: 45,
    marginBottom: 15,
  },
  subtitle: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '500',
  },
  buttonContainer: { gap: 15, marginBottom: 30 },
  primaryBtn: { borderRadius: 20, overflow: 'hidden', elevation: 8, shadowColor: COLORS.primary, shadowOpacity: 0.5, shadowRadius: 15 },
  btnGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    gap: 10,
  },
  primaryBtnText: { color: '#fff', fontSize: 18, fontWeight: '800' },
  secondaryBtn: {
    paddingVertical: 18,
    borderRadius: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
    backgroundColor: 'rgba(255,255,255,0.05)',
  },
  secondaryBtnText: { color: '#fff', fontSize: 16, fontWeight: '700' },
  footer: { alignItems: 'center', marginBottom: 10 },
  footerText: { color: 'rgba(255,255,255,0.4)', fontSize: 12, fontWeight: '600', letterSpacing: 1 },
});

export default WelcomeScreen;
