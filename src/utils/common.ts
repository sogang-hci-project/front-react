import { LANGUAGE } from '~/types/common';
import { getSettingState } from '~/states/store';

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
	const language = getSettingState().language;
	if (language === LANGUAGE.KR) {
		return korValue;
	} else if (language === LANGUAGE.US) {
		return engValue;
	}
	return fallback;
};

export const setValueOnEnvironment = <T>(
	devValue: T,
	prodValue: T,
	fallback: T
) => {
	if (process.env.NODE_ENV === 'development') {
		return devValue;
	} else if (process.env.NODE_ENV === 'production') {
		return prodValue;
	} else if (process.env.NODE_ENV === 'test') {
		return prodValue;
	}
	return fallback;
};
