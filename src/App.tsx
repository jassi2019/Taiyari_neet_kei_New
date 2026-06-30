import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { StatusBar } from 'expo-status-bar';
import { Home as HomeIcon, Notebook, User } from 'lucide-react-native';
import { ActivityIndicator, View } from 'react-native';
import ErrorBoundary from 'react-native-error-boundary';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Fallback from './screens/error/Fallback';
import './styles/global.css';

// Auth Screens
import AskForEmail from './screens/auth/ForgotPassword/AskForEmail';
import OTPVerification from './screens/auth/ForgotPassword/OTPVerification';
import Landing from './screens/auth/Landing/Landing';
import { Login } from './screens/auth/Login/Login';
import SetAccountPassword from './screens/auth/Register/SetAccountPassword';
import SetEmail from './screens/auth/Register/SetEmail';

// Main Screens
import { usePreventScreenCapture } from 'expo-screen-capture';
import { ResetPassword } from './screens/auth/ForgotPassword/ResetPassword';
import { RegisterOTPVerification } from './screens/auth/Register/RegisterOTPVerification';
import Chapters from './screens/main/Chapters';
import { Home } from './screens/main/Home';
import PaymentScreen from './screens/main/Payment';
import PlansScreen from './screens/main/Plans';
import Privacy from './screens/main/Privacy';
import { Profile } from './screens/main/Profile';
import Subjects from './screens/main/Subjects';
import SubscriptionMessage from './screens/main/SubscriptionMessage';
import TermsAndConditions from './screens/main/TermsAndConditions';
import TopicContent from './screens/main/TopicContent';
import Topics from './screens/main/Topics';
import { TPlan } from './types/Plan';
import { TTopic } from './types/Topic';

// Navigation Types
type RootStackParamList = {
  Auth: undefined;
  Main: undefined;
};

type AuthStackParamList = {
  Login: undefined;
  SetEmail: undefined;
  SetAccountPassword: undefined;
  AskForEmail: undefined;
  OTPVerification: undefined;
  RegistrationOTPVerification: undefined;
  ResetPassword: undefined;
  Landing: undefined;
  Privacy: undefined;
  TermsAndConditions: undefined;
};

type MainStackParamList = {
  HomeScreen: undefined;
  SubjectsScreen: undefined;
  ProfileScreen: undefined;
  Chapters: {
    subjectId: string;
    subjectTitle: string;
  };
  Topics: {
    subjectId: string;
    chapterId: string;
    chapterTitle: string;
    subjectTitle: string;
  };
  TopicContent: {
    topic: TTopic;
  };
  Plans: undefined;
  Payment: {
    plan: TPlan;
  };
  SubscriptionMessage: {
    success: boolean;
  };
};

const queryClient = new QueryClient();

// Create stack navigators
const Stack = createNativeStackNavigator<RootStackParamList>();
const AuthStack = createNativeStackNavigator<AuthStackParamList>();
const Tab = createBottomTabNavigator();
const HomeStack = createNativeStackNavigator<MainStackParamList>();
const SubjectsStack = createNativeStackNavigator<MainStackParamList>();
const ProfileStack = createNativeStackNavigator<MainStackParamList>();

// Auth navigator
const AuthNavigator = () => {
  return (
    <AuthStack.Navigator screenOptions={{ headerShown: false }}>
      <AuthStack.Screen name="Landing" component={Landing} />
      <AuthStack.Screen name="Login" component={Login} />
      <AuthStack.Screen name="SetEmail" component={SetEmail} />
      <AuthStack.Screen name="OTPVerification" component={OTPVerification} />
      <AuthStack.Screen name="RegistrationOTPVerification" component={RegisterOTPVerification} />
      <AuthStack.Screen name="SetAccountPassword" component={SetAccountPassword} />
      <AuthStack.Screen name="ResetPassword" component={ResetPassword} />
      <AuthStack.Screen name="AskForEmail" component={AskForEmail} />
      <AuthStack.Screen name="Privacy" component={Privacy} />
      <AuthStack.Screen name="TermsAndConditions" component={TermsAndConditions} />
    </AuthStack.Navigator>
  );
};

