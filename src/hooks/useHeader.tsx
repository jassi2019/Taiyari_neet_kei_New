// src/components/user-header/UserHeader.tsx
import { Crown } from 'lucide-react-native';
import React from 'react';
import { Image, Text, View } from 'react-native';

interface UserHeaderProps {
  name: string;
  isPremium?: boolean;
  imageUrl?: string;
}

export const UserHeader = ({ name, isPremium = false, imageUrl }: UserHeaderProps) => {
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((word) => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <View className="px-4 pt-4">
      <View className="flex-row items-center justify-between">
        <View>
          <Text className="text-2xl font-bold text-black">Hi, {name}</Text>
          {isPremium ? (
            <View className="flex-row items-center">
              <View className="w-4 h-4 mr-1">
                <Crown size={14} className="text-amber-500" color="orange" />
              </View>
              <Text className="text-amber-500">Premium</Text>
            </View>
          ) : (
            <View className="flex-row items-center">
              <View className="w-4 h-4 mr-1">
                <Crown size={14} className="text-[#588157]" color="green" />
              </View>
              <Text className="text-[#588157]">Freemium</Text>
            </View>
          )}
        </View>

        {imageUrl ? (
          <Image source={{ uri: imageUrl }} className="w-14 h-14 rounded-full" />
        ) : (
          <View className="w-14 h-14 rounded-full bg-blue-500 items-center justify-center">
            <Text className="text-white text-xl font-bold">{getInitials(name)}</Text>
          </View>
        )}
      </View>
    </View>
  );
};

export default UserHeader;
