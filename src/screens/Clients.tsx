import React, { useCallback, useState } from 'react'
import { FlatList, SafeAreaView, StyleSheet, View, Text, I18nManager, ViewStyle } from 'react-native';

import { useTranslation } from "react-i18next";
import { DataTable } from 'react-native-paper';
import Carousel from 'pinar';

import { TableText } from '../components/data/TableRow';
import Colors from '../constants/Colors';
import useColorScheme from '../hooks/useColorScheme';
import FloatingBtn from '../components/buttons/FloatingBtn';
import CheckBox from '../components/buttons/CheckBox';
import AddNewClientForm from '../components/forms/AddNewClientForm';



export default function Clients() {
    let carouselRef: Carousel;

    const theme = useColorScheme();
    const { t } = useTranslation();

    const tableHeaderBg: ViewStyle = {
        backgroundColor: Colors[theme].subAccent,
        borderBottomColor: Colors[theme].shade,
    };
    const tableRowBg: ViewStyle = {
        backgroundColor: Colors[theme].bright,
        borderBottomColor: Colors[theme].shade,
    };

    const clients = [
        {
            id: '1',
            name: 'Ali',
            paid: 3400,
            notPaid: 5000,
        },
        {
            id: '2',
            name: 'Ahmed',
            paid: 2000,
            notPaid: 5000,
        },
        {
            id: '3',
            name: 'BeoShop',
            paid: 56000,
            notPaid: 0,
        },
    ];

    const header = () => {
        return (
            <DataTable.Header style={tableHeaderBg}>
                <TableText header label='Name' style={{ flex: 1.5 }} />
                <TableText header label='Paid' />
                <TableText header label='Not Paid' />
            </DataTable.Header>
        )
    }


    const renderClient = ({ item }) => {
        return (
            <DataTable.Row style={tableRowBg}>
                <TableText label={item.name} style={{ flex: 1.5 }} />
                <TableText label={item.paid} formatPrice />
                <TableText label={item.notPaid} formatPrice />
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

                <View style={{ ...styles.containerStyle, padding: 16, backgroundColor: Colors[theme].tint }}>
                    <DataTable>
                        <FlatList
                            data={clients}
                            renderItem={renderClient}
                            keyExtractor={(item, index) => index.toString()}
                            ListHeaderComponent={header}
                            showsVerticalScrollIndicator={false}
                        />
                    </DataTable>
                    <FloatingBtn onPress={openFTB} />
                </View>

                {/* add new client */}
                <View style={[styles.containerStyle, { backgroundColor: Colors[theme].tint }]}>
                    <AddNewClientForm
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
})
