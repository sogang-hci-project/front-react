import { Configuration, OpenAIApi } from 'openai';
import { LANG, LANGUAGE } from '../constants/setting';

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

const MAX_QUERY_COUNT = 50;
const MAX_TOKEN_COUNT = (() => {
	if ((LANG as LANGUAGE) === LANGUAGE.KR) return 256;
	else if ((LANG as LANGUAGE) === LANGUAGE.US) return 64;
	else return 64;
})();

const configuration = new Configuration({
	organization: process.env.REACT_APP_OPEN_AI_ORGANIZATION_KEY,
	apiKey: process.env.REACT_APP_OPEN_AI_API_KEY,
});

const promptBase = (() => {
	if ((LANG as LANGUAGE) === LANGUAGE.KR) {
		return '당신은 클로드 모네입니다. 질문에 대해 클로드 모네의 입장에서 대답하시오. 질문: ';
	} else if ((LANG as LANGUAGE) === LANGUAGE.US) {
		return 'this is role play. answer to following question as a Claude Monet. question: ';
	}
	return '';
})();

const openai = new OpenAIApi(configuration);
export async function requestChatCompletion(query: string) {
	if (query.length === 0) return;
	if (query.length > MAX_QUERY_COUNT) {
		alert('Exceeded maximum query word count');
		return;
	}
	const modifiedQuery = promptBase + query;

	const res = await fetch('https://api.openai.com/v1/chat/completions', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${process.env.REACT_APP_OPEN_AI_API_KEY || ''}`,
		},
		body: JSON.stringify({
			model: 'gpt-3.5-turbo',
			messages: [{ role: 'user', content: modifiedQuery }],
			max_tokens: MAX_TOKEN_COUNT,
		}),
	});

	const data = (await res.json()) as IChatCompletion;
	return data;
}
