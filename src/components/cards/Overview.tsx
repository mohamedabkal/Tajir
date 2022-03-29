import { I18nManager, Image, ImageSourcePropType, Pressable, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import React from 'react';

import NumberFormat from 'react-number-format';

import Colors from '../../constants/Colors';
import useColorScheme from '../../hooks/useColorScheme';
import { en } from '../../assets/Typography';
import Feather from 'react-native-vector-icons/Feather';


type Props = {
    profit: number;
    statIcon: ImageSourcePropType;
    statName: string;
    type: string;
}


export default function Overview(props: Props) {
    const theme = useColorScheme();

    const WIDTH = (useWindowDimensions().width - 56) / 2;

    const bgColor =
        props.type === 'balance' ?
            props.profit >= 0 ? Colors[theme].success :
                Colors[theme].error : Colors[theme].active;

    const arrowIcon = props.profit >= 0 ? 'arrow-up' : 'arrow-down';
    const iconStyle = { width: 16, height: 16, tintColor: Colors[theme].bright, opacity: 0.8 };

    return (
        <Pressable style={{
            ...styles.container,
            width: WIDTH,
            backgroundColor: bgColor,
        }}>

            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 16 }}>
                <Image source={props.statIcon} style={iconStyle} />
                <Text style={{ ...styles.h5, color: Colors[theme].bright }}>{props.statName}</Text>
            </View>

            <View style={{ flexDirection: 'row', alignItems: 'center', }}>
                <NumberFormat
                    value={Math.round(props.profit)}
                    displayType='text'
                    thousandSeparator=','
                    suffix=' dh'
                    allowLeadingZeros={false}
                    renderText={(value) => (
                        <Text style={{ ...styles.h2, color: Colors[theme].bright }}>
                            {props.profit === 0 ? '' : props.profit > 0 ? '+' : '-'}{value}
                        </Text>
                    )}
                />
                {props.type === 'balance' && props.profit !== 0 &&
                    <Feather
                        name={arrowIcon}
                        size={24}
                        color={Colors[theme].bright}
                        style={{ opacity: 0.5, position: 'absolute', bottom: 0, right: 0, }}
                    />
                }
            </View>

        </Pressable>
    );
}

const styles = StyleSheet.create({
    container: {
        borderRadius: 16,
        padding: 16,
    },
    h5: {
        ...en.h5m,
        marginLeft: 8,
        opacity: 0.8,
    },
    h2: {
        ...en.h2,
        textAlign: I18nManager.isRTL ? 'left' : 'right'
    }
});
