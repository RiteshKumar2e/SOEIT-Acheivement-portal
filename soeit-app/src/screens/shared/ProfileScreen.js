import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
  Platform,
  TextInput,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import * as ImagePicker from 'expo-image-picker';
import { COLORS } from '../../constants/colors';
import { useAuth } from '../../context/AuthContext';
import Button from '../../components/common/Button';
import { SPACING, getResponsiveFontSize } from '../../utils/responsive';

const ProfileItem = ({
  icon,
  label,
  value,
  color = COLORS.primary,
}) => (
  <View style={styles.profileItem}>
    <View style={[styles.itemIcon, { backgroundColor: color + '15' }]}>
      <Ionicons name={icon} size={22} color={color} />
    </View>
    <View style={styles.itemContent}>
      <Text style={styles.itemLabel} allowFontScaling maxFontSizeMultiplier={1.2}>
        {label}
      </Text>
      <Text style={styles.itemValue} allowFontScaling maxFontSizeMultiplier={1.2}>
        {value || 'Not Set'}
      </Text>
    </View>
  </View>
);

const MenuItem = ({ icon, label, onPress }) => (
  <TouchableOpacity style={styles.menuItem} onPress={onPress}>
    <Ionicons name={icon} size={22} color={COLORS.textSecondary} />
    <Text style={styles.menuText} allowFontScaling maxFontSizeMultiplier={1.2}>
      {label}
    </Text>
    <Ionicons name="chevron-forward" size={18} color={COLORS.textMuted} />
  </TouchableOpacity>
);

const EditableField = ({
  label,
  value,
  onChange,
  icon,
  placeholder,
  editable = true,
}) => (
  <View style={styles.fieldContainer}>
    <Text style={styles.fieldLabel}>{label}</Text>
    <View style={[styles.fieldInput, !editable && { backgroundColor: COLORS.bgSecondary }]}>
      <Ionicons 
        name={icon} 
        size={18} 
        color={editable ? COLORS.primary : COLORS.textMuted}
        style={styles.fieldIcon}
      />
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChange}
        placeholder={placeholder}
        placeholderTextColor={COLORS.textMuted}
        editable={editable}
        {...(icon === 'mail' && { keyboardType: 'email-address' })}
        {...(icon === 'call' && { keyboardType: 'phone-pad' })}
      />
    </View>
  </View>
);

