import {
  add,
  eachDayOfInterval,
  format,
  isAfter,
  isBefore,
  isSameDay,
  isSaturday,
  isSunday,
  nextSaturday,
  previousSunday,
  sub,
} from 'date-fns';
import {
  createContext,
  Dispatch,
  FC,
  ReactNode,
  SetStateAction,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react';
import { MD3Theme, useTheme } from 'react-native-paper';

import { Cell, TimelineProps } from './types';

import { hexAlpha } from '@/utils/hexAlpha';

interface TimelineContextProps {
  theme?: MD3Theme;
  setTheme?: Dispatch<SetStateAction<MD3Theme>>;
  range: [Date, Date];
  setRange: Dispatch<SetStateAction<[Date, Date]>>;
  data: Date[];
  setData: Dispatch<SetStateAction<Date[]>>;
  cellsData: Cell[];
  cellSize: number;
  setCellSize: Dispatch<SetStateAction<number>>;
  cellMargin: number;
  setCellMargin: Dispatch<SetStateAction<number>>;
  fontSize: number;
  setFontSize: Dispatch<SetStateAction<number>>;
  mirrored?: boolean;
  setMirrored?: Dispatch<SetStateAction<boolean>>;
  invertColor?: boolean;
  setInvertColor?: Dispatch<SetStateAction<boolean>>;
}

export const TimelineContext = createContext<TimelineContextProps>({
  theme: undefined,
  setTheme: () => {
    //do nothing
  },
  range: [sub(new Date(), { months: 6 }), add(new Date(), { months: 6 })],
  setRange: () => {
    //do nothing
  },
  data: [],
  setData: () => {
    // do nothing
  },
  cellsData: [],
  cellSize: 10,
  setCellSize: () => {
    //do nothing
  },
  cellMargin: 1,
  setCellMargin: () => {
    //do nothing
  },
  fontSize: 8,
  setFontSize: () => {
    //do nothing
  },
  mirrored: true,
  setMirrored: () => {
    //do nothing
  },
  invertColor: false,
  setInvertColor: () => {
    //do nothing
  },
});

interface TimelineContextProviderProps {
  props: TimelineProps;
  children?: ReactNode;
}

const TimelineContextProvider: FC<TimelineContextProviderProps> = ({
  props,
  children,
}) => {
  const defaultTheme = useTheme();
  const [theme, setTheme] = useState<MD3Theme>(defaultTheme);
  const [range, setRange] = useState<[Date, Date]>([
    props.range[0],
    props.range[1],
  ]);
  const [data, setData] = useState<Date[]>(props.data);
  const [cellSize, setCellSize] = useState<number>(props.cellSize || 10);
  const [cellMargin, setCellMargin] = useState<number>(props.cellMargin || 1);
  const [fontSize, setFontSize] = useState<number>(props.fontSize || 8);
  const [mirrored, setMirrored] = useState<boolean>(props.mirrored || true);
  const [invertColor, setInvertColor] = useState<boolean>(
    props.invertColor || false,
  );

  const startSunday = useMemo(() => {
    return isSunday(range[0]) ? range[0] : previousSunday(range[0]);
  }, [range]);

  const endSaturday = useMemo(() => {
    const saturday = isSaturday(range[1]) ? range[1] : nextSaturday(range[1]);
    return nextSaturday(saturday);
  }, [range]);

  const frequencyMap = useMemo(() => {
    return props.data.reduce<{ [key: string]: number }>((map, date) => {
      const key = format(date, 'yyyy-MM-dd');
      map[key] = (map[key] || 0) + 1;
      return map;
    }, {});
  }, [props.data]);

  const getCellBackgroundColor = useCallback(
    (day: Date) => {
      const key = format(day, 'yyyy-MM-dd');
      const frequency = frequencyMap[key] || 0;
      const withinRange =
        (isBefore(day, range[1]) || isSameDay(day, range[1])) &&
        (isAfter(day, range[0]) || isSameDay(day, range[0]));
      const future = isAfter(day, new Date());
      const past = isBefore(day, new Date());
      const frequencyMax = Math.max(...Object.values(frequencyMap));

      if (future || !withinRange) {
        return 'transparent';
      }

      if (past && frequency !== 0) {
        return invertColor
          ? defaultTheme.colors.primary
          : hexAlpha(
              defaultTheme.colors.errorContainer,
              frequency / frequencyMax,
            );
      }

      return invertColor
        ? hexAlpha(defaultTheme.colors.errorContainer, 1)
        : defaultTheme.colors.primary;
    },
    [invertColor, frequencyMap, range, defaultTheme],
  );

  const cellsData = useMemo(() => {
    const days = eachDayOfInterval({
      start: startSunday,
      end: endSaturday,
    });

    const cells = days.map(day => {
      const key = format(day, 'yyyy-MM-dd');
      const totalSeconds =
        new Date().getHours() * 60 * 60 +
        new Date().getMinutes() * 60 +
        new Date().getSeconds();
      const dayProgress = isSameDay(day, new Date())
        ? totalSeconds / (24 * 60 * 60)
        : 1;

      return {
        day,
        backgroundColor: getCellBackgroundColor(day),
        frequency: frequencyMap[key] || 0,
        dayProgress,
      };
    });

    return mirrored ? cells.reverse() : cells;
  }, [
    startSunday,
    endSaturday,
    getCellBackgroundColor,
    frequencyMap,
    mirrored,
  ]);

  return (
    <TimelineContext.Provider
      value={{
        theme,
        setTheme,
        range,
        setRange,
        data,
        setData,
        cellsData,
        cellSize,
        setCellSize,
        cellMargin,
        setCellMargin,
        fontSize,
        setFontSize,
        mirrored,
        setMirrored,
        invertColor,
        setInvertColor,
      }}
    >
      {children}
    </TimelineContext.Provider>
  );
};

export const useTimelineContext = () => {
  const context = useContext(TimelineContext);
  if (!context) {
    throw new Error(
      'useTimelineContext must be used within a TimelineContextProvider',
    );
  }
  return context;
};

export { TimelineContextProvider };
