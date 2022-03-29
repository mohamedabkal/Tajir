import firestore from '@react-native-firebase/firestore';
import { User } from '../types';



export const addUserToDB = async (userData: User) => {
    try {
        await firestore()
            .collection('users')
            .doc(userData.id?.toString())
            .set(userData)
        __DEV__ && console.log('✔✔ user added to DB');
    } catch (error) {
        __DEV__ && console.log('⛔⛔ ERROR ADD USER TO DB', error);
    }
};


export const updateUserData = async (userData: User) => {
    const { id } = userData;
    try {
        await firestore()
            .collection('users')
            .doc(id?.toString())
            .set(userData)
        __DEV__ && console.log('✔✔ user data updated');
    } catch (error) {
        __DEV__ && console.log('⛔⛔ ERROR UPDATE USER DATA', error);
    }
};


export const fetchUserData = async (phoneNumber: number | string) => {
    return firestore()
        .collection('users')
        .where('info.phoneNumber', '==', phoneNumber.toString())
        .get()
        .then(querySnapshot => {
            if (querySnapshot.empty) {
                __DEV__ && console.log('🚫 No such document! => fetchUserData');
                return false;
            } else {
                __DEV__ && console.log('✅✅ Fetch user by email >> success!')
                const newUserData = querySnapshot.docs[0].data();
                return newUserData;
            }
        })
        .catch(error => {
            __DEV__ && console.log(
                `⛔⛔ error fetchUserByEmail() firebaseActions.ts ===>> ${error.message}`
            );
            return undefined;
        })
}