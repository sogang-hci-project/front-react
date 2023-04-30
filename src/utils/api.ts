export function getQueryString(queries: { [key: string]: string }): string {
	const res: string[] = [];
	for (const [key, value] of Object.entries(queries)) {
		res.push(`${key}=${encodeURIComponent(value)}`);
	}
	return res.join('&');
}
