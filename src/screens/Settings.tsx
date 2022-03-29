import { FlatList, SafeAreaView, StyleSheet, Text, TextStyle, } from 'react-native'
import React, { useCallback, useState } from 'react';

;
import { List, Switch } from 'react-native-paper';

import Colors from '../constants/Colors';
import useColorScheme from '../hooks/useColorScheme';
import { en } from '../assets/Typography';
import { useTranslation } from 'react-i18next';
import EditUsername from '../components/modals/EditUsername';
import SelectLang from '../components/modals/SelectLang';
import MembersModal from '../components/modals/MembersModal';




export default function Settings() {
    const theme = useColorScheme();
    const { t } = useTranslation();

    const [isSwitchOn, setIsSwitchOn] = React.useState(false);
    const [usernameModalVisible, setUsernameModalVisible] = useState<boolean>(false);
    const [langModalVisible, setLangModalVisible] = useState<boolean>(false);
    const [membersModalVisible, setMembersModalVisible] = useState<boolean>(false);

    const onToggleSwitch = () => setIsSwitchOn(!isSwitchOn);

    const SETTINGS = [
        {
            id: 'username',
            label: t('settings.username'),
            icon: 'account-outline',
            onPress: useCallback(() => setUsernameModalVisible(true), []),
        },
        {
            id: 'language',
            label: t('settings.change_lang'),
            icon: 'translate',
            onPress: useCallback(() => setLangModalVisible(true), []),
        },
        {
            id: 'dark_mode',
            label: t('settings.dark_mode'),
            icon: 'theme-light-dark',
            onPress: () => null,
            hasSwitch: true,
        },
        {
            id: 'notifications',
            label: t('settings.notifications'),
            icon: 'bell-outline',
            onPress: () => null,
            hasSwitch: true,
        },
        {
            id: 'members',
            label: t('settings.members'),
            icon: 'account-cog-outline',
            onPress: useCallback(() => setMembersModalVisible(true), []),
        },
        {
            id: 'contact',
            label: t('settings.contact'),
            icon: 'message-text-outline',
            onPress: () => null,
        },
    ];


    const textColor: TextStyle = { color: Colors[theme].primary };

    const title = () => <Text style={[styles.title, { color: Colors[theme].primary }]}>{t('settings.title')}</Text>;

    const renderItem = ({ item }) => {
        return (
            <List.Item
                style={{ paddingVertical: 4, backgroundColor: Colors[theme].tint }}
                onPress={item.onPress}
                title={item.label}
                titleStyle={textColor}
                left={() => <List.Icon color={Colors[theme].primary} icon={item.icon} />}
                right={() => item.hasSwitch && (
                    <Switch
                        value={isSwitchOn}
                        onValueChange={onToggleSwitch}
                        theme={{
                            dark: theme === 'dark',
                            colors: {
                                accent: Colors[theme].active,
                            },
                        }}
                    />
                )}
            />
        )
    }

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <FlatList
                data={SETTINGS}
                keyExtractor={(item) => item.id}
                renderItem={renderItem}
                style={{ ...styles.container, backgroundColor: Colors[theme].tint }}
                contentContainerStyle={{ paddingBottom: 32 }}
                ListHeaderComponent={title}
                showsVerticalScrollIndicator={false}
            />

            <EditUsername
                visible={usernameModalVisible}
                hide={() => setUsernameModalVisible(false)}
            />

            <SelectLang
                visible={langModalVisible}
                hide={() => setLangModalVisible(false)}
            />

            <MembersModal
                visible={membersModalVisible}
                hide={() => setMembersModalVisible(false)}
            />
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingVertical: 16,
    },
    title: {
        ...en.h1,
        marginBottom: 16,
        marginHorizontal: 24
    },
})