import Logo from '@/components/Logo/Logo';
import React from 'react';
import { Image, StatusBar, Text, TouchableOpacity, View } from 'react-native';

const Landing = ({ navigation }: { navigation: any }) => {
  return (
    <View className="flex-1 relative" style={{ paddingTop: StatusBar.currentHeight }}>
      <Image
        source={require('../../../assets/images/landing-bg.jpeg')}
        className="w-full absolute inset-0"
        style={{ top: StatusBar.currentHeight, height: '100%' }}
        resizeMode="stretch"
      />

      {/* Main Container */}
      <View className="flex-1 px-6 pt-8">
        {/* Logo and Brand */}
        <View className="flex-row items-center mt-2">
          <Logo />
        </View>

        {/* Main Content */}
        <View className="flex-1 justify-between">
          <View className="flex-1 justify-center mb-56" />

          {/* Bottom Content Container */}
          <View className="mb-12">
            {/* Buttons Container */}
            <View className="space-y-4">
              {/* Get Started Button */}
              <TouchableOpacity
                className="bg-gray-900 py-4 rounded-lg"
                activeOpacity={0.8}
                onPress={() => navigation.navigate('SetEmail')}
              >
                <Text className="text-white text-center text-lg font-semibold">Get Started</Text>
              </TouchableOpacity>

              {/* Google Sign In Button */}
            </View>

            {/* Terms and Privacy */}
            <Text className="mt-6 text-center">
              By Signing Up, I agree to the{' '}
              <Text className="underline" onPress={() => navigation.navigate('TermsAndConditions')}>
                Terms & Conditions
              </Text>{' '}
              and{' '}
              <Text className="underline" onPress={() => navigation.navigate('Privacy')}>
                Privacy Policy
              </Text>
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
};

export default Landing;
