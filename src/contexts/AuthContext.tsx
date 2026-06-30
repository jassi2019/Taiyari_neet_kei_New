import { useGetProfile } from '@/hooks/api/user';
import tokenManager from '@/lib/tokenManager';
import { TUser } from '@/types/User';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useEffect, useState } from 'react';

const USER_KEY = '@auth_user';

type AuthContextType = {
  user: TUser | null;
  setUser: (user: TUser | null) => void;
  isLoading: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<TUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { refetch: fetchProfile } = useGetProfile({ enabled: false });

  const persistUser = async (userData: TUser | null) => {
    try {
      if (userData) {
        await AsyncStorage.setItem(USER_KEY, JSON.stringify(userData));
      } else {
        await AsyncStorage.removeItem(USER_KEY);
        await tokenManager.clearToken();
      }
      setUser(userData);
    } catch (error) {
      console.log(JSON.stringify(error, null, 2));
    }
  };

  useEffect(() => {
    const initAuth = async () => {
      try {
        const token = await tokenManager.loadToken();
        if (!token) {
          setUser(null);
          return;
        }

        try {
          // Try to get fresh user data
          const profileResult = await fetchProfile();
          if (profileResult.data?.data) {
            await persistUser(profileResult.data.data);
          } else {
            // If profile fetch fails, clear everything
            await persistUser(null);
          }
        } catch (error) {
          await persistUser(null);
        }
      } catch (error) {
        await persistUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser: persistUser,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
