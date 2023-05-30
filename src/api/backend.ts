import { getSessionStage } from '~/states/store';
import { ServiceType } from '~/types/common';
import { setValueOnEnvironment } from '~/utils/common';
import { handleError } from '~/utils/error';
import axios from 'axios';

const backendApiUrl = setValueOnEnvironment(
	'/backend',
	'https://sgu-hci.p-e.kr/',
	'https://sgu-hci.p-e.kr/'
);

// const INITIALIZATION_URL = `${backendApiUrl}/api/v1/session/init`;
const INITIALIZATION_URL = `https://sgu-hci.p-e.kr/api/v1/session/init`;

export async function getCookie() {
	// const res = await fetch(INITIALIZATION_URL, {
	// 	credentials: 'include',
	// });
	// // console.log(res);
	// const reader = res.body?.getReader();
	// const uint8res = (await reader?.read())?.value || new Uint8Array();
	// const result = new TextDecoder().decode(uint8res);
	// console.log(result);

	try {
		const res = await axios.get(INITIALIZATION_URL, {
			withCredentials: true, // fetch API 경우 {credentials: "include" }
		});
		console.log(res);
	} catch (error) {
		console.log(error);
	}

	// return res.status === 200;
}

export async function postBackendAnswer(message: string) {
	if (message.length === 0)
		handleError({
			message: 'OpenAI query is empty',
			origin: ServiceType.BACKEND,
		});

	// const stage = getSessionStage();
	// const res = await fetch(`${backendApiUrl}/api/v1${stage}`, {
	// const res = await fetch(`https://sgu-hci.p-e.kr/api/v1/vts/init`, {
	// 	method: 'POST',
	// 	headers: {
	// 		'Content-Type': 'application/json',
	// 	},
	// 	body: JSON.stringify({
	// 		user: message,
	// 	}),
	// });
	const data = {
		user: 'my name is Siwon Jeon. who are you?',
	};

	const res = await axios.post(
		'https://sgu-hci.p-e.kr/api/v1/session/greeting',
		data
	);

	console.log(res);

	// const reader = res.body?.getReader();
	// const uint8res = (await reader?.read())?.value || new Uint8Array();
	// const result = new TextDecoder().decode(uint8res);

	// console.log(result);
}
