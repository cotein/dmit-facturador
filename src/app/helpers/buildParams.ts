// src/app/utils/buildParams.ts
import type { InvoiceListParams } from '@/app/types/ApiParams';

export const buildParams = (params: InvoiceListParams): URLSearchParams => {
    const urlParams = new URLSearchParams();

    Object.entries(params).forEach(([key, value]) => {
        if (value !== null && value !== undefined) {
            urlParams.append(key, value.toString());
        }
    });

    return urlParams;
};
