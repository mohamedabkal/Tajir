import { FlatList, StyleSheet, ViewStyle } from 'react-native'
import React from 'react'

import { TableText } from './TableRow';
import { useTranslation } from 'react-i18next';
import { DataTable } from 'react-native-paper';

import Colors from '../../constants/Colors';
import useColorScheme from '../../hooks/useColorScheme';


const data = [
    {
        id: '1',
        amount: 2300,
        date: new Date(),
        number: 12,
    },
    {
        id: '2',
        amount: 1000,
        date: new Date(),
        number: 12,
    },
    {
        id: '3',
        amount: 5000,
        date: new Date(),
        number: 12,
    },
]


export default function Transactions() {
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

    const header = () => (
        <DataTable.Header style={tableHeaderBg}>
            <TableText header label={t('home.transactions.transaction')} />
            <TableText header label={t('home.transactions.date')} />
            <TableText header label={t('home.transactions.amount')} />
        </DataTable.Header>
    )


    const renderItem = ({ item }) => {
        const date = `${item.date.getDate()}/${item.date.getMonth()}/${item.date.getFullYear()}`;
        return (
            <DataTable.Row style={tableRowBg}>
                <TableText label={`#${item.number}`} />
                <TableText label={date} />
                <TableText label={item.amount} formatPrice />
            </DataTable.Row>
        )
    };

    return (
        <DataTable>
            <FlatList
                data={data}
                renderItem={renderItem}
                keyExtractor={(item) => item.id}
                ListHeaderComponent={header}
                showsVerticalScrollIndicator={false}
            />
        </DataTable>
    )
}