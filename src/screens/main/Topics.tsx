import { Header } from '@/components/Header/Header';
import { TopicCard } from '@/components/TopicCard/TopicCard';
import { useAuth } from '@/contexts/AuthContext';
import { useGetFavorites } from '@/hooks/api/favorites';
import { useGetTopicsByChapterIdAndSubjectId, useMarkTopicAsLastRead } from '@/hooks/api/topics';
import { TTopic } from '@/types/Topic';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Modal,
  ScrollView,
  StatusBar,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';

type TopicsScreenProps = {
  navigation: any;
  route: {
    params: {
      subjectId: string;
      subjectTitle: string;
      chapterId: string;
      chapterTitle: string;
      chapterNumber: number;
    };
  };
};

export const Topics = ({ navigation, route }: TopicsScreenProps) => {
  const { chapterId, subjectId, chapterTitle, subjectTitle, chapterNumber } = route.params;
  const [showPremiumModal, setShowPremiumModal] = useState(false);
  const { user } = useAuth();

  const { data, isLoading, error } = useGetTopicsByChapterIdAndSubjectId({ chapterId, subjectId });
  const { data: favoritesData, isLoading: favoritesLoading } = useGetFavorites();

  const { mutate: markTopicAsLastRead } = useMarkTopicAsLastRead();

  const handleTopicPress = (topic: TTopic) => {
    if (topic.serviceType === 'PREMIUM' && !user?.subscription) {
      setShowPremiumModal(true);
    } else {
      markTopicAsLastRead(topic.id);
      navigation.navigate('TopicContent', { topic });
    }
  };

  const getFavoriteTopicId = (topicId: TTopic['id']) => {
    const favorite = favoritesData?.data?.find((each) => each.Topic.id === topicId);
    return favorite?.id;
  };

  if (isLoading || favoritesLoading)
    return (
      <View className="h-full w-full flex items-center justify-center">
        <ActivityIndicator size="large" color="#F4B95F" />
      </View>
    );

  if (error)
    return (
      <View className="h-full w-full flex items-center justify-center">
        <Text>{error.message}</Text>
      </View>
    );

  return (
    <View className="flex-1 bg-[#F1BB3E]/10" style={{ paddingTop: StatusBar.currentHeight }}>
      <Header title={chapterTitle} onBack={() => navigation.goBack()} />

      <ScrollView className="flex-1 px-4">
        {!data?.data?.length ? (
          <View className="flex justify-center items-center h-full w-full mt-6">
            <Text className="text-center">No Topics Found</Text>
          </View>
        ) : (
          data?.data?.map((topic) => (
            <TopicCard
              key={topic.id}
              topicId={topic.id}
              title={topic.name}
              favoriteId={getFavoriteTopicId(topic.id)}
              description={topic.description}
              thumbnailUrl={topic.contentThumbnail}
              isFree={topic.serviceType === 'FREE'}
              onPress={() => handleTopicPress(topic)}
              isFavorite={!!getFavoriteTopicId(topic.id)}
              chapterNumber={chapterNumber}
              subjectName={subjectTitle}
            />
          ))
        )}
      </ScrollView>

      <NoSubscriptionAlertModal
        showPremiumModal={showPremiumModal}
        setShowPremiumModal={setShowPremiumModal}
        onPress={() => {
          setShowPremiumModal(false);
          navigation.navigate('Plans');
        }}
      />
    </View>
  );
};

export const NoSubscriptionAlertModal = ({
  showPremiumModal,
  setShowPremiumModal,
  onPress,
}: {
  showPremiumModal: boolean;
  setShowPremiumModal: (value: boolean) => void;
  onPress: () => void;
}) => (
  <Modal
    animationType="fade"
    transparent={true}
    visible={showPremiumModal}
    onRequestClose={() => setShowPremiumModal(false)}
  >
    <TouchableWithoutFeedback onPress={() => setShowPremiumModal(false)}>
      <View className="flex-1 bg-black/50 justify-center items-center">
        <TouchableWithoutFeedback onPress={(e) => e.stopPropagation()}>
          <View className="bg-white w-[85%] rounded-2xl p-6">
            <Text className="text-2xl font-bold text-center mb-2">
              You don't have premium subscription!
            </Text>

            <Text className="text-gray-500 text-center mb-6">
              Access premium content with premium subscription
            </Text>

            <TouchableOpacity className="bg-[#F4B95F] rounded-lg py-3 mb-4" onPress={onPress}>
              <Text className="text-center text-base font-semibold">Upgrade To Pro</Text>
            </TouchableOpacity>
          </View>
        </TouchableWithoutFeedback>
      </View>
    </TouchableWithoutFeedback>
  </Modal>
);

export default Topics;
