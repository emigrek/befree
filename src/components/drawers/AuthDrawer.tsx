import auth from '@react-native-firebase/auth';
import {
  DrawerContentComponentProps,
  DrawerContentScrollView,
} from '@react-navigation/drawer';
import { useNavigation } from '@react-navigation/native';
import React, { FC } from 'react';
import { Alert, StyleSheet, View } from 'react-native';
import { IconButton, Title, Tooltip } from 'react-native-paper';

import { ThemeChanger } from '@/components/ui/ThemeChanger';
import { UserAvatar } from '@/components/ui/UserAvatar';
import i18n from '@/i18n';
import { RootStackNavigationProp } from '@/navigation/types';
import { useAuthStore } from '@/store';
import { useTheme } from '@/theme';

const AuthDrawer: FC<DrawerContentComponentProps> = props => {
  const user = useAuthStore(state => state.user);
  const navigation = useNavigation<RootStackNavigationProp>();
  const { colors } = useTheme();

  const handleSignOut = () => {
    Alert.alert(
      i18n.t(['labels', 'signOut']),
      i18n.t(['labels', 'signOutConfirmationMessage']),
      [
        {
          text: i18n.t(['labels', 'confirm']),
          onPress: () => auth().signOut(),
          style: 'destructive',
        },
        {
          text: i18n.t(['labels', 'cancel']),
        },
      ],
    );
  };

  const handleOnline = () => {
    navigation.navigate('Authentication');
  };

  return (
    <>
      <DrawerContentScrollView
        style={{ backgroundColor: colors.background }}
        {...props}
      >
        <View style={style.content}>
          <View style={style.user}>
            <View style={style.userDetails}>
              <UserAvatar size={40} user={user} />
              {user ? (
                <Tooltip title={i18n.t(['labels', 'signOut'])}>
                  <IconButton
                    onPress={handleSignOut}
                    size={20}
                    icon={'logout'}
                  />
                </Tooltip>
              ) : (
                <Tooltip title={i18n.t(['labels', 'signIn'])}>
                  <IconButton onPress={handleOnline} size={20} icon={'login'} />
                </Tooltip>
              )}
            </View>
            {user && (
              <Title style={style.title}>
                {user.displayName ?? user.email}
              </Title>
            )}
          </View>
        </View>
      </DrawerContentScrollView>
      <ThemeChanger />
    </>
  );
};

const style = StyleSheet.create({
  content: {
    flex: 1,
    marginTop: 20,
    marginHorizontal: 5,
    gap: 10,
  },
  user: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    marginBottom: 15,
  },
  userDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    marginVertical: 20,
    fontWeight: 'bold',
  },
});

export { AuthDrawer };
