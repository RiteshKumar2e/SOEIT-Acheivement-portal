import React from 'react';
import { TouchableOpacity, View, Text, StyleSheet, Platform } from 'react-native';
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
import PublicPortfolioScreen from '../screens/student/PublicPortfolioScreen';

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

  const renderStudentItems = () => (
    <>
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
      <CustomDrawerItem label="Live Hackathons" icon="terminal-outline" screenName="Hackathons" active={activeRouteName === 'Hackathons'} />
    </>
  );

  const renderFacultyItems = () => (
    <>
      <DrawerSectionHeader title="MAIN MENU" />
      <CustomDrawerItem label="Dashboard" icon="grid-outline" screenName="FacultyHome" active={activeRouteName === 'FacultyHome'} />
      <CustomDrawerItem label="Campus Events" icon="calendar-outline" screenName="Broadcasts" active={activeRouteName === 'Broadcasts'} />

      <DrawerSectionHeader title="ACHIEVEMENTS" />
      <CustomDrawerItem label="Verify Achievements" icon="checkmark-circle-outline" screenName="Verify" active={activeRouteName === 'Verify'} />
      <CustomDrawerItem label="All Achievements" icon="trophy-outline" screenName="AllAchievements" active={activeRouteName === 'AllAchievements'} />

      <DrawerSectionHeader title="ACADEMIC" />
      <CustomDrawerItem label="Students" icon="people-outline" screenName="StudentManagement" active={activeRouteName === 'StudentManagement'} />
      <CustomDrawerItem label="Course Monitoring" icon="book-outline" screenName="Courses" active={activeRouteName === 'Courses'} />
      <CustomDrawerItem label="Project Monitoring" icon="layers-outline" screenName="Projects" active={activeRouteName === 'Projects'} />

      <DrawerSectionHeader title="RESOURCES" />
      <CustomDrawerItem label="Internship Postings" icon="cloud-upload-outline" screenName="Postings" active={activeRouteName === 'Postings'} />
      <CustomDrawerItem label="Internship Monitoring" icon="briefcase-outline" screenName="InternshipMonitoring" active={activeRouteName === 'InternshipMonitoring'} />
      <CustomDrawerItem label="Hackathon Control" icon="pulse-outline" screenName="Hackathons" active={activeRouteName === 'Hackathons'} />

      <DrawerSectionHeader title="ANALYTICS" />
      <CustomDrawerItem label="Reports & Analytics" icon="bar-chart-outline" screenName="Reports" active={activeRouteName === 'Reports'} />
    </>
  );

  const renderAdminItems = () => (
    <>
      <DrawerSectionHeader title="SYSTEM ADMIN" />
      <CustomDrawerItem label="Main Dashboard" icon="stats-chart-outline" screenName="AdminHome" active={activeRouteName === 'AdminHome'} />
      <CustomDrawerItem label="Verification" icon="shield-checkmark-outline" screenName="Verify" active={activeRouteName === 'Verify'} />
      
      <DrawerSectionHeader title="USER MANAGEMENT" />
      <CustomDrawerItem label="Student Registry" icon="people-outline" screenName="StudentManagement" active={activeRouteName === 'StudentManagement'} />
      <CustomDrawerItem label="Faculty Registry" icon="school-outline" screenName="FacultyManagement" active={activeRouteName === 'FacultyManagement'} />

      <DrawerSectionHeader title="INSTITUTION" />
      <CustomDrawerItem label="Public Notices" icon="megaphone-outline" screenName="Notices" active={activeRouteName === 'Notices'} />
      <CustomDrawerItem label="System Reports" icon="analytics-outline" screenName="Reports" active={activeRouteName === 'Reports'} />
    </>
  );

  const renderContent = () => {
    switch (user?.role) {
      case 'admin': return renderAdminItems();
      case 'faculty': return renderFacultyItems();
      default: return renderStudentItems();
    }
  };

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
             <View style={styles.avatarCircle}>
                <Text style={styles.avatarText}>{user?.name?.substring(0, 2).toUpperCase() || 'AJ'}</Text>
             </View>
          </View>
          <View>
            <Text style={styles.profileName}>{user?.name || 'Demo User'}</Text>
            <Text style={styles.profileRole}>{user?.role?.toUpperCase() || 'STUDENT'}</Text>
          </View>
        </View>

        {/* Dynamic Items Based on Role */}
        {renderContent()}
        
        <View style={{ height: 20 }} />
      </DrawerContentScrollView>

      {/* Footer Buttons */}
      <View style={styles.drawerFooter}>
        {user?.role === 'student' && (
          <TouchableOpacity 
            style={styles.portfolioBtn}
            onPress={() => navigation.navigate('Portfolio')}
          >
            <Ionicons name="star" size={20} color="#059669" style={{ marginRight: 10 }} />
            <Text style={styles.portfolioBtnText}>Public Portfolio</Text>
          </TouchableOpacity>
        )}

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
      headerShadowVisible: false,
      headerTintColor: COLORS.textPrimary,
    }}
  >
    <Drawer.Screen name="FacultyHome" component={FacultyDashboard} options={{ title: 'Faculty Dashboard' }} />
    <Drawer.Screen name="Verify" component={VerifyAchievements} options={{ title: 'Verify Achievements' }} />
    <Drawer.Screen name="AllAchievements" component={MyAchievements} options={{ title: 'All Achievements' }} />
    <Drawer.Screen name="StudentManagement" component={StudentManagementScreen} options={{ title: 'Student Directory' }} />
    <Drawer.Screen name="Courses" component={StudentCoursesPage} options={{ title: 'Course Monitoring' }} />
    <Drawer.Screen name="Projects" component={StudentProjectsPage} options={{ title: 'Project Monitoring' }} />
    <Drawer.Screen name="Postings" component={ManageInternshipsPage} options={{ title: 'Internship Postings' }} />
    <Drawer.Screen name="InternshipMonitoring" component={ManageInternshipsPage} options={{ title: 'Internship Monitoring' }} />
    <Drawer.Screen name="Hackathons" component={HackathonsPage} options={{ title: 'Hackathon Control' }} />
    <Drawer.Screen name="Broadcasts" component={EventsPage} options={{ title: 'Campus Events' }} />
    <Drawer.Screen name="Reports" component={ReportsScreen} options={{ title: 'Reports & Analytics' }} />
    <Drawer.Screen name="Profile" component={ProfileScreen} options={{ title: 'Profile' }} />
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
              <Stack.Screen name="Portfolio" component={PublicPortfolioScreen} options={{ headerShown: false }} />
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
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  avatarContainer: {
    marginRight: 16,
  },
  avatarCircle: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: '#f1f5f9',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  avatarText: {
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.primary,
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
