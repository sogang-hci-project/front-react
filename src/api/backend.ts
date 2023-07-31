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
	'https://163.239.109.58:13502',
	'https://163.239.109.58:13502',
	'https://163.239.109.58:13502'
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
		const res = await axios.post(`${backendApiUrl}/api/v1/register`);
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
	const mode = getSettingState().mode;
	const langCode = langauge === LANGUAGE.KR ? 'ko' : 'en';
	try {
		const sessionId = getSessionId();
		const res = await axios.post(
			`${backendApiUrl}/api/v1/${mode}/greeting/0`,
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
	const mode = getSettingState().mode;
	const langCode = langauge === LANGUAGE.KR ? 'ko' : 'en';

	try {
		const sessionId = getSessionId();
		const currentStage = getSessionStage();

		const res = await axios.post(
			`${backendApiUrl}/api/v1/${mode}${currentStage}`,
			{
				user: message,
			},
			{ params: { sessionID: sessionId, lang: langCode } }
		);

		const data = res.data as ISessionDataResponse;
		setSessionStage(data.data.nextStage);

		if (data.data.nextStage === '/end') {
			return { message: data.data.contents.agent, active: false };
		}
		return { message: data.data.contents.agent, active: true };
	} catch (error) {
		handleError({
			message: (error as Error).message,
			origin: ServiceType.BACKEND,
		});
		return { message: '', active: true };
	}
}

interface ITranslationResponse {
	text: string;
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
		const translatedText = (res.data as ITranslationResponse).text;
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
	decodedAudio: Array<number>;
	message: string;
}

export async function postBackendTextToSpeech(text: string) {
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
		const res = await axios.post(
			`${backendApiUrl}/api/v1/util/texttospeech`,
			{
				text,
				voice: textToSpeechVoice,
			},
			{ responseType: 'blob' }
		);
		const audioUrl = URL.createObjectURL(res.data as Blob);
		return audioUrl;
	} catch (error) {
		handleError({
			message: (error as Error).message,
			origin: ServiceType.BACKEND,
		});
		return '';
	}
}

interface IBackendSpeechToTextResponse {
	text: string;
}

export async function postBackendSpeechToText(audioFile: File) {
	const formData = new FormData();
	formData.append('file', audioFile);

	try {
		const res = await axios.post<IBackendSpeechToTextResponse>(
			`${backendApiUrl}/api/v1/util/speechtotext`,
			formData,
			{
				headers: {
					Accept: 'application/json',
					'Content-Type': 'multipart/form-data',
				},
			}
		);
		return res.data.text;
	} catch (error) {
		handleError({
			message: (error as Error).message,
			origin: ServiceType.BACKEND,
		});
		return '';
	}
}
