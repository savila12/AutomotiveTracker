import { act, waitFor } from '@testing-library/react-native';

import { useAppStore } from '../../src/stores/appStore';

const mockEnsureProfile = jest.fn();
const mockUpdateProfile = jest.fn();

jest.mock('../../src/lib/api', () => ({
    ensureProfile: (...args: unknown[]) => mockEnsureProfile(...args),
    updateProfile: (...args: unknown[]) => mockUpdateProfile(...args),
}));

const resetStore = () => {
    useAppStore.setState({
        userId: null,
        activeVehicleId: null,
        unitSystem: 'imperial',
    });
};

describe('appStore', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        resetStore();
        mockEnsureProfile.mockResolvedValue({
            active_vehicle_id: 'v-1',
            default_unit_system: 'metric',
        });
        mockUpdateProfile.mockResolvedValue({ default_unit_system: 'imperial' });
    });

    it('initializes user state with initializeForUser', () => {
        act(() => {
            useAppStore.getState().initializeForUser('user-1');
        });

        const state = useAppStore.getState();
        expect(state.userId).toBe('user-1');
        expect(state.activeVehicleId).toBeNull();
        expect(state.unitSystem).toBe('imperial');
    });

    it('hydrates profile data with loadProfile', async () => {
        act(() => {
            useAppStore.getState().initializeForUser('user-1');
        });

        await act(async () => {
            await useAppStore.getState().loadProfile('user-1');
        });

        await waitFor(() => {
            expect(useAppStore.getState().activeVehicleId).toBe('v-1');
        });

        expect(useAppStore.getState().unitSystem).toBe('metric');
    });

    it('handles loadProfile rejection gracefully', async () => {
        mockEnsureProfile.mockRejectedValue(new Error('network error'));
        act(() => {
            useAppStore.getState().initializeForUser('user-1');
            useAppStore.setState({ activeVehicleId: 'v-previous' });
        });

        await act(async () => {
            await useAppStore.getState().loadProfile('user-1');
        });

        await waitFor(() => {
            expect(useAppStore.getState().activeVehicleId).toBeNull();
        });
    });

    it('updates unitSystem when saveProfile is called', async () => {
        act(() => {
            useAppStore.getState().initializeForUser('user-1');
        });

        await act(async () => {
            await useAppStore.getState().saveProfile({ default_unit_system: 'imperial' });
        });

        expect(mockUpdateProfile).toHaveBeenCalledWith('user-1', { default_unit_system: 'imperial' });
        expect(useAppStore.getState().unitSystem).toBe('imperial');
    });

    it('setActiveVehicleId updates the stored vehicleId', async () => {
        act(() => {
            useAppStore.getState().initializeForUser('user-1');
        });

        act(() => {
            useAppStore.getState().setActiveVehicleId('v-2');
        });

        expect(useAppStore.getState().activeVehicleId).toBe('v-2');
    });
});
