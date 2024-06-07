export type PriceList = {
    id?: number;
    name: string;
    active: boolean;
    profit_percentage: number;
    value?: number;
    label?: string;
};

export type PriceListSendData = {
    name: string;
    profit_percentage: number;
};

export type PriceListTranferData = {
    key: string;
    title: string;
    description?: string;
    disabled?: boolean;
};

export type PriceListFromDataBase = {
    id: number;
    name: string;
    pricelist_id: number;
    cost: number;
    profit_percentage: number;
    profit_rate: number;
    sale_price: number;
};
