import { Image, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import React, { useEffect, useState } from 'react';

import Feather from 'react-native-vector-icons/Feather';

import Colors from '../../constants/Colors';
import useColorScheme from '../../hooks/useColorScheme';
import { en } from '../../assets/Typography';


type Props = {
    onChange: (arg0: number) => void;
    label: string;
}


export default function Counter(props: Props) {
    let [count, setCount] = useState(1);

    useEffect(() => {
        props.onChange(count);
    }, [count]);

    const theme = useColorScheme();

    const onPress = (trigger: string) => {
        if (trigger === '+') {
            let newCount = count++;
            setCount(newCount);
        } else if (trigger === '-' && count > 0) {
            let newCount = count--;
            setCount(newCount);
        }
    }

    return (
        <View>

            <Text style={{ ...styles.label, color: Colors[theme].secondary }}>{props.label}</Text>

            <View style={[styles.container, { backgroundColor: Colors[theme].bright, borderColor: Colors[theme].shade }]}>
                <Pressable
                    onPress={() => onPress('-')}
                    style={styles.ticker}
                    hitSlop={{ top: 16, right: 16, bottom: 16, left: 16 }}
                >
                    <Feather name='minus' size={16} color={Colors[theme].accent} />
                </Pressable>

                <View style={{ height: 40, width: 1, backgroundColor: Colors[theme].shade }} />

                {/* count */}
                <TextInput
                    value={count ? count.toString() : ''}
                    onChangeText={value => {
                        const newCount = parseInt(value);
                        setCount(newCount > 0 ? newCount : 1);
                    }}
                    keyboardType='numeric'
                    style={{ ...styles.counter, color: Colors[theme].primary }}
                />

                <View style={{ height: 40, width: 1, backgroundColor: Colors[theme].shade }} />

                <Pressable
                    onPress={() => onPress('+')}
                    style={styles.ticker}
                    hitSlop={{ top: 16, right: 16, bottom: 16, left: 16 }}
                >
                    <Feather name='plus' size={16} color={Colors[theme].accent} />
                </Pressable>
            </View>

        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        height: 40,
        marginBottom: 16,
        borderRadius: 8,
        width: 180,
    },
    ticker: {
        width: 60,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 40,
    },
    counter: {
        width: 60,
        alignItems: 'center',
        justifyContent: 'center',
        ...en.h4,
        textAlign: 'center'
    },
    label: {
        fontSize: 14,
        fontWeight: '500',
        marginBottom: 8,
    },
});
