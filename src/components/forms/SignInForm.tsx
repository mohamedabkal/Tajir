import React, { useMemo, } from 'react'
import { View, StyleSheet, Text, } from 'react-native';

import * as yup from 'yup';
import { useTranslation } from 'react-i18next';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';

import TextInput from '../Inputs/TextInput';
import Button from '../buttons/Button';
import Colors from '../../constants/Colors';
import { en } from '../../assets/Typography';
import useColorScheme from '../../hooks/useColorScheme';
import { ProgressBar } from 'react-native-paper';


type FormValues = {
    phoneNumber: string;
}

type Props = {
    loading: boolean;
    sendCode: (phoneNumber: FormValues) => Promise<void>;
}


const schema = yup.object().shape({
    phoneNumber: yup
        .string()
        .test({
            name: 'len',
            test: (value) => value?.toString().length === 10,
        })
        .required(),
});


const defaultValues: FormValues = {
    phoneNumber: '',
}


export default function AuthForm(props: Props) {
    const { loading, sendCode } = props;

    const theme = useColorScheme();
    const { t } = useTranslation();

    const { handleSubmit, control } = useForm({
        resolver: yupResolver(schema),
        defaultValues: useMemo(() => {
            return defaultValues;
        }, [])
    });

    return (
        <View style={[styles.container, { backgroundColor: Colors[theme].tint }]}>

            {/* title */}
            <Text style={{ ...styles.title, color: Colors[theme].primary }}>
                {t('onBoarding.welcome')}
            </Text>

            {/* slogan */}
            <Text style={{ ...en.h3, marginBottom: 24, color: Colors[theme].secondary }}>
                {t('onBoarding.slogan')}
            </Text>

            <ProgressBar
                visible={loading}
                progress={0.5}
                color={Colors[theme].accent}
                style={{ position: 'absolute', top: -16 }}
                indeterminate={true}
            />

            <TextInput
                name='phoneNumber'
                control={control}
                placeholder='0612345678'
                keyboardType='numeric'
                bgColor={Colors[theme].bright}
                leftIcon={() => <Text style={{ color: Colors[theme].muted }}>+212  </Text>}
            />
            <Button
                title={t('onBoarding.start')}
                onPress={handleSubmit(sendCode)}
                containerStyle={{ marginTop: 24 }}
                titleStyle={{ fontSize: 16 }}
            />

        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 16,
        paddingTop: 24,
        borderTopRightRadius: 16,
        borderTopLeftRadius: 16,
        marginTop: -16,
    },
    title: {
        ...en.h1,
        fontWeight: 'bold',
    },
})
