import { useCallback, useState } from 'react';
import { Alert } from 'react-native';

import { getErrorMessage } from '../lib/errorMessage';
import { pickImageAsync, uploadReceipt } from '../lib/image';
import { cancelMaintenanceReminder } from '../lib/notifications';
import { MaintenanceTask } from '../types/models';

type CompleteTaskPayload = {
  task: MaintenanceTask;
  odometer: number;
  cost: number;
  notes?: string;
  photo_url?: string;
};

type UseMaintenanceCompletionParams = {
  userId: string;
  upcomingTasks: MaintenanceTask[];
  completeTask: (payload: CompleteTaskPayload) => Promise<unknown>;
  onSuccess?: () => void;
};

export const useMaintenanceCompletion = ({
  userId,
  upcomingTasks,
  completeTask,
  onSuccess,
}: UseMaintenanceCompletionParams) => {
  const [completeMileage, setCompleteMileage] = useState('');
  const [completeCost, setCompleteCost] = useState('');
  const [completeNotes, setCompleteNotes] = useState('');
  const [receiptUri, setReceiptUri] = useState<string | undefined>(undefined);

  const resetCompletionForm = useCallback(() => {
    setCompleteMileage('');
    setCompleteCost('');
    setCompleteNotes('');
    setReceiptUri(undefined);
  }, []);

  const onAttachReceipt = useCallback(async () => {
    try {
      const image = await pickImageAsync();
      if (image?.uri) {
        setReceiptUri(image.uri);
      }
    } catch {
      Alert.alert('Could not attach receipt', 'Please try again.');
    }
  }, []);

  const completeMaintenanceTask = useCallback(
    async (taskId: string) => {
      const task = upcomingTasks.find((item) => item.id === taskId);

      if (!task) {
        return;
      }

      if (!completeMileage || !completeCost) {
        Alert.alert('Missing fields', 'Enter completion mileage and cost first.');
        return;
      }

      try {
        let photoUrl: string | undefined;

        if (receiptUri) {
          try {
            photoUrl = await uploadReceipt(userId, receiptUri);
          } catch {
            // Attachment is optional, continue completion.
          }
        }

        await completeTask({
          task,
          odometer: Number(completeMileage),
          cost: Number(completeCost),
          notes: completeNotes,
          photo_url: photoUrl,
        });

        await cancelMaintenanceReminder(task.id);

        resetCompletionForm();
        onSuccess?.();
      } catch (error) {
        const message = getErrorMessage(error);
        Alert.alert('Could not complete task', message);
      }
    },
    [
      completeCost,
      completeMileage,
      completeNotes,
      completeTask,
      onSuccess,
      receiptUri,
      resetCompletionForm,
      upcomingTasks,
      userId,
    ],
  );

  return {
    completeMileage,
    setCompleteMileage,
    completeCost,
    setCompleteCost,
    completeNotes,
    setCompleteNotes,
    receiptUri,
    onAttachReceipt,
    completeMaintenanceTask,
    resetCompletionForm,
  };
};