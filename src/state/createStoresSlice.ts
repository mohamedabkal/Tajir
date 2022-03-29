import { GetState, SetState } from "zustand";
import { MyState } from "./useStore";
import { Store } from '../types';

export interface StoresSlice {
    stores: Store[];
    updateStoresData: () => void;
}

const createStoresSlice = (set: SetState<MyState>, get: GetState<MyState>) => ({
    stores: [],
    updateStoresData: () => set((state) => ({ stores: [...state.stores] }))
});

export default createStoresSlice;
