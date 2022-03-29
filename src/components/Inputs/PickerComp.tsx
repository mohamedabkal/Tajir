import { StyleSheet, Text, View, ViewStyle } from 'react-native'
import React from 'react';

import { Picker } from '@react-native-picker/picker';
import useColorScheme from '../../hooks/useColorScheme';
import Colors from '../../constants/Colors';

type Props = {
    value: string;
    onChange?: (value: string) => void;
    children: React.ReactNode;
    containerStyle?: ViewStyle;
}

function PickerComp(props: Props) {
    const theme = useColorScheme();
    const { value, onChange, children } = props;
    const style = [styles.pickerContainer, { backgroundColor: Colors[theme].bright }];
    return (
        <View style={[style, props.containerStyle]} {...props}>
            <Picker
                selectedValue={value}
                mode='dropdown'
                onValueChange={onChange}
            >
                {children}
            </Picker>
        </View>
    )
};

export default React.memo(PickerComp);

const styles = StyleSheet.create({
    pickerContainer: {
        borderRadius: 8,
        height: 50,
        justifyContent: 'center',
        marginBottom: 16,
    },
})