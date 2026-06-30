import { ChapterListingCard } from '@/components/ChapterCard/ChapterCard';
import { useGetChaptersBySubjectId } from '@/hooks/api/chapters';
import { useGetAllClasses } from '@/hooks/api/classes';
import { TChapter } from '@/types/Chapter';
import { TClass } from '@/types/Class';
import { ChevronDown, ChevronLeft } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
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

type ChaptersScreenProps = {
  navigation: any;
  route: {
    params: {
      subjectId: string;
      subjectTitle: string;
    };
  };
};

export const Chapters = ({ navigation, route }: ChaptersScreenProps) => {
  const { subjectId, subjectTitle } = route.params;
  const [showPremiumModal, setShowPremiumModal] = useState(false);
  const [selectedClass, setSelectedClass] = useState<TClass['id'] | null>(null);
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);

  const {
    data: chapters,
    isLoading: chaptersLoading,
    error: chaptersError,
  } = useGetChaptersBySubjectId({ subjectId, classId: selectedClass || '' });
  const { data: classes, isLoading: classesLoading, error: classesError } = useGetAllClasses();

  useEffect(() => {
    if (classes?.data) {
      setSelectedClass(classes?.data?.[0].id);
    }
  }, [classesLoading]);

  const handleChapterPress = (chapter: TChapter) => {
    navigation.navigate('Topics', {
      subjectId,
      subjectTitle,
      chapterId: chapter.id,
      chapterTitle: chapter.name,
      chapterNumber: chapter.number,
    });
  };

  const handleBack = () => {
    navigation.goBack();
  };

  const toggleDropdown = () => {
    setIsDropdownVisible(!isDropdownVisible);
  };

  const handleClassSelect = (classId: TClass['id']) => {
    setSelectedClass(classId);
    setIsDropdownVisible(false);
  };

  if (chaptersLoading || classesLoading)
    return (
      <View className="h-full w-full flex items-center justify-center">
        <ActivityIndicator size="large" color="#F1BB3E" />
      </View>
    );

  if (chaptersError || classesError)
    return (
      <View className="h-full w-full flex items-center justify-center">
        <Text>{chaptersError?.message || classesError?.message}</Text>
      </View>
    );

  return (
    <View className="flex-1 bg-[#F1BB3E]/10" style={{ paddingTop: StatusBar.currentHeight }}>
      <View className="flex-row items-center justify-between px-4 py-4">
        <TouchableOpacity onPress={handleBack} className="flex-row items-center">
          <ChevronLeft size={28} color="#000" />
          <Text className="text-2xl font-semibold ml-2">{subjectTitle}</Text>
        </TouchableOpacity>

        <View className="relative">
          <TouchableOpacity
            onPress={toggleDropdown}
            className="flex-row items-center bg-white px-3 py-2 rounded-lg"
          >
            <Text className="mr-2">
              {selectedClass
                ? classes?.data?.find((c) => c.id === selectedClass)?.name || 'Select Class'
                : 'Select Class'}
            </Text>
            <ChevronDown size={16} color="#000" />
          </TouchableOpacity>

          {isDropdownVisible && (
            <View className="absolute top-12 right-0 bg-white rounded-2xl shadow-lg z-50 min-w-[120px]">
              {classes?.data?.map((classItem) => (
                <TouchableOpacity
                  key={classItem.id}
                  onPress={() => handleClassSelect(classItem.id)}
                  className="px-4 py-2 border-b border-gray-100"
                >
                  <Text>{classItem.name}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>
      </View>

      <ScrollView className="flex-1">
        {!chapters?.data?.length ? (
          <View className="flex justify-center items-center h-full w-full mt-6">
            <Text className="text-center">No Chapters Found</Text>
          </View>
        ) : (
          chapters?.data
            ?.filter((each) => each.subjectId === subjectId)
            .map((chapter) => (
              <ChapterListingCard
                key={chapter.id}
                chapter={chapter}
                onPress={() => handleChapterPress(chapter)}
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

const NoSubscriptionAlertModal = ({
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

export default Chapters;
