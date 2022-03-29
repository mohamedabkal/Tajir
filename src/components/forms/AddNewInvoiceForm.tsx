import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { BackHandler, ScrollView, StyleSheet, Text, View, ViewStyle } from 'react-native';

import * as yup from 'yup';
import { useTranslation } from 'react-i18next';
import { yupResolver } from '@hookform/resolvers/yup';
import { Controller, useForm } from 'react-hook-form';
import DateTimePicker from '@react-native-community/datetimepicker';

import TextInput from '../Inputs/TextInput';
import Button from '../buttons/Button';
import Colors from '../../constants/Colors';
import { en } from '../../assets/Typography';
import useColorScheme from '../../hooks/useColorScheme';
import CheckBox from '../buttons/CheckBox';
import { IconButton } from 'react-native-paper';


type FormValues = {
    supplier: string;
    invoiceNumber: number;
    date: Date;
    total: number;
    paid: boolean;
    products: any[];
}

type Props = {
    loading: boolean;
    goBack: () => void;
    submit: (data: FormValues) => void;
    showProductForm: () => void;
}


const schema = yup.object().shape({
    supplier: yup
        .string()
        .required(),
    invoiceNumber: yup
        .number()
        .min(1)
        .required(),
    date: yup
        .date(),
    total: yup
        .number()
        .min(1)
        .required(),
    paid: yup
        .boolean(),
    products: yup
        .array()
});


const defaultValues: FormValues = {
    supplier: '',
    invoiceNumber: 1,
    date: new Date(),
    total: 0,
    paid: true,
    products: [],
}


export default function AddNewInvoiceForm(props: Props) {
    const { loading, goBack, submit, showProductForm } = props;

    const [datePickerVisibel, setDatePickerVisibel] = useState<boolean>(false);

    const theme = useColorScheme();
    const { t } = useTranslation();
    const { handleSubmit, control, setValue, getValues } = useForm({
        resolver: yupResolver(schema),
        defaultValues: useMemo(() => {
            return defaultValues;
        }, [])
    });

    // 🔙 Back button handler (android)
    useEffect(() => {
        const backAction = () => {
            goBack();
            return true;
        };
        const backHandler = BackHandler.addEventListener("hardwareBackPress", backAction);
        return () => backHandler.remove();
    }, []);


    const customSetValue = useCallback((fieldName: any, newValue: any) => {
        newValue !== getValues(fieldName) ? setValue(fieldName, newValue) : null;
    }, []);

    const showDatePicker = useCallback((value = true) => setDatePickerVisibel(value), []);

    const onDateChange = (event: any, selectedDate: Date | undefined) => {
        const currentDate = selectedDate;
        showDatePicker(false);
        customSetValue('date', currentDate);
    };


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
                {t('invoices.add.title')}
            </Text>

            {/* Invoice Number */}
            <TextInput
                name='invoiceNumber'
                control={control}
                label={t('invoices.add.invoice_number')}
                placeholder='1'
                bgColor={Colors[theme].bright}
            />

            {/* Date */}
            <Controller
                control={control}
                name='date'
                render={({ field: { value } }) => (
                    <>
                        <TextInput
                            name='date'
                            value={value.toDateString()}
                            control={control}
                            label={t('invoices.add.date')}
                            placeholder={t('invoices.add.date_format')}
                            bgColor={Colors[theme].bright}
                            showRightBtn
                            rightBtnLabel={t('invoices.add.select_date')}
                            editable={false}
                            handleRightBtn={showDatePicker}
                        />
                        {datePickerVisibel &&
                            <DateTimePicker
                                value={value}
                                mode='date'
                                is24Hour={true}
                                onChange={onDateChange}
                                display='spinner'
                            />
                        }
                    </>
                )}
            />

            {/* Total Amount */}
            <TextInput
                name='total'
                control={control}
                label={t('invoices.add.total')}
                placeholder='0'
                priceInput
                bgColor={Colors[theme].bright}
            />

            {/* Paid / Not Paid */}
            <Controller
                name='paid'
                control={control}
                render={({ field: { value } }) => (
                    <View style={styles.paid}>
                        <CheckBox
                            label={t('common.paid')}
                            color={value ? Colors[theme].success : Colors[theme].secondary}
                            checked={value}
                            onPress={() => customSetValue('paid', true)}
                        />
                        <CheckBox
                            label={t('common.not_paid')}
                            color={value ? Colors[theme].secondary : Colors[theme].error}
                            checked={!value}
                            onPress={() => customSetValue('paid', false)}
                        />
                    </View>
                )}
            />

            {/* // !!!!! show this only if mode is pro */}
            {/* TODO: finish this (is this field mandatory when creating new invoice?) */}
            <Controller
                control={control}
                name='products'
                render={({ field: { value }, fieldState }) => {
                    const btnStyle: ViewStyle = { borderWidth: 1, borderColor: fieldState.invalid ? Colors[theme].error : Colors[theme].shade };
                    return (
                        <>
                            <Button
                                title={t('invoices.add.add_product')}
                                containerStyle={{ ...btnStyle, backgroundColor: Colors[theme].bright }}
                                titleColor={Colors[theme].secondary}
                                onPress={showProductForm}
                            />
                            {/* <InvoicesModal
                                visible={invoicesModalVisibe}
                                hide={() => setInvoicesModalVisible(false)}
                                saveAndHide={saveInvoiceID}
                                invoiceID={value}
                            /> */}
                        </>
                    )
                }}
            />

            <Button
                title={t('invoices.add.add_invoice')}
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
    label: {
        fontSize: 14,
        fontWeight: '500',
        marginBottom: 8,
    },
    dateContainer: {
        borderWidth: 1,
        borderRadius: 10,
        height: 50,
        overflow: 'hidden',
        padding: 8,
        alignItems: 'flex-end',
        marginBottom: 16,
    },
    dateInput: {
        borderRadius: 5,
        height: 34,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 8,
        minWidth: 80,
    },
    date: {
        ...en.h5,
    }
})