// Stack navigators for each tab
const HomeStackNavigator = () => (
  <HomeStack.Navigator screenOptions={{ headerShown: false }}>
    <HomeStack.Screen name="HomeScreen" component={Home} />
    <HomeStack.Screen name="TopicContent" component={TopicContent} />
    <HomeStack.Screen name="Plans" component={PlansScreen} />
    <HomeStack.Screen name="Payment" component={PaymentScreen} />
    <HomeStack.Screen name="SubscriptionMessage" component={SubscriptionMessage} />
  </HomeStack.Navigator>
);

const SubjectsStackNavigator = () => (
  <SubjectsStack.Navigator screenOptions={{ headerShown: false }}>
    <SubjectsStack.Screen name="SubjectsScreen" component={Subjects} />
    <SubjectsStack.Screen name="Chapters" component={Chapters} />
    <SubjectsStack.Screen name="Topics" component={Topics} />
    <SubjectsStack.Screen name="TopicContent" component={TopicContent} />
    <SubjectsStack.Screen name="Plans" component={PlansScreen} />
    <SubjectsStack.Screen name="Payment" component={PaymentScreen} />
    <SubjectsStack.Screen name="SubscriptionMessage" component={SubscriptionMessage} />
  </SubjectsStack.Navigator>
);

const ProfileStackNavigator = () => (
  <ProfileStack.Navigator screenOptions={{ headerShown: false }}>
    <ProfileStack.Screen name="ProfileScreen" component={Profile} />
    <ProfileStack.Screen name="Plans" component={PlansScreen} />
    <ProfileStack.Screen name="Payment" component={PaymentScreen} />
    <ProfileStack.Screen name="SubscriptionMessage" component={SubscriptionMessage} />
  </ProfileStack.Navigator>
);

// Main navigator with bottom tabs
const MainNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: {
          height: 64,
          paddingTop: 12,
          paddingBottom: 12,
          backgroundColor: 'white',
          borderTopWidth: 1,
          borderTopColor: '#E5E7EB',
          borderTopLeftRadius: 30,
          borderTopRightRadius: 30,
        },
        tabBarIcon: ({ focused, color, size }) => {
          let Icon;
          switch (route.name) {
            case 'HomeStack':
              Icon = HomeIcon;
              break;
            case 'SubjectsStack':
              Icon = Notebook;
              break;
            case 'ProfileStack':
              Icon = User;
              break;
            default:
              Icon = HomeIcon;
          }
          return (
            <View className="relative">
              {focused && (
                <View className="absolute -top-4 left-0 right-0 h-0.5 bg-black rounded-full" />
              )}
              <Icon
                size={28}
                color={focused ? '#000000' : '#9CA3AF'}
                strokeWidth={1.5}
                fill={focused ? '#000000' : 'none'}
              />
            </View>
          );
        },
        tabBarLabel: () => null,
      })}
    >
      <Tab.Screen name="HomeStack" component={HomeStackNavigator} options={{ title: 'Home' }} />
      <Tab.Screen
        name="SubjectsStack"
        component={SubjectsStackNavigator}
        options={{ title: 'Subjects' }}
      />
      <Tab.Screen
        name="ProfileStack"
        component={ProfileStackNavigator}
        options={{ title: 'Profile' }}
      />
    </Tab.Navigator>
  );
};

const AppContent = () => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-[#FDF6F0]">
        <ActivityIndicator size="large" color="#1A1A1A" />
      </View>
    );
  }

  return (
    <>
      <StatusBar style="auto" />
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!user ? (
          <Stack.Screen name="Auth" component={AuthNavigator} />
        ) : (
          <Stack.Screen name="Main" component={MainNavigator} />
        )}
      </Stack.Navigator>
    </>
  );
};

const errorHandler = (error: Error, stackTrace: string) => {
  // Log the error to an error reporting service
  console.log(JSON.stringify(error, null, 2));
};

export default function App() {
  usePreventScreenCapture();
  return (
    <NavigationContainer>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <ErrorBoundary onError={errorHandler} FallbackComponent={Fallback}>
            <AppContent />
          </ErrorBoundary>
        </AuthProvider>
      </QueryClientProvider>
    </NavigationContainer>
  );
}
