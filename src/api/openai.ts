import { Configuration, OpenAIApi } from 'openai';
import { LANG, LANGUAGE } from '../constants/setting';
import { handleError } from '~/utils/common';

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
const MAX_TOKEN_COUNT = (() => {
	if ((LANG as LANGUAGE) === LANGUAGE.KR) return 64;
	else if ((LANG as LANGUAGE) === LANGUAGE.US) return 64;
	else return 64;
})();

const context = {
	previousQuestion: '',
	previousAnswer: '',
};

const configuration = new Configuration({
	organization: process.env.REACT_APP_OPEN_AI_ORGANIZATION_KEY,
	apiKey: process.env.REACT_APP_OPEN_AI_API_KEY,
});

const promptBase = `You are the Pablo Picasso. You're performing visual thinking strategy education to person in front of you about your painting the Guernica. Reply to the person as a Pablo Picasso then give further questions. Person's opinion : `;
const promptPostPosition = ' . Answer of Pablo Picasso: ';
const prevQPrompt = ' . Previous Audience opinion: ';
const prevAPrompt = ' . Previous Pablo Picasso Answer: ';

const openai = new OpenAIApi(configuration);
export async function requestChatCompletion(query: string) {
	if (query.length === 0) handleError('OpenAI query is empty');
	if (query.length > MAX_QUERY_COUNT)
		handleError('OpenAI query exceeds maximum length');
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
		handleError((error as Error).message);
		return;
	}
}
