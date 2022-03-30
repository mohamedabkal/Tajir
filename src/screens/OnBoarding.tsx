import React, { useEffect, useState, } from 'react';
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
import { Snackbar } from 'react-native-paper';


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



export default function OnBoarding({ navigation }: { navigation: NativeStackNavigationProp<any, any> }) {
    const theme = useColorScheme();
    const { t } = useTranslation();

    // zustand state
    const userData = useStore(state => state.userData);
    const updateUserData = useStore(state => state.updateUserData);
    const setIsSignedIn = useStore(state => state.setIsSignedIn);
    const isSignedIn = useStore(state => state.isSignedIn);

    const [showCodeConfInput, setShowCodeConfInput] = useState<boolean>(false),
        [confirm, setConfirm] = useState<any>(null),
        [formData, setFormData] = useState<AuthFormTypes>(defaultFormData),
        [loading, setLoading] = useState<boolean>(false),
        [showLoginForm, setShowLoginForm] = useState(false),
        [savePhoneNumber, setSavePhoneNumber] = useState<string>(''),
        [toastVisible, setToastVisible] = useState<boolean>(false),
        [toastMessage, setToastMessage] = useState<string>('');


    useEffect(() => {
        auth().onAuthStateChanged((user) => {
            if (user?.uid) {
                if (showLoginForm) {
                    console.log('>>>>>>>> FETCH USER DATA', showLoginForm)
                    fetchUser();
                } else {
                    console.log('>>>>>>>> CREATE USER DATA', showLoginForm)
                    createUserData();
                }
            }
        });
    }, []);


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
            __DEV__ && console.error('>>>>>', err);
            setLoading(false);
        }
    };

    const formatPhoneNumber = (phoneNumber: string | number) => {
        const clean = ('' + phoneNumber.toString()).replace(/\D/g, '');
        const toArray = clean.match(/^(\d{3})(\d{3})(\d{4})$/);
        const format = `+212 ${toArray[1]}-${toArray[2]}-${toArray[3]}`;
        return format;
    }

    const confirmCode = async (values: { confirmationCode: string }) => {
        setLoading(true);
        try {
            await confirm.confirm(values.confirmationCode);
            // if new user => create new user data : fetch data
            if (showLoginForm) {
                fetchUser();
            } else {
                createUserData();
            }
            setLoading(false);
        } catch (err) {
            __DEV__ && console.error('<<<<<<', err)
            setLoading(false);
        }
    };

    const createUserData = async () => {
        const newUserData = {
            ...userData,
            id: uuid.v4(),
            info: {
                firstName: 'Mohammad', //formData.firstName,
                lastName: 'Abkal', //formData.lastName,
                phoneNumber: '+212 077-034-0780', //savePhoneNumber,
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
        if (!isSignedIn) {
            try {
                const fetchData = await fetchUserData(savePhoneNumber);
                if (fetchData) {
                    const newUserData = fetchData;
                    // store userData locally
                    updateUserData(newUserData);
                    setIsSignedIn(true);
                } else {
                    setToastVisible(true);
                    setToastMessage('Phone number was not found!');
                    auth().signOut();
                }
            } catch (err) {
                __DEV__ && console.error(err);
                setLoading(false);
            }
        }
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
                ) : showLoginForm ? (
                    <SignInForm
                        sendCode={sendVerification}
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
                        title={showLoginForm ? t('onBoarding.signup') : t('onBoarding.login')}
                        onPress={() => setShowLoginForm(!showLoginForm)}
                        containerStyle={{ marginHorizontal: 16, backgroundColor: Colors[theme].tint }}
                        loading={loading}
                        titleStyle={{ color: Colors[theme].accent }}
                    />
                )}

                <Snackbar
                    visible={toastVisible}
                    onDismiss={() => setToastVisible(false)}
                    action={{
                        label: 'Close',
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
