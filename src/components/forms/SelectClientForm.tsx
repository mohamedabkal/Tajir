import React, { useCallback, useEffect, useState } from 'react'
import { BackHandler, FlatList, StyleSheet, View, } from 'react-native';

import { useTranslation } from 'react-i18next';
import Feather from 'react-native-vector-icons/Feather';
import { useForm } from 'react-hook-form';
import { DataTable, IconButton } from 'react-native-paper';

import Button from '../buttons/Button';
import Colors from '../../constants/Colors';
import { en } from '../../assets/Typography';
import useColorScheme from '../../hooks/useColorScheme';
import { Client, Store } from '../../types';
import { TableText } from '../data/TableRow';
import TextInput from '../Inputs/TextInput';
import Empty from '../cards/Empty';



type Props = {
    loading?: boolean;
    saveClient: (client: Client) => void;
    goBack: () => void;
    showNext: () => void;
    currentStore: Store;
}


const DATA = [
    {
        id: '45098459845',
        name: 'Ali',
        phoneNumber: '003745477',
    },
    {
        id: '4985',
        name: 'SDLFJS',
        phoneNumber: '003745477',
    },
    {
        id: '345',
        name: 'Ali',
        phoneNumber: '003745477',
    },
    {
        id: '326',
        name: 'AHMED',
        phoneNumber: '003745477',
    },
    {
        id: '2653',
        name: 'SD',
        phoneNumber: '003745477',
    },
    {
        id: '2356',
        name: 'SDLKJF',
        phoneNumber: '003745477',
    },
    {
        id: '235356',
        name: 'Ali 2',
        phoneNumber: '003745477',
    },
    {
        id: '35665',
        name: 'SLDKJF',
        phoneNumber: '003745477',
    },
    {
        id: '5363256',
        name: 'SDJF',
        phoneNumber: '003745477',
    },
    {
        id: '23562356',
        name: 'SDLFJ',
        phoneNumber: '003745477',
    },
    {
        id: '3562356',
        name: 'LKSJDF',
        phoneNumber: '003745477',
    },
    {
        id: '32563256',
        name: 'Ali LKSJD',
        phoneNumber: '003745477',
    },
]


export default function SelectClientForm(props: Props) {
    const { loading, goBack, saveClient, currentStore, showNext } = props;

    const [data] = useState(DATA);
    const [filterData, setFilterData] = useState(DATA);
    const [selectedClient, setSelectedClient] = useState<Client>();
    const [clientName, setClientName] = useState<string>('');
    const [showNotFound, setShowNotFound] = useState(false);

    const theme = useColorScheme();
    const { t } = useTranslation();

    useEffect(() => {
        const backAction = () => {
            goBack();
            return true;
        };
        const backHandler = BackHandler.addEventListener("hardwareBackPress", backAction);
        return () => backHandler.remove();
    }, []);

    useEffect(() => filterClients(), [clientName]);


    const { control } = useForm();

    const filterClients = () => {
        if (clientName) {
            const newData = data.filter((item: Client) => {
                const clientData = item.name ? item.name.toUpperCase() : ''.toUpperCase();
                const nameData = clientName.toUpperCase();
                return clientData.indexOf(nameData) > -1;
            })
            setFilterData(newData);
            newData.length === 0 ? setShowNotFound(true) : setShowNotFound(false);
        } else if (clientName.length === 0) {
            setFilterData(data);
        }
    }

    const onSelectClient = useCallback((data: Client) => setSelectedClient(data), []);


    const RenderEmpty = () => (
        <View style={{ marginTop: 116 }}>
            <Empty
                icon='users'
                text={showNotFound ? t('clients.not_found') : t('clients.empty')}
            />
            <Button
                title={t('clients.add.title')}
                onPress={showNext}
                containerStyle={{ backgroundColor: Colors[theme].subAccent, marginTop: 32 }}
                titleStyle={{ color: Colors[theme].accent }}
                loading={loading}
            />
        </View>
    );


    const renderHeader = () => (
        <DataTable.Header>
            <TableText
                label={t('clients.add.name').toString()}
                header={true}
            />
            <TableText
                label={t('clients.add.phone_number').toString()}
                style={{ justifyContent: 'flex-end' }}
                header={true}
            />
        </DataTable.Header>
    )


    const renderClient = ({ item }: { item: Client }) => {
        return (
            <DataTable.Row onPress={() => onSelectClient(item)}>
                <TableText label={item.name} />
                {selectedClient?.id === item.id && (
                    <DataTable.Cell style={{ flex: 0 }}>
                        <Feather name='check' color={Colors[theme].active} size={16} />
                    </DataTable.Cell>
                )}
                <TableText label={item.phoneNumber} style={{ justifyContent: 'flex-end' }} />
            </DataTable.Row>
        )
    };


    return (
        <View style={styles.container}>
            {/* select client */}
            <View style={{ paddingHorizontal: 24 }}>
                <View style={styles.searchContainer}>
                    <IconButton
                        icon='arrow-left'
                        color={Colors[theme].primary}
                        size={20}
                        onPress={goBack}
                        style={{ marginBottom: 16, }}
                    />
                    <TextInput
                        name='clientName'
                        control={control}
                        placeholder={t('common.search')}
                        bgColor={Colors[theme].bright}
                        leftIcon={() => (
                            <Feather name='search' color={Colors[theme].muted} size={16} style={{ marginRight: 8 }} />
                        )}
                        onChangeText={setClientName}
                        value={clientName}
                    />
                </View>

                {filterData.length > 0 ? (
                    <FlatList
                        data={filterData}
                        renderItem={renderClient}
                        keyExtractor={(item) => item.id}
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={{ paddingBottom: 24 }}
                        style={{ marginTop: 116 }}
                        ListHeaderComponent={renderHeader}
                        ListFooterComponent={() => (
                            <Button
                                title={t('sales.add.pick_client')}
                                onPress={saveClient}
                                containerStyle={{ marginTop: 32 }}
                                loading={loading}
                            />
                        )}
                    />
                ) : (
                    <RenderEmpty />
                )}
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 8,
    },
    title: {
        ...en.h2,
        marginBottom: 24,
    },
    searchContainer: {
        position: 'absolute',
        top: 0,
        width: '100%',
        alignSelf: 'center',
    }
})
