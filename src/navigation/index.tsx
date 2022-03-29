import React, { ComponentProps } from 'react';
import { ColorSchemeName } from 'react-native';

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer, DefaultTheme, DarkTheme, } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { useTranslation } from 'react-i18next';
import Feather from 'react-native-vector-icons/Feather';

import useColorScheme from '../hooks/useColorScheme';
import { RootStackParamList, RootTabParamList } from '../types';
import useStore from '../state/useStore';
import Sales from '../screens/Sales/Sales';
import Inventory from '../screens/Inventory';
import OnBoarding from '../screens/OnBoarding';
import MyShops from '../screens/MyShops';
import Clients from '../screens/Clients';
import Invoices from '../screens/Invoices';
import Suppliers from '../screens/Suppliers';
import Settings from '../screens/Settings';
import Colors from '../constants/Colors';
import Home from '../screens/Home';



export default function Navigation({ colorScheme }: { colorScheme: ColorSchemeName }) {
    return (
        <NavigationContainer theme={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
            <RootNavigator />
        </NavigationContainer>
    );
}



const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createMaterialTopTabNavigator();
const BottomTab = createBottomTabNavigator<RootTabParamList>();


function RootNavigator() {
    const isSignedIn = useStore(state => state.isSignedIn);
    return (
        <Stack.Navigator>
            {!isSignedIn ? (
                <Stack.Group>
                    <Stack.Screen name="OnBoarding" component={OnBoarding} options={{ headerShown: false }} />
                    <Stack.Screen name="MyShops" component={MyShops} options={{ headerShown: false }} />
                </Stack.Group>
            ) : (
                <Stack.Screen name="Root" component={BottomTabNavigator} options={{ headerShown: false }} />
            )}
        </Stack.Navigator>
    );
};


// Home Stack
const HomeStack = () => {
    return (
        <Stack.Navigator>
            <Stack.Screen name="Home" component={Home} options={{ headerShown: false }} />
        </Stack.Navigator>
    )
}

// Settings Stack
const SettingsStack = () => {
    return (
        <Stack.Navigator>
            <Stack.Screen name="Settings" component={Settings} options={{ headerShown: false }} />
        </Stack.Navigator>
    )
}

// Inventory stack
const InventoryStack = () => {
    const theme = useColorScheme();
    const { t } = useTranslation();
    return (
        <Tab.Navigator
            screenOptions={{
                tabBarStyle: { backgroundColor: Colors[theme].tint },
                tabBarIndicatorStyle: { backgroundColor: Colors[theme].active }
            }}
            sceneContainerStyle={{ elevation: 0 }}>
            <Tab.Screen name="Inventory" component={Inventory} options={{ tabBarLabel: t('inventory.title') }} />
            <Tab.Screen name="Invoices" component={Invoices} options={{ tabBarLabel: t('invoices.title') }} />
        </Tab.Navigator>
    );
}

// Clients stack
const ClientsStack = () => {
    const theme = useColorScheme();
    const { t } = useTranslation();
    return (
        <Tab.Navigator
            screenOptions={{
                tabBarStyle: { backgroundColor: Colors[theme].tint },
                tabBarIndicatorStyle: { backgroundColor: Colors[theme].active }
            }}>
            <Tab.Screen name="Clients" component={Clients} options={{ tabBarLabel: t('clients.title') }} />
            <Tab.Screen name="Suppliers" component={Suppliers} options={{ tabBarLabel: t('suppliers.title') }} />
        </Tab.Navigator>
    );
}



function BottomTabNavigator() {
    const colorScheme = useColorScheme();

    return (
        <BottomTab.Navigator
            initialRouteName="HomeTab"
            screenOptions={{
                tabBarInactiveTintColor: Colors[colorScheme].muted,
                tabBarActiveTintColor: Colors[colorScheme].active,
                tabBarStyle: {
                    height: 60,
                    elevation: 0,
                    shadowOpacity: 0,
                    borderTopColor: Colors[colorScheme].shade,
                    backgroundColor: Colors[colorScheme].bright,
                },
            }}>
            <BottomTab.Screen
                name="HomeTab"
                component={HomeStack}
                options={{
                    headerShown: false,
                    tabBarShowLabel: false,
                    tabBarIcon: ({ color }) => <TabBarIcon name="home" color={color} />,
                }}
            />
            <BottomTab.Screen
                name="SalesTab"
                component={Sales}
                options={{
                    headerShown: false,
                    tabBarShowLabel: false,
                    tabBarIcon: ({ color }) => <TabBarIcon name="bar-chart-2" color={color} />,
                }}
            />
            <BottomTab.Screen
                name="InventoryTab"
                component={InventoryStack} // TODO: if pro show "InventoryStack" : "Inventory"
                options={{
                    headerShown: false,
                    tabBarShowLabel: false,
                    tabBarIcon: ({ color }) => <TabBarIcon name="archive" color={color} />,
                }}
            />
            <BottomTab.Screen
                name="ClientsTab"
                component={ClientsStack}
                options={{
                    headerShown: false,
                    tabBarShowLabel: false,
                    tabBarIcon: ({ color }) => <TabBarIcon name="users" color={color} />,
                }}
            />
            <BottomTab.Screen
                name="SettingsTab"
                component={SettingsStack}
                options={{
                    headerShown: false,
                    tabBarShowLabel: false,
                    tabBarIcon: ({ color }) => <TabBarIcon name="settings" color={color} />,
                }}
            />
        </BottomTab.Navigator>
    );
};


const TabBarIcon = React.memo((props: {
    name: ComponentProps<typeof Feather>['name'];
    color: string;
}) => {
    return <Feather size={24} style={{ marginBottom: -3 }} {...props} />;
})