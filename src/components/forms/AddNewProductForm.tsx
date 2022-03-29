import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { BackHandler, I18nManager, ScrollView, StyleSheet, Text, View, ViewStyle } from 'react-native';

import * as yup from 'yup';
import { useTranslation } from 'react-i18next';
import { yupResolver } from '@hookform/resolvers/yup';
import { Controller, useForm } from 'react-hook-form';

import TextInput from '../Inputs/TextInput';
import Button from '../buttons/Button';
import Colors from '../../constants/Colors';
import { en } from '../../assets/Typography';
import useColorScheme from '../../hooks/useColorScheme';
import CheckBox from '../buttons/CheckBox';
import Ticker from '../Inputs/Ticker';
import InvoicesModal from '../modals/InvoicesModal';
import { IconButton } from 'react-native-paper';


type FormValues = {
    productName: string;
    buyingPrice: number;
    qty: number;
    invoiceID: string;
    paid: boolean;
}

type Props = {
    loading: boolean;
    goBack: () => void;
    submit: (data: FormValues) => void;
}


const schema = yup.object().shape({
    productName: yup
        .string()
        .required(),
    buyingPrice: yup
        .number()
        .min(1)
        .required(),
    qty: yup
        .number(),
    paid: yup
        .boolean(),
    invoiceID: yup
        .string()
        .required(),
});


const defaultValues: FormValues = {
    productName: '',
    buyingPrice: 0,
    qty: 1,
    paid: false,
    invoiceID: '',
}


export default function AddNewProductForm(props: Props) {
    const { loading, goBack, submit } = props;

    const [invoicesModalVisibe, setInvoicesModalVisible] = useState<boolean>(false)

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

    const { handleSubmit, control, setValue, getValues } = useForm({
        resolver: yupResolver(schema),
        defaultValues: useMemo(() => {
            return defaultValues;
        }, [])
    });

    const showInvoicesModal = useCallback(() => setInvoicesModalVisible(true), [setInvoicesModalVisible]);

    const customSetValue = useCallback((fieldName: any, newValue: any) => {
        newValue !== getValues(fieldName) ? setValue(fieldName, newValue) : null;
    }, []);

    const saveInvoiceID = useCallback((invoiceID: string) => {
        setValue('invoiceID', invoiceID);
        setInvoicesModalVisible(false);
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
                {t('inventory.add.title')}
            </Text>

            {/* product name */}
            <TextInput
                name='productName'
                defaultValue='Product'
                control={control}
                label={t('sales.modal.product_label')}
                placeholder={t('sales.modal.product')}
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

            <Ticker label={t('inventory.add.qty')} onChange={(qty: number) => customSetValue('qty', qty)} />

            <Controller
                name='paid'
                control={control}
                render={({ field: { value } }) => (
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
                )}
            />

            <Controller
                control={control}
                name='invoiceID'
                render={({ field: { value }, fieldState }) => {
                    const btnStyle: ViewStyle = { borderWidth: 1, borderColor: fieldState.invalid ? Colors[theme].error : Colors[theme].shade };
                    return (
                        <>
                            <Button
                                title={value || t('inventory.add.pick_invoice')}
                                containerStyle={{ ...btnStyle, backgroundColor: Colors[theme].bright }}
                                titleColor={Colors[theme].secondary}
                                onPress={showInvoicesModal}
                            />
                            <InvoicesModal
                                visible={invoicesModalVisibe}
                                hide={() => setInvoicesModalVisible(false)}
                                saveAndHide={saveInvoiceID}
                                invoiceID={value}
                            />
                        </>
                    )
                }}
            />

            <Button
                title={t('inventory.add.add_product')}
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
        paddingTop: 16,
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
        paddingLeft: 8,
        overflow: 'hidden'
    },
    label: {
        fontSize: 14,
        fontWeight: '500',
        marginBottom: 8,
    },
    pickerItem: {
        fontSize: 14,
        fontWeight: '400'
    }
})
