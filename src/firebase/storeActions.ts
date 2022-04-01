import firestore from '@react-native-firebase/firestore';
import { Store } from '../types';



export const addStoreToDB = async (store: Store) => {
    try {
        await firestore()
            .collection('stores')
            .doc(store.id?.toString())
            .set(store)
        __DEV__ && console.log('✔✔ store added to DB');
    } catch (error) {
        __DEV__ && console.log('⛔⛔ ERROR ADD STORE TO DB', error);
    }
};


export const fetchStoresData = async (id: string) => {
    return firestore()
        .collection('stores')
        .where('id', '==', id)
        .get()
        .then(querySnapshot => {
            if (querySnapshot.empty) {
                __DEV__ && console.log('🚫 No such document! => fetchStoresData');
                return false;
            } else {
                __DEV__ && console.log('✅✅ Fetch stores data >> success!')
                const storesData = querySnapshot.docs[0].data();
                return storesData;
            }
        })
        .catch(error => {
            __DEV__ && console.log(
                `⛔⛔ error fetchStoresData() storeActions.ts ===>> ${error.message}`
            );
            return undefined;
        })
};


export const deleteStore = async (storeID: string | number) => {
    try {
        firestore()
            .collection('stores')
            .doc(storeID.toString())
            .delete()
            .then(() => {
                __DEV__ && console.log("✅✅ Store Document successfully deleted!");
            })
    } catch (error) {
        __DEV__ && console.log(
            `⛔⛔ error deleteStore() storeActions.ts ===>> ${error}`
        );
    }
}