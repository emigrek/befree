import { FC, useCallback } from 'react';
import { SectionList } from 'react-native';

import { RelapseCard } from './RelapseCard';
import { SectionHeader } from './SectionHeader';

import { RelapsesSection } from '@/hooks/relapse/useCategorizedRelapses';

interface RelapsesSectionListProps {
  addiction: Addiction;
  sections: RelapsesSection[];
}

const RelapsesSectionList: FC<RelapsesSectionListProps> = ({
  sections,
  addiction,
}) => {
  const renderItem = useCallback(
    ({ item }: { item: Relapse }) => (
      <RelapseCard relapse={item} addiction={addiction} />
    ),
    [addiction],
  );

  const renderSectionHeader = useCallback(
    ({ section: { title } }: { section: RelapsesSection }) => (
      <SectionHeader title={title} />
    ),
    [],
  );

  return (
    <SectionList
      scrollEnabled={false}
      sections={sections}
      contentContainerStyle={{ gap: 6, marginBottom: 2 }}
      keyExtractor={item => item.id}
      renderItem={renderItem}
      renderSectionHeader={renderSectionHeader}
    />
  );
};

export { RelapsesSectionList };
