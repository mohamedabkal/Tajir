import React from 'react'
import { ActivityIndicator, Pressable, StyleSheet, Text, View, ViewStyle, TextStyle } from 'react-native';
import { TouchableRipple } from 'react-native-paper';

import Colors from '../../constants/Colors';
import useColorScheme from '../../hooks/useColorScheme';


type Props = {
    title?: string;
    onPress?: () => void;
    containerStyle?: ViewStyle;
    loading?: boolean;
    titleColor?: string;
    titleStyle?: TextStyle;
    disabled?: boolean;
}

export default function Button(props: Props) {
    const theme = useColorScheme();

    return (
        <TouchableRipple
            onPress={props.onPress}
            rippleColor="rgba(0, 0, 0, .25)"
            style={{
                ...styles.container,
                backgroundColor: Colors[theme].accent,
                ...props.containerStyle,
            }}
            disabled={props.disabled}
        >
            {props.loading ? (
                <ActivityIndicator color={Colors[theme].bright} />
            ) : (
                <Text style={[styles.title, props.titleStyle]}>
                    {props.title}
                </Text>
            )}
        </TouchableRipple>
    )
}

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 12,
        paddingVertical: 10,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
        height: 50,
    },
    title: {
        fontSize: 14,
        fontWeight: '500',
        color: '#fff',
    }
})
