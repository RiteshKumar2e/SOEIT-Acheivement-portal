import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS } from '../../constants/colors';
import { useAuth } from '../../context/AuthContext';
import Button from '../../components/common/Button';
import { SPACING, getResponsiveFontSize } from '../../utils/responsive';

const ProfileItem = ({
  icon,
  label,
  value,
  color = COLORS.primary,
  accessible = true,
}) => (
  <View
    style={styles.profileItem}
    accessible
    accessibilityRole="text"
    accessibilityLabel={`${label}: ${value || 'Not Set'}`}
  >
    <View style={[styles.itemIcon, { backgroundColor: color + '15' }]}>
      <Ionicons name={icon} size={22} color={color} />
    </View>
    <View style={styles.itemContent}>
      <Text
        style={styles.itemLabel}
        allowFontScaling
        maxFontSizeMultiplier={1.2}
      >
        {label}
      </Text>
      <Text
        style={styles.itemValue}
        allowFontScaling
        maxFontSizeMultiplier={1.2}
      >
        {value || 'Not Set'}
      </Text>
    </View>
  </View>
);

const MenuItem = ({ icon, label, onPress, testID }) => (
  <TouchableOpacity
    style={styles.menuItem}
    onPress={onPress}
    accessible
    accessibilityRole="button"
    accessibilityLabel={label}
    testID={testID}
  >
    <Ionicons name={icon} size={22} color={COLORS.textSecondary} />
    <Text
      style={styles.menuText}
      allowFontScaling
      maxFontSizeMultiplier={1.2}
    >
      {label}
    </Text>
    <Ionicons name="chevron-forward" size={18} color={COLORS.textMuted} />
  </TouchableOpacity>
);

