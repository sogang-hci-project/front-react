import { Configuration, OpenAIApi } from 'openai';

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

const configuration = new Configuration({
	organization: process.env.REACT_APP_OPEN_AI_ORGANIZATION_KEY,
	apiKey: process.env.REACT_APP_OPEN_AI_API_KEY,
});
const openai = new OpenAIApi(configuration);
export async function requestChatCompletion(query: string) {
	const modifiedQuery =
		'this is role play. answer to following question as a Claude Monet, question: ' +
		query;

	const res = await fetch('https://api.openai.com/v1/chat/completions', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${process.env.REACT_APP_OPEN_AI_API_KEY || ''}`,
		},
		body: JSON.stringify({
			model: 'gpt-3.5-turbo',
			messages: [{ role: 'user', content: modifiedQuery }],
			max_tokens: 64,
		}),
	});

	const data = (await res.json()) as IChatCompletion;
	return data;
}
