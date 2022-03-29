import { GetState, SetState } from "zustand";
import { MyState } from "./useStore";
import { User } from '../types';

export interface UserSlice {
    userData: User;
    updateUserData: (newUserData: User) => void;
}

const createUserSlice = (set: SetState<MyState>, get: GetState<MyState>) => ({
    userData: {
        id: null,
        info: {
            firstName: null,
            lastName: null,
            phoneNumber: null,
        },
        expoToken: null,
        stores: [],
    },
    updateUserData: (newUserData: User) => set((state) => {
        ({
            userData: {
                ...state.userData,
                id: newUserData.id,
                info: newUserData.info,
                expoToken: newUserData.expoToken,
                stores: newUserData.stores,
            }
        })
    })
});

export default createUserSlice;
