import { ContinueReading } from '@/components/ContinueReading/ContinueReading';
import {
  ContinueReadingSkeleton,
  SubjectCardSkeleton,
  TopicCardSkeleton,
} from '@/components/SkeletonLoader/SkeletonLoader';
import SubjectCard from '@/components/SubjectCard/SubjectCard';
import { TopicCard } from '@/components/TopicCard/TopicCard';
import { useAuth } from '@/contexts/AuthContext';
import { useGetChaptersBySubjectId } from '@/hooks/api/chapters';
import { useGetAllClasses } from '@/hooks/api/classes';
import { useGetFavorites } from '@/hooks/api/favorites';
import { useGetAllSubjects } from '@/hooks/api/subjects';
import {
  useGetFreeTopics,
  useGetLastReadTopic,
  useGetTopicsByChapterIdAndSubjectId,
  useMarkTopicAsLastRead,
} from '@/hooks/api/topics';
import { useGetProfile } from '@/hooks/api/user';
import UserHeader from '@/hooks/useHeader';
import { NoSubscriptionAlertModal } from '@/screens/main/Topics';
import { TSubject } from '@/types/Subject';
import { TTopic } from '@/types/Topic';
import React, { useState } from 'react';
import { ScrollView, StatusBar, Text, View } from 'react-native';

type HomeScreenProps = {
  navigation: any;
};

