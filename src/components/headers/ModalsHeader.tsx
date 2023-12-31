import { getHeaderTitle } from '@react-navigation/elements';
import { StackHeaderProps } from '@react-navigation/stack';
import React, { FC } from 'react';
import { View } from 'react-native';
import { Appbar, Text } from 'react-native-paper';

import { style } from './style';

import { OfflineBanner } from '@/components/ui/OfflineBanner';

const ModalsHeader: FC<StackHeaderProps> = ({
  options,
  route,
  back,
  navigation,
}) => {
  const title = getHeaderTitle(options, route.name);

  return (
    <>
      <Appbar.Header style={style.header}>
        {back ? (
          <Appbar.BackAction onPress={() => navigation.goBack()} />
        ) : null}
        <View style={style.container}>
          <View style={style.center}>
            <Text variant={'titleMedium'} style={{ textAlign: 'center' }}>
              {title}
            </Text>
          </View>
          {options.headerRight &&
            options.headerRight({
              pressColor: options.headerPressColor,
              tintColor: options.headerTintColor,
            })}
        </View>
      </Appbar.Header>
      <OfflineBanner absolute />
    </>
  );
};

export { ModalsHeader };
