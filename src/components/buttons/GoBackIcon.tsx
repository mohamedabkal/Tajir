import React from 'react';
import { I18nManager } from 'react-native';
import { IconButton } from 'react-native-paper';

import Colors from '../../constants/Colors';
import useColorScheme from '../../hooks/useColorScheme';

export default function GoBackIcon({ goBack }: { goBack: () => void }) {
    const theme = useColorScheme();
    return (
        <IconButton
            icon={I18nManager.isRTL ? 'arrow-right' : 'arrow-left'}
            color={Colors[theme].primary}
            size={20}
            onPress={goBack}
            style={{ marginBottom: 16 }}
        />
    )
}