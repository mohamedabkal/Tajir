import React, { useCallback, useState, useEffect } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, } from 'react-native';

import { useTranslation } from 'react-i18next';

import { en } from '../../assets/Typography';
import Colors from '../../constants/Colors';
import useColorScheme from '../../hooks/useColorScheme';
import { TableText } from '../data/TableRow';
import { useForm, useWatch } from 'react-hook-form';
import Feather from 'react-native-vector-icons/Feather';
import TextInput from '../Inputs/TextInput';
import { DataTable, Modal, Portal } from 'react-native-paper';


type Props = {
    visible: boolean;
    hide: () => void;
    saveAndHide: (invoiceID: string) => void;
    invoiceID?: string;
}

export default function InvoicesModal(props: Props) {
    const { visible, hide, saveAndHide } = props;

    const [fetchInvoices, setFetchInvoices] = useState<string[]>([]);
    const [selectedInvoiceID, setSelectedInvoiceID] = useState<string>((''));
    const [loading, setLoading] = useState<boolean>(false);

    const theme = useColorScheme();
    const { t } = useTranslation();

    const { handleSubmit, control } = useForm<{ invoiceId: string }>({
        defaultValues: { invoiceId: '' }
    });

    const watchSearchInput = useWatch({ control, name: 'invoiceId' });

    useEffect(() => {
        setLoading(true);
        // mocking fake data fetch
        const fakeInvoices = ['Invoice 1', 'Invoice 2', 'Invoice 3'];
        const mockFetchData = setTimeout(() => {
            setFetchInvoices(fakeInvoices);
            setLoading(false);
        }, 500);
        return () => clearTimeout(mockFetchData);
    }, [watchSearchInput, visible]);


    const selectClient = useCallback((clientId: string) => {
        setSelectedInvoiceID(clientId);
        saveAndHide(clientId);
    }, []);


    const renderInvoice = ({ item }: { item: string }) => {
        return (
            <DataTable.Row onPress={() => selectClient(item)}>
                <TableText label={item} />
                {selectedInvoiceID === item && (
                    <DataTable.Cell style={{ flex: 0 }}>
                        <Feather name='check' color={Colors[theme].active} size={16} />
                    </DataTable.Cell>
                )}
            </DataTable.Row>
        )
    }


    return (
        <Portal>
            <Modal
                visible={visible}
                onDismiss={hide}
                contentContainerStyle={[styles.container, { backgroundColor: Colors[theme].tint }]}
            >

                {/* Search Input */}
                <TextInput
                    name='invoiceId'
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
                    <FlatList
                        data={fetchInvoices}
                        renderItem={renderInvoice}
                        keyExtractor={(item, index) => item + index}
                        showsVerticalScrollIndicator={false}
                    />
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
    contentContainer: {
        flex: 1,
    },
    title: {
        ...en.h2,
        marginBottom: 24,
        marginHorizontal: 16
    },
    row: {
        flexDirection: 'row',
        overflow: 'hidden',
        borderTopWidth: 1,
    },
    paid: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    totalContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        marginTop: 8
    },
    footer: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderTopWidth: 1,
        paddingBottom: 16,
    }
})