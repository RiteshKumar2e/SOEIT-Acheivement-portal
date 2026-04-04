import React from 'react';
import { TouchableOpacity, View, Text, StyleSheet } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createDrawerNavigator, DrawerContentScrollView, DrawerItemList, DrawerItem } from '@react-navigation/drawer';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../constants/colors';
import { useAuth } from '../context/AuthContext';

// Auth Screens
import LoginScreen from '../screens/auth/LoginScreen';
import RegisterScreen from '../screens/auth/RegisterScreen';

// Student Screens
import StudentDashboard from '../screens/student/StudentDashboard';
import MyAchievements from '../screens/student/MyAchievements';
import UploadAchievement from '../screens/student/UploadAchievement';
import InternshipsPage from '../screens/student/InternshipsPage';
import HackathonsPage from '../screens/student/HackathonsPage';
import StudentCoursesPage from '../screens/student/StudentCoursesPage';
import StudentProjectsPage from '../screens/student/StudentProjectsPage';
import ProfileScreen from '../screens/shared/ProfileScreen';
import EventsPage from '../screens/shared/EventsPage';

// Admin/Faculty Screens
import AdminDashboard from '../screens/admin/AdminDashboard';
import VerifyAchievements from '../screens/admin/VerifyAchievements';
import FacultyDashboard from '../screens/faculty/FacultyDashboard';
import ManageInternshipsPage from '../screens/faculty/ManageInternshipsPage';
import ReportsScreen from '../screens/admin/ReportsScreen';
import StudentManagementScreen from '../screens/admin/StudentManagementScreen';
import FacultyManagementScreen from '../screens/admin/FacultyManagementScreen';
import BroadcastNoticeScreen from '../screens/shared/BroadcastNoticeScreen';

const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();

const DrawerIcon = ({ name, color, size }) => (
  <Ionicons name={name} size={size} color={color} />
);

const CustomDrawerContent = (props) => {
  const { logout, user } = useAuth();
  const navigation = props.navigation;

  const DrawerSectionHeader = ({ title }) => (
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionHeaderText}>{title}</Text>
    </View>
  );

  const CustomDrawerItem = ({ label, icon, screenName, active }) => (
    <TouchableOpacity 
      style={[styles.drawerItem, active && styles.drawerItemActive]} 
      onPress={() => navigation.navigate(screenName)}
    >
      <Ionicons name={icon} size={22} color={active ? COLORS.primary : COLORS.textMuted} style={styles.drawerItemIcon} />
      <Text style={[styles.drawerItemLabel, active && styles.drawerItemLabelActive]}>{label}</Text>
    </TouchableOpacity>
  );

  const activeRouteName = props.state?.routeNames[props.state?.index] || 'Dashboard';

  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      {/* Sidebar Header */}
      <View style={styles.drawerHeader}>
        <View style={styles.logoContainer}>
          <View style={styles.logoCircle}>
            <Ionicons name="school" size={24} color="#fff" />
          </View>
          <View>
            <Text style={styles.logoText}>SOEIT</Text>
            <Text style={styles.logoSubText}>ACHIEVEMENT PORTAL</Text>
          </View>
        </View>
        <TouchableOpacity onPress={() => navigation.closeDrawer()}>
          <Ionicons name="close-outline" size={28} color={COLORS.textMuted} />
        </TouchableOpacity>
      </View>

      <DrawerContentScrollView {...props} showsVerticalScrollIndicator={false}>
        {/* Profile Card */}
        <View style={styles.profileCard}>
          <View style={styles.avatarContainer}>
            <Ionicons name="person-circle" size={54} color={COLORS.primary} />
          </View>
          <View>
            <Text style={styles.profileName}>{user?.name || 'Ritesh Kumar'}</Text>
            <Text style={styles.profileRole}>{user?.role?.toUpperCase() || 'STUDENT'}</Text>
          </View>
        </View>

        {/* Sections */}
        <DrawerSectionHeader title="MAIN MENU" />
        <CustomDrawerItem label="Dashboard" icon="grid-outline" screenName="Dashboard" active={activeRouteName === 'Dashboard'} />
        <CustomDrawerItem label="Campus Events" icon="calendar-outline" screenName="Broadcasts" active={activeRouteName === 'Broadcasts'} />

        <DrawerSectionHeader title="ACHIEVEMENTS" />
        <CustomDrawerItem label="My Achievements" icon="trophy-outline" screenName="Achievements" active={activeRouteName === 'Achievements'} />
        <CustomDrawerItem label="Upload Achievement" icon="cloud-upload-outline" screenName="Upload" active={activeRouteName === 'Upload'} />

        <DrawerSectionHeader title="ACADEMIC" />
        <CustomDrawerItem label="Course Registry" icon="book-outline" screenName="Courses" active={activeRouteName === 'Courses'} />
        <CustomDrawerItem label="My Projects" icon="layers-outline" screenName="Projects" active={activeRouteName === 'Projects'} />

        <DrawerSectionHeader title="CAREER & TALENT" />
        <CustomDrawerItem label="My Internships" icon="briefcase-outline" screenName="Internships" active={activeRouteName === 'Internships'} />
        <CustomDrawerItem label="Opportunities" icon="star-outline" screenName="Internships" active={activeRouteName === 'Internships_opp'} />
        <CustomDrawerItem label="Live Hackathons" icon="terminal-outline" screenName="Hackathons" active={activeRouteName === 'Hackathons'} />

        <DrawerSectionHeader title="ACCOUNT" />
        <CustomDrawerItem label="My Profile" icon="person-outline" screenName="Profile" active={activeRouteName === 'Profile'} />
        
        <View style={{ height: 20 }} />
      </DrawerContentScrollView>

      {/* Footer Buttons */}
      <View style={styles.drawerFooter}>
        <TouchableOpacity style={styles.portfolioBtn}>
          <Ionicons name="star" size={20} color="#059669" style={{ marginRight: 10 }} />
          <Text style={styles.portfolioBtnText}>Public Portfolio</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.logoutBtn} onPress={logout}>
          <Ionicons name="log-out-outline" size={20} color="#dc2626" style={{ marginRight: 10 }} />
          <Text style={styles.logoutBtnText}>Logout</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const StudentDrawer = () => (
  <Drawer.Navigator
    drawerContent={(props) => <CustomDrawerContent {...props} />}
    screenOptions={{
      drawerType: 'front',
      drawerStyle: {
        width: 300,
      },
      headerStyle: {
        backgroundColor: COLORS.bgSecondary,
      },
      headerShadowVisible: false,
      headerTintColor: COLORS.textPrimary,
      headerTitleStyle: {
        fontWeight: '700',
      },
    }}
  >
    <Drawer.Screen name="Dashboard" component={StudentDashboard} options={{ title: 'Student Dashboard' }} />
    <Drawer.Screen name="Achievements" component={MyAchievements} options={{ title: 'My Achievements' }} />
    <Drawer.Screen name="Upload" component={UploadAchievement} options={{ title: 'Upload New' }} />
    <Drawer.Screen name="Courses" component={StudentCoursesPage} options={{ title: 'Course Registry' }} />
    <Drawer.Screen name="Projects" component={StudentProjectsPage} options={{ title: 'My Projects' }} />
    <Drawer.Screen name="Internships" component={InternshipsPage} options={{ title: 'Internships' }} />
    <Drawer.Screen name="Hackathons" component={HackathonsPage} options={{ title: 'Live Hackathons' }} />
    <Drawer.Screen name="Broadcasts" component={EventsPage} options={{ title: 'Campus Events' }} />
    <Drawer.Screen name="Profile" component={ProfileScreen} options={{ title: 'My Profile' }} />
  </Drawer.Navigator>
);

