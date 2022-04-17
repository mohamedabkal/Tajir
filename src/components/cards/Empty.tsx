import { Pressable, StyleSheet, Text, View } from 'react-native';
import React, { ComponentProps } from 'react';

import Feather from 'react-native-vector-icons/Feather';

import useColorScheme from '../../hooks/useColorScheme';
import Colors from '../../constants/Colors';
import { en } from '../../assets/Typography';



type Props = {
    icon: ComponentProps<typeof Feather>['name'];
    text: string;
    onPress?: () => void;
}


export default function Empty(props: Props) {
    const theme = useColorScheme();
    return (
        <Pressable
            onPress={props.onPress}
            style={styles.container}>
            <Feather name={props.icon} color={Colors[theme].muted} size={50} style={styles.icon} />
            <Text style={{ ...styles.empty, color: Colors[theme].muted }}>
                {props.text}
            </Text>
        </Pressable>
    )
}

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 40,
    },
    icon: {
        marginBottom: 24,
    },
    empty: {
        ...en.h4,
        textAlign: 'center',
        width: 240,
    },
})