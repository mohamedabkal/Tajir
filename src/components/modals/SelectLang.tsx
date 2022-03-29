import { ActivityIndicator, StyleSheet, } from 'react-native'
import React, { useState } from 'react';

import { DataTable, Modal, Portal, } from 'react-native-paper';
import Feather from 'react-native-vector-icons/Feather';
import { useTranslation } from 'react-i18next';

import Colors from '../../constants/Colors';
import useColorScheme from '../../hooks/useColorScheme';
import { en } from '../../assets/Typography';
import Button from '../buttons/Button';
import { TableText } from '../data/TableRow';


type Props = {
    visible: boolean;
    hide: () => void;
};


const LANGUAGES = [{ lang: 'العربية', code: 'ar' }, { lang: 'Français', code: 'fr' }];


export default function SelectLang(props: Props) {
    const { visible, hide } = props;

    const theme = useColorScheme();
    const { t } = useTranslation();

    const [loading, setLoading] = useState(false);
    const [selectedLang, setSelectedLang] = useState<string>('ar');

    const saveLang = () => null;


    return (
        <Portal>
            <Modal
                visible={visible}
                onDismiss={hide}
                contentContainerStyle={[styles.container, { backgroundColor: Colors[theme].tint }]}
            >
                {loading ? (
                    <ActivityIndicator animating={loading} color={Colors[theme].active} size='large' />
                ) : (
                    <DataTable>
                        {LANGUAGES.map(item => (
                            <DataTable.Row
                                onPress={() => setSelectedLang(item.code)}
                                key={item.code}
                            >
                                <TableText label={item.lang} />
                                {selectedLang === item.code && (
                                    <DataTable.Cell style={{ flex: 0 }}>
                                        <Feather name='check' color={Colors[theme].active} size={16} />
                                    </DataTable.Cell>
                                )}
                            </DataTable.Row>
                        ))}
                    </DataTable>
                )}

                <Button
                    title={t('common.save_changes')}
                    onPress={saveLang}
                    containerStyle={{ marginTop: 32 }}
                    loading={loading}
                />
            </Modal>
        </Portal>
    )
}

const styles = StyleSheet.create({
    container: {
        padding: 16,
        margin: 24,
        borderRadius: 8,
        minHeight: 220,
        justifyContent: 'space-between'
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