const AdminDrawer = () => (
  <Drawer.Navigator
    drawerContent={(props) => <CustomDrawerContent {...props} />}
    screenOptions={{
      drawerStyle: {
        backgroundColor: COLORS.bgPrimary,
        width: 260,
      },
      drawerActiveTintColor: COLORS.secondary,
      drawerInactiveTintColor: COLORS.textPrimary,
      headerStyle: {
        backgroundColor: COLORS.bgSecondary,
      },
      headerTintColor: COLORS.textPrimary,
    }}
  >
    <Drawer.Screen
      name="AdminHome"
      component={AdminDashboard}
      options={{
        title: 'Dashboard',
        drawerIcon: (props) => <DrawerIcon name="stats-chart-outline" {...props} />,
      }}
    />
    <Drawer.Screen
      name="Verify"
      component={VerifyAchievements}
      options={{
        drawerIcon: (props) => <DrawerIcon name="checkmark-done-circle-outline" {...props} />,
      }}
    />
    <Drawer.Screen
      name="Notices"
      component={EventsPage}
      options={{
        drawerIcon: (props) => <DrawerIcon name="megaphone-outline" {...props} />,
      }}
    />
    <Drawer.Screen
      name="Profile"
      component={ProfileScreen}
      options={{
        title: 'Profile',
        drawerIcon: (props) => <DrawerIcon name="person-outline" {...props} />,
      }}
    />
  </Drawer.Navigator>
);

const FacultyDrawer = () => (
  <Drawer.Navigator
    drawerContent={(props) => <CustomDrawerContent {...props} />}
    screenOptions={{
      drawerStyle: {
        backgroundColor: COLORS.bgPrimary,
        width: 260,
      },
      drawerActiveTintColor: '#8b5cf6',
      drawerInactiveTintColor: COLORS.textPrimary,
      headerStyle: {
        backgroundColor: COLORS.bgSecondary,
      },
      headerTintColor: COLORS.textPrimary,
    }}
  >
    <Drawer.Screen
      name="FacultyHome"
      component={FacultyDashboard}
      options={{
        title: 'Dashboard',
        drawerIcon: (props) => <DrawerIcon name="school-outline" {...props} />,
      }}
    />
    <Drawer.Screen
      name="Postings"
      component={ManageInternshipsPage}
      options={{
        title: 'Internships',
        drawerIcon: (props) => <DrawerIcon name="briefcase-outline" {...props} />,
      }}
    />
    <Drawer.Screen
      name="FacultyEvents"
      component={EventsPage}
      options={{
        title: 'Broadcasts',
        drawerIcon: (props) => <DrawerIcon name="megaphone-outline" {...props} />,
      }}
    />
    <Drawer.Screen
      name="Profile"
      component={ProfileScreen}
      options={{
        title: 'Profile',
        drawerIcon: (props) => <DrawerIcon name="person-outline" {...props} />,
      }}
    />
  </Drawer.Navigator>
);

