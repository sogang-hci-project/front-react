import { LANGUAGE, SystemStatus } from '~/types/common';
import { generateAgentDialogue } from '@api/openai';
import { playTextToAudio } from './audio';
import {
	getDialogueStatus,
	getSettingState,
	setDialogueState,
	setDialogueStateBypassPause,
} from '~/states/store';
import { postBackendTranslation, progressSession } from '~/api/backend';
import { setValueOnLanguage } from './common';

export async function startProbeDialogue(
	setAgentMessage: React.Dispatch<React.SetStateAction<string>>
) {
	const welcomeMessage = setValueOnLanguage(
		'반가워요 저는 당신의 인공지능 친구 Helenos 입니다. 당신의 이름은 무엇인가요?',
		`Hi there, I'm your AI friend, Helenos. What is your name?`,
		`Hi there, I'm your AI friend, Helenos. What is your name?`
	);
	setAgentMessage(welcomeMessage);
	console.log('Agent Message: ', welcomeMessage);
	setDialogueState(SystemStatus.SPEAK);
	await playTextToAudio(welcomeMessage);
	setDialogueStateBypassPause(SystemStatus.WAIT);
}

export async function answerUserDialogue(
	userMessage: string,
	setAgentMessage: React.Dispatch<React.SetStateAction<string>>
) {
	console.log('User Message: ', userMessage);
	const systemStatus = getDialogueStatus();
	const langauge = getSettingState().language;
	if (systemStatus !== SystemStatus.GENERATE || userMessage.length === 0)
		return;
	if (langauge === LANGUAGE.KR) {
		const translatedMessage = await postBackendTranslation(
			userMessage,
			LANGUAGE.KR,
			LANGUAGE.US
		);
		const answer = await generateAgentDialogue(translatedMessage);
		const translatedAnswer = await postBackendTranslation(
			answer,
			LANGUAGE.US,
			LANGUAGE.KR
		);
		setAgentMessage(translatedAnswer);
		console.log('Agent Message: ', translatedAnswer);
		setDialogueStateBypassPause(SystemStatus.SPEAK);
		await playTextToAudio(translatedAnswer);
		setDialogueStateBypassPause(SystemStatus.WAIT);
	} else if (langauge === LANGUAGE.US) {
		const answer = await generateAgentDialogue(userMessage);
		setAgentMessage(answer);
		setDialogueStateBypassPause(SystemStatus.SPEAK);
		await playTextToAudio(answer);
		console.log('Agent Message: ', answer);
		setDialogueStateBypassPause(SystemStatus.WAIT);
	}
}

export async function startDialogue(
	message: string,
	setAgentMessage: React.Dispatch<React.SetStateAction<string>>
) {
	setAgentMessage(message);
	setDialogueState(SystemStatus.SPEAK);
	await playTextToAudio(message);
	setDialogueState(SystemStatus.WAIT);
}

export async function progressDialogue(
	message: string,
	setAgentMessage: React.Dispatch<React.SetStateAction<string>>
) {
	console.log('User Message: ', message);
	const systemStatus = getDialogueStatus();
	if (systemStatus !== SystemStatus.GENERATE) return;
	const { message: answer, active } = await progressSession(message);
	setAgentMessage(answer);
	setDialogueStateBypassPause(SystemStatus.SPEAK);
	await playTextToAudio(answer);
	console.log('Agent Answer: ', answer);
	if (active) {
		setDialogueStateBypassPause(SystemStatus.WAIT);
	} else {
		setDialogueStateBypassPause(SystemStatus.PAUSE);
	}
}
