import { STATE_OPTIONS, StateKey } from '@/constants/states';
import { useAuth } from '@/contexts/AuthContext';
import { useRegister } from '@/hooks/api/auth';
import { useGetProfile } from '@/hooks/api/user';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  ImageBackground,
  Keyboard,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';

interface RegisterProps {
  navigation: any;
  route: any;
}

export const SetAccountPassword = ({ navigation, route }: RegisterProps) => {
  const { email } = route.params;
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [address, setAddress] = useState('');
  const [state, setState] = useState<StateKey | ''>('');
  const [showStatePicker, setShowStatePicker] = useState(false);

  const { mutate: register, isPending } = useRegister();
  const { setUser } = useAuth();
  const { refetch: getProfile } = useGetProfile({
    enabled: false,
  });

  const getStateLabel = (stateKey: StateKey | '') => {
    if (!stateKey) return '';
    const option = STATE_OPTIONS.find((opt) => opt.value === stateKey);
    return option?.label || '';
  };

  const handleSubmit = async () => {
    if (!email) {
      Alert.alert('Error', 'Email not found. Please try again.');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match.');
      return;
    }

    if (password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters long.');
      return;
    }

    if (!address.trim()) {
      Alert.alert('Error', 'Address is required.');
      return;
    }

    if (!state) {
      Alert.alert('Error', 'Please select your state.');
      return;
    }

    register(
      {
        email,
        password,
        profilePicture: `https://avatar.iran.liara.run/public/${
          Math.floor(Math.random() * 100) + 1
        }`,
        address: address.trim(),
        state,
      },
      {
        onSuccess: async () => {
          try {
            const { data: profileData } = await getProfile();
            if (profileData && profileData.data) {
              setUser(profileData.data);
            } else {
              Alert.alert('Error', 'Failed to fetch profile data');
            }
          } catch (err) {
            Alert.alert('Error', 'Failed to fetch profile data');
          }
        },
        onError: (error) => {
          Alert.alert('Error', error.message);
        },
      }
    );
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
            <Text className="text-base text-gray-600 mb-4">
              Please set password for your account
            </Text>

            {/* Input fields */}
            <View className="space-y-4">
              <TextInput
                className="bg-white rounded-xl p-4 text-base text-black mb-4"
                placeholder="Password"
                placeholderTextColor="#999"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
              />

              <TextInput
                className="bg-white rounded-xl p-4 text-base text-black mb-4"
                placeholder="Confirm Password"
                placeholderTextColor="#999"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry
              />

              <TextInput
                className="bg-white rounded-xl p-4 text-base text-black mb-4"
                placeholder="Address *"
                placeholderTextColor="#999"
                value={address}
                onChangeText={setAddress}
                multiline
                numberOfLines={3}
                textAlignVertical="top"
                style={{ minHeight: 80 }}
              />

              <TouchableOpacity
                className="bg-white rounded-xl p-4"
                onPress={() => setShowStatePicker(true)}
              >
                <Text className={state ? 'text-base text-black' : 'text-base text-[#999]'}>
                  {state ? getStateLabel(state) : 'Select State *'}
                </Text>
              </TouchableOpacity>
            </View>

            <Modal
              visible={showStatePicker}
              transparent
              animationType="slide"
              onRequestClose={() => setShowStatePicker(false)}
            >
              <Pressable
                className="flex-1 bg-black/50 justify-end"
                onPress={() => setShowStatePicker(false)}
              >
                <Pressable className="bg-white rounded-t-3xl max-h-[70%]" onPress={() => {}}>
                  <View className="p-4 border-b border-gray-200">
                    <Text className="text-lg font-semibold text-center text-black">
                      Select State
                    </Text>
                  </View>
                  <ScrollView className="p-4">
                    {STATE_OPTIONS.map((option) => (
                      <TouchableOpacity
                        key={option.value}
                        className={`p-4 border-b border-gray-100 ${
                          state === option.value ? 'bg-gray-100' : ''
                        }`}
                        onPress={() => {
                          setState(option.value);
                          setShowStatePicker(false);
                        }}
                      >
                        <Text
                          className={`text-base ${
                            state === option.value ? 'text-black font-semibold' : 'text-gray-700'
                          }`}
                        >
                          {option.label}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </Pressable>
              </Pressable>
            </Modal>

            {/* Submit Button */}
            <TouchableOpacity
              onPress={handleSubmit}
              className="bg-[#1A1A1A] rounded-xl mt-6 p-4"
              disabled={isPending}
            >
              {isPending ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text className="text-white text-center text-lg font-medium">Submit</Text>
              )}
            </TouchableOpacity>
          </View>
        </ImageBackground>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
};

export default SetAccountPassword;
