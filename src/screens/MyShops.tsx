import { SafeAreaView, StyleSheet, View, Text, Image, FlatList, useWindowDimensions, } from 'react-native';
import React from 'react';

import { useTranslation } from 'react-i18next';
import Carousel from 'pinar';

import Colors from '../constants/Colors';
import useColorScheme from '../hooks/useColorScheme';
import BranchCard from '../components/cards/BranchCard';
import AssetsManager from '../assets/AssetsManager';
import { en } from '../assets/Typography';
import useStore from '../state/useStore';
import { Store } from '../types';
import FloatingBtn from '../components/buttons/FloatingBtn';
import AddNewShopForm from '../components/forms/AddNewShopForm';

export default function MyShops() {
    let carouselRef: Carousel;

    const theme = useColorScheme();
    const { t } = useTranslation();
    const stores = useStore(state => state.stores);

    const openFTB = () => carouselRef?.scrollToNext();

    const emptyImg = theme === 'light' ? AssetsManager.Images.storeLight : AssetsManager.Images.storeDark;

    const renderStore = ({ item }: { item: Store }) => {
        return (
            <BranchCard
                name='Branch 1'
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
                        <View style={{ width: '100%', alignItems: 'center', marginTop: 72 }}>
                            {/* empty myShops */}
                            <Image source={emptyImg} style={styles.emptyImg} />
                            <Text style={{ ...styles.empty, color: Colors[theme].muted }}>
                                No stores have benn added
                            </Text>
                        </View>
                    )}

                    <FloatingBtn onPress={openFTB} />

                </View>

                <View style={[styles.container, { backgroundColor: Colors[theme].tint }]}>
                    <AddNewShopForm
                        loading={false}
                        submit={(data) => console.log(data)}
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
    empty: {
        ...en.h4,
    },
    emptyImg: {
        width: 150, height: 120, marginBottom: 24
    }
});
