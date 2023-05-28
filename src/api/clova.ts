import { ServiceType } from '~/types/common';
import { getQueryString, setValueOnLanguage } from '~/utils/common';
import { handleError } from '@utils/error';

const textToSpeechHeader = new Headers();
textToSpeechHeader.append('Content-Type', 'application/x-www-form-urlencoded');
textToSpeechHeader.append(
	'X-NCP-APIGW-API-KEY-ID',
	process.env.REACT_APP_NAVER_CLOUD_AI_ID_KEY || ''
);
textToSpeechHeader.append(
	'X-NCP-APIGW-API-KEY',
	process.env.REACT_APP_NAVER_CLOUD_AI_SECRET_KEY || ''
);

const textToSpeechVoice = setValueOnLanguage('nwontak', 'clara', 'nwontak');

const dataParam = new URLSearchParams();
dataParam.append('speaker', textToSpeechVoice);
dataParam.append('volume', '0');
dataParam.append('speed', '-1');
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
			headers: textToSpeechHeader,
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
		handleError({
			message: (error as Error).message,
			origin: ServiceType.CLOVA_TTS,
		});
		return;
	}
}

const speechToTextHeader = new Headers();
speechToTextHeader.append('Content-Type', 'application/octet-stream');
speechToTextHeader.append(
	'X-NCP-APIGW-API-KEY-ID',
	process.env.REACT_APP_NAVER_CLOUD_AI_ID_KEY || ''
);
speechToTextHeader.append(
	'X-NCP-APIGW-API-KEY',
	process.env.REACT_APP_NAVER_CLOUD_AI_SECRET_KEY || ''
);

const speechToTextQueries = {
	lang: setValueOnLanguage('Kor', 'Eng', 'Eng'),
};

interface INaverSpeechToTextResult {
	text: string;
}

export async function postNaverSpeechToText(binaryString: Uint8Array) {
	try {
		const res = await fetch(
			`/naver/stt?${getQueryString(speechToTextQueries)}`,
			{
				method: 'POST',
				headers: speechToTextHeader,
				body: binaryString,
			}
		);
		const reader = res.body?.getReader();
		const uint8res = (await reader?.read())?.value || new Uint8Array();
		const result = new TextDecoder().decode(uint8res);

		return (JSON.parse(result) as INaverSpeechToTextResult).text;
	} catch (error) {
		handleError({
			message: (error as Error).message,
			origin: ServiceType.CLOVA_STT,
		});
		return '';
	}
}
