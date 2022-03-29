import React, { useMemo } from 'react'
import { FlatList, SafeAreaView, StyleSheet, View, Text, ViewStyle } from 'react-native';

import { useTranslation } from "react-i18next";
import Feather from 'react-native-vector-icons/Feather';
import Carousel from 'pinar';

import { Status, TableText } from '../components/data/TableRow';
import Colors from '../constants/Colors';
import useColorScheme from '../hooks/useColorScheme';
import { en } from '../assets/Typography';
import FloatingBtn from '../components/buttons/FloatingBtn';
import AddNewProductForm from '../components/forms/AddNewProductForm';
import { DataTable } from 'react-native-paper';



const products = [
    {
        id: '1',
        product: 'IPhone 12',
        buyingPrice: 1500,
        qty: 20,
        supplier: 'Ali Gro',
        status: 'paid',
    },
    {
        id: '2',
        product: 'IPhone 12',
        buyingPrice: 1500,
        qty: 20,
        supplier: 'Ali Gro',
        status: 'unpaid',
    },
    {
        id: '3',
        product: 'IPhone 12',
        buyingPrice: 1500,
        qty: 20,
        supplier: 'Ali Gro',
        status: 'paid',
    },
    {
        id: '4',
        product: 'IPhone 12',
        buyingPrice: 1500,
        qty: 20,
        supplier: 'Ali Gro',
        status: 'pending',
    },
];




export default function Inventory() {
    let carouselRef: Carousel;

    const theme = useColorScheme();
    const { t } = useTranslation();

    const tableHeaderBg: ViewStyle = useMemo(() => ({
        backgroundColor: Colors[theme].subAccent,
        borderBottomColor: Colors[theme].shade,
    }), []);

    const tableRowBg: ViewStyle = useMemo(() => ({
        backgroundColor: Colors[theme].bright,
        borderBottomColor: Colors[theme].shade,
    }), []);

    const header = () => {
        return (
            <View>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    <Text style={{ ...styles.title, color: Colors[theme].primary }}>
                        {t('inventory.title')}
                    </Text>
                    <View style={{ ...styles.overview, backgroundColor: Colors[theme].subAccent }}>
                        <Feather
                            name='bar-chart-2'
                            size={14}
                            color={Colors[theme].accent}
                            style={{ marginRight: 8 }}
                        />
                        <Text style={{ ...en.h6, color: Colors[theme].accent }}>
                            1000 {t('inventory.units')}
                        </Text>
                    </View>
                </View>

                <DataTable.Header style={tableHeaderBg}>
                    <TableText header label='' style={{ flex: 0.2 }} />
                    <TableText header label='Product' style={{ flex: 2 }} />
                    <TableText header label='Buying $' />
                    <TableText header label='Qty' />
                    <TableText header label='Supplier' />
                </DataTable.Header>
            </View>
        )
    }

    const renderProducts = ({ item }) => {
        return (
            <DataTable.Row style={tableRowBg}>
                <DataTable.Cell style={{ flex: 0.2 }}>
                    <Status status={item.status} />
                </DataTable.Cell>
                <TableText label={item.product} style={{ flex: 2 }} />
                <TableText label={item.buyingPrice} formatPrice />
                <TableText label={item.qty} formatPrice />
                <TableText label={item.supplier} />
            </DataTable.Row>
        )
    };

    const openFTB = () => carouselRef?.scrollToIndex({ index: 1 });

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <Carousel
                ref={carousel => carousel ? carouselRef = carousel : null}
                showsControls={false}
                showsDots={false}
                scrollEnabled={false}
                style={{ backgroundColor: Colors[theme].tint }}
            >

                <View style={[styles.containerStyle, { backgroundColor: Colors[theme].tint }]}>
                    <FlatList
                        data={products}
                        renderItem={renderProducts}
                        keyExtractor={(item) => item.id}
                        ListHeaderComponent={header}
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={{ paddingVertical: 24, paddingHorizontal: 16 }}
                    />
                    <FloatingBtn onPress={openFTB} />
                </View>

                {/* add new product */}
                <View style={[styles.containerStyle, { backgroundColor: Colors[theme].tint }]}>
                    <AddNewProductForm
                        loading={false}
                        submit={(data) => console.log(data)}
                        goBack={() => carouselRef?.scrollToPrev()}
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
    overview: {
        height: 30,
        alignItems: 'center',
        borderRadius: 8,
        paddingHorizontal: 8,
        flexDirection: 'row'
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
