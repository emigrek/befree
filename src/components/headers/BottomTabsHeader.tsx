import { BottomTabHeaderProps } from '@react-navigation/bottom-tabs';
import { DrawerNavigationProp } from '@react-navigation/drawer';
import { useNavigation } from '@react-navigation/native';
import React, { FC } from 'react';
import { View } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { Appbar } from 'react-native-paper';

import { style } from './style';

import { Logo } from '@/components/ui/Logo';
import { OfflineBanner } from '@/components/ui/OfflineBanner';
import { UserAvatar } from '@/components/ui/UserAvatar';
import { AuthDrawerStackParamList } from '@/navigation/types';
import { useAuthStore } from '@/store';

type AuthDrawerStackNavigationProp =
  DrawerNavigationProp<AuthDrawerStackParamList>;

const BottomTabsHeader: FC<BottomTabHeaderProps> = ({ options }) => {
  const user = useAuthStore(state => state.user);
  const { openDrawer } = useNavigation<AuthDrawerStackNavigationProp>();

  return (
    <>
      <Appbar.Header mode={'center-aligned'} style={style.header}>
        <View style={style.container}>
          <TouchableOpacity onPress={openDrawer}>
            <UserAvatar user={user} />
          </TouchableOpacity>
          <View style={style.center}>
            <Logo />
          </View>
          {options.headerRight &&
            options.headerRight({
              pressColor: options.headerPressColor,
              tintColor: options.headerTintColor,
            })}
        </View>
      </Appbar.Header>
      <OfflineBanner />
    </>
  );
};

export { BottomTabsHeader };
