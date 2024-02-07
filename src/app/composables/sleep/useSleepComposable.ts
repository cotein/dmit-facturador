export const useSleepComposable = () => {
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
