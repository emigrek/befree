import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import { AppSlice, createAppSlice } from './app';
import { ThemeSlice, createThemeSlice } from './theme';

export const useGlobalStore = create<ThemeSlice & AppSlice>()(
  persist(
    (...a) => ({
      ...createThemeSlice(...a),
      ...createAppSlice(...a),
    }),
    {
      name: 'global-storage',
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);
