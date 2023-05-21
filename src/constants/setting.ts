export enum LANGUAGE {
	US = 'en-US',
	KR = 'ko-KR',
}

export const LANG = LANGUAGE.KR;

export const ACTIVATION_VOLUME = 60;
export const DEACTIVATION_VOLUME = 60;
export const VOICE_DEACTIVATION_TIME = 600;

export const PAINTING_NAME = LANG === LANGUAGE.KR ? '게르니카' : 'Guernica';
export const PAINTER_NAME =
	LANG === LANGUAGE.KR ? '파블로 피카소 작' : 'by Pablo Picasso';
