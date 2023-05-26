import { LANG, LANGUAGE } from '@constants/setting';

export function getQueryString(queries: { [key: string]: string }): string {
	const res: string[] = [];
	for (const [key, value] of Object.entries(queries)) {
		res.push(`${key}=${encodeURIComponent(value)}`);
	}
	return res.join('&');
}

export const isChrome = navigator.userAgent.indexOf('Chrome') !== -1;
export const isSafari = navigator.userAgent.indexOf('Safari') !== -1;

export const setValueOnLanguage = <T>(
	korValue: T,
	engValue: T,
	fallback: T
) => {
	if (LANG === LANGUAGE.KR) {
		return korValue;
	} else if (LANG === LANGUAGE.US) {
		return engValue;
	}
	return fallback;
};
