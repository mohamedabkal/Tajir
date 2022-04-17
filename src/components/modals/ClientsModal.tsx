import { ActivityIndicator, FlatList, StyleSheet, } from 'react-native'
import React, { useCallback, useEffect, useState } from 'react';

import { DataTable, Modal, Portal, Searchbar, } from 'react-native-paper';
import { Controller, useForm, useWatch } from 'react-hook-form';
import Feather from 'react-native-vector-icons/Feather';
import { useTranslation } from 'react-i18next';
import Carousel from 'pinar';

import Colors from '../../constants/Colors';
import useColorScheme from '../../hooks/useColorScheme';
import { en } from '../../assets/Typography';
import { TableText } from '../data/TableRow';
import TextInput from '../Inputs/TextInput';
import { Client } from '../../types';


type Props = {
    visible: boolean;
    hide: () => void;
    saveAndHide?: (clientId: string) => void;
    clientId?: string;
    clientsData: Client[],
}


export default function ClientsModal(props: Props) {
    const { visible, hide } = props;
    let carouselRef: Carousel;

    const theme = useColorScheme();
    const { t } = useTranslation();

    const [clientsData, setClientsData] = useState(props.clientsData);
    const [loading, setLoading] = useState(false);
    const [selectedClientId, setSelectedClientId] = useState(props.clientId || '');
    const [clientName, setClientName] = useState<string>('');

    const { handleSubmit, control } = useForm();

    // useEffect(() => {
    //     fetchClients();
    // }, [clientName]);


    // filter clients by name
    const fetchClients = (name: string) => {
        if (name.length > 1) {
            const filterClients = clientsData?.filter((client: Client) => client.name === name);
            setClientsData(filterClients);
        }
    }

    const selectClient = useCallback((clientId: string) => {
        setSelectedClientId(clientId);
        props.saveAndHide(clientId);
    }, []);


    const renderClient = ({ item }: { item: Client }) => {
        return (
            <DataTable.Row onPress={() => selectClient(item.id)}>
                <TableText label={item.name} />
                {selectedClientId === item.id && (
                    <DataTable.Cell style={{ flex: 0 }}>
                        <Feather name='check' color={Colors[theme].active} size={16} />
                    </DataTable.Cell>
                )}
            </DataTable.Row>
        )
    }

    const SelectClientForm = () => {
        return (
            <>
                <Controller
                    control={control}
                    name='clientName'
                    render={({ field: { value, onChange } }) => (
                        <Searchbar
                            placeholder="Search"
                            onChangeText={(value: string) => {
                                onChange(value);
                                fetchClients(value);
                            }}
                            value={value}
                            style={{ margin: 16, backgroundColor: Colors[theme].bright, }}
                            iconColor={Colors[theme].secondary}
                            inputStyle={{ color: Colors[theme].primary }}
                        />
                    )}
                />
                {/* <TextInput
                    name='clientName'
                    control={control}
                    placeholder={t('common.search')}
                    bgColor={Colors[theme].bright}
                    leftIcon={() => (
                        <Feather name='search' color={Colors[theme].muted} size={16} style={{ marginRight: 8 }} />
                    )}
                    onChangeText={setClientName}
                /> */}
                {/* <DataTable>
                    <FlatList
                        data={clientsData}
                        renderItem={renderClient}
                        keyExtractor={(item) => item.id}
                        showsVerticalScrollIndicator={false}
                    />
                </DataTable> */}
                {loading ? (
                    <ActivityIndicator animating={loading} color={Colors[theme].active} size='large' />
                ) : (
                    <DataTable>
                        {clientsData.map((client: Client) => (
                            <DataTable.Row
                                onPress={() => selectClient(client.id)}
                                key={client.id}
                            >
                                <TableText label={client.name} />
                                {selectedClientId === client.id && (
                                    <DataTable.Cell style={{ flex: 0 }}>
                                        <Feather name='check' color={Colors[theme].active} size={16} />
                                    </DataTable.Cell>
                                )}
                            </DataTable.Row>
                        ))}
                    </DataTable>
                )}
            </>
        )
    }


    return (
        <Portal>
            <Modal
                visible={visible}
                onDismiss={hide}
                contentContainerStyle={[styles.container, { backgroundColor: Colors[theme].bright }]}
            >
                <Carousel
                    ref={carousel => carousel ? carouselRef = carousel : null}
                    showsControls={false}
                    showsDots={false}
                    scrollEnabled={false}
                >
                    <SelectClientForm />
                </Carousel>
            </Modal>
        </Portal>
    )
}

const styles = StyleSheet.create({
    container: {
        // padding: 16,
        paddingBottom: 24,
        margin: 24,
        borderRadius: 8,
        minHeight: 300,
        justifyContent: 'flex-start'
    },
    text: {
        ...en.h4,
        marginVertical: 8
    },
    skeleton: {
        width: '100%',
        height: 40,
        backgroundColor: 'rgba(0,0,0,0.2)',
        marginBottom: 8
    }
})