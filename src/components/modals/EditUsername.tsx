import { StyleSheet, } from 'react-native'
import React, { useCallback, useState } from 'react';

import { Modal, Portal, } from 'react-native-paper';
import Colors from '../../constants/Colors';
import useColorScheme from '../../hooks/useColorScheme';
import { en } from '../../assets/Typography';
import TextInput from '../Inputs/TextInput';
import { useForm, useWatch } from 'react-hook-form';
import Feather from 'react-native-vector-icons/Feather';
import { useTranslation } from 'react-i18next';
import Button from '../buttons/Button';

type Props = {
    visible: boolean;
    hide: () => void;
}


export default function EditUsername(props: Props) {
    const { visible, hide } = props;

    const theme = useColorScheme();
    const { t } = useTranslation();

    const [loading, setLoading] = useState(false);

    const { handleSubmit, control } = useForm<{ username: string }>({
        defaultValues: { username: '' }
    });

    const saveUsername = () => null;


    return (
        <Portal>
            <Modal
                visible={visible}
                onDismiss={hide}
                contentContainerStyle={[styles.container, { backgroundColor: Colors[theme].tint }]}
            >
                <TextInput
                    name='username'
                    label={t('settings.username')}
                    control={control}
                    // placeholder={t('common.search')}
                    bgColor={Colors[theme].bright}
                />

                <Button
                    title={t('common.save_changes')}
                    onPress={handleSubmit(saveUsername)}
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