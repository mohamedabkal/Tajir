import { GetState, SetState } from "zustand";
import { MyState } from "./useStore";

export interface GeneralSlice {
    isSignedIn: boolean;
    setIsSignedIn: (value: boolean) => void;
}

const createStoresSlice = (set: SetState<MyState>, get: GetState<MyState>) => ({
    isSignedIn: false,
    setIsSignedIn: (value: boolean) => set(() => ({ isSignedIn: value }))
});

export default createStoresSlice;
