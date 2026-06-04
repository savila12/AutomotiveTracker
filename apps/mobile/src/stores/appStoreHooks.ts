import { useAppStore } from './appStore';

export const useAppVehicleScope = () => {
  const userId = useAppStore((state) => state.userId);
  const activeVehicleId = useAppStore((state) => state.activeVehicleId);

  return { userId, activeVehicleId };
};

export const useSetActiveVehicleId = () => useAppStore((state) => state.setActiveVehicleId);

export const useUnitSystemPreference = () => {
  const unitSystem = useAppStore((state) => state.unitSystem);
  const saveProfile = useAppStore((state) => state.saveProfile);

  return { unitSystem, saveProfile };
};
