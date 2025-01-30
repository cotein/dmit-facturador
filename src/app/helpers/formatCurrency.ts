export const formatCurrency = (value: number, useToFixed: boolean = true): string => {
    if (value === null) {
        return '';
    }

    let formattedValue = value.toString();

    if (useToFixed) {
        formattedValue = value
            .toFixed(2)
            .replace(/\./g, ',')
            .replace(/\d(?=(\d{3})+,)/g, '$&.');
    } else {
        formattedValue = formattedValue.replace(/\./g, ',').replace(/\d(?=(\d{3})+,)/g, '$&.');
    }
    return `$${formattedValue}`;
};
