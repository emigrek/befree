import { FC, useCallback } from 'react';
import { FlatList } from 'react-native-gesture-handler';
import { List } from 'react-native-paper';

import { AddictionSetting, Section as SectionEnum } from './useSettings';

import { Divider } from '@/components/ui/Divider';
import i18n from '@/i18n';

interface SectionProps {
  section: SectionEnum;
  settings: AddictionSetting[];
}

const Section: FC<SectionProps> = ({ section, settings }) => {
  const renderItem = useCallback(
    ({ item }: { item: AddictionSetting }) => (
      <List.Item
        title={item.name}
        description={item.description}
        left={item.left}
        right={item.right}
        onPress={item.onChange}
      />
    ),
    [],
  );

  const renderDivider = useCallback(() => <Divider />, []);

  return (
    <List.Section>
      <List.Subheader>
        {i18n.t(['modals', 'addiction', 'settings', 'sections', section])}
      </List.Subheader>
      <FlatList
        data={settings}
        renderItem={renderItem}
        ItemSeparatorComponent={renderDivider}
        keyExtractor={item => item.id.toString()}
      />
    </List.Section>
  );
};

export { Section };