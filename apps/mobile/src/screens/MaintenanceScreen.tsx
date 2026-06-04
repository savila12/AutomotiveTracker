import { useCallback, useMemo, useRef, useState } from 'react';
import { Alert, StyleSheet, Text, View } from 'react-native';
import {
  BottomSheetModal,
  BottomSheetModalProvider,
} from '@gorhom/bottom-sheet';
import { SafeAreaView } from 'react-native-safe-area-context';
// Styling tier: stable. Use NativeWind for layout; move to explicit styles if form UX regresses.
import { InputField } from '../components/InputField';
import { MaintenanceCompletionSheet } from '../components/MaintenanceCompletionSheet';
import { PrimaryButton } from '../components/PrimaryButton';
import { Screen } from '../components/Screen';
import { useAutoTrack } from '../hooks/useAutoTrack';
import { useMaintenanceCompletion } from '../hooks/useMaintenanceCompletion';
import { buildMaintenanceTaskPayload, hasTaskTitle } from '../lib/maintenance';
import { useAppVehicleScope } from '../stores/appStoreHooks';
import {
  requestNotificationPermission,
  scheduleMaintenanceReminder,
} from '../lib/notifications';

export const MaintenanceScreen = () => {
  const { userId, activeVehicleId } = useAppVehicleScope();
  const { tasks, createTask, completeTask } = useAutoTrack(userId, activeVehicleId);

  const [title, setTitle] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [dueOdometer, setDueOdometer] = useState('');
  const [intervalMiles, setIntervalMiles] = useState('');

  const [completingTaskId, setCompletingTaskId] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const upcomingTasks = tasks.filter((task) => task.status === 'upcoming');
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  const snapPoints = useMemo(() => ['50%'], []);

  const {
    completeMileage,
    setCompleteMileage,
    completeCost,
    setCompleteCost,
    completeNotes,
    setCompleteNotes,
    receiptUri,
    onAttachReceipt,
    completeMaintenanceTask,
  } = useMaintenanceCompletion({
    userId: userId ?? '',
    upcomingTasks,
    completeTask,
    onSuccess: () => {
      closeModal();
    },
  });

  const closeModal = () => {
    bottomSheetModalRef.current?.dismiss();
  };

  const onSheetDismiss = useCallback(() => {
    setCompletingTaskId(null);
  }, []);

  const onCreateTask = async () => {
    if (!hasTaskTitle(title)) {
      Alert.alert('Missing title', 'Service title is required.');
      return;
    }

    const { payload, dueDateIso } = buildMaintenanceTaskPayload({
      title,
      dueDate,
      dueOdometer,
      intervalMiles,
    });

    const createdTask = await createTask(payload);

    if (dueDateIso) {
      const canNotify = await requestNotificationPermission();
      if (canNotify) {
        await scheduleMaintenanceReminder(
          createdTask.id,
          `Upcoming Service: ${title}`,
          'Your maintenance service is coming up.',
          dueDateIso,
        );
      }
    }

    setTitle('');
    setDueDate('');
    setDueOdometer('');
    setIntervalMiles('');
    setShowAddForm(false);
  };

  const onMarkComplete = (taskId: string) => {
    setCompletingTaskId(taskId);
    bottomSheetModalRef.current?.present();
  };

  const selectedTask = completingTaskId
    ? upcomingTasks.find((item) => item.id === completingTaskId) ?? null
    : null;

  const handleCompleteTask = () => {
    if (!selectedTask) {
      return;
    }

    void completeMaintenanceTask(selectedTask.id);
  };


  return (
    <BottomSheetModalProvider>
      <Screen>
      <Text style={styles.title}>Maintenance</Text>
      <Text style={styles.subtitle}>Track upcoming services and auto-log completed work.</Text>

      {/* Tasks list */}
      <View style={styles.taskList}>
        {upcomingTasks.map((task) => (
          <View key={task.id} style={styles.taskCard}>
            <Text style={styles.taskTitle}>{task.title}</Text>
            <Text style={styles.taskMeta}>Status: {task.status}</Text>
            <Text style={styles.taskMeta}>
              Due: {task.due_date ? new Date(task.due_date).toLocaleDateString() : 'N/A'}
            </Text>
            <Text style={styles.taskMeta}>Due Odometer: {task.due_odometer ?? 'N/A'}</Text>

            <View style={styles.completeAction}>
              <PrimaryButton
                label={completingTaskId === task.id ? 'Marking Complete...' : 'Mark Complete'}
                onPress={() => onMarkComplete(task.id)}
                disabled={Boolean(completingTaskId)}
              />
            </View>
          </View>
        ))}
      </View>

      {showAddForm ? (
        <SafeAreaView style={styles.card}>
          <InputField label="Service Title" value={title} onChangeText={setTitle} placeholder="Oil change" />
          <InputField label="Due Date (MM-DD-YYYY)" value={dueDate} onChangeText={setDueDate} />
          <InputField
            label="Due Odometer"
            value={dueOdometer}
            onChangeText={setDueOdometer}
            keyboardType="numeric"
          />
          <InputField
            label="Mileage Interval"
            value={intervalMiles}
            onChangeText={setIntervalMiles}
            keyboardType="numeric"
          />
          <PrimaryButton label="Save Task" onPress={onCreateTask} />
        </SafeAreaView>
      ) : null}

      {/* Add task toggle + collapsible form */}
      <View style={styles.addHeader}>
        <PrimaryButton
          label={showAddForm ? 'Hide Form' : 'Add Task'}
          onPress={() => setShowAddForm((prev) => !prev)}
          variant="secondary"
        />
      </View>
      </Screen>

      <MaintenanceCompletionSheet
        bottomSheetModalRef={bottomSheetModalRef}
        snapPoints={snapPoints}
        task={selectedTask}
        completeMileage={completeMileage}
        setCompleteMileage={setCompleteMileage}
        completeCost={completeCost}
        setCompleteCost={setCompleteCost}
        completeNotes={completeNotes}
        setCompleteNotes={setCompleteNotes}
        receiptUri={receiptUri}
        onAttachReceipt={onAttachReceipt}
        onCompleteTask={handleCompleteTask}
        onDismiss={onSheetDismiss}
      />
    </BottomSheetModalProvider>
  );
};

const styles = StyleSheet.create({
  title: {
    color: '#ffffff',
    fontSize: 30,
    fontWeight: '700',
  },
  subtitle: {
    marginTop: 4,
    color: '#a1a1aa',
    fontSize: 15,
  },
  card: {
    marginTop: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#27272a',
    backgroundColor: '#18181b',
    padding: 16,
  },
  sectionLabel: {
    marginBottom: 8,
    color: '#d4d4d8',
    fontSize: 14,
    fontWeight: '600',
  },
  addHeader: {
    marginTop: 16,
  },
  taskList: {
    marginTop: 16,
    rowGap: 12,
  },
  taskCard: {
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#27272a',
    backgroundColor: '#18181b',
    padding: 16,
  },
  taskTitle: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  taskMeta: {
    marginTop: 4,
    color: '#a1a1aa',
    fontSize: 14,
  },
  completeAction: {
    marginTop: 12,
  },
});
