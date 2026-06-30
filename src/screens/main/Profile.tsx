import { useAuth } from '@/contexts/AuthContext';
import { useGetProfile, useUpdateUser } from '@/hooks/api/user';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { ChevronRight, Lock, LogOut } from 'lucide-react-native';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  ScrollView,
  StatusBar,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { Header } from '../../components/Header/Header';

type AccountProps = {
  navigation: any;
};

export const Profile = ({ navigation }: AccountProps) => {
  const { user, setUser } = useAuth();
  const { mutate, isPending } = useUpdateUser();
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState(user?.name || '');
  const [editedBio, setEditedBio] = useState(user?.bio || '');
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');

  const {
    data: profile,
    isLoading: isLoadingProfile,
    error: profileError,
    refetch,
  } = useGetProfile();

  const handleBack = () => {
    navigation.goBack();
  };

  const handleUpgrade = () => {
    navigation.navigate('Plans');
  };

  const handleUpdateProfile = () => {
    mutate(
      { name: editedName, bio: editedBio, id: user?.id },
      {
        onSuccess: (data) => {
          setIsEditing(false);
          refetch();
          if (data?.data) {
            setUser(data.data);
          }
        },
        onError: (error) => {
          Alert.alert('Error', error.message);
        },
      }
    );
  };

  const handlePasswordUpdate = () => {
    if (!currentPassword || !newPassword) {
      Alert.alert('Error', 'Please fill in all password fields');
      return;
    }

    mutate(
      { id: profile?.data?.id, password: newPassword, currentPassword },
      {
        onSuccess: () => {
          Alert.alert('Success', 'Password updated successfully');
          setShowPasswordForm(false);
          setCurrentPassword('');
          setNewPassword('');
        },
        onError: (error) => {
          Alert.alert('Error', error.message);
        },
      }
    );
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((word) => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const renderSubscriptionStatus = () => {
    return (
      <View
        className={`self-start px-4 py-1 rounded-full mt-2 ${
          profile?.data?.subscription?.paymentStatus === 'SUCCESS' ? 'bg-amber-500' : 'bg-[#588157]'
        }`}
      >
        <Text className="text-white text-sm">
          {(() => {
            switch (profile?.data?.subscription?.paymentStatus) {
              case 'PENDING':
                return 'Freemium';
              case 'SUCCESS':
                return 'Premium';
              default:
                return 'Freemium';
            }
          })()}
        </Text>
      </View>
    );
  };

  return (
    <View className="flex-1 bg-[#F1BB3E]/10" style={{ paddingTop: StatusBar.currentHeight }}>
      <ScrollView className="flex-1">
        <Header title="My Account" onBack={handleBack} />

        <View className="px-4 mt-4">
          <View className="flex-row items-center">
            <View className="w-24 h-24 rounded-full border-2 border-[#4A635D] overflow-hidden flex items-center justify-center">
              {profile?.data?.profilePicture ? (
                <Image
                  source={{ uri: profile?.data?.profilePicture }}
                  className="h-full w-full rounded-full"
                />
              ) : (
                <View className="h-full w-full rounded-full bg-white items-center justify-center">
                  <Text className="text-black text-4xl font-medium">
                    {getInitials(profile?.data?.name || '')}
                  </Text>
                </View>
              )}
            </View>
            <View className="ml-4 flex-1">
              {isEditing ? (
                <TextInput
                  className="text-2xl bg-white px-4 py-2 rounded-xl border border-gray-200"
                  value={editedName}
                  onChangeText={setEditedName}
                  placeholder="Enter your name"
                  placeholderTextColor="#999"
                />
              ) : (
                <Text className="text-2xl font-semibold">{profile?.data?.name}</Text>
              )}
              <Text className="text-gray-500 mt-0.5">{profile?.data?.email}</Text>
              {renderSubscriptionStatus()}
            </View>
          </View>
        </View>

        <View className="px-4 mt-8">
          <View className="flex-row justify-between items-center mb-2">
            <Text className="text-xl font-semibold">Bio</Text>
            {!isEditing && (
              <TouchableOpacity
                onPress={() => setIsEditing(true)}
                className="flex-row items-center"
              >
                <MaterialIcons name="edit" size={20} color="#4A635D" />
                <Text className="text-[#4A635D] ml-1">Edit</Text>
              </TouchableOpacity>
            )}
          </View>

          {isEditing ? (
            <View>
              <TextInput
                className="text-gray-600 bg-white rounded-xl p-4 min-h-[100] border border-gray-200"
                value={editedBio}
                onChangeText={setEditedBio}
                multiline
                placeholder="Tell us about yourself"
                placeholderTextColor="#999"
                textAlignVertical="top"
              />

              <View className="flex-row justify-end mt-4 space-x-3">
                <TouchableOpacity
                  onPress={() => {
                    setIsEditing(false);
                    setEditedName(profile?.data?.name || '');
                    setEditedBio(profile?.data?.bio || '');
                  }}
                  className="bg-gray-100 px-4 py-2 rounded-xl flex-row items-center"
                >
                  <MaterialIcons name="close" size={18} color="#666" />
                  <Text className="text-gray-700 ml-1 text-sm font-medium">Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={handleUpdateProfile}
                  className="bg-[#4A635D] px-4 py-2 rounded-xl flex-row items-center ml-2"
                  disabled={isPending}
                >
                  {isPending ? (
                    <ActivityIndicator size="small" color="white" />
                  ) : (
                    <>
                      <MaterialIcons name="check" size={18} color="white" />
                      <Text className="text-white text-sm ml-1 font-medium">Save Changes</Text>
                    </>
                  )}
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            <Text className="text-gray-600 min-h-[50]">{user?.bio || 'No bio added yet'}</Text>
          )}
        </View>

        {profile?.data?.subscription?.paymentStatus !== 'SUCCESS' && (
          <View className="mx-4 mt-4 bg-[#1E1E1E] p-6 rounded-3xl">
            <Text className="text-white text-2xl font-semibold mb-4">Upgrade To Premium</Text>

            <View className="space-y-3 mb-6">
              <View className="flex-row items-center mb-2">
                <View className="bg-gray-800 rounded-3xl p-1">
                  <Ionicons name="checkmark" size={10} color="white" />
                </View>
                <Text className="text-white ml-2">Access to all premium tutorials</Text>
              </View>
              <View className="flex-row items-center mb-2">
                <View className="bg-gray-800 rounded-3xl p-1">
                  <Ionicons name="checkmark" size={10} color="white" />
                </View>
                <Text className="text-white ml-2">Priority support</Text>
              </View>
              <View className="flex-row items-center">
                <View className="bg-gray-800 rounded-3xl p-1">
                  <Ionicons name="checkmark" size={10} color="white" />
                </View>
                <Text className="text-white ml-2">Quality content</Text>
              </View>
            </View>

            <TouchableOpacity onPress={handleUpgrade} className="bg-white py-4 rounded-xl">
              <Text className="text-center text-black font-semibold">Upgrade To Pro</Text>
            </TouchableOpacity>
          </View>
        )}

        <View className="px-6 mt-6 mb-20">
          <Text className="text-xl font-semibold text-gray-800 mb-4">Settings</Text>

          <View className="bg-white rounded-2xl shadow-sm">
            <TouchableOpacity
              onPress={() => setShowPasswordForm(!showPasswordForm)}
              className="flex-row items-center justify-between p-4 border-b border-gray-100"
            >
              <View className="flex-row items-center">
                <Lock size={20} color="#4A635D" />
                <Text className="text-gray-700 ml-3 text-base">Change Password</Text>
              </View>
              <ChevronRight size={20} color="#4A635D" />
            </TouchableOpacity>

            {showPasswordForm && (
              <View className="p-4 space-y-4">
                <TextInput
                  className="bg-gray-50 rounded-xl p-4 text-base text-gray-700 border border-gray-100"
                  placeholder="Current Password"
                  placeholderTextColor="#999"
                  value={currentPassword}
                  onChangeText={setCurrentPassword}
                  secureTextEntry
                />
                <TextInput
                  className="bg-gray-50 rounded-xl p-4 text-base text-gray-700 border border-gray-100 mt-2"
                  placeholder="New Password"
                  placeholderTextColor="#999"
                  value={newPassword}
                  onChangeText={setNewPassword}
                  secureTextEntry
                />
                <TouchableOpacity
                  onPress={handlePasswordUpdate}
                  className="bg-[#4A635D] py-3.5 rounded-xl mt-2"
                  disabled={isPending}
                >
                  <Text className="text-white text-center font-medium">
                    {isPending ? 'Updating...' : 'Update Password'}
                  </Text>
                </TouchableOpacity>
              </View>
            )}

            <TouchableOpacity
              onPress={() => setUser(null)}
              className="flex-row items-center justify-between p-4"
            >
              <View className="flex-row items-center">
                <LogOut size={20} color="#EF4444" />
                <Text className="text-red-500 ml-3 text-base">Logout</Text>
              </View>
              <ChevronRight size={20} color="#EF4444" />
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default Profile;
