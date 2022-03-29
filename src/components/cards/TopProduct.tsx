import { Pressable, StyleSheet, Text, View, Image } from 'react-native';
import React from 'react';

import NumberFormat from 'react-number-format';

import Colors from '../../constants/Colors';
import useColorScheme from '../../hooks/useColorScheme';
import AssetsManager from '../../assets/AssetsManager';
import { en } from '../../assets/Typography';

type Props = {
    name: string;
    amountSold: number;
    sales: number;
}

export default function TopProduct(props: Props) {
    const theme = useColorScheme();
    return (
        <Pressable style={{ ...styles.container, backgroundColor: Colors[theme].bright }}>
            {/* name */}
            <Text
                numberOfLines={1}
                ellipsizeMode='tail'
                style={{ ...styles.h5, color: Colors[theme].primary }}
            >
                {props.name}
            </Text>

            {/* amount sold */}
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
                <Image
                    source={AssetsManager.Images.grid}
                    style={{ width: 14, height: 14, tintColor: Colors[theme].muted }}
                />
                <Text
                    numberOfLines={1}
                    style={{ ...en.h5, color: Colors[theme].success, marginHorizontal: 8 }}>
                    +{props.amountSold}
                </Text>
            </View>

            {/* amount earned */}
            <View style={{ flexDirection: 'row', alignItems: 'center', }}>
                <Image
                    source={AssetsManager.Images.money}
                    style={{ width: 14, height: 14, tintColor: Colors[theme].muted }}
                />
                <NumberFormat
                    value={Math.round(props.sales)}
                    displayType='text'
                    thousandSeparator=','
                    suffix=' dh'
                    allowLeadingZeros={false}
                    renderText={(value) => (
                        <Text
                            ellipsizeMode='tail'
                            numberOfLines={1}
                            style={{ ...en.h5, color: Colors[theme].success, marginHorizontal: 8 }}>
                            +{value}
                        </Text>
                    )}
                />
            </View>
        </Pressable>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 16,
        width: 130,
        borderRadius: 16,
        marginRight: 16,
    },
    h5: {
        ...en.h5m,
        marginBottom: 16,
    },
});
