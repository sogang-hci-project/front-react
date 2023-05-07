export function getQueryString(queries: { [key: string]: string }): string {
	const res: string[] = [];
	for (const [key, value] of Object.entries(queries)) {
		res.push(`${key}=${encodeURIComponent(value)}`);
	}
	return res.join('&');
}

export const isChrome = navigator.userAgent.indexOf('Chrome') !== -1;
export const isSafari = navigator.userAgent.indexOf('Safari') !== -1;
