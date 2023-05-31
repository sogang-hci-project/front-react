import { setValueOnEnvironment, setValueOnLanguage } from '~/utils/common';
import { handleError } from '@utils/error';
import { ServiceType } from '~/types/common';

interface IChatCompletion {
	id: string;
	object: string;
	created: number;
	choices: IChoice[];
	usage: {
		prompt_tokens: number;
		completion_tokens: number;
		total_tokens: number;
	};
}

interface IChoice {
	index: number;
	message: {
		role: string;
		content: string;
	};
	finish_reason: string;
}

const MAX_QUERY_COUNT = 100;
const MAX_TOKEN_COUNT = setValueOnLanguage(5, 5, 5);

const context = {
	previousQuestion: '',
	previousAnswer: '',
};

const promptBase = `You are the Pablo Picasso. You're performing visual thinking strategy education to person in front of you about your painting the Guernica. Reply to the person as a Pablo Picasso then give further questions. Person's opinion : `;
const promptPostPosition = ' . Answer of Pablo Picasso: ';
const prevQPrompt = ' . Previous Audience opinion: ';
const prevAPrompt = ' . Previous Pablo Picasso Answer: ';

export async function requestChatCompletion(query: string) {
	if (query.length === 0)
		handleError({
			message: 'OpenAI query is empty',
			origin: ServiceType.OPENAI,
		});
	if (query.length > MAX_QUERY_COUNT)
		handleError({
			message: 'OpenAI query exceeds maximum length',
			origin: ServiceType.OPENAI,
		});
	const modifiedQuery =
		context.previousQuestion +
		context.previousAnswer +
		promptBase +
		query +
		promptPostPosition;
	try {
		const res = await fetch('https://api.openai.com/v1/chat/completions', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${process.env.REACT_APP_OPEN_AI_API_KEY || ''}`,
			},
			body: JSON.stringify({
				model: 'gpt-3.5-turbo',
				// model: 'gpt-4',
				messages: [{ role: 'user', content: modifiedQuery }],
				max_tokens: MAX_TOKEN_COUNT,
			}),
		});
		const data = (await res.json()) as IChatCompletion;
		context.previousQuestion = prevQPrompt + query + ' ';
		context.previousAnswer =
			prevAPrompt + data.choices[0].message.content + ' ';
		return data;
	} catch (error) {
		handleError({
			message: (error as Error).message,
			origin: ServiceType.OPENAI,
		});
		return;
	}
}

const whisperRequestUrl = setValueOnEnvironment(
	'/openai',
	'https://api.openai.com',
	'https://api.openai.com'
);
const whisperTranscriptForm = new FormData();

whisperTranscriptForm.append('model', 'whisper-1');

interface IWhisperTranscript {
	text: string;
}

export async function getWhisperTranscript(audioFile: File) {
	const whisperPrompt = setValueOnLanguage(
		'이것은 파블로 피카소와 그림 게르니카에 대한 대화입니다. 스페인 내전 과정에서 나타난 참혹함과 그것을 표현한 게르니카에 대해 다루고 있습니다.',
		`This is a converation about the painting 'Guernica' with Pablo Picasso. It includes details about the gruesome reality of Spanish War and the artpiece 'Guernica' based on it`,
		'이것은 파블로 피카소와 그림 게르니카에 대한 대화입니다. 스페인 내전 과정에서 나타난 참혹함과 그것을 표현한 게르니카에 대해 다루고 있습니다.'
	);

	whisperTranscriptForm.delete('file');
	whisperTranscriptForm.append('file', audioFile);
	whisperTranscriptForm.delete('prompt');
	whisperTranscriptForm.append('prompt', whisperPrompt);

	try {
		const res = await fetch(`${whisperRequestUrl}/v1/audio/transcriptions`, {
			method: 'POST',
			headers: {
				Authorization: `Bearer ${process.env.REACT_APP_OPEN_AI_API_KEY || ''}`,
			},
			body: whisperTranscriptForm,
		});
		const reader = res.body?.getReader();
		const uint8res = (await reader?.read())?.value || new Uint8Array();
		const result = new TextDecoder().decode(uint8res);
		return (JSON.parse(result) as IWhisperTranscript).text || '';
	} catch (error) {
		handleError({
			message: (error as Error).message,
			origin: ServiceType.OPENAI,
		});
		return '';
	}
}
