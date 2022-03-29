import React, { useState } from 'react'
import { FlatList, SafeAreaView, StyleSheet, View, Text, ViewStyle, useWindowDimensions } from 'react-native';

;
import { Picker } from '@react-native-picker/picker';
import { useTranslation } from "react-i18next";
import { DataTable } from 'react-native-paper';
import Carousel from 'pinar';

import { Status, TableText } from '../../components/data/TableRow';
import Colors from '../../constants/Colors';
import useColorScheme from '../../hooks/useColorScheme';
import { en } from '../../assets/Typography';
import FloatingBtn from '../../components/buttons/FloatingBtn';
import PickerComp from '../../components/Inputs/PickerComp';
import AddNewSaleForm from '../../components/forms/AddNewSaleForm';


const salesData = [
    {
        product: 'Nike Shoes',
        status: 'unpaid',
        date: '2021/12/23',
        price: 299,
    },
    {
        product: 'Iphone 12 Pro',
        status: 'paid',
        date: '2021/12/20',
        price: 199,
    },
    {
        product: 'Xbox',
        status: 'paid',
        date: '2021/12/20',
        price: 159,
    },
    {
        product: 'IPad Pro',
        status: 'paid',
        date: '2021/12/19',
        price: 399,
    },
    {
        product: 'Iphone 12 Pro',
        status: 'paid',
        date: '2021/12/20',
        price: 199,
    },
    {
        product: 'Xbox',
        status: 'unpaid',
        date: '2021/12/20',
        price: 159,
    },
    {
        product: 'IPad Pro',
        status: 'paid',
        date: '2021/12/19',
        price: 399,
    },
];


export default function Sales() {
    let carouselRef: Carousel;

    const theme = useColorScheme();
    const { t } = useTranslation();

    const [timeRange, setTimeRange] = useState('today');

    const updateTimeRange = React.useCallback((range: string) => setTimeRange(range), [timeRange]);

    const tableHeaderBg: ViewStyle = React.useMemo(() => ({
        backgroundColor: Colors[theme].subAccent,
        borderBottomColor: Colors[theme].shade,
    }), []);

    const tableRowBg: ViewStyle = React.useMemo(() => ({
        backgroundColor: Colors[theme].bright,
        borderBottomColor: Colors[theme].shade,
    }), []);

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
                        <Status status='paid' label={t('sales.modal.paid')} />
                        <Status status='unpaid' label={t('sales.modal.not_paid')} />
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

    const openFTB = () => carouselRef?.scrollToNext();

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <Carousel
                ref={carousel => carousel ? carouselRef = carousel : null}
                showsControls={false}
                showsDots={false}
                width={useWindowDimensions().width}
                height={useWindowDimensions().height - 60}
                scrollEnabled={false}
            >

                {/* sales screen */}
                <View style={[styles.containerStyle, { backgroundColor: Colors[theme].tint }]}>
                    <FlatList
                        data={salesData}
                        renderItem={renderSales}
                        keyExtractor={(item, index) => index.toString()}
                        ListHeaderComponent={header}
                        ListFooterComponent={footer}
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={{ paddingVertical: 24, paddingHorizontal: 16 }}
                    />
                    <FloatingBtn onPress={openFTB} />
                </View>

                {/* add new sale */}
                <View style={[styles.containerStyle, { backgroundColor: Colors[theme].tint }]}>
                    <AddNewSaleForm
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
