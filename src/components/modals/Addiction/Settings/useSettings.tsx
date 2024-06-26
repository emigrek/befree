import { useNavigation } from '@react-navigation/native';
import { useMemo } from 'react';
import { StyleProp, TextStyle, View } from 'react-native';
import { List, Switch } from 'react-native-paper';
import { Style } from 'react-native-paper/lib/typescript/components/List/utils';

import i18n from '@/i18n';
import { ModalStackNavigationProp } from '@/navigation/types';
import { UserDataManager } from '@/services/managers/firebase';
import { NotificationsBlacklistManager } from '@/services/managers/local';
import { useAuthStore, useLocalAuthStore } from '@/store';
import { Addiction } from '@/structures';
import { useTheme } from '@/theme';

export enum Section {
  PRIVACY = 'privacy',
  DISPLAY = 'display',
  MANAGEMENT = 'management',
}

type SideProps =
  | ((props: { color: string; style?: Style | undefined }) => React.ReactNode)
  | undefined;

export interface AddictionSetting {
  id: number;
  section: Section;
  name: string;
  description?: string;
  onChange: () => Promise<void>;
  titleStyle?: StyleProp<TextStyle>;
  disabled?: boolean;
  left?: SideProps;
  right?: SideProps;
}

interface UseSettingsProps {
  addiction: Addiction;
}

export const useSettings = ({ addiction }: UseSettingsProps) => {
  const navigation = useNavigation<ModalStackNavigationProp>();
  const user = useAuthStore(state => state.user);
  const hasHardware = useLocalAuthStore(state => state.hasHardware);

  const { colors } = useTheme();

  return useMemo<AddictionSetting[]>(
    () => [
      {
        id: 0,
        section: Section.PRIVACY,
        name: i18n.t([
          'modals',
          'addiction',
          'settings',
          'list',
          'hidden',
          'name',
        ]),
        description: i18n.t([
          'modals',
          'addiction',
          'settings',
          'list',
          'hidden',
          'description',
        ]),
        disabled: !hasHardware,
        left: props => {
          return <List.Icon {...props} icon="eye-off" />;
        },
        right: () => {
          return (
            <View pointerEvents={'none'}>
              <Switch color={colors.primary} value={addiction.hidden} />
            </View>
          );
        },
        onChange: async () => {
          if (!user) return;
          const { addictions } = new UserDataManager(user.uid);
          await addictions.update(addiction.id, {
            hidden: !addiction.hidden,
          });
        },
      },
      {
        id: 1,
        section: Section.DISPLAY,
        name: i18n.t([
          'modals',
          'addiction',
          'settings',
          'list',
          'inverseTimelineColor',
          'name',
        ]),
        description: i18n.t([
          'modals',
          'addiction',
          'settings',
          'list',
          'inverseTimelineColor',
          'description',
        ]),
        left: props => {
          return <List.Icon {...props} icon="invert-colors" />;
        },
        right: () => {
          return (
            <View pointerEvents={'none'}>
              <Switch
                color={colors.primary}
                value={addiction.inverseTimelineColor}
              />
            </View>
          );
        },
        onChange: async () => {
          if (!user) return;
          const { addictions } = new UserDataManager(user.uid);
          await addictions.update(addiction.id, {
            inverseTimelineColor: !addiction.inverseTimelineColor,
          });
        },
      },
      {
        id: 2,
        section: Section.MANAGEMENT,
        name: i18n.t([
          'modals',
          'addiction',
          'settings',
          'list',
          'delete',
          'name',
        ]),
        description: i18n.t([
          'modals',
          'addiction',
          'settings',
          'list',
          'delete',
          'description',
        ]),
        left: props => {
          return <List.Icon {...props} icon="trash-can" />;
        },
        titleStyle: {
          color: colors.error,
        },
        onChange: async () => {
          if (!user) return;
          const { addictions } = new UserDataManager(user.uid);

          await addiction.achievements.notifications.cancelAll();
          await NotificationsBlacklistManager.getInstance().remove(
            addiction.id,
          );
          navigation.pop();

          await addictions.delete(addiction.id);
        },
      },
    ],
    [addiction, colors.error, colors.primary, hasHardware, navigation, user],
  );
};
