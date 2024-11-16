export const onlyNumeric = (event: KeyboardEvent) => {
    let key = event.key;
    const input = event.target as HTMLInputElement;

    if (key === ',') {
        key = '.';
    }

    if ((key < '0' || key > '9') && key !== '.') {
        event.preventDefault();
        return;
    }

    if (key === '.' && input.value.includes('.')) {
        event.preventDefault();
        return;
    }

    const decimalPointIndex = input.value.indexOf('.');
    if (
        decimalPointIndex !== -1 &&
        input.value.substring(decimalPointIndex + 1).length >= 2 &&
        key >= '0' &&
        key <= '9' &&
        input.selectionStart !== null &&
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

export const onlyNumericInputEvent = (event: KeyboardEvent) => {
    const key = event.key;
    // Permitir solo números
    if (key < '0' || key > '9') {
        event.preventDefault();
        return;
    }
};
