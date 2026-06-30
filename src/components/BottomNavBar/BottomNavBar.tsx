import { useNavigation } from '@react-navigation/native';
import { Home, Notebook, User } from 'lucide-react-native';
import React, { createContext, useContext, useState } from 'react';
import { TouchableOpacity, View } from 'react-native';

export type TabName = 'Home' | 'Subjects' | 'Profile';

type BottomNavContextType = {
  activeTab: TabName;
  setActiveTab: (tab: TabName) => void;
};

const BottomNavContext = createContext<BottomNavContextType | undefined>(undefined);

export const useBottomNav = () => {
  const context = useContext(BottomNavContext);
  if (!context) {
    throw new Error('useBottomNav must be used within a BottomNavProvider');
  }
  return context;
};

export const BottomNavProvider = ({ children }: { children: React.ReactNode }) => {
  const [activeTab, setActiveTab] = useState<TabName>('Home');

  return (
    <BottomNavContext.Provider value={{ activeTab, setActiveTab }}>
      {children}
    </BottomNavContext.Provider>
  );
};

export const BottomNav = () => {
  const { activeTab, setActiveTab } = useBottomNav();
  const navigation = useNavigation();

  const navItems: NavItem[] = [
    {
      icon: Home,
      tab: 'Home',
    },
    {
      icon: Notebook,
      tab: 'Subjects',
    },
    {
      icon: User,
      tab: 'Profile',
    },
  ];

  const handleTabPress = (tab: TabName) => {
    if (tab === activeTab) return;
    setActiveTab(tab);
    navigation.navigate(tab as never);
  };

  return (
    <View className="flex-row justify-around items-center py-4 bg-white border-t border-gray-200 rounded-tr-[30px] rounded-tl-[30px]">
      {navItems.map((item) => {
        const isActive = activeTab === item.tab;
        return (
          <TouchableOpacity
            key={item.tab}
            onPress={() => handleTabPress(item.tab)}
            activeOpacity={0.7}
            className="relative"
          >
            {isActive && (
              <View className="absolute -top-4 left-0 right-0 h-0.5 bg-black rounded-full" />
            )}
            <item.icon
              size={28}
              color={isActive ? '#000000' : '#9CA3AF'}
              strokeWidth={1.5}
              fill={isActive ? '#000000' : 'none'}
            />
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

type NavItem = {
  icon: typeof Home | typeof Notebook | typeof User;
  tab: TabName;
};

export default BottomNav;
