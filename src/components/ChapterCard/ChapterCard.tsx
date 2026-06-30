// import React from 'react';
// import { Text, TouchableOpacity } from 'react-native';

// type ChapterListingCardProps = {
//   title: string;
//   description: string;
//   onPress: () => void;
// };

// export const ChapterListingCard = ({ title, description, onPress }: ChapterListingCardProps) => {
//   return (
//     <TouchableOpacity className="mx-4 my-2 bg-white rounded-2xl p-4 shadow-sm" onPress={onPress}>
//       <Text className="text-xl font-semibold text-gray-800">{title}</Text>
//       <Text className="text-gray-500 mt-1 mb-2">{description}</Text>
//     </TouchableOpacity>
//   );
// };

import { TChapter } from '@/types/Chapter';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

type ChapterListingCardProps = {
  chapter: Pick<TChapter, 'id' | 'name' | 'description' | 'number'>;
  onPress: () => void;
};

export const ChapterListingCard = ({ chapter, onPress }: ChapterListingCardProps) => {
  return (
    <TouchableOpacity
      className="mx-4 my-2 bg-white rounded-2xl border border-gray-100"
      activeOpacity={0.9}
      onPress={onPress}
    >
      <View className="p-4">
        <View className="flex-row justify-between items-start">
          <Text className="text-lg font-semibold text-gray-800 flex-1 pr-3" numberOfLines={2}>
            {chapter.name}
          </Text>
          <MaterialCommunityIcons name="chevron-right" size={24} color="#94A3B8" className="mt-1" />
        </View>

        <Text className="text-gray-600 text-sm leading-5 mt-2" numberOfLines={2}>
          {chapter.description}
        </Text>

        <Text className="text-[#F1BB3E] text-sm leading-5 mt-2 font-medium">
          Chapter {chapter.number || 'N/A'}
        </Text>
      </View>
    </TouchableOpacity>
  );
};
