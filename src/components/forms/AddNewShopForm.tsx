import React, { useCallback, useEffect, } from 'react'
import { BackHandler, ScrollView, StyleSheet, Text, ViewStyle } from 'react-native';

import { useTranslation } from 'react-i18next';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

import TextInput from '../Inputs/TextInput';
import Button from '../buttons/Button';
import Colors from '../../constants/Colors';
import { en } from '../../assets/Typography';
import useColorScheme from '../../hooks/useColorScheme';
import { Controller, useForm } from 'react-hook-form';
import { Picker } from '@react-native-picker/picker';
import PickerComp from '../Inputs/PickerComp';
import { IconButton } from 'react-native-paper';


type FormData = {
    name: string;
    mode: 'pro' | 'normal',
}

type Props = {
    loading: boolean;
    submit: (data: FormData) => void;
    goBack: () => void;
}

const schema = yup.object().shape({
    name: yup.string().required(),
    mode: yup.string()
});

const defaultValues = {
    name: '',
    mode: 'normal',
}


export default function AddNewShopForm(props: Props) {
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

    const customSetValue = useCallback((fieldName: any, newValue: any) => {
        newValue !== getValues(fieldName) ? setValue(fieldName, newValue) : null;
    }, []);

    const onChangeMode = (value: string) => value !== '0' ? customSetValue('mode', value) : null;


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
                {t('myShops.add.title')}
            </Text>

            {/* name */}
            <TextInput
                name='name'
                control={control}
                label={t('myShops.add.name')}
                placeholder=''
                bgColor={Colors[theme].bright}
            />

            {/* mode */}
            <Text style={{ ...styles.label, color: Colors[theme].secondary }}>
                {t('myShops.add.mode')}
            </Text>

            <Controller
                name='mode'
                control={control}
                render={({ field: { value }, fieldState }) => {
                    const pickerStyle: ViewStyle = { borderWidth: 1, borderColor: fieldState.invalid ? Colors[theme].error : Colors[theme].shade };
                    return (
                        <PickerComp
                            value={value}
                            onChange={onChangeMode}
                            containerStyle={pickerStyle}>
                            <Picker.Item
                                style={{ ...en.h5, color: Colors[theme].primary }}
                                label={t('myShops.add.normal')}
                                value='normal'
                            />
                            <Picker.Item
                                style={{ ...en.h5, color: Colors[theme].primary }}
                                label={t('myShops.add.pro')}
                                value='pro'
                            />
                        </PickerComp>
                    )
                }}
            />

            <Button
                title={t('myShops.add.btn')}
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
    label: {
        fontSize: 14,
        fontWeight: '500',
        marginBottom: 8,
    },
})
