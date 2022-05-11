import React, { useEffect, useState } from 'react'
import { FlatList, SafeAreaView, StyleSheet, View, Text, ViewStyle, I18nManager } from 'react-native';

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
import { Client, Sale, Store, TimeRange } from '../../types';
import SelectClientForm from '../../components/forms/SelectClientForm';
import AddNewClientForm from '../../components/forms/AddNewClientForm';
import { scrollToNext, scrollToPrev } from '../../utils/carouselNavigationl';
import { updateStoreData } from '../../firebase/storeActions';



export default function Sales() {
    let carouselRef: Carousel;

    const theme = useColorScheme();
    const { t } = useTranslation();

    // zustand
    const currentStore = useStore(state => state.currentStore);
    const setCurrentStore = useStore(state => state.setCurrentStore);
    const stores = useStore(state => state.stores);
    const updateStoresData = useStore(state => state.updateStoresData);

    const [timeRange, setTimeRange] = useState('today');
    const [loading, setLoading] = useState<boolean>(false);
    // sales
    const [selectedClient, setSelectedClient] = useState<Client>();
    const [data, setData] = useState<Sale[]>(currentStore.sales);


    useEffect(() => {
        updateTimeRange('today'); // default time range is today
    }, []);


    // Carousel navigation
    const showNext = () => scrollToNext(carouselRef, I18nManager.isRTL);
    const goBack = () => scrollToPrev(carouselRef, I18nManager.isRTL);

    const updateTimeRange = (range: TimeRange) => {
        const today = new Date().getDate();
        const month = new Date().getMonth() + 1;
        const year = new Date().getFullYear();
        const salesData = [...currentStore.sales];
        const newSalesData = salesData.filter(sale => {
            if (range === 'today') {
                return new Date(sale.date).getDate() === today;
            } else if (range === 'month') {
                return new Date(sale.date).getMonth() + 1 === month;
            } else if (range === 'year') {
                return new Date(sale.date).getFullYear() === year;
            }
        });
        setTimeRange(range);
        setData(newSalesData);
    };

    const openFTB = () => showNext();


    /**
     * Updates one store's data in stores
     * and returns the result
     */
    const getNewStoresData = (storeData: Store) => {
        const newStoresData = [...stores];
        const storeIndex = newStoresData.findIndex(store => store.id === storeData.id);
        if (storeIndex !== -1) {
            newStoresData[storeIndex] = storeData;
        }
        return newStoresData;
    }

    // Saves new client data
    const addNewClient = async (data: { name: string, phoneNumber: string }) => {
        setLoading(true);

        const newClient: Client = {
            id: uuid.v4().toString(),
            name: data.name,
            phoneNumber: data.phoneNumber,
        };

        const allClients: Client[] = [...currentStore.clients];
        allClients.push(newClient);

        const newStoreData: Store = { ...currentStore, clients: allClients };
        const newStoresData: Store[] = getNewStoresData(newStoreData);

        try {
            setCurrentStore(newStoreData); // update current store data
            updateStoresData(newStoresData); // update all stores data
            await updateStoreData(newStoreData); // update store data in DB
            goBack();
        } catch (error) {
            __DEV__ && console.error('🛑 Error in addNewClient', error);
        } finally {
            setLoading(false);
        }
    }

    // Save selected client
    const saveClient = (client: Client) => {
        setSelectedClient(client);
        goBack();
    }


    const addNewSale = async (data: Sale) => {
        // show loading
        setLoading(true);

        // generate new sale data
        const newSale: Sale = {
            id: uuid.v4().toString(),
            productName: data.productName,
            sellingPrice: data.sellingPrice,
            buyingPrice: data.buyingPrice,
            paid: data.paid,
            clientId: data.clientId,
            date: Date.now(),
        };

        const allSales: Sale[] = [...currentStore.sales];
        allSales.push(newSale);

        const newStoreData: Store = { ...currentStore, sales: allSales };
        const newStoresData: Store[] = getNewStoresData(newStoreData);

        try {
            setCurrentStore(newStoreData); // update current store data
            updateStoresData(newStoresData); // update all stores data
            await updateStoreData(newStoreData); // update store data in DB
            setData(newStoreData.sales);
            goBack();
            __DEV__ && console.log('✅ Update Store Sales SUCCESS');
        } catch (error) {
            __DEV__ && console.error('🛑 Error in addNewSale', error);
        } finally {
            setLoading(false);
        }
    }


    const header = () => {
        const tableHeaderBg: ViewStyle = {
            backgroundColor: Colors[theme].subAccent,
            borderBottomColor: Colors[theme].shade,
        };
        return (
            <View>
                <View style={{ flexDirection: 'row', marginBottom: 16 }}>
                    <Status status={true} label={t('sales.add.paid').toString()} />
                    <Status status={false} label={t('sales.add.not_paid').toString()} />
                </View>
                <DataTable.Header style={tableHeaderBg}>
                    <TableText header label='' style={{ flex: 0.2 }} />
                    <TableText header label='Product' style={{ flex: 2 }} />
                    <TableText header label='Buying $' />
                    <TableText header label='Selling $' />
                </DataTable.Header>
            </View>
        )
    };


    const renderSales = ({ item }: { item: Sale }) => {
        const tableRowBg: ViewStyle = {
            backgroundColor: Colors[theme].bright,
            borderBottomColor: Colors[theme].shade,
        };
        return (
            <DataTable.Row style={tableRowBg}>
                <DataTable.Cell style={{ flex: 0.2 }}>
                    <Status status={item.paid} />
                </DataTable.Cell>
                <TableText label={item.productName} style={{ flex: 2 }} />
                <TableText label={item.buyingPrice} formatPrice />
                <TableText label={item.sellingPrice} formatPrice />
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
                    <View style={{ paddingTop: 24, paddingHorizontal: 16 }}>
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
                    </View>
                    {data.length > 0 ? (
                        <FlatList
                            data={data}
                            renderItem={renderSales}
                            keyExtractor={(item) => item.id}
                            ListHeaderComponent={header}
                            showsVerticalScrollIndicator={false}
                            contentContainerStyle={{ paddingVertical: 24, paddingHorizontal: 16 }}
                        />
                    ) : (
                        <Empty icon='bar-chart-2' text={t('sales.empty')} />
                    )}
                    <FloatingBtn onPress={openFTB} />
                </View>

                {/* add new sale */}
                <View style={[styles.containerStyle, { backgroundColor: Colors[theme].tint }]}>
                    <AddNewSaleForm
                        loading={loading}
                        submit={addNewSale}
                        currentStore={currentStore}
                        goBack={goBack}
                        showNext={showNext}
                        selectedClient={selectedClient}
                    />
                </View>

                {/* select client */}
                <View style={[styles.containerStyle, { backgroundColor: Colors[theme].tint }]}>
                    <SelectClientForm
                        loading={loading}
                        saveClient={saveClient}
                        currentStore={currentStore}
                        goBack={goBack}
                        showNext={showNext}
                    />
                </View>

                {/* if no client => add new client */}
                <View style={[styles.containerStyle, { backgroundColor: Colors[theme].tint }]}>
                    <AddNewClientForm
                        loading={loading}
                        submit={addNewClient}
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
