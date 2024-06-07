export const onlyNumeric = (event: KeyboardEvent) => {
    const key = event.key;
    const input = event.target as HTMLInputElement;

    // Permitir solo números y un punto
    if ((key < '0' || key > '9') && key !== '.') {
        event.preventDefault();
        return;
    }

    // Si se presiona un punto y ya hay un punto en el valor, prevenir la entrada
    if (key === '.' && input.value.includes('.')) {
        event.preventDefault();
        return;
    }

    // Si ya hay dos dígitos después del punto, prevenir la entrada de más números
    const decimalPointIndex = input.value.indexOf('.');
    if (
        decimalPointIndex !== -1 &&
        input.value.substring(decimalPointIndex + 1).length >= 2 &&
        key >= '0' &&
        key <= '9' &&
        input.selectionStart !== null && // Add null check here
        input.selectionStart > decimalPointIndex + 2
    ) {
        event.preventDefault();
        return;
    }
};

export const selectText = (event: FocusEvent) => {
    const input = event.target as HTMLInputElement;
    input.select();
};
