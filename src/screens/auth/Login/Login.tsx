import { useAuth } from '@/contexts/AuthContext';
import { useLogin } from '@/hooks/api/auth';
import { useGetProfile } from '@/hooks/api/user';
import tokenManager from '@/lib/tokenManager';
import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  ImageBackground,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';

export const Login = ({ navigation }: any) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const { mutate: login, isSuccess, isPending } = useLogin();
  const { data: profileData, isLoading } = useGetProfile({
    enabled: isSuccess && !!tokenManager.getToken(),
  });

  const { setUser } = useAuth();

  useEffect(() => {
    if (isSuccess && !isLoading && profileData?.data) {
      setUser(profileData.data);
    }
  }, [isSuccess, isLoading, profileData?.data]);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    login(
      { email, password },
      {
        onSuccess: async (data) => {
          await tokenManager.setToken(data?.data?.token || '');
        },
        onError: (error) => {
          Alert.alert('Error', error.message);
        },
      }
    );
  };

  const handleForgotPassword = () => {
    navigation.navigate('AskForEmail');
  };

  const handleRegister = () => {
    navigation.navigate('SetEmail');
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        <ImageBackground
          source={require('../../../assets/images/background-pattern.png')}
          className="flex-1 bg-[#FDF6F0] w-full"
        >
          <View className="flex-1 px-4 justify-start pt-16">
            {/* Title */}
            <View className="mb-6">
              <Text className="text-6xl font-bold text-black leading-tight">
                Welcome to{'\n'}Taiyari NEET ki
              </Text>
            </View>

            {/* Login text */}
            <Text className="text-base text-gray-600 mb-4">Please enter your credentials</Text>

            {/* Input fields */}
            <View className="space-y-4 mb-1">
              <TextInput
                className="bg-white rounded-xl p-4 text-base text-black mb-4"
                placeholder="john.thompson@gmail.com"
                placeholderTextColor="#999"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />

              <View>
                <TextInput
                  className="bg-white rounded-xl p-4 text-base text-black pr-16"
                  placeholder="Password"
                  placeholderTextColor="#999"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                />
                <TouchableOpacity
                  onPress={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-4"
                >
                  <Ionicons name={showPassword ? 'eye-off' : 'eye'} size={24} color="#666" />
                </TouchableOpacity>
              </View>

              {/* Forgot Password Link */}
              <TouchableOpacity onPress={handleForgotPassword} className="self-end mt-2">
                <Text className="text-amber-500 text-base font-medium">Forgot Password?</Text>
              </TouchableOpacity>
            </View>

            {/* Login Button */}
            <TouchableOpacity onPress={handleLogin} className="bg-[#1A1A1A] rounded-xl mt-4 p-4">
              {isPending ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text className="text-white text-center text-lg font-medium">Login</Text>
              )}
            </TouchableOpacity>

            {/* Register Link */}
            <View className="flex-row mt-4">
              <Text className="text-[#1A1A1A] text-lg">Don't have an account?</Text>
              <TouchableOpacity onPress={handleRegister} className="ml-1">
                <Text className="text-amber-500 text-lg">Register</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ImageBackground>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
};

export default Login;
