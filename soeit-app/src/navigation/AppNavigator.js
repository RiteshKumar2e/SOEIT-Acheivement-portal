import React from 'react';
import { TouchableOpacity } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
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
const Tab = createBottomTabNavigator();
const LogoutButton = () => {
  const { logout } = useAuth();
  return (
    <TouchableOpacity onPress={logout} style={{ marginRight: 15 }}>
      <Ionicons name="log-out-outline" size={24} color={COLORS.textPrimary} />
    </TouchableOpacity>
  );
};

const TabIcon = ({ name, color, size }) => (
  <Ionicons name={name} size={size} color={color} />
);

const StudentTabs = () => (
  <Tab.Navigator
    screenOptions={{
      tabBarStyle: {
        backgroundColor: COLORS.bgSecondary,
        borderTopColor: COLORS.border,
        paddingBottom: 5,
        height: 60,
      },
      tabBarActiveTintColor: COLORS.primary,
      tabBarInactiveTintColor: COLORS.textMuted,
      headerStyle: {
        backgroundColor: COLORS.bgSecondary,
      },
      headerShadowVisible: false,
      headerTintColor: COLORS.textPrimary,
      headerRight: () => <LogoutButton />,
    }}
  >
    <Tab.Screen
      name="Dashboard"
      component={StudentDashboard}
      options={{
        tabBarIcon: (props) => <TabIcon name="grid-outline" {...props} />,
      }}
    />
    <Tab.Screen
      name="Achievements"
      component={MyAchievements}
      options={{
        tabBarIcon: (props) => <TabIcon name="trophy-outline" {...props} />,
      }}
    />
    <Tab.Screen
      name="Academic"
      component={StudentCoursesPage}
      options={{
        tabBarIcon: (props) => <TabIcon name="book-outline" {...props} />,
      }}
    />
    <Tab.Screen
      name="Broadcasts"
      component={EventsPage}
      options={{
        tabBarIcon: (props) => <TabIcon name="notifications-outline" {...props} />,
      }}
    />
    <Tab.Screen
      name="Profile"
      component={ProfileScreen}
      options={{
        tabBarIcon: (props) => <TabIcon name="person-outline" {...props} />,
      }}
    />
  </Tab.Navigator>
);

const AdminTabs = () => (
  <Tab.Navigator
    screenOptions={{
      tabBarStyle: {
        backgroundColor: COLORS.bgSecondary,
        borderTopColor: COLORS.border,
        paddingBottom: 5,
        height: 60,
      },
      tabBarActiveTintColor: COLORS.secondary,
      tabBarInactiveTintColor: COLORS.textMuted,
      headerStyle: {
        backgroundColor: COLORS.bgSecondary,
      },
      headerTintColor: COLORS.textPrimary,
      headerRight: () => <LogoutButton />,
    }}
  >
    <Tab.Screen
      name="AdminHome"
      component={AdminDashboard}
      options={{
        title: 'Dashboard',
        tabBarIcon: (props) => <TabIcon name="stats-chart-outline" {...props} />,
      }}
    />
    <Tab.Screen
      name="Verify"
      component={VerifyAchievements}
      options={{
        tabBarIcon: (props) => <TabIcon name="checkmark-done-circle-outline" {...props} />,
      }}
    />
    <Tab.Screen
      name="Notices"
      component={EventsPage}
      options={{
        tabBarIcon: (props) => <TabIcon name="megaphone-outline" {...props} />,
      }}
    />
    <Tab.Screen
      name="Profile"
      component={ProfileScreen}
      options={{
        title: 'Profile',
        tabBarIcon: (props) => <TabIcon name="person-outline" {...props} />,
      }}
    />
  </Tab.Navigator>
);

const FacultyTabs = () => (
  <Tab.Navigator
    screenOptions={{
      tabBarStyle: {
        backgroundColor: COLORS.bgSecondary,
        borderTopColor: COLORS.border,
        paddingBottom: 5,
        height: 60,
      },
      tabBarActiveTintColor: '#8b5cf6',
      tabBarInactiveTintColor: COLORS.textMuted,
      headerStyle: {
        backgroundColor: COLORS.bgSecondary,
      },
      headerTintColor: COLORS.textPrimary,
      headerRight: () => <LogoutButton />,
    }}
  >
    <Tab.Screen
      name="FacultyHome"
      component={FacultyDashboard}
      options={{
        title: 'Dashboard',
        tabBarIcon: (props) => <TabIcon name="school-outline" {...props} />,
      }}
    />
    <Tab.Screen
      name="Postings"
      component={ManageInternshipsPage}
      options={{
        title: 'Internships',
        tabBarIcon: (props) => <TabIcon name="briefcase-outline" {...props} />,
      }}
    />
    <Tab.Screen
      name="FacultyEvents"
      component={EventsPage}
      options={{
        title: 'Broadcasts',
        tabBarIcon: (props) => <TabIcon name="megaphone-outline" {...props} />,
      }}
    />
    <Tab.Screen
      name="Profile"
      component={ProfileScreen}
      options={{
        title: 'Profile',
        tabBarIcon: (props) => <TabIcon name="person-outline" {...props} />,
      }}
    />
  </Tab.Navigator>
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
                component={StudentTabs} 
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
                component={FacultyTabs} 
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
                component={AdminTabs} 
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

export default AppNavigator;
