import { NavigatorScreenParams } from "@react-navigation/native";



export type RootStackParamList = {
    Root: NavigatorScreenParams<RootTabParamList> | undefined;
    Home: undefined;
    Inventory: undefined;
    OnBoarding: undefined;
    Sales: undefined;
    Settings: undefined;
    Cliens: undefined;
    MyStores: undefined;
};

export type RootTabParamList = {
    HomeTab: undefined;
    SalesTab: undefined;
    InventoryTab: undefined;
    ClientsTab: undefined;
    SettingsTab: undefined;
};