import { GetState, SetState } from "zustand";
import { MyState } from "./useStore";
import { User } from '../types';

export interface UserSlice {
    userData: User;
    updateUserData: (newUserData: User) => void;
    deleteUserState: () => void;
}

const createUserSlice = (set: SetState<MyState>, get: GetState<MyState>) => ({
    userData: {
        id: '',
        info: {
            firstName: '',
            lastName: '',
            phoneNumber: '',
        },
        expoToken: '',
        stores: [],
    },
    updateUserData: (newUserData: User) => set((state) => ({
        userData: { ...newUserData }
    })),
    deleteUserState: () => set(() => ({
        userData: {
            id: '',
            info: {
                firstName: '',
                lastName: '',
                phoneNumber: '',
            },
            expoToken: '',
            stores: [],
        },
    }))
});

export default createUserSlice;
