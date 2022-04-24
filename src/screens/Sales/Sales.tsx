import React, { useState } from 'react'
import { FlatList, SafeAreaView, StyleSheet, View, Text, ViewStyle, useWindowDimensions, I18nManager } from 'react-native';

import { Picker } from '@react-native-picker/picker';
import { useTranslation } from "react-i18next";
import { DataTable } from 'react-native-paper';
import Carousel from 'pinar';
import uuid from 'react-native-uuid';

import { Status, TableText } from '../../components/data/TableRow';
import Colors from '../../constants/Colors';
import useColorScheme from '../../hooks/useColorScheme';
import { en } from '../../assets/Typography';
import FloatingBtn from '../../components/buttons/FloatingBtn';
import PickerComp from '../../components/Inputs/PickerComp';
import AddNewSaleForm from '../../components/forms/AddNewSaleForm';
import useStore from '../../state/useStore';
import Empty from '../../components/cards/Empty';
import { Sale } from '../../types';
import SelectClientForm from '../../components/forms/SelectClientForm';
import AddNewClientForm from '../../components/forms/AddNewClientForm';
import { scrollToNext, scrollToPrev } from '../../utils/carouselNavigationl';



export default function Sales() {
    let carouselRef: Carousel;

    const theme = useColorScheme();
    const { t } = useTranslation();

    const [timeRange, setTimeRange] = useState('today');

    // zustand
    const currentStore = useStore(state => state.currentStore);
    const setCurrentStore = useStore(state => state.setCurrentStore);


    // Carousel navigation
    const showNext = () => scrollToNext(carouselRef, I18nManager.isRTL);
    const goBack = () => scrollToPrev(carouselRef, I18nManager.isRTL);


    const updateTimeRange = React.useCallback((range: string) => setTimeRange(range), [timeRange]);
    const openFTB = () => showNext();

    const tableHeaderBg: ViewStyle = React.useMemo(() => ({
        backgroundColor: Colors[theme].subAccent,
        borderBottomColor: Colors[theme].shade,
    }), []);

    const tableRowBg: ViewStyle = React.useMemo(() => ({
        backgroundColor: Colors[theme].bright,
        borderBottomColor: Colors[theme].shade,
    }), []);


    const addNewStore = async (data: Sale) => {
        carouselRef?.scrollToPrev();

        // 1. generate new store data
        const newSale: Sale = {
            id: uuid.v4().toString(),
            name: data.name,
            products: [],
            invoices: [],
            sales: [],
            transactions: [],
            members: [{ name: userData.info.firstName, id: userData.id, role: 'owner' }],
            type: data.mode,
        };

        // 2. add store id to userData
        const userStoresData = [...userData.stores];
        userStoresData.push(newSale.id);
        const newUserData: User = {
            ...userData,
            stores: userStoresData,
        };

        // 3. check if store already saved
        const isDuplicate = stores.some((store: Store) => store.id === newSale.id);

        // 4. save data
        if (!isDuplicate) {
            // add store to db
            await addStoreToDB(newSale);
            // add store to local data
            updateStoresData([...stores, newSale]);
            setCurrentStore(newSale);
            // update user data
            await updateUserData(newUserData);
            updateUserState(newUserData);
        }
    }


    const header = () => {
        return (
            <View>
                <View >
                    <Text style={[styles.title, { color: Colors[theme].primary }]}>
                        {t('sales.title')}
                    </Text>
                    {/* picker */}
                    <PickerComp
                        value={timeRange}
                        onChange={updateTimeRange}>
                        <Picker.Item style={{ ...en.h5, color: Colors[theme].primary }} label={t('sales.today')} value="today" />
                        <Picker.Item style={{ ...en.h5, color: Colors[theme].primary }} label={t('sales.month')} value="month" />
                        <Picker.Item style={{ ...en.h5, color: Colors[theme].primary }} label={t('sales.year')} value="year" />
                    </PickerComp>
                    {/*  */}
                    <View style={{ flexDirection: 'row', marginBottom: 16 }}>
                        <Status status='paid' label={t('sales.add.paid')} />
                        <Status status='unpaid' label={t('sales.add.not_paid')} />
                    </View>
                </View>

                <DataTable.Header style={tableHeaderBg}>
                    <TableText header label='' style={{ flex: 0.2 }} />
                    <TableText header label='Product' style={{ flex: 2 }} />
                    <TableText header label='Selling $' />
                    <TableText header label='Buying $' />
                </DataTable.Header>
            </View>
        )
    };

    const footer = () => {
        return (
            <View style={{ ...styles.footer, }}>
                <Text style={{ ...en.h3 }}>{t('sales.total')}</Text>
                <Text style={{ ...en.h3 }}>846 د.م</Text>
            </View>
        )
    };

    const renderSales = ({ item }) => {
        return (
            <DataTable.Row style={tableRowBg}>
                <DataTable.Cell style={{ flex: 0.2 }}>
                    <Status status={item.status} />
                </DataTable.Cell>
                <TableText label={item.product} style={{ flex: 2 }} />
                <TableText label={item.price} formatPrice />
                <TableText label={item.price} formatPrice />
            </DataTable.Row>
        )
    };


    return (
        <SafeAreaView style={{ flex: 1 }}>
            <Carousel
                ref={carousel => carousel ? carouselRef = carousel : null}
                showsControls={false}
                showsDots={false}
                scrollEnabled={false}
                index={I18nManager.isRTL ? 3 : 0}
            >

                {/* sales screen */}
                <View style={[styles.containerStyle, { backgroundColor: Colors[theme].tint }]}>
                    {currentStore?.sales.length > 0 ? (
                        <FlatList
                            data={currentStore?.sales}
                            renderItem={renderSales}
                            keyExtractor={(item, index) => index.toString()}
                            ListHeaderComponent={header}
                            ListFooterComponent={footer}
                            showsVerticalScrollIndicator={false}
                            contentContainerStyle={{ paddingVertical: 24, paddingHorizontal: 16 }}
                        />
                    ) : (
                        <View style={{ paddingHorizontal: 16, paddingVertical: 24, }}>
                            <Text style={[styles.title, { color: Colors[theme].primary }]}>
                                {t('sales.title')}
                            </Text>
                            <Empty icon='bar-chart-2' text={t('sales.empty')} />
                        </View>
                    )}
                    <FloatingBtn onPress={openFTB} />
                </View>

                {/* add new sale */}
                <View style={[styles.containerStyle, { backgroundColor: Colors[theme].tint }]}>
                    <AddNewSaleForm
                        loading={false}
                        submit={(data) => console.log(data)}
                        currentStore={currentStore}
                        goBack={goBack}
                        showNext={showNext}
                    />
                </View>

                {/* select client */}
                <View style={[styles.containerStyle, { backgroundColor: Colors[theme].tint }]}>
                    <SelectClientForm
                        loading={false}
                        saveClient={(data) => console.log(data)}
                        currentStore={currentStore}
                        goBack={goBack}
                        showNext={showNext}
                    />
                </View>

                {/* if no client => add new client */}
                <View style={[styles.containerStyle, { backgroundColor: Colors[theme].tint }]}>
                    <AddNewClientForm
                        loading={false}
                        submit={(data) => console.log(data)}
                        goBack={goBack}
                    />
                </View>

            </Carousel>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    containerStyle: {
        flex: 1,
    },
    header: {
        width: '100%',
        padding: 16,
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    footer: {
        paddingTop: 16,
        paddingBottom: 84,
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 26,
    },
    pickerContainer: {
        borderRadius: 8,
        height: 40,
        justifyContent: 'center',
        marginBottom: 16,
    },
    title: {
        ...en.h1,
        marginBottom: 16,
    },
    row: {
        flexDirection: 'row',
        overflow: 'hidden'
    }
})
