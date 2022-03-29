import { SafeAreaView, StyleSheet, Text, View, FlatList } from 'react-native';

;
import { useTranslation } from "react-i18next";

import Colors from '../constants/Colors';
import useColorScheme from '../hooks/useColorScheme';
import { en } from '../assets/Typography';
import Overview from '../components/cards/Overview';
import AssetsManager from '../assets/AssetsManager';
import TopProduct from '../components/cards/TopProduct';
import Chart from '../components/cards/Chart';
import Transactions from '../components/data/Transactions';
import useStore from '../state/useStore';

export default function Home() {
    const theme = useColorScheme();
    const { t } = useTranslation();
    const userData = useStore(state => state.userData);
    console.log(userData)

    // TODO: fix arabic issue
    const months = t('common.days', { returnObjects: true })

    const data = {
        labels: months,
        datasets: [
            {
                data: [20, 45, 28, 80, 100, 43],
                color: (opacity = 1) => Colors[theme].active, // optional
                strokeWidth: 2 // optional
            }
        ],
    };

    const main = () => (
        <>
            {/* welcome */}
            <Text style={{ ...styles.title, color: Colors[theme].primary }}>
                {t('home.welcome')} Mohammad 👋🏼
            </Text>

            <View style={{ ...styles.overview, backgroundColor: Colors[theme].tint, }}>
                {/* balance */}
                <Overview
                    statName={t('home.balance')}
                    statIcon={AssetsManager.Images.money}
                    profit={12000}
                    type='balance'
                />
                {/* inventory */}
                <Overview
                    statName={t('home.inventory')}
                    statIcon={AssetsManager.Images.grid}
                    profit={12000}
                    type='inventory'
                />
            </View>

            {/* sales */}
            <View>
                <View style={styles.sectionTitle}>
                    <Text style={{ ...styles.h3, color: Colors[theme].primary }}>{t('home.sales_label')}</Text>
                    <Text style={{ ...styles.h5, color: Colors[theme].success }}>+12%</Text>
                </View>
                <Chart data={data} />
            </View>
        </>
    );

    const content = () => {
        return (
            <>
                {/* transactions */}
                <View style={{ marginBottom: 32 }}>
                    <View style={styles.sectionTitle}>
                        <Text style={{ ...styles.h3, color: Colors[theme].primary }}>{t('home.transactions_label')}</Text>
                        <Text style={{ ...styles.h5, color: Colors[theme].secondary }}>{t('home.this_month')}</Text>
                    </View>

                    <Transactions />
                </View>

                {/* top 5 products */}
                <View style={{ marginBottom: 48 }}>
                    <View style={styles.sectionTitle}>
                        <Text style={{ ...styles.h3, color: Colors[theme].primary }}>{t('home.top_products')}</Text>
                        <Text style={{ ...styles.h5, color: Colors[theme].secondary }}>{t('home.this_month')}</Text>
                    </View>

                    <View style={{ flexDirection: 'row' }}>
                        <TopProduct
                            name='IPhone 12 Pro'
                            amountSold={22}
                            sales={12000}
                        />
                        <TopProduct
                            name='Macbook 14 Pro'
                            amountSold={22}
                            sales={1240000}
                        />
                    </View>
                </View>
            </>
        )
    }

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <FlatList
                style={{ ...styles.container, backgroundColor: Colors[theme].tint }}
                showsVerticalScrollIndicator={false}
                ListHeaderComponent={main}
                ListFooterComponent={content}
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 24,
        paddingVertical: 16,
    },
    title: {
        ...en.h1,
        marginBottom: 24,
    },
    overview: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 32
    },
    h3: {
        ...en.h3,
    },
    h5: {
        ...en.h5m,
    },
    sectionTitle: {
        marginBottom: 16,
        flexDirection: 'row',
        alignItems: 'flex-end',
        justifyContent: 'space-between',
    }
});
