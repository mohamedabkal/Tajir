import React from 'react'
import { StyleSheet, Image, ViewStyle, Pressable, View, Text } from 'react-native';

import NumberFormat from 'react-number-format';
import Feather from 'react-native-vector-icons/Feather';

import { en } from '../../assets/Typography';
import Colors from '../../constants/Colors'
import useColorScheme from '../../hooks/useColorScheme';
import { DataTable } from 'react-native-paper';


type Props = {
    rowWidth?: string | number;
    label?: string | number;
    containerStyle?: ViewStyle;
    style?: ViewStyle;
    header?: boolean;
    status?: string;
    formatPrice?: boolean;
    onPress?: () => void;
    iconName?: keyof typeof Feather.glyphMap;
    customRow?: () => JSX.Element;
}


export const Status = React.memo((props: Props) => {
    const { status, label } = props;
    const theme = useColorScheme();
    const statusColor =
        status === 'paid' ?
            Colors[theme].success :
            Colors[theme].error;

    return (
        <View style={styles.statusContainer}>
            <View style={{ ...styles.status, borderColor: statusColor }} />
            {label && (
                <Text style={[en.h5, { marginHorizontal: 5, color: Colors[theme].secondary }]}>
                    {label}
                </Text>
            )}
        </View>
    )
});


export const TableText = React.memo((props: Props) => {
    const theme = useColorScheme();
    const { formatPrice, header, label } = props;
    const rowLabelColor = header ? Colors[theme].accent : Colors[theme].primary;
    return (
        <>
            {props.header ? (
                <DataTable.Title {...props}>
                    <Text style={{ ...styles.label, color: rowLabelColor }}>
                        {label}
                    </Text>
                </DataTable.Title>
            ) : (
                <DataTable.Cell style={{ alignItems: 'center' }} {...props}>
                    {formatPrice ? (
                        <NumberFormat
                            value={Math.round(label)}
                            displayType='text'
                            thousandSeparator=','
                            // suffix=' dh'
                            allowLeadingZeros={false}
                            renderText={(value) =>
                                <Text style={{ ...styles.label, color: rowLabelColor }}>
                                    {value}
                                </Text>
                            }
                        />
                    ) : (
                        <Text style={{ ...styles.label, color: rowLabelColor }}>
                            {label}
                        </Text>
                    )}
                </DataTable.Cell>
            )}
        </>
    )
})

function TableRow(props: Props) {
    const theme = useColorScheme();

    const rowLabelColor = props.header ? Colors[theme].accent : Colors[theme].primary;
    const rowBgColor = props.header ? Colors[theme].subAccent : Colors[theme].bright;
    const statusColor =
        props.status === 'paid' ? Colors[theme].success :
            props.status === 'pending' ? Colors[theme].warning : Colors[theme].error;

    return (
        <DataTable>
            {props.header ? (
                <DataTable.Header style={[
                    styles.container,
                    { backgroundColor: rowBgColor }
                ]}>
                    <DataTable.Title>Dessert</DataTable.Title>
                    <DataTable.Title numeric>Calories</DataTable.Title>
                    <DataTable.Title numeric>Fat</DataTable.Title>
                </DataTable.Header>
            ) : (
                <DataTable.Row style={[
                    styles.container,
                    { backgroundColor: rowBgColor }
                ]}>
                    {props.status ? (
                        <View style={{ ...styles.status, borderColor: statusColor }} />
                    ) : null}
                    <DataTable.Cell>
                        Frozen yogurt
                    </DataTable.Cell>
                    <DataTable.Cell numeric>159</DataTable.Cell>
                    <DataTable.Cell numeric>6.0</DataTable.Cell>
                </DataTable.Row>
            )}
        </DataTable>
    )
};

export default React.memo(TableRow);

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 16,
        // height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
        borderBottomWidth: 0,
    },
    label: {
        ...en.h4,
        fontSize: 13,
        textAlign: 'center',
    },
    status: {
        borderWidth: 2,
        width: 8, height: 8,
        borderRadius: 20,
    },
    statusContainer: {
        flexDirection: 'row', alignItems: 'center', marginHorizontal: 5,
    }
})