import WelcomeScreen from '../screens/auth/WelcomeScreen';

const AppNavigator = () => {
  const { isAuthenticated, user, loading } = useAuth();

  if (loading) return null;

  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: COLORS.bgSecondary,
        },
        headerTintColor: COLORS.textPrimary,
        headerTitleStyle: {
          fontWeight: '700',
        },
        headerShadowVisible: false,
        contentStyle: { backgroundColor: COLORS.bgPrimary },
      }}
    >
      {!isAuthenticated ? (
        <>
          <Stack.Screen 
            name="Welcome" 
            component={WelcomeScreen} 
            options={{ headerShown: false }} 
          />
          <Stack.Screen 
            name="Login" 
            component={LoginScreen} 
            options={{ headerShown: false }} 
          />
          <Stack.Screen 
            name="Register" 
            component={RegisterScreen} 
            options={{ title: 'Create Account' }}
          />
        </>
      ) : (
        <>
          {user?.role === 'student' ? (
            <Stack.Group>
              <Stack.Screen 
                name="StudentMain" 
                component={StudentDrawer} 
                options={{ headerShown: false }}
              />
              <Stack.Screen name="Upload" component={UploadAchievement} />
              <Stack.Screen name="Internships" component={InternshipsPage} />
              <Stack.Screen name="Hackathons" component={HackathonsPage} />
              <Stack.Screen name="Courses" component={StudentCoursesPage} />
              <Stack.Screen name="Projects" component={StudentProjectsPage} />
            </Stack.Group>
          ) : user?.role === 'faculty' ? (
            <Stack.Group>
              <Stack.Screen 
                name="FacultyMain" 
                component={FacultyDrawer} 
                options={{ headerShown: false }}
              />
              <Stack.Screen 
                name="VerifyDetail" 
                component={VerifyAchievements} 
                options={{ title: 'Verify Achievement' }}
              />
              <Stack.Screen name="Reports" component={ReportsScreen} />
              <Stack.Screen name="StudentManagement" component={StudentManagementScreen} options={{ title: 'Student Directory' }} />
              <Stack.Screen name="BroadcastNotice" component={BroadcastNoticeScreen} options={{ title: 'Create Notice' }} />
            </Stack.Group>
          ) : (
            <Stack.Group>
              <Stack.Screen 
                name="AdminMain" 
                component={AdminDrawer} 
                options={{ headerShown: false }}
              />
              <Stack.Screen 
                name="VerifyDetail" 
                component={VerifyAchievements} 
                options={{ title: 'Verify Achievement' }}
              />
              <Stack.Screen name="ManageInternships" component={ManageInternshipsPage} />
              <Stack.Screen name="Reports" component={ReportsScreen} />
              <Stack.Screen name="StudentManagement" component={StudentManagementScreen} options={{ title: 'Student Directory' }} />
              <Stack.Screen name="FacultyManagement" component={FacultyManagementScreen} options={{ title: 'Faculty Registry' }} />
              <Stack.Screen name="BroadcastNotice" component={BroadcastNoticeScreen} options={{ title: 'Create Notice' }} />
            </Stack.Group>
          )}
        </>
      )}
    </Stack.Navigator>
  );
};

const styles = StyleSheet.create({
  drawerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoCircle: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#0f172a',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  logoText: {
    fontSize: 18,
    fontWeight: '800',
    color: '#1e293b',
    letterSpacing: 0.5,
  },
  logoSubText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#64748b',
    letterSpacing: 1,
  },
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: 16,
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#f1f5f9',
    boxShadow: '0px 2px 10px rgba(0,0,0,0.05)',
    elevation: 2,
  },
  avatarContainer: {
    marginRight: 16,
  },
  profileName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1e293b',
  },
  profileRole: {
    fontSize: 11,
    fontWeight: '600',
    color: '#64748b',
    letterSpacing: 1,
    marginTop: 2,
  },
  sectionHeader: {
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 8,
  },
  sectionHeaderText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#94a3b8',
    letterSpacing: 1.5,
  },
  drawerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 24,
    marginHorizontal: 8,
    borderRadius: 12,
  },
  drawerItemActive: {
    backgroundColor: '#f8fafc',
  },
  drawerItemIcon: {
    marginRight: 16,
  },
  drawerItemLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: '#475569',
  },
  drawerItemLabelActive: {
    color: '#0f172a',
    fontWeight: '700',
  },
  drawerFooter: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#f3f4f6',
  },
  portfolioBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0fdf4',
    padding: 14,
    borderRadius: 12,
    marginBottom: 10,
  },
  portfolioBtnText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#065f46',
  },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fef2f2',
    padding: 14,
    borderRadius: 12,
  },
  logoutBtnText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#991b1b',
  },
});

export default AppNavigator;
