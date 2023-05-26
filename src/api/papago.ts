import { LANGUAGE } from '~/constants/setting';
import { ServiceType } from '~/types/common';
import { handleError } from '~/utils/common';

const body = new URLSearchParams();
body.append('honorific', 'true');

const headers = {
	'X-NCP-APIGW-API-KEY-ID':
		process.env.REACT_APP_NAVER_CLOUD_PAPAGO_ID_KEY || '',
	'X-NCP-APIGW-API-KEY':
		process.env.REACT_APP_NAVER_CLOUD_PAPAGO_SECRET_KEY || '',
	'Content-Type': 'application/x-www-form-urlencoded',
};

interface ITranslateResult {
	message: {
		result: {
			srcLangType: string;
			tarLangType: string;
			translatedText: string;
		};
	};
}

export async function postPapagoTranslation(
	text: string,
	source: LANGUAGE,
	target: LANGUAGE
) {
	const langSource = source === LANGUAGE.KR ? 'ko' : 'en';
	const langTarget = target === LANGUAGE.KR ? 'ko' : 'en';

	body.delete('text');
	body.delete('source');
	body.delete('target');
	body.append('text', text);
	body.append('source', langSource);
	body.append('target', langTarget);

	try {
		const res = await fetch('/naver/translation', {
			method: 'POST',
			headers,
			body,
		});
		const reader = res.body?.getReader();
		const uint8res = (await reader?.read())?.value || new Uint8Array();
		const result = new TextDecoder().decode(uint8res);
		return (JSON.parse(result) as ITranslateResult).message.result
			.translatedText;
	} catch (error) {
		handleError({
			message: (error as Error).message,
			origin: ServiceType.PAPAGO_TRANS,
		});
		return '';
	}
}
