import React, { useCallback, useEffect, useState } from 'react'
import { BackHandler, I18nManager, ScrollView, StyleSheet, Text, View, ViewStyle } from 'react-native';

import { useTranslation } from 'react-i18next';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

import TextInput from '../Inputs/TextInput';
import Button from '../buttons/Button';
import Colors from '../../constants/Colors';
import { en } from '../../assets/Typography';
import useColorScheme from '../../hooks/useColorScheme';
import CheckBox from '../buttons/CheckBox';
import { Controller, useForm } from 'react-hook-form';
import { Picker } from '@react-native-picker/picker';
import PickerComp from '../Inputs/PickerComp';
import ClientsModal from '../modals/ClientsModal';
import { IconButton } from 'react-native-paper';


type FormData = {
    productName: string;
    sellingPrice: number;
    buyingPrice: number;
    paid: boolean;
    clientId: string;
}

type Props = {
    loading: boolean;
    submit: (data: FormData) => void;
    goBack: () => void;
}

const schema = yup.object().shape({
    productName: yup.string().required(),
    sellingPrice: yup.number().required().min(1),
    buyingPrice: yup.number().required().min(1),
    paid: yup.boolean(),
    clientId: yup.string()
});

const defaultValues = {
    productName: '',
    sellingPrice: 0,
    buyingPrice: 0,
    paid: false,
    clientId: '',
}


export default function AddNewSaleForm(props: Props) {
    const [clientsModalVisible, setClientsModalVisible] = useState<boolean>(false);

    const { loading, goBack } = props;
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

    const { handleSubmit, control, setValue, getValues } = useForm<FormData>({
        resolver: yupResolver(schema),
        defaultValues: React.useMemo(() => {
            return defaultValues;
        }, [])
    });

    const submit = (data: FormData) => console.log(data);

    const showClientsModal = useCallback(() => setClientsModalVisible(true), [setClientsModalVisible]);

    const customSetValue = useCallback((fieldName: any, newValue: any) => {
        newValue !== getValues(fieldName) ? setValue(fieldName, newValue) : null;
    }, []);

    const pickProduct = (value: string) => value !== '0' ? customSetValue('productName', value) : null;

    const saveClientId = useCallback((client: string) => {
        setValue('clientId', client);
        setClientsModalVisible(false);
    }, []);

    return (
        <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.container}>

            <IconButton
                icon='arrow-left'
                color={Colors[theme].primary}
                size={20}
                onPress={goBack}
                style={{ marginBottom: 16 }}
            />

            {/* title */}
            <Text style={{ ...styles.title, color: Colors[theme].primary }}>
                {t('sales.modal.title')}
            </Text>

            {/* //??? if mode is pro show product picker */}
            <Controller
                name='productName'
                control={control}
                render={({ field: { value }, fieldState }) => {
                    const pickerStyle: ViewStyle = { borderWidth: 1, borderColor: fieldState.invalid ? Colors[theme].error : Colors[theme].shade };
                    return (
                        <PickerComp
                            value={value}
                            onChange={pickProduct}
                            containerStyle={pickerStyle}>
                            <Picker.Item
                                style={{ ...en.h5, color: Colors[theme].primary }}
                                label={t('sales.modal.pick_product')}
                                value='0'
                            />
                            {/* TODO: show products */}
                        </PickerComp>
                    )
                }}
            />

            {/* //!!!! if mode is normal show this */}
            {/* product name */}
            <TextInput
                name='productName'
                defaultValue='Product'
                control={control}
                label={t('sales.modal.product_label')}
                placeholder={t('sales.modal.product')}
                bgColor={Colors[theme].bright}
            />

            {/* Selling price */}
            <TextInput
                name='sellingPrice'
                defaultValue='0'
                control={control}
                label={t('sales.modal.selling_label')}
                placeholder={t('sales.modal.price')}
                priceInput
                bgColor={Colors[theme].bright}
            />

            {/* Buying price */}
            <TextInput
                name='buyingPrice'
                defaultValue='0'
                control={control}
                label={t('sales.modal.buying_label')}
                placeholder={t('sales.modal.price')}
                priceInput
                bgColor={Colors[theme].bright}
            />

            <Controller
                name='paid'
                control={control}
                render={({ field: { value }, fieldState }) => {
                    const btnStyle: ViewStyle = { borderWidth: 1, borderColor: fieldState.invalid ? Colors[theme].error : Colors[theme].shade };
                    const isPaid = value;
                    return (
                        <>
                            <View style={styles.paid}>
                                <CheckBox
                                    label={t('sales.modal.paid')}
                                    color={value ? Colors[theme].success : Colors[theme].secondary}
                                    checked={value}
                                    onPress={() => customSetValue('paid', true)}
                                />
                                <CheckBox
                                    label={t('sales.modal.not_paid')}
                                    color={value ? Colors[theme].secondary : Colors[theme].error}
                                    checked={!value}
                                    onPress={() => customSetValue('paid', false)}
                                />
                            </View>

                            {/* if sale is not paid we need to save it by selecting client */}
                            {!isPaid && (
                                <Controller
                                    control={control}
                                    name='clientId'
                                    render={({ field: { value } }) => (
                                        <>
                                            <Button
                                                title={value || t('sales.modal.pick_client')}
                                                containerStyle={{ ...btnStyle, backgroundColor: Colors[theme].bright }}
                                                titleColor={Colors[theme].secondary}
                                                onPress={showClientsModal}
                                            />
                                            <ClientsModal
                                                visible={clientsModalVisible}
                                                hide={() => setClientsModalVisible(false)}
                                                saveAndHide={saveClientId}
                                                clientId={value}
                                            />
                                        </>
                                    )}
                                />
                            )}
                        </>
                    )
                }}
            />

            <Button
                title={t('sales.modal.btn')}
                onPress={handleSubmit(submit)}
                containerStyle={{ marginTop: 32 }}
                loading={loading}
            />

        </ScrollView>
    )
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        padding: 24,
        paddingTop: 8,
    },
    title: {
        ...en.h2,
        marginBottom: 24,
    },
    paid: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginBottom: 16,
    },
    pickerContainer: {
        borderRadius: 8,
        height: 50,
        justifyContent: 'center',
        marginBottom: 16,
        borderWidth: 1,
    },
})
