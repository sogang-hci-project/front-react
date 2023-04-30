import { LANG } from '../constants/setting';

const transcriptConfig = {
	encoding: 'WEBM_OPUS',
	sampleRateHertz: 48000,
	audioChannelCount: 1,
	languageCode: LANG,
	enableWordTimeOffsets: false,
};

const transcriptHeader = {
	'Content-Type': 'application/json',
};

const transcriptQueries = {
	key: process.env.REACT_APP_GCLOUD_API_KEY || '',
};

function getQueryString(queries: { [key: string]: string }): string {
	const res: string[] = [];
	for (const [key, value] of Object.entries(queries)) {
		res.push(`${key}=${encodeURIComponent(value)}`);
	}
	return res.join('&');
}

interface IGoogleTranscriptResponse {
	requestId: string;
	results: [
		{
			alternatives: [{ confidence: number; transcript: string }];
			languageCode: string;
		}
	];
	error?: {
		code: number;
		message: string;
		status: string;
	};
}

export async function blobToBase64(blob: Blob) {
	return new Promise<string>((resolve, reject) => {
		const reader = new FileReader();
		reader.onloadend = () => {
			if (typeof reader.result === 'string') {
				const comma = /,\s*(.*)(?=,|$)/;
				const v = reader.result.match(comma);
				if (v?.length == 2) resolve(v[1]);
			} else reject();
		};
		reader.readAsDataURL(blob);
	});
}

export async function getGoogleTranscript(blobString: string) {
	try {
		const res = await fetch(
			`https://speech.googleapis.com/v1/speech:recognize?${getQueryString(
				transcriptQueries
			)}`,
			{
				method: 'POST',
				headers: transcriptHeader,
				body: JSON.stringify({
					config: transcriptConfig,
					audio: {
						content: blobString,
					},
				}),
			}
		);
		const {
			results: [
				{
					alternatives: [{ transcript }],
				},
			],
		} = (await res.json()) as IGoogleTranscriptResponse;
		return transcript;
	} catch (error) {
		return Promise.reject(error);
	}
}
