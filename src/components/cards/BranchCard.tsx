import { Image, Pressable, StyleSheet, Text, View, ViewStyle } from 'react-native';
import React from 'react';

import Feather from 'react-native-vector-icons/Feather';
import NumberFormat from 'react-number-format';

import Colors from '../../constants/Colors';
import useColorScheme from '../../hooks/useColorScheme';
import { en } from '../../assets/Typography';


type Props = {
    name: string;
    admin: string;
    profit: number;
    containerStyle: ViewStyle;
}

export default function BranchCard(props: Props) {
    const theme = useColorScheme();
    return (
        <Pressable style={{
            ...styles.container,
            backgroundColor: Colors[theme].bright,
            ...props.containerStyle,
        }}>
            <View style={{ padding: 16 }}>
                {/* name */}
                <Text style={{ ...styles.title, color: Colors[theme].primary }}>{props.name}</Text>
                {/* admin */}
                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
                    <Feather name="user" size={12} color={Colors[theme].secondary} />
                    <Text style={{ ...styles.admin, color: Colors[theme].secondary }}>{props.admin}</Text>
                </View>
                {/* profit */}
                <NumberFormat
                    value={Math.round(props.profit)}
                    displayType='text'
                    thousandSeparator=','
                    suffix=' dh'
                    allowLeadingZeros={false}
                    renderText={(value) => (
                        <Text style={styles.profit}>+{value}</Text>
                    )}
                />
            </View>
            {/* branch image */}
            <Image
                source={{ uri: 'http://unblast.com/wp-content/uploads/2020/02/Storefront-Board-Mockup.jpg' }}
                style={{ width: '30%', height: '100%', borderRadius: 16, resizeMode: 'cover' }}
            />
        </Pressable>
    );
}

const styles = StyleSheet.create({
    container: {
        borderRadius: 16,
        flexDirection: 'row',
        justifyContent: 'space-between',
        overflow: 'hidden',
        marginBottom: 16,
    },
    title: {
        ...en.h3,
        marginBottom: 8,
    },
    admin: {
        ...en.h5,
        marginLeft: 8,
    },
    profit: {
        ...en.h3,
        color: Colors.light.success,
    }
});
