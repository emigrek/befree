import { produce } from 'immer';
import { StateCreator } from 'zustand';

export interface AddictionSorting {
  direction: 'asc' | 'desc';
  field: keyof Addiction;
}

export interface AddictionsSlice {
  sorting: AddictionSorting;
  setSorting: (sorting: AddictionSorting) => void;
  addictions: Addiction[];
  setAddictions: (addictions: Addiction[]) => void;
  add: (addiction: Addiction) => void;
  edit: (id: string, addiction: Partial<Addiction>) => void;
  remove: (id: string) => void;
  addRelapse: (id: string, date: Date) => void;
  removeRelapse: (id: string, date: Date) => void;
}

export const createAddictionsSlice: StateCreator<AddictionsSlice> = (
  set,
  get,
) => ({
  sorting: {
    direction: 'asc',
    field: 'lastRelapse',
  },
  setSorting: (sorting: AddictionSorting) => set({ sorting }),
  addictions: [],
  setAddictions: (addictions: Addiction[]) =>
    set(
      produce(state => {
        state.addictions = addictions;
        return state;
      }),
    ),
  add: (addiction: Addiction) =>
    set(
      produce(state => {
        state.addictions.push(addiction);
        return state;
      }),
    ),
  edit: (id: string, addiction: Partial<Addiction>) => {
    set(
      produce(state => {
        const a = state.addictions.find(
          (addiction: Addiction) => addiction.id === id,
        );

        if (!a) return;

        Object.assign(a, addiction);
        return state;
      }),
    );
  },
  remove: (id: string) => {
    set(
      produce(state => {
        state.addictions = state.addictions.filter(
          (addiction: Addiction) => addiction.id !== id,
        );

        return state;
      }),
    );
  },
  addRelapse: (id: string, date: Date) => {
    set(
      produce(state => {
        const addiction = state.addictions.find(
          (addiction: Addiction) => addiction.id === id,
        );

        if (!addiction) return;

        addiction.relapses.push(date);
        addiction.lastRelapse = date;

        return state;
      }),
    );
  },
  removeRelapse: (id: string, date: Date) => {
    set(
      produce(state => {
        const addiction = state.addictions.find(
          (addiction: Addiction) => addiction.id === id,
        );

        if (!addiction) return;

        const relapses = addiction.relapses.filter(
          (relapse: Date) => relapse.getTime() !== date.getTime(),
        );

        addiction.relapses = relapses;
        addiction.lastRelapse = addiction.relapses[0];

        return state;
      }),
    );
  },
});

export const getSortingFunction = (sorting: AddictionSorting) => {
  return (a: Addiction, b: Addiction) => {
    const { field, direction } = sorting;

    const aField = a[field];
    const bField = b[field];

    if (aField == null || bField == null) {
      return 0;
    }

    const comparingDates = aField instanceof Date && bField instanceof Date;
    const comparingStrings =
      typeof aField === 'string' && typeof bField === 'string';
    const comparingNumbers =
      typeof aField === 'number' && typeof bField === 'number';

    if (comparingDates) {
      const aDate = new Date(aField as Date);
      const bDate = new Date(bField as Date);

      return direction === 'asc'
        ? aDate.getTime() - bDate.getTime()
        : bDate.getTime() - aDate.getTime();
    } else if (comparingStrings) {
      const aString = aField as string;
      const bString = bField as string;

      return direction === 'asc'
        ? aString.localeCompare(bString)
        : bString.localeCompare(aString);
    } else if (comparingNumbers) {
      const aNumber = aField as number;
      const bNumber = bField as number;

      return direction === 'asc' ? aNumber - bNumber : bNumber - aNumber;
    } else {
      return 0;
    }
  };
};
