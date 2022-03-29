import React, { useEffect, useMemo, useState, } from 'react'
import { Text, View, StyleSheet } from 'react-native';

import * as yup from 'yup';
import { useTranslation } from 'react-i18next';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import { ProgressBar } from 'react-native-paper';

import TextInput from '../Inputs/TextInput';
import Button from '../buttons/Button';
import Colors from '../../constants/Colors';
import useColorScheme from '../../hooks/useColorScheme';
import { en } from '../../assets/Typography';


type Props = {
    loading: boolean;
    confirmCode: (value: { confirmationCode: string }) => Promise<void>;
    isVisible: boolean;
    resendCode: () => void;
}


const confirmationSchema = yup.object().shape({
    confirmationCode: yup
        .string()
        .required()
})

const confirmationDefaultValues = {
    confirmationCode: '',
};


export default function CodeConfirmationFrom(props: Props) {
    const { loading, confirmCode, resendCode } = props;

    const [timerCount, setTimer] = useState(60);

    useEffect(() => {
        let interval = setInterval(() => {
            setTimer(lastTimerCount => {
                lastTimerCount <= 1 && clearInterval(interval)
                return lastTimerCount - 1
            })
        }, 1000) //each count lasts for a second
        //cleanup the interval on complete
        return () => clearInterval(interval)
    }, []);

    const theme = useColorScheme();
    const { t } = useTranslation();

    const { handleSubmit, control, } = useForm({
        resolver: yupResolver(confirmationSchema),
        defaultValues: useMemo(() => {
            return confirmationDefaultValues;
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

            {/* Name */}
            < TextInput
                name='confirmationCode'
                control={control}
                placeholder={t('onBoarding.confirmation_code')}
                bgColor={Colors[theme].bright}
                keyboardType='numeric'
                autoFocus={true}
            />

            <Button
                title={t('onBoarding.confirm')}
                onPress={handleSubmit(confirmCode)}
                containerStyle={{ marginTop: 24 }}
                titleStyle={{ fontSize: 16 }}
            />

            <Button
                title={timerCount > 0 ? `Resend in ${timerCount}` : t('onBoarding.confirm')}
                onPress={resendCode}
                containerStyle={{ marginHorizontal: 16, backgroundColor: Colors[theme].tint }}
                titleStyle={{ color: Colors[theme].accent }}
                disabled={timerCount > 0}
            />

        </View>
    )
};

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
