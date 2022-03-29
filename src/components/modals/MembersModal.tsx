import { ActivityIndicator, FlatList, Image, StyleSheet, ViewStyle, } from 'react-native'
import React, { useCallback, useState } from 'react';

import { DataTable, Modal, Portal, } from 'react-native-paper';
import Svg, { G, Path } from "react-native-svg"
import { useForm, useWatch } from 'react-hook-form';
import Feather from 'react-native-vector-icons/Feather';
import { useTranslation } from 'react-i18next';

import Colors from '../../constants/Colors';
import useColorScheme from '../../hooks/useColorScheme';
import { en } from '../../assets/Typography';
import TextInput from '../Inputs/TextInput';
import Button from '../buttons/Button';
import { TableText } from '../data/TableRow';
import AssetsManager from '../../assets/AssetsManager';


type Props = {
    visible: boolean;
    hide: () => void;
};


const MEMBERS = [
    {
        id: '1',
        name: 'Ali',
        role: 'owner'
    },
    {
        id: '2',
        name: 'Ahmed',
        role: 'manager'
    },
];


export default function MembersModal(props: Props) {
    const { visible, hide } = props;

    const theme = useColorScheme();
    const { t } = useTranslation();

    const [loading, setLoading] = useState(false);
    const [selectedLang, setSelectedLang] = useState<string>('ar');

    const { handleSubmit, control } = useForm<{ username: string }>({
        defaultValues: { username: '' }
    });

    const saveUsername = () => null;

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
            <DataTable.Header style={tableHeaderBg}>
                <TableText header label='Name' />
                <TableText header label='Role' />
            </DataTable.Header>
        )
    }

    const renderMember = ({ item }) => {
        return (
            <DataTable.Row style={tableRowBg}>
                <TableText label={item.name} />
                <TableText label={item.role} />
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
                {loading ? (
                    <ActivityIndicator animating={loading} color={Colors[theme].active} size='large' />
                ) : (
                    <DataTable>
                        <FlatList
                            data={MEMBERS}
                            renderItem={renderMember}
                            keyExtractor={(item) => item.id}
                            ListHeaderComponent={header}
                            showsVerticalScrollIndicator={false}
                        />
                    </DataTable>
                )}

                {/* <Button
                    title={t('common.save_changes')}
                    onPress={handleSubmit(saveUsername)}
                    containerStyle={{ marginTop: 32 }}
                    loading={loading}
                /> */}
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