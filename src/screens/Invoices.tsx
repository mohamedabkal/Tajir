import React, { useMemo } from 'react'
import { FlatList, SafeAreaView, StyleSheet, View, Text, ViewStyle } from 'react-native';

import { useTranslation } from "react-i18next";
import Carousel from 'pinar';

import { TableText } from '../components/data/TableRow';
import Colors from '../constants/Colors';
import useColorScheme from '../hooks/useColorScheme';
import { en } from '../assets/Typography';
import FloatingBtn from '../components/buttons/FloatingBtn';
import AddNewProductForm from '../components/forms/AddNewProductForm';
import { DataTable } from 'react-native-paper';
import CheckBox from '../components/buttons/CheckBox';
import AddNewInvoiceForm from '../components/forms/AddNewInvoiceForm';



const data = [
    {
        id: '1',
        supplier: 'Ali',
        invoiceNumber: 34,
        date: new Date().getMonth() + new Date().getFullYear(),
        total: 5040,
        notPaid: 3400,
    },
    {
        id: '2',
        supplier: 'Ali',
        invoiceNumber: 34,
        date: new Date().getMonth() + new Date().getFullYear(),
        total: 5040,
        notPaid: 500,
    },
    {
        id: '3',
        supplier: 'Ali',
        invoiceNumber: 34,
        date: new Date().getMonth() + new Date().getFullYear(),
        total: 5040,
        notPaid: 0,
    },
    {
        id: '4',
        supplier: 'Ali',
        invoiceNumber: 34,
        date: new Date().getMonth() + new Date().getFullYear(),
        total: 5040,
        notPaid: 5040,
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
                <View style={{ paddingHorizontal: 16 }}>
                    <Text style={{ ...styles.title, color: Colors[theme].primary }}>
                        {t('invoices.title')}
                    </Text>
                </View>

                <DataTable.Header style={tableHeaderBg}>
                    <TableText header label='Supplier' />
                    <TableText header label='Invoice' />
                    <TableText header label='Date' />
                    <TableText header label='Total' />
                    <TableText header label='Status' style={{ flex: 1 }} />
                </DataTable.Header>
            </View>
        )
    }

    const renderInvoices = ({ item }) => {
        return (
            <DataTable.Row style={tableRowBg}>
                <TableText label={item.supplier} />
                <TableText label={item.invoiceNumber} />
                <TableText label={item.date} />
                <TableText label={item.total} formatPrice />
                <View style={{ flex: 1, flexDirection: 'row' }}>
                    <CheckBox
                        checked={item.notPaid === 0}
                        color={Colors[theme].success}
                    />
                    <CheckBox
                        checked={item.notPaid > 0}
                        color={Colors[theme].error}
                    />
                </View>
            </DataTable.Row>
        )
    };

    const openFTB = () => carouselRef?.scrollToNext();

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
                        data={data}
                        renderItem={renderInvoices}
                        keyExtractor={(item) => item.id}
                        ListHeaderComponent={header}
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={{ paddingVertical: 24, }}
                    />
                    <FloatingBtn onPress={openFTB} />
                </View>

                {/* add new invoice */}
                <View style={[styles.containerStyle, { backgroundColor: Colors[theme].tint }]}>
                    <AddNewInvoiceForm
                        loading={false}
                        submit={(data) => console.log(data)}
                        goBack={() => carouselRef?.scrollToPrev()}
                        showProductForm={() => carouselRef?.scrollToNext()}
                    />
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
