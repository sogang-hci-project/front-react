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
	'https://sgu-hci.p-e.kr',
	'https://sgu-hci.p-e.kr'
);

interface IGetSessionDataResponse {
	currentStage: string;
	message: string;
	nextStage: string;
	sessionID: string;
}

export async function getSession() {
	try {
		const res = await axios.get(`${backendApiUrl}/api/v1/session/init`);
		const data = res.data as IGetSessionDataResponse;
		setSessionId(data.sessionID);
		setSessionStage(data.nextStage);
	} catch (error) {
		alert('Session initialization failed, reload the page');
		console.error(error);
	}
}

interface IStartSessionResponse {
	message: string;
	contents: {
		agent: string;
	};
	currentStage: string;
	nextStage: string;
}

export async function startSession() {
	const langauge = getSettingState().language;
	const langCode = langauge === LANGUAGE.KR ? 'ko' : 'en';
	try {
		const sessionId = getSessionId();
		const res = await axios.get(`${backendApiUrl}/api/v1/session/pre`, {
			params: { sessionID: sessionId, lang: langCode },
		});
		const data = res.data as IStartSessionResponse;
		setSessionStage(data.nextStage);
		return data.contents.agent;
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
	user: string;
	VTS_QUESTION?: string;
	contents: {
		agent: string;
		answer?: string;
		quiz?: string;
	};
	source: string;
	relevantSource: string;
	currentStage: string;
	nextStage: string;
}

export async function progressSession(message: string) {
	const langauge = getSettingState().language;
	const langCode = langauge === LANGUAGE.KR ? 'ko' : 'en';

	try {
		const sessionId = getSessionId();
		const currentStage = getSessionStage();
		const agentMessage = new Array<string>();

		const res = await axios.post(
			`${backendApiUrl}/api/v1${currentStage}`,
			{
				user: message,
			},
			{ params: { sessionID: sessionId, lang: langCode } }
		);

		const data = res.data as ISessionDataResponse;

		const urlParams = new URLSearchParams(data.nextStage);
		const isAdditional = urlParams.get('additional');
		if (data.contents.answer) {
			agentMessage.push(data.contents.answer || '');
		} else {
			agentMessage.push(data.contents.agent);
		}
		if (data.VTS_QUESTION) {
			agentMessage.push(data.VTS_QUESTION || '');
		} else {
			if (data.contents.quiz !== '정의되지 않음')
				agentMessage.push(data.contents.quiz || '');
		}
		setSessionStage(data.nextStage);
		return agentMessage.join('. ');
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
			return setValueOnLanguage('nwontak', 'clara', 'nwontak');
		} else if (location === LocalPATH.PROBE) {
			return setValueOnLanguage('vhyeri', 'clara', 'vhyeri');
		}
		return setValueOnLanguage('nwontak', 'clara', 'nwontak');
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
