import { setValueOnEnvironment } from '~/utils/common';

const backendApiUrl = setValueOnEnvironment(
	'/backend',
	'https://sgu-hci.p-e.kr',
	'https://sgu-hci.p-e.kr'
);

// const INITIALIZATION_URL = `${backendApiUrl}/api/v1/session/init`;
const INITIALIZATION_URL = `https://sgu-hci.p-e.kr/api/v1/session/init`;

export async function getCookie() {
	const res = await fetch(INITIALIZATION_URL, {
		credentials: 'include',
	});
	console.log(res);
	return res.status === 200;
}
