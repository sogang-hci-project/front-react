import { postPapagoTranslation } from '~/api/papago';
import { LANGUAGE, SystemStatus } from '~/types/common';
import { requestChatCompletion } from '@api/openai';
import { playTextToAudio } from './audio';
import {
	getDialogueStatus,
	getSettingState,
	setDialogueStateBypassPause,
} from '~/states/store';

async function generateAgentDialogue(question: string) {
	const res = await requestChatCompletion(question);
	const content = res?.choices[0].message.content || '';
	return content;
}

export async function answerUserDialogue(
	question: string,
	setAgentMessage: React.Dispatch<React.SetStateAction<string>>
) {
	console.log('user question: ', question);
	const systemStatus = getDialogueStatus();
	const langauge = getSettingState().language;
	if (systemStatus !== SystemStatus.GENERATE || question.length === 0) return;
	if (langauge === LANGUAGE.KR) {
		const translatedQuestion = await postPapagoTranslation(
			question,
			LANGUAGE.KR,
			LANGUAGE.US
		);
		const answer = await generateAgentDialogue(translatedQuestion);
		const translatedAnswer = await postPapagoTranslation(
			answer,
			LANGUAGE.US,
			LANGUAGE.KR
		);
		setAgentMessage(translatedAnswer);
		console.log('agent answer: ', translatedAnswer);
		setDialogueStateBypassPause(SystemStatus.SPEAK);
		await playTextToAudio(translatedAnswer);
		setDialogueStateBypassPause(SystemStatus.WAIT);
	} else if (langauge === LANGUAGE.US) {
		const answer = await generateAgentDialogue(question);
		setAgentMessage(answer);
		setDialogueStateBypassPause(SystemStatus.SPEAK);
		await playTextToAudio(answer);
		console.log('agent answer: ', answer);
		setDialogueStateBypassPause(SystemStatus.WAIT);
	}
}
