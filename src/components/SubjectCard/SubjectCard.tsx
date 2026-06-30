import BotanyIcon from '@/assets/icons/Botany';
import ChemistryIcon from '@/assets/icons/Chemistry';
import PhysicsIcon from '@/assets/icons/Physics';
import ZoologyIcon from '@/assets/icons/Zoology';
import { TSubject } from '@/types/Subject';
import { Book } from 'lucide-react-native';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

type SubjectCardProps = {
  subject: TSubject;
  onPress: () => void;
};

const getSubjectIcon = (subject: string) => {
  switch (subject.trim().toLowerCase()) {
    case 'physics':
      return PhysicsIcon;
    case 'chemistry':
      return ChemistryIcon;
    case 'botany':
      return BotanyIcon;
    case 'zoology':
      return ZoologyIcon;
    default:
      return Book;
  }
};

export const SubjectCard = ({ subject, onPress }: SubjectCardProps) => {
  const NewIcon = getSubjectIcon(subject.name);

  return (
    <TouchableOpacity
      onPress={onPress}
      className="bg-white p-5 flex-1 h-36 relative overflow-hidden rounded-3xl flex flex-col justify-end mb-4"
    >
      <Text className="text-2xl font-semibold text-[#1e1e1e] z-10">
        {subject.name.toUpperCase()}
      </Text>
      <View className="absolute -bottom-0 -right-0 opacity-5">
        <NewIcon />
      </View>
    </TouchableOpacity>
  );
};

export default SubjectCard;
