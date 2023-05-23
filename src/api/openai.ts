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

const MAX_QUERY_COUNT = 70;
const MAX_TOKEN_COUNT = (() => {
	if ((LANG as LANGUAGE) === LANGUAGE.KR) return 256;
	else if ((LANG as LANGUAGE) === LANGUAGE.US) return 256;
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

const promptBase = (() => {
	if ((LANG as LANGUAGE) === LANGUAGE.KR) {
		return `당신은 파블로 피카소입니다. 당신은 게르니카에 대해 관객에게 시각적 사고 전략(visual thinking strategy)을 수행하고 있습니다. 관객의 이야기에 대해 파블로 피카소의 입장에서 자세히 대답하고 관객에게 한번 질문하세요. 관객의 이야기: `;
	} else if ((LANG as LANGUAGE) === LANGUAGE.US) {
		return `You are the Pablo Picasso. You're performing visual thinking strategy to audience about your painting the Guernica. Reply to audience as a Pablo Picasso then give further questions. Audience's : `;
	}
	return '';
})();

const promptPostPosition = (() => {
	if ((LANG as LANGUAGE) === LANGUAGE.KR) {
		return ' . 파블로 피카소의 대답과 관객에 대한 질문: ';
	} else if ((LANG as LANGUAGE) === LANGUAGE.US) {
		return ' . Answer of Pablo Picasso: ';
	}
	return '';
})();

const prevQPrompt = (() => {
	if ((LANG as LANGUAGE) === LANGUAGE.KR) {
		return ' . 과거 관객의 이야기: ';
	} else if ((LANG as LANGUAGE) === LANGUAGE.US) {
		return ' . Previous Audience Question: ';
	}
	return '';
})();

const prevAPrompt = (() => {
	if ((LANG as LANGUAGE) === LANGUAGE.KR) {
		return ' . 과거 파블로 피카소의 대답과 질문: ';
	} else if ((LANG as LANGUAGE) === LANGUAGE.US) {
		return ' . Previous Pablo Picasso Answer: ';
	}
	return '';
})();

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
