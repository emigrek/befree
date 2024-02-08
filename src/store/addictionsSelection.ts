import { produce } from 'immer';
import { StateCreator } from 'zustand';

export interface AddictionsSelectionSlice {
  selected: string[];
  setSelected: (selected: string[]) => void;
  addSelected: (id: string) => void;
  removeSelected: (id: string) => void;
  clearSelected: () => void;
}

export const createAddictionsSelectionSlice: StateCreator<
  AddictionsSelectionSlice
> = (set, get) => ({
  selected: [],
  setSelected: (selected: string[]) => set({ selected }),
  addSelected: (id: string) =>
    set(
      produce(state => {
        state.selected.push(id);
        return state;
      }),
    ),
  removeSelected: (id: string) =>
    set(
      produce(state => {
        state.selected = state.selected.filter((i: string) => i !== id);
        return state;
      }),
    ),
  clearSelected: () => set({ selected: [] }),
});
