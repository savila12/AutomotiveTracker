import { PropsWithChildren, createContext, useCallback, useContext, useEffect, useMemo } from 'react';

import { UnitSystem } from '../types/models';
import { ensureProfile, updateProfile } from './api';
import { useAppStore } from '../stores/appStore';

type AppContextValue = {
  userId: string;
  activeVehicleId: string | null;
  setActiveVehicleId: (vehicleId: string | null) => void;
  unitSystem: UnitSystem;
  saveProfile: (patch: { default_unit_system?: UnitSystem }) => Promise<void>;
};

const AppContext = createContext<AppContextValue | null>(null);

export const AppProvider = ({ userId, children }: PropsWithChildren<{ userId: string }>) => {
  const initializeForUser = useAppStore((state) => state.initializeForUser);
  const activeVehicleId = useAppStore((state) => state.activeVehicleId);
  const setActiveVehicleId = useAppStore((state) => state.setActiveVehicleId);
  const unitSystem = useAppStore((state) => state.unitSystem);
  const setUnitSystem = useAppStore((state) => state.setUnitSystem);
  const hydrateProfile = useAppStore((state) => state.hydrateProfile);

  useEffect(() => {
    initializeForUser(userId);
  }, [initializeForUser, userId]);

  useEffect(() => {
    ensureProfile(userId)
      .then((profile) => {
        hydrateProfile({
          activeVehicleId: profile.active_vehicle_id || null,
          unitSystem: profile.default_unit_system ?? 'imperial',
        });
      })
      .catch(() => {
        setActiveVehicleId(null);
      });
  }, [hydrateProfile, setActiveVehicleId, userId]);

  const saveProfile = useCallback(
    async (patch: { default_unit_system?: UnitSystem }) => {
      const updated = await updateProfile(userId, patch);
      if (patch.default_unit_system !== undefined) setUnitSystem(updated.default_unit_system ?? 'imperial');
    },
    [setUnitSystem, userId],
  );

  const value = useMemo(
    () => ({
      userId,
      activeVehicleId,
      setActiveVehicleId,
      unitSystem,
      saveProfile,
    }),
    [activeVehicleId, saveProfile, unitSystem, userId],
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = () => {
  const context = useContext(AppContext);

  if (!context) {
    throw new Error('useAppContext must be used inside AppProvider');
  }

  return context;
};
