import { eachDayOfInterval, format } from 'date-fns';
import { FC, useMemo } from 'react';
import { FlatList, StyleSheet, ViewProps } from 'react-native';
import { Text } from 'react-native-paper';

import { useTimelineContext } from './context';

import { useTheme } from '@/theme';

interface DaysProps {
  dayStyle?: ViewProps['style'];
}

const Days: FC<DaysProps> = ({ dayStyle }) => {
  const { colors } = useTheme();
  const { cellSize, cellMargin, fontSize, mirrored } = useTimelineContext();

  const daysOfWeek = useMemo(() => {
    const days = eachDayOfInterval({
      start: new Date(2021, 0, 3),
      end: new Date(2021, 0, 9),
    });

    return mirrored ? days.reverse() : days;
  }, [mirrored]);

  const shortWeekDays = useMemo(() => {
    return daysOfWeek.map(day => format(day, 'EEE'));
  }, [daysOfWeek]);

  const renderItem = useMemo(
    () =>
      ({ item, index }: { item: string; index: number }) => {
        return (
          <Text
            style={[
              style.day,
              dayStyle,
              {
                height: cellSize,
                margin: cellMargin,
                color: colors.onSurface,
                fontSize,
              },
            ]}
          >
            {[1, 3, 5].includes(index) ? item : ''}
          </Text>
        );
      },
    [dayStyle, cellMargin, cellSize, fontSize, colors.onSurface],
  );

  const keyExtractor = (item: string, index: number) => {
    return item;
  };

  return (
    <FlatList
      contentContainerStyle={[
        {
          marginTop: cellSize + 2 * cellMargin,
        },
      ]}
      scrollEnabled={false}
      data={shortWeekDays}
      renderItem={renderItem}
      keyExtractor={keyExtractor}
      showsVerticalScrollIndicator={false}
    />
  );
};

const style = StyleSheet.create({
  days: {},
  day: {
    borderWidth: 1,
    borderColor: 'transparent',
    borderRadius: 2,
    verticalAlign: 'middle',
  },
});

export { Days };
