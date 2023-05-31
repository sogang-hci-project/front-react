import {
	getSessionId,
	getSessionStage,
	setSessionId,
	setSessionStage,
} from '~/states/store';
import { ServiceType } from '~/types/common';
import { setValueOnEnvironment } from '~/utils/common';
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
	try {
		const sessionId = getSessionId();
		const res = await axios.get(`${backendApiUrl}/api/v1/session/pre`, {
			params: { sessionID: sessionId },
		});
		console.log(res);
		const data = res.data as IStartSessionResponse;
		setSessionStage(data.nextStage);
		return data.contents.agent;
	} catch (error) {
		console.error(error);
		handleError({
			message: 'start session error',
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
	try {
		const sessionId = getSessionId();
		const currentStage = getSessionStage();
		const agentMessage = new Array<string>();

		const res = await axios.post(
			`${backendApiUrl}/api/v1${currentStage}`,
			{
				user: message,
			},
			{ params: { sessionID: sessionId } }
		);

		const data = res.data as ISessionDataResponse;
		console.log(data);

		const urlParams = new URLSearchParams(data.nextStage);
		const isAdditional = urlParams.get('additional');
		if (data.contents.answer) {
			agentMessage.push(data.contents.answer || '');
		} else {
			agentMessage.push(data.contents.agent);
		}
		if (data.contents.quiz) {
			agentMessage.push(data.contents.quiz || '');
		} else {
			agentMessage.push(data.VTS_QUESTION || '');
		}
		setSessionStage(data.nextStage);
		return agentMessage.join('. ');
	} catch (error) {
		console.error(error);
		handleError({
			message: 'start session error',
			origin: ServiceType.BACKEND,
		});
		return '';
	}
}
