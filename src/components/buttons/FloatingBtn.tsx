import React from 'react'
import { StyleSheet, } from 'react-native';

import Colors from '../../constants/Colors';
import useColorScheme from '../../hooks/useColorScheme';
import { FAB } from 'react-native-paper';

type Props = {
    onPress: () => void;
}

export default function FloatingBtn(props: Props) {
    const theme = useColorScheme();
    return (
        <FAB
            style={[styles.button, { backgroundColor: Colors[theme].accent }]}
            icon="plus"
            onPress={props.onPress}
        />
    )
}

const styles = StyleSheet.create({
    button: {
        position: 'absolute',
        bottom: 20, right: 20,
    }
})
