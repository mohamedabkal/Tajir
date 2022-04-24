import React, { useCallback, useEffect, } from 'react'
import { BackHandler, ScrollView, StyleSheet, Text, View, ViewStyle } from 'react-native';

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
import { Store } from '../../types';
import GoBackIcon from '../buttons/GoBackIcon';


type FormData = {
    productName: string;
    sellingPrice: number;
    buyingPrice?: number;
    paid: boolean;
    clientId: string;
}

type Props = {
    loading?: boolean;
    submit: (data: FormData) => void;
    goBack: () => void;
    showNext: () => void;
    currentStore: Store;
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
    const { loading, goBack, submit, currentStore, showNext } = props;
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

    const pickProduct = (value: string) => value !== '0' ? customSetValue('productName', value) : null;

    const customSetValue = useCallback((fieldName: any, newValue: any) => {
        newValue !== getValues(fieldName) ? setValue(fieldName, newValue) : null;
    }, []);


    return (
        <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.container}>

            <GoBackIcon goBack={goBack} />

            {/* title */}
            <Text style={{ ...styles.title, color: Colors[theme].primary }}>
                {t('sales.add.title')}
            </Text>

            {/* //??? if mode is pro show product picker */}
            {currentStore.type === 'pro' ? (
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
                                    label={t('sales.add.pick_product')}
                                    value='0'
                                />
                                {/* TODO: show products */}
                            </PickerComp>
                        )
                    }}
                />
            ) : (
                <TextInput
                    name='productName'
                    control={control}
                    label={t('sales.add.product_label')}
                    placeholder={t('sales.add.product')}
                    bgColor={Colors[theme].bright}
                />
            )}


            {/* Selling price */}
            <TextInput
                name='sellingPrice'
                defaultValue='0'
                control={control}
                label={t('sales.add.selling_label')}
                placeholder={t('sales.add.price')}
                priceInput
                bgColor={Colors[theme].bright}
            />

            {/* Buying price */}
            {currentStore.type === 'normal' && (
                <TextInput
                    name='buyingPrice'
                    defaultValue='0'
                    control={control}
                    label={t('sales.add.buying_label')}
                    placeholder={t('sales.add.price')}
                    priceInput
                    bgColor={Colors[theme].bright}
                />
            )}

            <Controller
                name='paid'
                control={control}
                render={({ field: { value }, fieldState }) => {
                    const isPaid = value;
                    return (
                        <>
                            <View style={styles.paid}>
                                <CheckBox
                                    label={t('sales.add.paid')}
                                    color={value ? Colors[theme].success : Colors[theme].secondary}
                                    checked={value}
                                    onPress={() => customSetValue('paid', true)}
                                />
                                <CheckBox
                                    label={t('sales.add.not_paid')}
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
                                        <View style={styles.clientContainer}>
                                            <Text style={[styles.label, { color: Colors[theme].secondary }]}>
                                                {t('sales.add.pick_client')}
                                            </Text>
                                            {value ? (
                                                <Text style={[styles.label, { color: Colors[theme].accent }]}>
                                                    {value}
                                                </Text>
                                            ) : (
                                                <Button
                                                    title={t('sales.add.pick_client')}
                                                    containerStyle={{ backgroundColor: Colors[theme].subAccent }}
                                                    titleStyle={{ color: Colors[theme].accent }}
                                                    onPress={showNext}
                                                />
                                            )}
                                        </View>
                                    )}
                                />
                            )}
                        </>
                    )
                }}
            />

            <Button
                title={t('sales.add.btn')}
                onPress={handleSubmit(submit)}
                containerStyle={{ marginTop: 40 }}
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
    clientContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    label: {
        fontSize: 14,
        fontWeight: '500',
    },
})
