import { ChevronDown, ChevronLeft } from 'lucide-react-native';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

type HeaderProps = {
  title: string;
  subtitle?: string;
  onBack?: () => void;
  onSubtitlePress?: () => void;
};

export const Header = ({ title, subtitle, onBack, onSubtitlePress }: HeaderProps) => {
  return (
    <View className="flex-row items-center px-4 py-4">
      {onBack && (
        <TouchableOpacity onPress={onBack} className="mr-3">
          <ChevronLeft size={28} color="#000" />
        </TouchableOpacity>
      )}

      <Text className="text-2xl font-semibold flex-1">{title}</Text>

      {subtitle && (
        <TouchableOpacity onPress={onSubtitlePress} className="flex-row items-center">
          <Text className="text-lg mr-1">{subtitle}</Text>
          <ChevronDown size={20} color="#000" />
        </TouchableOpacity>
      )}
    </View>
  );
};

export default Header;
