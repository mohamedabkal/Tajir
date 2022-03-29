import { ActivityIndicator, StyleSheet, } from 'react-native'
import React, { useCallback, useEffect, useState } from 'react';

import { DataTable, Modal, Portal, } from 'react-native-paper';
import Colors from '../../constants/Colors';
import useColorScheme from '../../hooks/useColorScheme';
import { en } from '../../assets/Typography';
import { TableText } from '../data/TableRow';
import TextInput from '../Inputs/TextInput';
import { useForm, useWatch } from 'react-hook-form';
import Feather from 'react-native-vector-icons/Feather';
import { useTranslation } from 'react-i18next';

type Props = {
    visible: boolean;
    hide: () => void;
    saveAndHide?: (clientId: string) => void;
    clientId?: string;
}


export default function ClientsModal(props: Props) {
    const { visible, hide } = props;

    const theme = useColorScheme();
    const { t } = useTranslation();

    const [fetchedClients, setFetchedClients] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedClientId, setSelectedClientId] = useState(props.clientId || '');

    const { handleSubmit, control } = useForm<{ clientName: string }>({
        defaultValues: { clientName: '' }
    });

    const watchSearchInput = useWatch({ control, name: 'clientName' });

    useEffect(() => {
        setLoading(true);
        // mocking fake data fetch
        setTimeout(() => {
            const fetchClients = ['client 1', 'client 2', 'client 3'];
            setFetchedClients(fetchClients);
            setLoading(false);
        }, 500);
    }, [watchSearchInput]);

    const selectClient = useCallback((clientId: string) => {
        setSelectedClientId(clientId);
        props.saveAndHide(clientId);
    }, []);

    return (
        <Portal>
            <Modal
                visible={visible}
                onDismiss={hide}
                contentContainerStyle={[styles.container, { backgroundColor: Colors[theme].tint }]}
            >
                <TextInput
                    name='clientName'
                    control={control}
                    placeholder={t('common.search')}
                    bgColor={Colors[theme].bright}
                    leftIcon={() => (
                        <Feather name='search' color={Colors[theme].muted} size={16} style={{ marginRight: 8 }} />
                    )}
                />

                {loading ? (
                    <ActivityIndicator animating={loading} color={Colors[theme].active} size='large' />
                ) : (
                    <DataTable>
                        {fetchedClients.map(client => (
                            <DataTable.Row
                                onPress={() => selectClient(client)}
                                key={(client + Math.random()).toString()}
                            >
                                <TableText label={client} />
                                {selectedClientId === client && (
                                    <DataTable.Cell style={{ flex: 0 }}>
                                        <Feather name='check' color={Colors[theme].active} size={16} />
                                    </DataTable.Cell>
                                )}
                            </DataTable.Row>
                        ))}
                    </DataTable>
                )}
            </Modal>
        </Portal>
    )
}

const styles = StyleSheet.create({
    container: {
        padding: 16,
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