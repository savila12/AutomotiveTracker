import { RefObject } from 'react';
import { StyleSheet, Text } from 'react-native';
import {
  BottomSheetBackdrop,
  BottomSheetBackdropProps,
  BottomSheetModal,
  BottomSheetView,
} from '@gorhom/bottom-sheet';

import { InputField } from './InputField';
import { PrimaryButton } from './PrimaryButton';
import { type MaintenanceTask } from '../hooks/useAutoTrack';

type Props = {
  bottomSheetModalRef: RefObject<BottomSheetModal | null>;
  snapPoints: string[];
  task: MaintenanceTask | null;
  completeMileage: string;
  setCompleteMileage: (value: string) => void;
  completeCost: string;
  setCompleteCost: (value: string) => void;
  completeNotes: string;
  setCompleteNotes: (value: string) => void;
  receiptUri?: string;
  onAttachReceipt: () => void;
  onCompleteTask: () => void;
  onDismiss: () => void;
};

const renderBackdrop = (props: BottomSheetBackdropProps) => (
  <BottomSheetBackdrop
    {...props}
    appearsOnIndex={0}
    disappearsOnIndex={-1}
    pressBehavior="close"
    opacity={0.6}
  />
);

export const MaintenanceCompletionSheet = ({
  bottomSheetModalRef,
  snapPoints,
  task,
  completeMileage,
  setCompleteMileage,
  completeCost,
  setCompleteCost,
  completeNotes,
  setCompleteNotes,
  receiptUri,
  onAttachReceipt,
  onCompleteTask,
  onDismiss,
}: Props) => {
  return (
    <BottomSheetModal
      ref={bottomSheetModalRef}
      index={0}
      snapPoints={snapPoints}
      enablePanDownToClose
      onDismiss={onDismiss}
      backdropComponent={renderBackdrop}
      backgroundStyle={styles.bottomSheetBackground}
      handleIndicatorStyle={styles.bottomSheetHandle}
    >
      {task ? (
        <BottomSheetView style={styles.bottomSheetContent}>
          <Text style={styles.sectionLabel}>Complete a Task</Text>
          <InputField
            label="Completion Odometer"
            value={completeMileage}
            onChangeText={setCompleteMileage}
            keyboardType="numeric"
          />
          <InputField
            label="Completion Cost"
            value={completeCost}
            onChangeText={setCompleteCost}
            keyboardType="numeric"
          />
          <InputField label="Notes (Optional)" value={completeNotes} onChangeText={setCompleteNotes} />
          <PrimaryButton
            label={receiptUri ? 'Receipt Attached ✓' : 'Attach Receipt (Optional)'}
            onPress={onAttachReceipt}
            variant="secondary"
          />
          <PrimaryButton label="Complete Task" onPress={onCompleteTask} />
        </BottomSheetView>
      ) : null}
    </BottomSheetModal>
  );
};

const styles = StyleSheet.create({
  sectionLabel: {
    marginBottom: 8,
    color: '#d4d4d8',
    fontSize: 14,
    fontWeight: '600',
  },
  bottomSheetBackground: {
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#27272a',
    backgroundColor: '#18181b',
  },
  bottomSheetHandle: {
    backgroundColor: '#52525b',
    width: 44,
  },
  bottomSheetContent: {
    flex: 1,
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
});