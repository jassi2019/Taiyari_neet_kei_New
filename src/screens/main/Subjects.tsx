import { Header } from '@/components/Header/Header';
import { SubjectCard } from '@/components/SubjectCard/SubjectCard';
import { useGetAllSubjects } from '@/hooks/api/subjects';
import { TSubject } from '@/types/Subject';
import React from 'react';
import { ActivityIndicator, ScrollView, StatusBar, Text, View } from 'react-native';

type SubjectsScreenProps = {
  navigation: any;
};

export const Subjects = ({ navigation }: SubjectsScreenProps) => {
  const { data, isLoading, error } = useGetAllSubjects();

  const handleBack = () => {
    navigation.goBack();
  };

  const handleSubjectPress = (subject: TSubject) => {
    navigation.navigate('Chapters', {
      subjectId: subject.id,
      subjectTitle: subject.name,
    });
  };

  if (isLoading)
    return (
      <View className="h-full w-full flex justify-center items-center">
        <ActivityIndicator size="large" color="#F1BB3E" />
      </View>
    );

  if (error)
    return (
      <View className="h-full w-full flex justify-center items-center">
        <Text>Error Fetching Data</Text>
      </View>
    );

  return (
    <View className="flex-1 bg-[#F1BB3E]/10" style={{ paddingTop: StatusBar.currentHeight }}>
      <Header title="Subjects" onBack={handleBack} />

      <ScrollView className="flex-1 px-4">
        {data?.data?.map((subject) => (
          <SubjectCard
            key={subject.id}
            subject={subject}
            onPress={() => handleSubjectPress(subject)}
          />
        ))}
      </ScrollView>
    </View>
  );
};

export default Subjects;
