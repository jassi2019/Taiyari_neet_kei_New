import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

interface ContinueReadingProps {
  title: string;
  description: string;
  subject: string;
  isPremium?: boolean;
  isStartReading?: boolean;
  onPress: () => void;
}

export const ContinueReading = ({
  title,
  description,
  subject,
  isPremium = false,
  isStartReading = false,
  onPress,
}: ContinueReadingProps) => {
  return (
    <TouchableOpacity onPress={onPress} className="bg-white rounded-3xl p-4 mx-4">
      <Text className="text-[#1e1e1e] font-medium text-2xl mb-4">
        {isStartReading ? 'Start Reading' : 'Continue Reading'}
      </Text>
      {/* Top dashed line */}
      <View className="border-t border-[#1e1e1e]/30 mb-4" />

      <Text className="text-xl font-semibold text-black mb-2">{title}</Text>
      <Text className="text-[#1e1e1e]/50 mb-4" numberOfLines={2}>
        {description}
      </Text>

      <View className="flex-row items-center justify-between">
        <View className="flex-row gap-2">
          <View className="bg-[#E8F1EE] px-4 py-1 rounded-full">
            <Text className="text-[#4E9982] text-sm font-medium">{subject}</Text>
          </View>
          {isPremium && (
            <View className="bg-amber-50 px-4 py-1.5 rounded-full">
              <Text className="text-[#F1BB3E] text-sm font-medium">Premium</Text>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default ContinueReading;
