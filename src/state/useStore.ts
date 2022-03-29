import create from "zustand";
import { persist, StateStorage } from "zustand/middleware";
import { MMKV } from 'react-native-mmkv';

import createUserSlice, { UserSlice } from "./createUserSlice";
import createStoresSlice, { StoresSlice } from "./createStoresSlice";
import createGeneralSlice, { GeneralSlice } from "./createGeneralSlice";

const storage = new MMKV()

const zustandStorage: StateStorage = {
    setItem: (name, value) => {
        return storage.set(name, value)
    },
    getItem: (name) => {
        const value = storage.getString(name)
        return value ?? null
    },
    removeItem: (name) => {
        return storage.delete(name)
    },
};


export type MyState = UserSlice & StoresSlice & GeneralSlice;

const useStore = create<MyState>(persist(
    (set, get) => ({
        ...createUserSlice(set, get),
        ...createStoresSlice(set, get),
        ...createGeneralSlice(set, get),
    }),
    {
        name: "appState", // unique name
        getStorage: () => zustandStorage,
    }
));

export default useStore;