import { create } from 'zustand';

import { UnitSystem } from '../types/models';

type AppStoreState = {
  userId: string | null;
  activeVehicleId: string | null;
  unitSystem: UnitSystem;
};

type AppStoreActions = {
  initializeForUser: (userId: string) => void;
  setActiveVehicleId: (vehicleId: string | null) => void;
  setUnitSystem: (unitSystem: UnitSystem) => void;
  hydrateProfile: (payload: { activeVehicleId: string | null; unitSystem: UnitSystem }) => void;
};

type AppStore = AppStoreState & AppStoreActions;

const defaultState: AppStoreState = {
  userId: null,
  activeVehicleId: null,
  unitSystem: 'imperial',
};

export const useAppStore = create<AppStore>((set, get) => ({
  ...defaultState,
  initializeForUser: (userId) => {
    const currentUserId = get().userId;

    if (currentUserId !== userId) {
      set({
        userId,
        activeVehicleId: null,
        unitSystem: 'imperial',
      });
      return;
    }

    set({ userId });
  },
  setActiveVehicleId: (activeVehicleId) => set({ activeVehicleId }),
  setUnitSystem: (unitSystem) => set({ unitSystem }),
  hydrateProfile: ({ activeVehicleId, unitSystem }) => set({ activeVehicleId, unitSystem }),
}));