const ProfileScreen = ({ navigation }) => {
  const { user, logout, isAdmin, updateProfile, changePassword, updateUser } = useAuth();
  const [activeTab, setActiveTab] = useState('view');
  const [loading, setLoading] = useState(false);
  const [profileImage, setProfileImage] = useState(user?.profileImage || null);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    bio: user?.bio || '',
    batch: user?.batch || '',
    semester: user?.semester || '',
    section: user?.section || '',
    linkedIn: user?.linkedIn || '',
    github: user?.github || '',
    portfolio: user?.portfolio || '',
  });
  const [pwFormData, setPwFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

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

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Required', 'We need access to your photo library');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled) {
      const selectedUri = result.assets[0].uri;
      setProfileImage(selectedUri);
      
      // If we're not in edit mode, suggest saving or automatically switch to edit
      if (activeTab !== 'edit') {
        Alert.alert(
          'Update Profile Picture',
          'Would you like to save this as your new profile picture?',
          [
            { text: 'Cancel', style: 'cancel', onPress: () => setProfileImage(user?.profileImage) },
            { 
              text: 'Save Now', 
              onPress: () => {
                // We'll call the update logic directly here for a better UX
                requestAnimationFrame(() => handleUpdateProfile(selectedUri));
              } 
            },
          ]
        );
      }
    }
  };

  const handleUpdateProfile = async (directImageUri = null) => {
    setLoading(true);
    try {
      const fd = new FormData();
      
      // Add text fields
      Object.entries(formData).forEach(([key, value]) => {
        if (value && value.toString().trim()) {
          fd.append(key, value);
        }
      });

      // Add image - use direct URI if provided (from pickImage) or state
      const imgToUpload = directImageUri || (profileImage !== user?.profileImage ? profileImage : null);

      if (imgToUpload) {
        const filename = imgToUpload.split('/').pop();
        const match = /\.(\w+)$/.exec(filename);
        const type = match ? `image/${match[1]}` : 'image/jpeg';
        
        fd.append('profileImage', {
          uri: imgToUpload,
          type: type,
          name: filename,
        });
      }

      const updated = await updateProfile(fd);
      updateUser(updated);
      Alert.alert('Success', 'Profile updated successfully!');
      setActiveTab('view');
    } catch (error) {
      const message = error?.response?.data?.message || error?.message || 'Failed to update profile';
      Alert.alert('Error', message);
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async () => {
    setLoading(true);
    try {
      if (pwFormData.newPassword !== pwFormData.confirmPassword) {
        Alert.alert('Error', 'Passwords do not match');
        setLoading(false);
        return;
      }

      const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
      if (!passwordRegex.test(pwFormData.newPassword)) {
        Alert.alert(
          'Weak Password',
          'Password must be at least 8 chars with uppercase, lowercase, number, and special character'
        );
        setLoading(false);
        return;
      }

      await changePassword({
        currentPassword: pwFormData.currentPassword,
        newPassword: pwFormData.newPassword,
      });
      Alert.alert('Success', 'Password changed successfully!');
      setPwFormData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setActiveTab('view');
    } catch (error) {
      Alert.alert('Error', error.response?.data?.message || 'Failed to change password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.avatarWrapper}>
          <LinearGradient
            colors={isAdmin ? COLORS.gradientSecondary : COLORS.gradientPrimary}
            style={styles.avatarLarge}
          >
            {profileImage ? (
              <Image
                source={{ uri: profileImage }}
                style={styles.avatarImage}
              />
            ) : (
              <Text style={styles.avatarChar} allowFontScaling maxFontSizeMultiplier={1.3}>
                {user?.name?.[0]?.toUpperCase() || 'U'}
              </Text>
            )}
          </LinearGradient>
          <TouchableOpacity style={styles.cameraButton} onPress={pickImage}>
            <Ionicons name="camera" size={20} color="#fff" />
          </TouchableOpacity>
        </View>
        <Text style={styles.userName} allowFontScaling maxFontSizeMultiplier={1.3}>
          {user?.name}
        </Text>
        <View
          style={[
            styles.roleLabel,
            {
              backgroundColor: isAdmin ? COLORS.secondary + '20' : COLORS.primary + '20',
            },
          ]}
        >
          <Text
            style={[
              styles.roleText,
              { color: isAdmin ? COLORS.secondary : COLORS.primary },
            ]}
            allowFontScaling
            maxFontSizeMultiplier={1.1}
          >
            {user?.role?.toUpperCase()}
          </Text>
        </View>

        {/* Tab Buttons */}
        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={[styles.tabButton, activeTab === 'view' && styles.tabActive]}
            onPress={() => setActiveTab('view')}
          >
            <Ionicons
              name="eye-outline"
              size={16}
              color={activeTab === 'view' ? COLORS.primary : COLORS.textMuted}
            />
            <Text
              style={[
                styles.tabText,
                activeTab === 'view' && styles.tabTextActive,
              ]}
            >
              View
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tabButton, activeTab === 'edit' && styles.tabActive]}
            onPress={() => setActiveTab('edit')}
          >
            <Ionicons
              name="create-outline"
              size={16}
              color={activeTab === 'edit' ? COLORS.primary : COLORS.textMuted}
            />
            <Text
              style={[
                styles.tabText,
                activeTab === 'edit' && styles.tabTextActive,
              ]}
            >
              Edit
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tabButton, activeTab === 'password' && styles.tabActive]}
            onPress={() => setActiveTab('password')}
          >
            <Ionicons
              name="lock-closed-outline"
              size={16}
              color={activeTab === 'password' ? COLORS.primary : COLORS.textMuted}
            />
            <Text
              style={[
                styles.tabText,
                activeTab === 'password' && styles.tabTextActive,
              ]}
            >
              Security
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* View Tab */}
      {activeTab === 'view' && (
        <>
          <View style={styles.section}>
            <Text style={styles.sectionTitle} allowFontScaling maxFontSizeMultiplier={1.2}>
              Account Information
            </Text>
            <View style={styles.card}>
              <ProfileItem icon="mail-outline" label="Email" value={user?.email} />
              <View style={styles.divider} />
              {user?.enrollmentNo && (
                <>
                  <ProfileItem
                    icon="id-card-outline"
                    label="Enrollment No."
                    value={user?.enrollmentNo}
                    color={COLORS.secondary}
                  />
                  <View style={styles.divider} />
                </>
              )}
              {user?.batch && (
                <>
                  <ProfileItem
                    icon="school-outline"
                    label="Batch"
                    value={user?.batch}
                    color={COLORS.secondary}
                  />
                  <View style={styles.divider} />
                </>
              )}
              {user?.semester && (
                <>
                  <ProfileItem
                    icon="layers-outline"
                    label="Semester"
                    value={`Sem ${user?.semester}`}
                    color="#f59e0b"
                  />
                  <View style={styles.divider} />
                </>
              )}
              {user?.section && (
                <>
                  <ProfileItem
                    icon="documents-outline"
                    label="Section"
                    value={user?.section}
                    color="#8b5cf6"
                  />
                  <View style={styles.divider} />
                </>
              )}
              {user?.phone && (
                <>
                  <ProfileItem
                    icon="call-outline"
                    label="Phone"
                    value={user?.phone}
                    color="#10b981"
                  />
                  <View style={styles.divider} />
                </>
              )}
              {user?.bio && (
                <>
                  <ProfileItem
                    icon="information-circle-outline"
                    label="Bio"
                    value={user?.bio}
                    color="#ec4899"
                  />
                  <View style={styles.divider} />
                </>
              )}
              <ProfileItem
                icon="calendar-outline"
                label="Joined On"
                value={user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'August 2024'}
                color="#ec4899"
              />
            </View>
          </View>

          {(user?.linkedIn || user?.github || user?.portfolio) && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle} allowFontScaling maxFontSizeMultiplier={1.2}>
                Social Links
              </Text>
              <View style={styles.card}>
                {user?.linkedIn && (
                  <>
                    <ProfileItem
                      icon="logo-linkedin"
                      label="LinkedIn"
                      value={user?.linkedIn}
                      color="#0a66c2"
                    />
                    <View style={styles.divider} />
                  </>
                )}
                {user?.github && (
                  <>
                    <ProfileItem
                      icon="logo-github"
                      label="GitHub"
                      value={user?.github}
                      color={COLORS.textPrimary}
                    />
                    <View style={styles.divider} />
                  </>
                )}
                {user?.portfolio && (
                  <ProfileItem
                    icon="globe-outline"
                    label="Portfolio"
                    value={user?.portfolio}
                    color="#06b6d4"
                  />
                )}
              </View>
            </View>
          )}

        </>
      )}

      {/* Edit Tab */}
      {activeTab === 'edit' && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle} allowFontScaling maxFontSizeMultiplier={1.2}>
            Edit Profile
          </Text>
          <View style={styles.card}>
            <EditableField
              label="Full Name"
              value={formData.name}
              onChange={(text) => setFormData({ ...formData, name: text })}
              icon="person"
              placeholder="Your name"
            />
            <EditableField
              label="Email"
              value={user?.email}
              icon="mail"
              editable={false}
            />
            <EditableField
              label="Phone"
              value={formData.phone}
              onChange={(text) => setFormData({ ...formData, phone: text })}
              icon="call"
              placeholder="Your phone number"
            />
            <EditableField
              label="Bio"
              value={formData.bio}
              onChange={(text) => setFormData({ ...formData, bio: text })}
              icon="information-circle"
              placeholder="Tell us about yourself"
            />
            <EditableField
              label="Batch"
              value={formData.batch}
              onChange={(text) => setFormData({ ...formData, batch: text })}
              icon="school"
              placeholder="e.g., 2023"
            />
            <EditableField
              label="Semester"
              value={formData.semester}
              onChange={(text) => setFormData({ ...formData, semester: text })}
              icon="layers"
              placeholder="e.g., 4"
            />
            <EditableField
              label="Section"
              value={formData.section}
              onChange={(text) => setFormData({ ...formData, section: text })}
              icon="documents"
              placeholder="e.g., A"
            />
            <EditableField
              label="LinkedIn Profile"
              value={formData.linkedIn}
              onChange={(text) => setFormData({ ...formData, linkedIn: text })}
              icon="logo-linkedin"
              placeholder="linkedin.com/in"
            />
            <EditableField
              label="GitHub Profile"
              value={formData.github}
              onChange={(text) => setFormData({ ...formData, github: text })}
              icon="logo-github"
              placeholder="github.com"
            />
            <EditableField
              label="Portfolio"
              value={formData.portfolio}
              onChange={(text) => setFormData({ ...formData, portfolio: text })}
              icon="globe"
            />
            <View style={styles.buttonGroup}>
              <Button
                title={loading ? 'Saving...' : 'Save Changes'}
                onPress={() => handleUpdateProfile()}
                disabled={loading}
                width="48%"
              />
              <Button
                title="Cancel"
                onPress={() => {
                  setFormData({
                    name: user?.name || '',
                    phone: user?.phone || '',
                    bio: user?.bio || '',
                    batch: user?.batch || '',
                    semester: user?.semester || '',
                    section: user?.section || '',
                    linkedIn: user?.linkedIn || '',
                    github: user?.github || '',
                    portfolio: user?.portfolio || '',
                  });
                  setActiveTab('view');
                }}
                variant="outline"
                width="48%"
              />
            </View>
          </View>
        </View>
      )}

      {/* Password Tab */}
      {activeTab === 'password' && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle} allowFontScaling maxFontSizeMultiplier={1.2}>
            Change Password
          </Text>
          <View style={styles.card}>
            <View style={styles.securityInfo}>
              <Ionicons name="information-circle" size={20} color={COLORS.primary} />
              <Text style={styles.securityInfoText}>
                Password must be 8+ chars with uppercase, lowercase, number, and special character
              </Text>
            </View>
            <EditableField
              label="Current Password"
              value={pwFormData.currentPassword}
              onChange={(text) =>
                setPwFormData({ ...pwFormData, currentPassword: text })
              }
              icon="lock-closed"
              placeholder="Enter current password"
            />
            <EditableField
              label="New Password"
              value={pwFormData.newPassword}
              onChange={(text) =>
                setPwFormData({ ...pwFormData, newPassword: text })
              }
              icon="lock-closed"
              placeholder="Enter new password"
            />
            <EditableField
              label="Confirm Password"
              value={pwFormData.confirmPassword}
              onChange={(text) =>
                setPwFormData({ ...pwFormData, confirmPassword: text })
              }
              icon="lock-closed"
              placeholder="Confirm new password"
            />

            <View style={styles.buttonGroup}>
              <Button
                title={loading ? 'Updating...' : 'Update Password'}
                onPress={handleChangePassword}
                disabled={loading}
                width="48%"
              />
              <Button
                title="Cancel"
                onPress={() => {
                  setPwFormData({
                    currentPassword: '',
                    newPassword: '',
                    confirmPassword: '',
                  });
                  setActiveTab('view');
                }}
                variant="outline"
                width="48%"
              />
            </View>
          </View>
        </View>
      )}

      <Button
        title="Logout"
        onPress={handleLogout}
        variant="danger"
        style={styles.logoutBtn}
      />

      <View style={styles.footer}>
        <Text style={styles.footerText} allowFontScaling maxFontSizeMultiplier={1.1}>
          SoEIT Achievement Portal v1.0.0
        </Text>
        <Text style={styles.footerSub} allowFontScaling maxFontSizeMultiplier={1.1}>
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
  avatarWrapper: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.md,
  },
  avatarLarge: {
    width: 110,
    height: 110,
    borderRadius: 55,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 8,
    ...Platform.select({
      ios: {
        shadowColor: COLORS.primary,
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.2,
        shadowRadius: 15,
      },
    }),
  },
  avatarImage: {
    width: '100%',
    height: '100%',
    borderRadius: 55,
  },
  cameraButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 10,
    borderWidth: 3,
    borderColor: COLORS.bgSecondary,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 6,
      },
    }),
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
  tabContainer: {
    flexDirection: 'row',
    marginTop: SPACING.xl,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  tabButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.md,
    gap: SPACING.xs,
  },
  tabActive: {
    borderBottomWidth: 3,
    borderBottomColor: COLORS.primary,
  },
  tabText: {
    fontSize: getResponsiveFontSize(12),
    fontWeight: '600',
    color: COLORS.textMuted,
  },
  tabTextActive: {
    color: COLORS.primary,
    fontWeight: '700',
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
  },
  card: {
    backgroundColor: COLORS.bgCard,
    borderRadius: 24,
    padding: SPACING.xl,
    borderWidth: 1,
    borderColor: COLORS.border,
    elevation: 2,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.04,
        shadowRadius: 10,
      },
    }),
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
  fieldContainer: {
    marginBottom: SPACING.md,
  },
  fieldLabel: {
    fontSize: getResponsiveFontSize(14),
    fontWeight: '600',
    color: COLORS.textPrimary,
    marginBottom: SPACING.sm,
  },
  fieldInput: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.bgPrimary,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingHorizontal: SPACING.md,
  },
  fieldIcon: {
    marginRight: SPACING.sm,
  },
  input: {
    flex: 1,
    paddingVertical: SPACING.md,
    fontSize: getResponsiveFontSize(15),
    color: COLORS.textPrimary,
  },
  buttonGroup: {
    flexDirection: 'row',
    marginTop: SPACING.xl,
    gap: SPACING.md,
    justifyContent: 'space-between',
  },
  resumeBtn: {
    marginVertical: SPACING.md,
  },
  resumeGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.lg,
    borderRadius: 12,
    gap: SPACING.md,
  },
  resumeText: {
    color: '#fff',
    fontSize: getResponsiveFontSize(14),
    fontWeight: '800',
  },
  securityInfo: {
    flexDirection: 'row',
    backgroundColor: COLORS.primary + '10',
    borderRadius: 12,
    padding: SPACING.md,
    marginBottom: SPACING.lg,
    alignItems: 'flex-start',
    gap: SPACING.sm,
  },
  securityInfoText: {
    flex: 1,
    fontSize: getResponsiveFontSize(13),
    color: COLORS.textPrimary,
    fontWeight: '500',
  },
  logoutBtn: {
    marginHorizontal: SPACING.xl,
    marginTop: SPACING.xxxl,
    marginBottom: SPACING.xl,
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
