import '@testing-library/jest-native/extend-expect';

process.env.EXPO_PUBLIC_SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL ?? 'https://example.supabase.co';
process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY =
  process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY ?? 'test-anon-key';

jest.mock('uuid', () => ({
  v4: () => 'mock-uuid',
}));

// Prevent native module crashes when code imports AsyncStorage in tests.
jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock')
);

jest.mock('expo-secure-store', () => {
  const store = new Map();

  return {
    getItemAsync: jest.fn(async (key) => (store.has(key) ? store.get(key) : null)),
    setItemAsync: jest.fn(async (key, value) => {
      store.set(key, value);
    }),
    deleteItemAsync: jest.fn(async (key) => {
      store.delete(key);
    }),
  };
});

jest.mock('@gorhom/bottom-sheet', () => {
  const React = require('react');
  const { View } = require('react-native');

  const BottomSheetModal = React.forwardRef(({ children, onDismiss }, ref) => {
    const [open, setOpen] = React.useState(false);

    React.useImperativeHandle(ref, () => ({
      present: jest.fn(() => {
        setOpen(true);
      }),
      dismiss: jest.fn(() => {
        setOpen(false);
        if (onDismiss) {
          onDismiss();
        }
      }),
    }));

    return open ? <View>{children}</View> : null;
  });

  const BottomSheetModalProvider = ({ children }) => <View>{children}</View>;
  const BottomSheetBackdrop = () => null;
  const BottomSheetView = ({ children, style }) => <View style={style}>{children}</View>;

  return {
    __esModule: true,
    BottomSheetModal,
    BottomSheetModalProvider,
    BottomSheetBackdrop,
    BottomSheetView,
  };
});
