import React from 'react';
import { SafeAreaView, StyleSheet, View, Text, Image, FlatList, } from 'react-native';

import { useTranslation } from 'react-i18next';
import Carousel from 'pinar';
import uuid from 'react-native-uuid';

import Colors from '../constants/Colors';
import useColorScheme from '../hooks/useColorScheme';
import BranchCard from '../components/cards/BranchCard';
import AssetsManager from '../assets/AssetsManager';
import { en } from '../assets/Typography';
import useStore from '../state/useStore';
import { Store, User } from '../types';
import FloatingBtn from '../components/buttons/FloatingBtn';
import AddNewShopForm from '../components/forms/AddNewShopForm';
import { addStoreToDB } from '../firebase/storeActions';
import { updateUserData } from '../firebase/userActions';


export default function MyShops() {
    let carouselRef: Carousel;

    const theme = useColorScheme();
    const { t } = useTranslation();

    // zustand
    const stores = useStore(state => state.stores);
    const userData = useStore(state => state.userData);
    const updateStoresData = useStore(state => state.updateStoresData);
    const setCurrentStore = useStore(state => state.setCurrentStore);
    const updateUserState = useStore(state => state.updateUserData);

    const openFTB = () => carouselRef?.scrollToNext();

    const emptyImg = theme === 'light' ? AssetsManager.Images.storeLight : AssetsManager.Images.storeDark;

    const addNewStore = async (data: { name: string, mode: 'pro' | 'normal' }) => {
        carouselRef?.scrollToPrev();

        // 1. generate new store data
        const newStore: Store = {
            id: uuid.v4().toString(),
            name: data.name,
            products: [],
            invoices: [],
            sales: [],
            translations: [],
            members: [{ name: userData.info.firstName, id: userData.id, role: 'owner' }],
            type: data.mode,
        };

        // 2. add store id to userData
        const userStoresData = [...userData.stores];
        userStoresData.push(newStore.id);
        const newUserData: User = {
            ...userData,
            stores: userStoresData,
        };

        // 3. check if store already saved
        const isDuplicate = stores.some((store: Store) => store.id === newStore.id);

        // 4. save data
        if (!isDuplicate) {
            // add store to db
            await addStoreToDB(newStore);
            // add store to local data
            updateStoresData([...stores, newStore]);
            setCurrentStore(newStore);
            // update user data
            await updateUserData(newUserData);
            updateUserState(newUserData);
        }
    }


    const renderStore = ({ item }: { item: Store }) => {
        return (
            <BranchCard
                name={item.name}
                admin='You'
                profit={13000}
            />
        )
    };


    return (
        <SafeAreaView style={{ flex: 1 }}>
            <Carousel
                ref={carousel => carousel ? carouselRef = carousel : null}
                showsControls={false}
                showsDots={false}
                scrollEnabled={false}
            >

                <View style={[styles.container, { backgroundColor: Colors[theme].tint }]}>

                    {/* title */}
                    <Text style={{ ...styles.title, color: Colors[theme].primary }}>
                        {t('myShops.title')}
                    </Text>

                    {stores.length > 0 ? (
                        <FlatList
                            data={stores}
                            keyExtractor={(item) => item.id}
                            renderItem={renderStore}
                        />
                    ) : (
                        <View style={styles.emptyContainer}>
                            {/* empty myShops */}
                            <Image source={emptyImg} style={{
                                width: 150,
                                height: 120,
                                marginBottom: 24
                            }} />
                            <Text style={{ ...styles.empty, color: Colors[theme].muted }}>
                                {t('myShops.empty')}
                            </Text>
                        </View>
                    )}

                    <FloatingBtn onPress={openFTB} />

                </View>

                <View style={[styles.container, { backgroundColor: Colors[theme].tint }]}>
                    <AddNewShopForm
                        submit={addNewStore}
                        goBack={() => carouselRef?.scrollToPrev()}
                    />
                </View>

            </Carousel>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    title: {
        fontSize: 24,
        fontWeight: '700',
        padding: 16,
    },
    emptyContainer: {
        width: '100%',
        alignItems: 'center',
        marginTop: 72
    },
    empty: {
        ...en.h4,
    },
});
