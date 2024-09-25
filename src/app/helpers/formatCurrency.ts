export const formatCurrency = (value: number): string => {
    if (value === null) {
        return '';
    }
    const formattedValue = value
        .toFixed(2)
        .replace(/\./g, ',')
        .replace(/\d(?=(\d{3})+,)/g, '$&.');
    return `$${formattedValue}`;
};
