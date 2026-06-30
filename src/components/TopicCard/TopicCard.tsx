import { useAuth } from '@/contexts/AuthContext';
import { useAddToFavorites, useGetFavorites, useRemoveFromFavorites } from '@/hooks/api/favorites';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import React from 'react';
import { ActivityIndicator, Alert, Image, Text, TouchableOpacity, View } from 'react-native';

type TopicCardProps = {
  topicId: string;
  title: string;
  favoriteId?: string;
  description: string;
  thumbnailUrl?: string;
  isFree?: boolean;
  isFavorite?: boolean;
  onPress?: () => void;
  chapterNumber?: number;
  subjectName?: string;
};

export const TopicCard = ({
  title,
  topicId,
  favoriteId,
  description,
  isFavorite,
  thumbnailUrl,
  isFree = false,
  onPress,
  chapterNumber,
  subjectName,
}: TopicCardProps) => {
  const { mutate: addToFavorites, isPending: isAddingToFavorites } = useAddToFavorites();
  const { mutate: removeFromFavorites, isPending: isRemovingFromFavorite } =
    useRemoveFromFavorites();
  const { refetch } = useGetFavorites();
  const { user } = useAuth();

  const handleAddToFavorites = () => {
    if (!user?.id) return;

    if (!isFavorite) {
      addToFavorites(
        { topicId, userId: user?.id },
        {
          onSuccess: () => {
            Alert.alert('Success', 'Topic added to favorites');
            refetch();
          },
          onError: (error) => {
            Alert.alert('Error', 'Unable to add to favorites');
            refetch();
          },
        }
      );
    } else {
      removeFromFavorites(favoriteId || '', {
        onSuccess: () => {
          Alert.alert('Success', 'Topic removed from favorites');
          refetch();
        },
        onError: (error) => {
          Alert.alert('Error', 'Unable to remove from favorites');
          refetch();
        },
      });
    }
  };

  return (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={onPress}
      className="bg-white rounded-3xl my-2 shadow-sm overflow-hidden border border-gray-100"
    >
      <View className="p-4 flex-row">
        <View className="relative h-32 aspect-[12/9] rounded-2xl overflow-hidden bg-gray-100">
          {thumbnailUrl ? (
            <Image source={{ uri: thumbnailUrl }} className="w-full h-full" resizeMode="cover" />
          ) : (
            <View className="w-full h-full bg-gray-100 items-center justify-center">
              <Text className="text-gray-500 text-sm">No Thumbnail</Text>
            </View>
          )}
        </View>

        <View className="flex-1 ml-4 min-h-[128px] justify-between">
          <View>
            <View className="flex-row justify-between items-start">
              <Text className="text-lg font-semibold text-gray-900 flex-1 mr-3" numberOfLines={2}>
                {title}
              </Text>
              <TouchableOpacity
                onPress={handleAddToFavorites}
                disabled={isAddingToFavorites}
                className="p-2 -mr-2 -mt-2"
              >
                {isAddingToFavorites ? (
                  <ActivityIndicator size="small" color="#FDB813" />
                ) : isFavorite ? (
                  <MaterialCommunityIcons name="star-box-multiple" size={24} color="#FDB813" />
                ) : (
                  <MaterialCommunityIcons
                    name="star-box-multiple-outline"
                    size={24}
                    color="#FDB813"
                  />
                )}
              </TouchableOpacity>
            </View>

            {chapterNumber && (
              <View className="flex-row items-center mt-1 space-x-2">
                <View className="flex-row items-center">
                  <MaterialCommunityIcons name="book-open-variant" size={16} color="#6B7280" />
                  <Text className="text-gray-500 text-sm ml-1">Ch. {chapterNumber}</Text>
                </View>
                {subjectName && (
                  <>
                    <Text className="text-gray-300">•</Text>
                    <View className="flex-row items-center">
                      <MaterialCommunityIcons name="school" size={16} color="#6B7280" />
                      <Text className="text-gray-500 text-sm ml-1">{subjectName}</Text>
                    </View>
                  </>
                )}
              </View>
            )}

            <Text className="text-gray-600 text-sm leading-5 mt-2" numberOfLines={2}>
              {description}
            </Text>
          </View>

          <View className="flex-row mt-2">
            <View
              className={`px-3 py-1 rounded-full 
                ${isFree ? 'bg-emerald-500' : 'bg-amber-500'}`}
            >
              <Text className="text-white text-xs font-medium">{isFree ? 'Free' : 'Premium'}</Text>
            </View>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};