const ProfileScreen = () => {
  const { user, logout, isAdmin } = useAuth();

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Logout', style: 'destructive', onPress: logout },
      ]
    );
  };

  return (
    <ScrollView
      style={styles.container}
      showsVerticalScrollIndicator={false}
      scrollEnabled={true}
    >
      <View style={styles.header}>
        <LinearGradient
          colors={isAdmin ? COLORS.gradientSecondary : COLORS.gradientPrimary}
          style={styles.avatarLarge}
        >
          <Text
            style={styles.avatarChar}
            allowFontScaling
            maxFontSizeMultiplier={1.3}
          >
            {user?.name[0]}
          </Text>
        </LinearGradient>
        <Text
          style={styles.userName}
          allowFontScaling
          maxFontSizeMultiplier={1.3}
          accessible
          accessibilityRole="header"
        >
          {user?.name}
        </Text>
        <View
          style={[
            styles.roleLabel,
            {
              backgroundColor: isAdmin
                ? COLORS.secondary + '20'
                : COLORS.primary + '20',
            },
          ]}
          accessible
          accessibilityLabel={`Role: ${user?.role}`}
        >
          <Text
            style={[
              styles.roleText,
              { color: isAdmin ? COLORS.secondary : COLORS.primary },
            ]}
            allowFontScaling
            maxFontSizeMultiplier={1.1}
          >
            {user?.role.toUpperCase()}
          </Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text
          style={styles.sectionTitle}
          accessible
          accessibilityRole="header"
          allowFontScaling
          maxFontSizeMultiplier={1.2}
        >
          Account Information
        </Text>
        <View style={styles.card}>
          <ProfileItem
            icon="mail-outline"
            label="Email Address"
            value={user?.email}
          />
          <View style={styles.divider} />
          {user?.enrollmentNo && (
            <>
              <ProfileItem
                icon="id-card-outline"
                label="Enrollment Number"
                value={user?.enrollmentNo}
                color={COLORS.secondary}
              />
              <View style={styles.divider} />
            </>
          )}
          {!isAdmin && (
            <>
              <TouchableOpacity
                style={styles.resumeBtn}
                activeOpacity={0.8}
                onPress={() =>
                  Alert.alert(
                    'Resume Hub',
                    'Your professional resume is being generated using the SOEIT Engine...'
                  )
                }
                accessible
                accessibilityRole="button"
                accessibilityLabel="Generate AI Resume"
                accessibilityHint="Creates a professional resume based on your achievements"
              >
                <LinearGradient
                  colors={['#06b6d4', '#3b82f6']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.resumeGradient}
                >
                  <Ionicons name="document-text" size={20} color="#fff" />
                  <Text
                    style={styles.resumeText}
                    allowFontScaling
                    maxFontSizeMultiplier={1.2}
                  >
                    Generate AI Resume
                  </Text>
                  <Ionicons name="sparkles" size={16} color="#fff" />
                </LinearGradient>
              </TouchableOpacity>
              <View style={styles.divider} />
            </>
          )}
          <ProfileItem
            icon="calendar-outline"
            label="Joined On"
            value={
              user?.createdAt
                ? new Date(user.createdAt).toLocaleDateString()
                : 'August 2024'
            }
            color="#ec4899"
          />
        </View>
      </View>

      <View style={styles.section}>
        <Text
          style={styles.sectionTitle}
          accessible
          accessibilityRole="header"
          allowFontScaling
          maxFontSizeMultiplier={1.2}
        >
          Settings & Preferences
        </Text>
        <View style={styles.card}>
          <MenuItem
            icon="notifications-outline"
            label="Push Notifications"
            onPress={() =>
              Alert.alert('Info', 'Notification settings coming soon')
            }
            testID="notificationSettings"
          />
          <View style={styles.divider} />
          <MenuItem
            icon="shield-checkmark-outline"
            label="Security & Privacy"
            onPress={() =>
              Alert.alert('Info', 'Security settings coming soon')
            }
            testID="securitySettings"
          />
          <View style={styles.divider} />
          <MenuItem
            icon="help-circle-outline"
            label="Help & Support"
            onPress={() => Alert.alert('Info', 'Help center coming soon')}
            testID="helpCenter"
          />
        </View>
      </View>

      <Button
        title="Logout Account"
        onPress={handleLogout}
        variant="danger"
        style={styles.logoutBtn}
        accessibilityLabel="Logout from your account"
        accessibilityHint="Sign out and return to login screen"
        testID="logoutButton"
      />

      <View style={styles.footer}>
        <Text
          style={styles.footerText}
          allowFontScaling
          maxFontSizeMultiplier={1.1}
        >
          SoEIT Achievement Portal v1.0.0
        </Text>
        <Text
          style={styles.footerSub}
          allowFontScaling
          maxFontSizeMultiplier={1.1}
        >
          Designed by Ritesh Kumar
        </Text>
      </View>

      <View style={{ height: SPACING.xxxl }} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.bgPrimary,
  },
  header: {
    paddingVertical: SPACING.xxxl,
    alignItems: 'center',
    backgroundColor: COLORS.bgSecondary,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  avatarLarge: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.lg,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 15,
    elevation: 8,
  },
  avatarChar: {
    fontSize: getResponsiveFontSize(40),
    fontWeight: '800',
    color: '#fff',
  },
  userName: {
    fontSize: getResponsiveFontSize(24),
    fontWeight: '800',
    color: COLORS.textPrimary,
  },
  roleLabel: {
    marginTop: SPACING.md,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.sm,
    borderRadius: 20,
  },
  roleText: {
    fontSize: getResponsiveFontSize(12),
    fontWeight: '800',
    letterSpacing: 1,
  },
  section: {
    paddingHorizontal: SPACING.xl,
    marginTop: SPACING.xxxl,
  },
  sectionTitle: {
    fontSize: getResponsiveFontSize(16),
    fontWeight: '700',
    color: COLORS.textSecondary,
    marginBottom: SPACING.lg,
    marginLeft: SPACING.sm,
  },
  card: {
    backgroundColor: COLORS.bgCard,
    borderRadius: 24,
    padding: SPACING.xl,
    borderWidth: 1,
    borderColor: COLORS.border,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 10,
    elevation: 2,
  },
  profileItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.md,
  },
  itemIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.lg,
  },
  itemContent: {
    flex: 1,
  },
  itemLabel: {
    fontSize: getResponsiveFontSize(13),
    color: COLORS.textMuted,
    marginBottom: SPACING.xs,
  },
  itemValue: {
    fontSize: getResponsiveFontSize(15),
    fontWeight: '600',
    color: COLORS.textPrimary,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.border,
    marginVertical: SPACING.sm,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.lg,
  },
  menuText: {
    flex: 1,
    fontSize: getResponsiveFontSize(16),
    fontWeight: '600',
    color: COLORS.textPrimary,
    marginLeft: SPACING.lg,
  },
  logoutBtn: {
    marginHorizontal: SPACING.xl,
    marginTop: SPACING.xxxl,
    marginBottom: SPACING.xl,
  },
  resumeBtn: {
    marginVertical: SPACING.md,
  },
  resumeGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.md,
    borderRadius: 12,
    gap: SPACING.md,
  },
  resumeText: {
    color: '#fff',
    fontSize: getResponsiveFontSize(14),
    fontWeight: '800',
  },
  footer: {
    marginTop: SPACING.xxxl,
    alignItems: 'center',
    paddingHorizontal: SPACING.xl,
  },
  footerText: {
    color: COLORS.textMuted,
    fontSize: getResponsiveFontSize(13),
    fontWeight: '700',
  },
  footerSub: {
    color: COLORS.textMuted,
    fontSize: getResponsiveFontSize(12),
    marginTop: SPACING.sm,
  },
});

export default ProfileScreen;
