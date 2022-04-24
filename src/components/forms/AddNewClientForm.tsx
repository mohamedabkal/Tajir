import React, { useEffect, useMemo, } from 'react'
import { BackHandler, ScrollView, StyleSheet, Text, } from 'react-native';

import * as yup from 'yup';
import { useTranslation } from 'react-i18next';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';

import TextInput from '../Inputs/TextInput';
import Button from '../buttons/Button';
import Colors from '../../constants/Colors';
import { en } from '../../assets/Typography';
import useColorScheme from '../../hooks/useColorScheme';
import { IconButton } from 'react-native-paper';
import GoBackIcon from '../buttons/GoBackIcon';


type FormValues = {
    name: string;
    phoneNumber: string;
}

type Props = {
    loading?: boolean;
    goBack: () => void;
    submit: (data: FormValues) => void;
    isSupplierForm?: boolean;
    hideBackButton?: boolean;
}


const schema = yup.object().shape({
    name: yup
        .string()
        .required(),
    phoneNumber: yup
        .number()
        // .test({
        //     name: 'len',
        //     test: (value) => value?.toString().length === 10,
        // })
        .required(),
});


const defaultValues: FormValues = {
    name: '',
    phoneNumber: '',
}


export default function AddNewClientForm(props: Props) {
    const { loading, goBack, submit, isSupplierForm } = props;

    const theme = useColorScheme();
    const { t } = useTranslation();
    const { handleSubmit, control, watch } = useForm({
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


    return (
        <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.container}>

            {!props.hideBackButton && (
                <GoBackIcon goBack={goBack} />
            )}

            {/* title */}
            <Text style={{ ...styles.title, color: Colors[theme].primary }}>
                {isSupplierForm ? t('suppliers.add.title') : t('clients.add.title')}
            </Text>

            {/* Name */}
            <TextInput
                name='name'
                control={control}
                label={t('clients.add.name')}
                // placeholder='1'
                bgColor={Colors[theme].bright}
            />

            {/* Phone Number */}
            <TextInput
                name='total'
                control={control}
                label={t('clients.add.phone_number')}
                // placeholder='0'
                bgColor={Colors[theme].bright}
                keyboardType='number-pad'
            />

            <Button
                title={isSupplierForm ? t('suppliers.add.add_supplier') : t('clients.add.add_client')}
                onPress={handleSubmit(data => console.log(data))}
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
