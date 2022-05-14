import React, { useState, } from 'react';
import { SafeAreaView, StyleSheet, View, } from 'react-native';

import auth from '@react-native-firebase/auth';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import uuid from 'react-native-uuid';

import Colors from '../constants/Colors';
import useColorScheme from '../hooks/useColorScheme';
import SignupForm from '../components/forms/SignupForm';
import { addUserToDB, fetchUserData } from '../firebase/userActions';
import useStore from '../state/useStore';
import { useTranslation } from 'react-i18next';
import SignInForm from '../components/forms/SignInForm';
import Button from '../components/buttons/Button';
import Carousel from '../components/Carousel';
import CodeConfirmationFrom from '../components/forms/CodeConfirmationFrom';
import { DefaultTheme, Snackbar } from 'react-native-paper';


type AuthFormTypes = {
    firstName: string;
    lastName: string;
    phoneNumber: string;
};

const defaultFormData = {
    firstName: '',
    lastName: '',
    phoneNumber: '',
}


/**
 * 🔰 Steps to explain the auth process
 * 
 * Creating a new user:
 *  - Enter user information
 *  - Send verifcation code
 *  - Add user to database and show next step
 * 
 * Existing user
 *  - Enter phone number
 *  - Verify phone number & send verifcation code
 *  - login
 */


export default function OnBoarding({ navigation }: { navigation: NativeStackNavigationProp<any, any> }) {
    const theme = useColorScheme();
    const { t } = useTranslation();

    // zustand state
    const userData = useStore(state => state.userData);
    const updateUserData = useStore(state => state.updateUserData);
    const setIsSignedIn = useStore(state => state.setIsSignedIn);
    const authType = useStore(state => state.authType);
    const setAuthType = useStore(state => state.setAuthType);

    const [showCodeConfInput, setShowCodeConfInput] = useState<boolean>(false),
        [confirm, setConfirm] = useState<any>(null),
        [formData, setFormData] = useState<AuthFormTypes>(defaultFormData),
        [loading, setLoading] = useState<boolean>(false),
        [savePhoneNumber, setSavePhoneNumber] = useState<string>(''),
        [toastVisible, setToastVisible] = useState<boolean>(false),
        [toastMessage, setToastMessage] = useState<string>('');


    const sendVerification = async (formValues: AuthFormTypes) => {
        setLoading(true);
        try {
            const phoneNumber = formatPhoneNumber(formValues.phoneNumber);
            const confirmation = await auth().signInWithPhoneNumber(phoneNumber);
            setFormData(formValues);
            setSavePhoneNumber(phoneNumber);
            setConfirm(confirmation);
            setShowCodeConfInput(true);
            setLoading(false);
        } catch (err) {
            setToastVisible(true);
            setToastMessage(t('commn.error'));
            __DEV__ && console.error('>>>>>', err);
            setLoading(false);
        }
    };

    const formatPhoneNumber = (phoneNumber: string | number) => {
        const clean = ('' + phoneNumber?.toString())?.replace(/\D/g, '');
        const toArray = clean?.match(/^(\d{3})(\d{3})(\d{4})$/);
        const format = `+212 ${toArray[1]}-${toArray[2]}-${toArray[3]}`;
        return format;
    }

    const confirmCode = async (values: { confirmationCode: string }) => {
        setLoading(true);
        try {
            await confirm.confirm(values.confirmationCode);
            if (authType === 'signin') {
                fetchUser();
            } else {
                createUserData();
            }
            setLoading(false);
        } catch (err) {
            setToastVisible(true);
            setToastMessage(t('common.error'));
            __DEV__ && console.error('🛑', err);
            setLoading(false);
        }
    };

    const createUserData = async () => {
        const newUserData = {
            ...userData,
            id: uuid.v4().toString(),
            info: {
                firstName: formData.firstName,
                lastName: formData.lastName,
                phoneNumber: savePhoneNumber,
            },
        };
        // add user to DB
        await addUserToDB(newUserData);
        // store userData locally
        updateUserData(newUserData);
        setIsSignedIn(true);
        // show stores screens
        navigation.replace('MyShops');
    }

    const fetchUser = async () => {
        try {
            const fetchData = await fetchUserData(savePhoneNumber);
            if (fetchData) {
                const newUserData = fetchData;
                // store userData locally
                updateUserData(newUserData);
                setIsSignedIn(true);
            } else {
                setToastVisible(true);
                setToastMessage(t('onBoarding.not_found'));
                auth().signOut();
            }
        } catch (err) {
            __DEV__ && console.error(err);
        }
    };

    const verifyPhoneNumber = async (formValues: AuthFormTypes) => {
        setLoading(true);
        const phoneNumber = formatPhoneNumber(formValues.phoneNumber);
        const fetchData = await fetchUserData(phoneNumber);
        if (fetchData) {
            sendVerification(formValues);
        } else {
            setToastVisible(true);
            setToastMessage(t('onBoarding.not_found'));
        }
        setLoading(false);
    }


    return (
        <SafeAreaView style={{ flex: 1 }}>
            <View style={{ ...styles.container, backgroundColor: Colors[theme].tint }}>

                {/* Images showing features */}
                <Carousel />

                {/* sign in/up with phone number */}
                {showCodeConfInput ? (
                    <CodeConfirmationFrom
                        confirmCode={confirmCode}
                        loading={loading}
                        isVisible={showCodeConfInput}
                        resendCode={() => sendVerification(savePhoneNumber)}
                    />
                ) : authType === 'signin' ? (
                    <SignInForm
                        sendCode={verifyPhoneNumber}
                        loading={loading}
                    />
                ) : (
                    <SignupForm
                        sendCode={sendVerification}
                        loading={loading}
                    />
                )}

                {!showCodeConfInput && (
                    <Button
                        title={authType === 'signin' ? t('onBoarding.signup') : t('onBoarding.login')}
                        onPress={() => setAuthType(authType === 'signin' ? 'signup' : 'signin')}
                        containerStyle={{ marginHorizontal: 16, backgroundColor: Colors[theme].tint }}
                        loading={loading}
                        titleStyle={{ color: Colors[theme].accent }}
                    />
                )}

                <Snackbar
                    visible={toastVisible}
                    onDismiss={() => setToastVisible(false)}
                    style={{ backgroundColor: Colors[theme].primary }}
                    theme={{ ...DefaultTheme, colors: { ...DefaultTheme.colors, accent: Colors[theme].accent } }}
                    action={{
                        label: t('common.close'),
                        onPress: () => setToastVisible(false)
                    }}>
                    {toastMessage}
                </Snackbar>

            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    text: {
        fontSize: 14,
        fontWeight: '500',
        lineHeight: 20,
        textAlign: 'center'
    },
});
