import {
	getSessionId,
	getSessionStage,
	getSettingState,
	setSessionId,
	setSessionStage,
} from '~/states/store';
import { LANGUAGE, LocalPATH, ServiceType } from '~/types/common';
import { setValueOnEnvironment, setValueOnLanguage } from '~/utils/common';
import { handleError } from '~/utils/error';
import axios from 'axios';

const backendApiUrl = setValueOnEnvironment(
	'/backend',
	'http://3.39.228.156',
	'http://3.39.228.156'
);

interface IGetSessionDataResponse {
	message: string;
	data: {
		currentStage: string;
		nextStage: string;
		sessionID: string;
	};
}

export async function getSession() {
	try {
		const res = await axios.post(`${backendApiUrl}/api/v1/greeting/0`);
		const data = res.data as IGetSessionDataResponse;
		setSessionId(data.data.sessionID);
		setSessionStage(data.data.nextStage);
	} catch (error) {
		alert('Session initialization failed, reload the page');
		console.error(error);
	}
}

interface IStartSessionResponse {
	message: string;
	data: {
		contents: {
			agent: string;
		};
		currentStage: string;
		nextStage: string;
	};
}

export async function startSession() {
	const langauge = getSettingState().language;
	const langCode = langauge === LANGUAGE.KR ? 'ko' : 'en';
	try {
		const sessionId = getSessionId();
		const res = await axios.post(
			`${backendApiUrl}/api/v1/greeting/1`,
			{
				user: 'Hello',
			},
			{
				params: { sessionID: sessionId, lang: langCode },
			}
		);
		const data = res.data as IStartSessionResponse;
		setSessionStage(data.data.nextStage);
		return data.data.contents.agent;
		return '';
	} catch (error) {
		handleError({
			message: (error as Error).message,
			origin: ServiceType.BACKEND_INIT,
		});
		return '';
	}
}

interface ISessionDataResponse {
	message: string;
	data: {
		contents: {
			agent: string;
		};
		currentStage: string;
		nextStage: string;
	};
}

export async function progressSession(message: string) {
	const langauge = getSettingState().language;
	const langCode = langauge === LANGUAGE.KR ? 'ko' : 'en';

	try {
		const sessionId = getSessionId();
		const currentStage = getSessionStage();

		const res = await axios.post(
			`${backendApiUrl}/api/v1${currentStage}`,
			{
				user: message,
			},
			{ params: { sessionID: sessionId, lang: langCode } }
		);

		const data = res.data as ISessionDataResponse;

		setSessionStage(data.data.nextStage);
		return data.data.contents.agent;
	} catch (error) {
		handleError({
			message: (error as Error).message,
			origin: ServiceType.BACKEND,
		});
		return '';
	}
}

interface ITranslationResponse {
	message: string;
	translatedText: string;
}

export async function postBackendTranslation(
	text: string,
	source: LANGUAGE,
	target: LANGUAGE
) {
	try {
		const lang = source === LANGUAGE.KR ? 'ko' : 'en';
		const res = await axios.post(
			`${backendApiUrl}/api/v1/util/translate`,
			{
				text,
			},
			{ params: { lang } }
		);
		const translatedText = (res.data as ITranslationResponse).translatedText;
		return translatedText;
	} catch (error) {
		handleError({
			message: (error as Error).message,
			origin: ServiceType.BACKEND,
		});
		return '';
	}
}

interface IBackendSpeechToTextResponse {
	decodedAudio: {
		type: string;
		data: Array<number>;
	};
	message: string;
}

export async function postBackendSpeechToText(text: string) {
	const textToSpeechVoice = (() => {
		const location = window.location.href.split('/').pop();
		if (location === LocalPATH.INTERACT) {
			return setValueOnLanguage('nkyuwon', 'clara', 'nkyuwon');
		} else if (location === LocalPATH.PROBE) {
			return setValueOnLanguage('vhyeri', 'clara', 'vhyeri');
		}
		return setValueOnLanguage('nkyuwon', 'clara', 'nkyuwon');
		//nsiyoon //njihwan //nkyuwon
	})();

	try {
		const res = await axios.post(`${backendApiUrl}/api/v1/util/texttospeech`, {
			text,
			voice: textToSpeechVoice,
		});
		const url = URL.createObjectURL(
			new Blob([
				new Uint8Array(
					(res.data as IBackendSpeechToTextResponse).decodedAudio.data
				),
			])
		);
		return url;
	} catch (error) {
		handleError({
			message: (error as Error).message,
			origin: ServiceType.BACKEND,
		});
		return '';
	}
}
