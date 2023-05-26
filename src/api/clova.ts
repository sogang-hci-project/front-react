import { LANG, LANGUAGE } from '~/constants/setting';
import { handleError } from '~/utils/common';

const headers = new Headers();
headers.append('Content-Type', 'application/x-www-form-urlencoded');
headers.append(
	'X-NCP-APIGW-API-KEY-ID',
	process.env.REACT_APP_NAVER_CLOUD_AI_ID_KEY || ''
);
headers.append(
	'X-NCP-APIGW-API-KEY',
	process.env.REACT_APP_NAVER_CLOUD_AI_SECRET_KEY || ''
);

const textToSpeechVoice = (() => {
	if ((LANG as LANGUAGE) === LANGUAGE.KR) {
		return 'nwontak';
	} else if ((LANG as LANGUAGE) === LANGUAGE.US) {
		return 'clara';
	}
	return '';
})();

const dataParam = new URLSearchParams();
dataParam.append('speaker', textToSpeechVoice);
dataParam.append('volume', '0');
dataParam.append('speed', '0');
dataParam.append('pitch', '0');
dataParam.append('end-pitch', '-2');

function concatenate(arrays: Uint8Array[]) {
	let totalLength = 0;
	for (const arr of arrays) {
		totalLength += arr.length;
	}
	const result = new Uint8Array(totalLength);
	let offset = 0;
	for (const arr of arrays) {
		result.set(arr, offset);
		offset += arr.length;
	}
	return result;
}

export async function postNaverTextToSpeech(text: string) {
	try {
		dataParam.delete('text');
		dataParam.append('text', text);

		const res = await fetch('/naver/tts', {
			method: 'POST',
			headers,
			body: dataParam,
		});

		const audioUint8Set = new Array<Uint8Array>();
		const reader = res.body?.getReader();
		const flag = true;

		while (flag) {
			const { done, value } = (await reader?.read()) || {
				done: true,
				value: undefined,
			};
			if (done) break;
			audioUint8Set.push(value);
		}
		const audioUint8Array = concatenate(audioUint8Set);
		return audioUint8Array;
	} catch (error) {
		handleError((error as Error).message);
		return;
	}
}
