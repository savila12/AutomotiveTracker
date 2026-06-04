import { MaintenanceTask, Vehicle } from '../types/models';

export const getVehicleSummary = (vehicle: Vehicle | null) => {
  if (!vehicle) {
    return 'Add a vehicle to start tracking';
  }

  return `${vehicle.year} ${vehicle.make} ${vehicle.model}`;
};

export const getNextUpcomingTask = (tasks: MaintenanceTask[]) => {
  return tasks.find((task) => task.status === 'upcoming') || null;
};
