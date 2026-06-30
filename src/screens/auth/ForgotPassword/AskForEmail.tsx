import { useRequestPasswordReset } from '@/hooks/api/auth';
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
  TouchableWithoutFeedback,
  View,
} from 'react-native';

type AskForEmailProps = {
  navigation: any;
};

export const AskForEmail = ({ navigation }: AskForEmailProps) => {
  const [email, setEmail] = useState('');
  const { mutate: requestPasswordReset, isPending } = useRequestPasswordReset();

  const handleSubmit = async () => {
    if (!email) {
      Alert.alert('Error', 'Please enter your email');
      return;
    }

    requestPasswordReset(email, {
      onSuccess: () => {
        navigation.navigate('OTPVerification', { email });
      },
      onError: (error) => {
        Alert.alert('Error', error.message);
        return;
      },
    });
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
            <Text className="text-lg text-gray-600 mb-4">
              Please enter your email to reset your password
            </Text>

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
          </View>
        </ImageBackground>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
};

export default AskForEmail;
