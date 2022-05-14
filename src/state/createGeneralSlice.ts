import { GetState, SetState } from "zustand";
import { AuthType } from "../types";
import { MyState } from "./useStore";

export interface GeneralSlice {
    isSignedIn: boolean;
    setIsSignedIn: (value: boolean) => void;
    authType: AuthType;
    setAuthType: (value: AuthType) => void;
}


const createStoresSlice = (set: SetState<MyState>, get: GetState<MyState>) => ({
    isSignedIn: false,
    setIsSignedIn: (value: boolean) => set(() => ({ isSignedIn: value })),
    authType: 'signup',
    setAuthType: (value: AuthType) => set(() => ({ authType: value })),
});

export default createStoresSlice;
