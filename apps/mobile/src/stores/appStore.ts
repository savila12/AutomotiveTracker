import { create } from 'zustand';

import { UnitSystem } from '../types/models';
import { ensureProfile, updateProfile } from '../lib/api';

type AppStoreState = {
  userId: string | null;
  activeVehicleId: string | null;
  unitSystem: UnitSystem;
};

type AppStoreActions = {
  initializeForUser: (userId: string) => void;
  clearForSignedOut: () => void;
  loadProfile: (userId: string) => Promise<void>;
  setActiveVehicleId: (vehicleId: string | null) => void;
  setUnitSystem: (unitSystem: UnitSystem) => void;
  hydrateProfile: (payload: { activeVehicleId: string | null; unitSystem: UnitSystem }) => void;
  saveProfile: (patch: { default_unit_system?: UnitSystem }) => Promise<void>;
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
  clearForSignedOut: () => set(defaultState),
  loadProfile: async (userId) => {
    try {
      const profile = await ensureProfile(userId);

      set({
        activeVehicleId: profile.active_vehicle_id || null,
        unitSystem: profile.default_unit_system ?? 'imperial',
      });
    } catch {
      set({ activeVehicleId: null });
    }
  },
  setActiveVehicleId: (activeVehicleId) => set({ activeVehicleId }),
  setUnitSystem: (unitSystem) => set({ unitSystem }),
  hydrateProfile: ({ activeVehicleId, unitSystem }) => set({ activeVehicleId, unitSystem }),
  saveProfile: async (patch) => {
    const userId = get().userId;

    if (!userId) {
      throw new Error('Cannot save profile without an authenticated user.');
    }

    const updated = await updateProfile(userId, patch);
    if (patch.default_unit_system !== undefined) {
      set({ unitSystem: updated.default_unit_system ?? 'imperial' });
    }
  },
}));
