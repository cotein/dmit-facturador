export type OverviewCard = {
    id: string;
    type: 'primary' | 'secondary' | 'tertiary';
    icon: string;
    total: string;
    suffix: string;
    prefix: string;
    label: string;
    growth: 'upward' | 'downward' | 'stable';
    growthRate: string;
    dataPeriod: string;
    decimal: number;
};

export type LastMonthInvoiced = {
    cbte_fch: string;
    customer_id: number;
    status_id: number;
    voucher_id: number;
    items: Item[];
    total: number;
};

export type SalesReportType = {
    title: string;
    labels: string[];
    orders: number[];
    sales: number[];
    total: string;
    growthRate: string;
    growthStatus: 'up' | 'down';
};

type Item = {
    id: number;
    name: string;
    quantity: number;
    total: number;
};

export type Invoiced = {
    totalIncomeLastMonth: number;
    totalIncomeThisMonth: number;
};
