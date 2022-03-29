import { Pressable, StyleSheet, Text, View, ViewStyle } from 'react-native';
import React from 'react';

import Feather from 'react-native-vector-icons/Feather';
import { Checkbox as PaperCheckBox } from 'react-native-paper';

import { en } from '../../assets/Typography';
import Colors from '../../constants/Colors';
import useColorScheme from '../../hooks/useColorScheme';

type Props = {
    label?: string;
    color?: string;
    onPress?: () => void;
    checked: boolean;
}

function CheckBox(props: Props) {
    const theme = useColorScheme();
    const [checked, setChecked] = React.useState(false);

    const onPress = () => {
        setChecked(!checked);
        props.onPress ? props.onPress() : null;
    }

    return (
        <View style={[styles.container, { marginRight: props.label ? 8 : 0 }]}>
            <PaperCheckBox
                status={props.checked ? 'checked' : 'unchecked'}
                onPress={onPress}
                color={props.color}
                uncheckedColor={Colors[theme].muted}
            />
            {props.label && (
                <Text style={{ ...styles.label, color: Colors[theme].secondary }}>
                    {props.label}
                </Text>
            )}
        </View>
    );
};

export default React.memo(CheckBox);

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    label: {
        ...en.h4,
    },
});
