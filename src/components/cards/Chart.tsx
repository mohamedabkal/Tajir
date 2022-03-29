import { I18nManager, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import React from 'react';

import { LineChart } from 'react-native-chart-kit';
import { LineChartData } from 'react-native-chart-kit/dist/line-chart/LineChart';

import Colors from '../../constants/Colors';
import useColorScheme from '../../hooks/useColorScheme';

export default function Chart(props: { data: LineChartData }) {
    const theme = useColorScheme();

    const chartConfig = {
        backgroundColor: Colors[theme].active,
        backgroundGradientFrom: Colors[theme].bright,
        backgroundGradientTo: Colors[theme].bright,
        decimalPlaces: 0, // optional, defaults to 2dp
        color: (opacity = 1) => Colors[theme].muted,
        labelColor: (opacity = 1) => Colors[theme].subSecondary,
        style: {
            borderRadius: 16,
        },
    };

    return (
        <View style={{ ...styles.chart, backgroundColor: Colors[theme].bright }}>
            <LineChart
                data={props.data}
                width={useWindowDimensions().width - 56}
                height={220}
                verticalLabelRotation={30}
                chartConfig={chartConfig}
                bezier
                style={{ marginLeft: I18nManager.isRTL ? 0 : -24 }}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    chart: {
        paddingHorizontal: 16,
        paddingVertical: 24,
        borderRadius: 16,
        overflow: 'hidden',
        marginBottom: 32,
    },
});
