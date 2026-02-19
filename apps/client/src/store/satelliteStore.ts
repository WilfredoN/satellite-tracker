import { create } from 'zustand';
import type { SelectableTarget } from '../types/satellite';

type SatelliteState = {
  selectedTarget: SelectableTarget | null;
  selectTarget: (target: SelectableTarget) => void;
  clearSelection: () => void;
};

export const useSatelliteStore = create<SatelliteState>((set) => ({
  selectedTarget: null,
  selectTarget: (target: SelectableTarget) => set({ selectedTarget: target }),
  clearSelection: () => set({ selectedTarget: null }),
}));
