import { StackHeaderProps } from '@react-navigation/stack';
import React, { FC } from 'react';
import { StyleSheet, View } from 'react-native';
import { Appbar } from 'react-native-paper';

import { Logo } from '@/components/ui/Logo';
import { useTheme } from '@/theme';

const RootHeader: FC<StackHeaderProps> = ({ options, route }) => {
  const { colors } = useTheme();
  return (
    <Appbar.Header
      mode={'center-aligned'}
      style={[
        style.header,
        {
          backgroundColor: colors.background,
        },
      ]}
    >
      <View style={style.container}>
        <Logo />
      </View>
    </Appbar.Header>
  );
};

const style = StyleSheet.create({
  header: {
    paddingHorizontal: 20,
  },
  container: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  center: {
    flex: 1,
  },
});

export { RootHeader };