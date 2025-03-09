export const useSleepComposable = () => {
    /**
     * Pauses the execution for a specified number of milliseconds.
     *
     * @param {number} number - The number of milliseconds to sleep.
     * @returns {Promise<boolean>} A promise that resolves to true after the specified time has elapsed.
     */
    const sleep = (number: number) => {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve(true);
            }, number);
        });
    };

    return {
        sleep,
    };
};
