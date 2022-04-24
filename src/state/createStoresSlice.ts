import { GetState, SetState } from "zustand";
import { MyState } from "./useStore";
import { Store } from '../types';

export interface StoresSlice {
    stores: Store[];
    updateStoresData: (stores: Store[]) => void;
    deleteStoresState: () => void;
    currentStore: Store,
    setCurrentStore: (data: Store) => void;
};


const fakeStore = {
    id: '',
    name: '',
    products: [],
    invoices: [],
    sales: [],
    transactions: [],
    members: [],
    clients: [],
    type: 'normal',
}


const createStoresSlice = (set: SetState<MyState>, get: GetState<MyState>) => ({
    stores: [],
    updateStoresData: (stores: Store[]) => set((state) => ({ stores: [...stores] })),
    deleteStoresState: () => set(() => ({ stores: [] })),
    currentStore: fakeStore,
    setCurrentStore: (data: Store) => set((state) => ({
        currentStore: { ...data }
    }))
});

export default createStoresSlice;