export const Home = ({ navigation }: HomeScreenProps) => {
  const { data: profile, isLoading: profileLoading } = useGetProfile();
  const { data, isLoading: subjectsLoading, error: subjectsError } = useGetAllSubjects();
  const [showPremiumModal, setShowPremiumModal] = useState(false);
  const { user } = useAuth();
  const { data: classes } = useGetAllClasses();
  const { data: chapters } = useGetChaptersBySubjectId(
    {
      subjectId: data?.data?.[0]?.id || '',
      classId: classes?.data?.[0]?.id || '',
    },
    {
      enabled: !!data?.data?.[0]?.id && !!classes?.data?.[0]?.id,
    }
  );
  const {
    data: favoritesData,
    isLoading: favoritesLoading,
    error: favoritesError,
  } = useGetFavorites();
  const { data: lastReadTopic, isLoading: lastReadTopicLoading } = useGetLastReadTopic();

  const { data: freeTopics, isLoading: freeTopicsLoading } = useGetFreeTopics();

  // Get first free topic if no last read topic
  const firstSubject = data?.data?.[0];
  const { data: topics, isLoading: topicsLoading } = useGetTopicsByChapterIdAndSubjectId(
    {
      subjectId: firstSubject?.id || '',
      chapterId: chapters?.data?.[0]?.id || '',
    },
    {
      enabled: !!firstSubject?.id && !!chapters?.data?.[0]?.id,
    }
  );
  const firstFreeTopic = topics?.data?.find((topic) => topic.serviceType === 'FREE');

  const { mutate: markTopicAsLastRead } = useMarkTopicAsLastRead();

  const handleSubjectPress = (subject: TSubject) => {
    navigation.navigate('SubjectsStack', {
      screen: 'Chapters',
      params: {
        subjectId: subject.id,
        subjectTitle: subject.name,
      },
    });
  };

  const handleContinueReading = () => {
    if (!lastReadTopic?.data) return;
    navigation.navigate('TopicContent', {
      topic: lastReadTopic.data,
    });
  };

  const handleStartReading = (topic: TTopic) => {
    markTopicAsLastRead(topic.id);
    navigation.navigate('TopicContent', {
      topic,
    });
  };

  return (
    <View className="flex-1 bg-[#F1BB3E]/10" style={{ paddingTop: StatusBar.currentHeight }}>
      <ScrollView className="flex-1">
        <UserHeader
          name={
            (profile?.data?.name?.charAt(0)?.toUpperCase() || '') +
            (profile?.data?.name?.slice(1) || '')
          }
          imageUrl={profile?.data?.profilePicture || ''}
          isPremium={profile?.data?.subscription?.paymentStatus === 'SUCCESS'}
        />

        <View className="px-4 my-8">
          <Text className="text-5xl font-bold text-[#1e1e1e] mb-1.5">Ab hogi</Text>
          <Text className="text-5xl font-bold text-[#F1BB3E]">Taiyari NEET ki</Text>
        </View>

        <View className="mb-8">
          {lastReadTopicLoading || (topicsLoading && !lastReadTopic?.data) ? (
            <ContinueReadingSkeleton />
          ) : lastReadTopic?.data ? (
            <ContinueReading
              title={lastReadTopic.data.name}
              description={lastReadTopic.data.description}
              subject={lastReadTopic.data.Subject.name}
              isPremium={lastReadTopic.data.serviceType === 'PREMIUM'}
              onPress={handleContinueReading}
            />
          ) : firstFreeTopic ? (
            <ContinueReading
              title={firstFreeTopic.name}
              description={firstFreeTopic.description}
              subject={firstSubject?.name || ''}
              isPremium={false}
              onPress={() => handleStartReading(firstFreeTopic)}
              isStartReading
            />
          ) : null}
        </View>

        {freeTopicsLoading ? (
          <ContinueReadingSkeleton />
        ) : freeTopics?.data?.length ? (
          <View className="px-4 mb-6">
            <Text className="text-3xl font-bold mb-4">Free Topics</Text>
            <View className="space-y-4">
              {freeTopics.data.map((topic) => (
                <TopicCard
                  key={topic.id}
                  topicId={topic.id}
                  title={topic.name}
                  description={topic.description}
                  thumbnailUrl={topic.contentThumbnail}
                  isFree={true}
                  onPress={() => handleStartReading(topic)}
                  chapterNumber={topic.Chapter.number}
                  subjectName={topic.Subject.name}
                />
              ))}
            </View>
          </View>
        ) : null}

        <View className="px-4 mb-8">
          <Text className="text-3xl font-bold">Subjects</Text>
          <View className="flex-row flex-wrap justify-between">
            {subjectsLoading ? (
              [...Array(4)].map((_, index) => (
                <View key={`skeleton-${index}`} className="w-[48%] mt-4">
                  <SubjectCardSkeleton />
                </View>
              ))
            ) : subjectsError ? (
              <View>
                <Text>{subjectsError.message}</Text>
              </View>
            ) : data?.data?.length ? (
              data?.data?.slice(0, 4).map((subject) => (
                <View key={subject.id} className="w-[48%] mt-4">
                  <SubjectCard subject={subject} onPress={() => handleSubjectPress(subject)} />
                </View>
              ))
            ) : (
              <View>
                <Text>No subjects found</Text>
              </View>
            )}
          </View>
        </View>

        <View className="mb-8">
          <Text className="ml-4 text-3xl font-bold mb-4">Favorites</Text>
          <View className="space-y-4 px-4">
            {favoritesLoading ? (
              [...Array(4)].map((_, index) => <TopicCardSkeleton key={`skeleton-${index}`} />)
            ) : favoritesError ? (
              <View>
                <Text>{favoritesError?.message}</Text>
              </View>
            ) : !favoritesData?.data?.length ? (
              <View className="mx-4 px-4 py-16 flex items-center justify-center bg-white rounded-3xl">
                <Text className="text-gray-600 text-lg mb-1 mt-4">No favorites yet</Text>
                <Text className="text-gray-500 text-center mx-6">
                  Browse topics and bookmark your favorites to see them here
                </Text>
              </View>
            ) : (
              favoritesData?.data?.slice(0, 4).map((favorite) => (
                <TopicCard
                  topicId={favorite.Topic.id}
                  key={favorite.Topic.id}
                  title={favorite.Topic.name}
                  description={favorite.Topic.description}
                  favoriteId={favorite.id}
                  thumbnailUrl={favorite.Topic.contentThumbnail}
                  isFree={favorite.Topic.serviceType === 'FREE'}
                  onPress={() => {
                    if (favorite.Topic.serviceType === 'PREMIUM' && !user?.subscription) {
                      setShowPremiumModal(true);
                    } else {
                      markTopicAsLastRead(favorite.Topic.id);
                      navigation.navigate('TopicContent', {
                        topic: favorite.Topic,
                      });
                    }
                  }}
                  isFavorite={true}
                  chapterNumber={favorite.Topic.Chapter.number}
                  subjectName={favorite.Topic.Subject.name}
                />
              ))
            )}
          </View>
        </View>
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

export default Home;
