import { UnitSystem } from '../types/models';

type VehicleDraft = {
  year: string;
  make: string;
  model: string;
  trim: string;
  color: string;
  vin: string;
  odometer: string;
  unitSystem: UnitSystem;
};

export const hasRequiredVehicleFields = ({ year, make, model }: Pick<VehicleDraft, 'year' | 'make' | 'model'>) => {
  return Boolean(year && make && model);
};

export const buildCreateVehiclePayload = ({
  year,
  make,
  model,
  trim,
  color,
  vin,
  odometer,
  unitSystem,
}: VehicleDraft) => {
  return {
    year: Number(year),
    make,
    model,
    trim,
    color,
    vin,
    unit_system: unitSystem,
    current_odometer: Number(odometer || 0),
  };
};
