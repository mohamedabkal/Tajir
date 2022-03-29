import React from 'react';
import { StatusBar } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Provider as PaperProvider } from 'react-native-paper';

import useColorScheme from './src/hooks/useColorScheme';
import Navigation from './src/navigation';
import './i18n.config';
import Colors from './src/constants/Colors';



export default function App() {
    const colorScheme = useColorScheme();
    return (
        <PaperProvider>
            <SafeAreaProvider>
                <GestureHandlerRootView style={{ flex: 1 }}>
                    <Navigation colorScheme={colorScheme} />
                </GestureHandlerRootView>
                <StatusBar
                    barStyle={colorScheme === 'dark' ? 'light-content' : 'dark-content'}
                    backgroundColor={Colors[colorScheme].tint}
                />
            </SafeAreaProvider>
        </PaperProvider>
    );
}
