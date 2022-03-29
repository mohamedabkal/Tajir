import { StyleSheet, Text, View, TextInput as Input, ViewStyle, TextInputProps, Pressable } from 'react-native';
import React, { memo } from 'react';

import Colors from '../../constants/Colors';
import useColorScheme from '../../hooks/useColorScheme';
import NumberFormat from 'react-number-format';
import { Control, Path, RegisterOptions, useController } from 'react-hook-form';

// types
type TRule = Omit<
    RegisterOptions,
    'valueAsNumber' | 'valueAsDate' | 'setValueAs'
>;

export type InputControllerType<T> = {
    name: Path<T>;
    control: Control<T>;
    rules?: TRule;
};
interface Props<T> extends TextInputProps, InputControllerType<T> {
    label?: string;
    containerStyle: ViewStyle,
    priceInput: boolean;
    leftIcon: JSX.Element;
    showRightBtn: boolean;
    handleRightBtn: () => void;
    rightBtnLabel: string;
}


function TextInput(props: Props) {
    const { label, name, control, defaultValue, rules, ...inputProps } = props;

    const theme = useColorScheme();
    const { field: { value, onChange, onBlur }, fieldState } = useController({ control, name, rules });

    const borderColor = fieldState.invalid
        ? Colors[theme].error
        : Colors[theme].shade;

    const backgroundColor = props.bgColor || 'transparent';

    return (
        <View style={{ marginBottom: 16, ...props.containerStyle }}>
            {/* label */}
            {props.label &&
                <Text style={{ ...styles.label, color: Colors[theme].secondary }}>{props.label}</Text>
            }
            <View style={[styles.inputContainer, { borderColor, backgroundColor }]}>
                {/* left icon */}
                {props.leftIcon && props.leftIcon()}

                {/* text input */}
                {props.priceInput ? (
                    <NumberFormat
                        value={value === 0 ? '' : value}
                        displayType='text'
                        thousandSeparator=' '
                        allowLeadingZeros={false}
                        renderText={inputValue => (
                            <Input
                                style={[styles.input, { color: Colors[theme].primary }]}
                                onChangeText={onChange}
                                value={inputValue}
                                placeholder='0'
                                placeholderTextColor={Colors[theme].muted}
                                onBlur={onBlur}
                                keyboardType='number-pad'
                                {...inputProps}
                            />
                        )}
                    />
                ) : (
                    <Input
                        style={[styles.input, { color: Colors[theme].primary }]}
                        onChangeText={onChange}
                        value={value ? value : ''}
                        placeholderTextColor={Colors[theme].muted}
                        onBlur={onBlur}
                        {...inputProps}
                    />
                )}

                {/* right button */}
                {props.showRightBtn &&
                    <Pressable
                        style={[styles.rightBtn, { backgroundColor: Colors[theme].subAccent }]}
                        onPress={props.handleRightBtn}>
                        <Text style={[styles.rightBtnLabel, { color: Colors[theme].accent }]}>
                            {props.rightBtnLabel}
                        </Text>
                    </Pressable>
                }
            </View>
        </View>
    );
};

export default memo(TextInput);

const styles = StyleSheet.create({
    inputContainer: {
        borderWidth: 1,
        borderRadius: 10,
        height: 50,
        overflow: 'hidden',
        flexDirection: 'row',
        paddingHorizontal: 12,
        alignItems: 'center',
    },
    input: {
        flex: 1,
        fontSize: 14,
        fontWeight: '400',
    },
    label: {
        fontSize: 14,
        fontWeight: '500',
        marginBottom: 8,
    },
    rightBtn: {
        borderRadius: 5,
        height: 34,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 8,
    },
    rightBtnLabel: {
        fontSize: 12,
        fontWeight: '400',
    }
});
