import { SafeAreaView, StyleSheet, View, Text, Image, } from 'react-native';
import React from 'react';


import { useTranslation } from 'react-i18next';

import Colors from '../constants/Colors';
import useColorScheme from '../hooks/useColorScheme';
import BranchCard from '../components/cards/BranchCard';
import AssetsManager from '../assets/AssetsManager';
import { en } from '../assets/Typography';

export default function Branches() {
    const theme = useColorScheme();
    const { t } = useTranslation();

    const emptyImg = theme === 'light' ? AssetsManager.Images.storeLight : AssetsManager.Images.storeDark;

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <View style={{ ...styles.container, backgroundColor: Colors[theme].tint }}>

                <Text style={{ ...styles.title, color: Colors[theme].primary }}>
                    {t('branches.title')}
                </Text>

                <BranchCard
                    name='Branch 1'
                    admin='You'
                    profit={13000}
                />

                <BranchCard
                    name='Branch 2'
                    admin='Brahim'
                    profit={5600}
                />

                {/* empty branches */}
                {/* <View style={{ width: '100%', alignItems: 'center', marginTop: 72 }}>
                    <Image source={emptyImg} style={{ width: 150, height: 120, marginBottom: 24 }} />
                    <Text style={{ ...styles.empty, color: Colors[theme].muted }}>
                        No stores have benn added
                    </Text>
                </View> */}

            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 24,
        paddingVertical: 16,
    },
    title: {
        fontSize: 24,
        fontWeight: '700',
        marginBottom: 24,
    },
    empty: {
        ...en.h4,
    }
});
