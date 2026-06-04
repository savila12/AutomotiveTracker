type UnitSystem = 'imperial' | 'metric';

export const todayIsoDate = () => new Date().toISOString().slice(0, 10);

export const parsePositiveNumber = (value: string) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : null;
};

export const getUnitLabels = (unitSystem?: UnitSystem) => {
  if (unitSystem === 'metric') {
    return {
      quantity: 'Liters',
      pricePerUnit: 'Price per Liter',
    };
  }

  return {
    quantity: 'Gallons',
    pricePerUnit: 'Price per Gallon',
  };
};
