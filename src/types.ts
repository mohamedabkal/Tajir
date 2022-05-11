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


export type User = {
    id: string;
    info: {
        firstName: string;
        lastName: string;
        phoneNumber: string;
    },
    expoToken: string;
    stores: string[];
};

export type Store = {
    id: string;
    name: string,
    products: Product[],
    invoices: Invoice[],
    sales: Sale[],
    transactions: Transaction[],
    members: Member[],
    clients: Client[],
    type: 'pro' | 'normal'
};

export type Product = {
    id: string;
    productName: string;
    buyingPrice: number;
    qty: number;
    invoiceID: string;
    paid: boolean;
};

export type Sale = {
    id: string;
    productName: string;
    sellingPrice: number;
    buyingPrice: number;
    paid: boolean;
    clientId: string;
    date: number;
};

export type Invoice = {
    id: string;
    supplier: string;
    invoiceNumber: number;
    date: Date;
    total: number;
    paid: boolean;
    products: Product[];
};

export type Member = {
    id: string;
    name: string;
    role: string;
};

export type Transaction = {
    id: string;
    amount: number;
    date: Date;
    number: number;
};

export type Client = {
    id: string;
    name: string;
    phoneNumber: string;
};

export type TimeRange = 'today' | 'month' | 'year';