export type MaintenanceTaskDraft = {
  title: string;
  dueDate: string;
  dueOdometer: string;
  intervalMiles: string;
};

export const hasTaskTitle = (title: string) => Boolean(title);

export const toOptionalIsoDate = (date: string) => (date ? new Date(date).toISOString() : undefined);

export const buildMaintenanceTaskPayload = ({
  title,
  dueDate,
  dueOdometer,
  intervalMiles,
}: MaintenanceTaskDraft) => {
  const dueDateIso = toOptionalIsoDate(dueDate);

  return {
    payload: {
      title,
      due_date: dueDateIso,
      due_odometer: dueOdometer ? Number(dueOdometer) : undefined,
      interval_miles: intervalMiles ? Number(intervalMiles) : undefined,
    },
    dueDateIso,
  };
};
