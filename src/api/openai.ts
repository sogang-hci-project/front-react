import { setValueOnEnvironment, setValueOnLanguage } from '~/utils/common';
import { handleError } from '@utils/error';
import { LANGUAGE, ServiceType } from '~/types/common';

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

interface IChatContextItem {
	name: string;
	message: string;
}

const MAX_QUERY_COUNT = 100;
const MAX_MESSAGE_TOKEN_COUNT = setValueOnLanguage(64, 64, 64);

const context = new Array<IChatContextItem>();

context.push({
	name: 'Helenos',
	message: `Hi there, I'm your friend, Helenos. What is your name?`,
});

const promptBase = `You're a person named Helenos. You're now introduced a new person in art museum picturing picasso's Guernica. Reply to person's message then add question and get to know each other. Make reference on the context provided below to generate life-like dialogue. Finish the sentence as Helenos only.`;

export async function generateAgentDialogue(friendMessage: string) {
	if (/^\s*$/.test(friendMessage))
		handleError({
			message: 'OpenAI query is empty',
			origin: ServiceType.OPENAI,
		});
	if (friendMessage.length > MAX_QUERY_COUNT)
		handleError({
			message: 'OpenAI query exceeds maximum length',
			origin: ServiceType.OPENAI,
		});
	context.push({ name: 'friend', message: friendMessage });
	const previousContext = context
		.map((item) => item.name + ': ' + item.message + '.')
		.join('\n');

	const query = promptBase + '\nCONTEXT\n' + previousContext + 'Helenos: ';
	try {
		const res = await fetch('https://api.openai.com/v1/chat/completions', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${process.env.REACT_APP_OPEN_AI_API_KEY || ''}`,
			},
			body: JSON.stringify({
				model: 'gpt-3.5-turbo',
				messages: [{ role: 'user', content: query }],
				max_tokens: MAX_MESSAGE_TOKEN_COUNT,
			}),
		});
		const data = (await res.json()) as IChatCompletion;
		const helenosMessage = data.choices[0].message.content;
		context.push({ name: 'Helenos', message: helenosMessage });
		return helenosMessage || '';
	} catch (error) {
		handleError({
			message: (error as Error).message,
			origin: ServiceType.OPENAI,
		});
		return '';
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

const MAX_TRANSLATE_TOKEN_COUNT = 200;

export async function postOpenAITranslation(
	text: string,
	source: LANGUAGE,
	target: LANGUAGE
) {
	const langSource = source === LANGUAGE.KR ? 'Korean' : 'English';
	const langTarget = target === LANGUAGE.KR ? 'Korean' : 'English';

	const prompt =
		`Convert following text from ${langSource} to ${langTarget}: ` + text;

	try {
		const res = await fetch('https://api.openai.com/v1/chat/completions', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${process.env.REACT_APP_OPEN_AI_API_KEY || ''}`,
			},
			body: JSON.stringify({
				model: 'gpt-3.5-turbo',
				messages: [{ role: 'user', content: prompt }],
				max_tokens: MAX_TRANSLATE_TOKEN_COUNT,
			}),
		});
		const data = (await res.json()) as IChatCompletion;
		return data.choices[0].message.content || '';
	} catch (error) {
		handleError({
			message: (error as Error).message,
			origin: ServiceType.OPENAI,
		});
		return '';
	}
}
