import { useGetRegistrationOTP } from '@/hooks/api/auth';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  ImageBackground,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Text,
  TextInput,
  TouchableHighlight,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';

type RegisterProps = {
  navigation: any;
};

export const SetEmail = ({ navigation }: RegisterProps) => {
  const [email, setEmail] = useState('');

  const { mutate: getRegistrationOTP, isPending } = useGetRegistrationOTP();

  const handleSubmit = async () => {
    getRegistrationOTP(email, {
      onSuccess: () => {
        navigation.navigate('RegistrationOTPVerification', { email });
      },
      onError: (error) => {
        Alert.alert('Error', error.message);
      },
    });
  };

  const handleLogin = () => {
    navigation.navigate('Login');
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        <ImageBackground
          source={require('../../../assets/images/background-pattern.png')}
          className="flex-1 bg-[#FDF6F0]"
        >
          <View className="flex-1 px-4 justify-start pt-16">
            {/* Title */}
            <View className="mb-6">
              <Text className="text-6xl font-bold text-black leading-tight">
                Welcome to{'\n'}Taiyari NEET ki
              </Text>
            </View>

            {/* Subtitle */}
            <Text className="text-lg text-gray-600 mb-4">Please enter your email</Text>

            {/* Input fields */}
            <View className="space-y-4">
              <TextInput
                className="bg-white rounded-xl p-4 text-base text-black"
                placeholder="john@gmail.com"
                placeholderTextColor="#999"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            {/* Submit Button */}
            <TouchableHighlight
              onPress={handleSubmit}
              className="bg-[#1A1A1A] rounded-xl mt-6 p-4"
              disabled={isPending}
            >
              {isPending ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text className="text-white text-center text-lg font-medium">Submit</Text>
              )}
            </TouchableHighlight>

            {/* Login Link */}
            <View className="flex-row mt-4">
              <Text className="text-[#1A1A1A] text-lg">Already have an account?</Text>
              <TouchableOpacity onPress={handleLogin} className="ml-1">
                <Text className="text-amber-500 text-lg">Login</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ImageBackground>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
};

export default SetEmail;
