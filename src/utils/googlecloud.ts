import { LANG } from '../constants/setting';
import { getQueryString } from './common';

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

interface IGoogleTextToSpeechResponse {
	audioConfig: {
		audioEncoding: string;
		pitch: number;
		sampleRateHertz: number;
		speakingRate: number;
		volumeGainDb: number;
	};
	audioContent: string;
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

export function base64ToAudio(audioString: string) {
	// Convert the base64 string to a binary string
	const binaryString = atob(audioString);

	// Convert the binary string to an ArrayBuffer
	const arrayBuffer = new ArrayBuffer(binaryString.length);
	const uint8Array = new Uint8Array(arrayBuffer);
	for (let i = 0; i < binaryString.length; i++) {
		uint8Array[i] = binaryString.charCodeAt(i);
	}

	// Create a Blob object from the ArrayBuffer
	const blob = new Blob([uint8Array], { type: 'audio/mpeg' });

	// Create a URL object from the Blob
	const url = URL.createObjectURL(blob);

	// Create a new Audio object from the URL
	const audio = new Audio(url);

	return audio;
}

export async function getGoogleTextToSpeech(inputText: string) {
	try {
		const res = await fetch(
			`https://texttospeech.googleapis.com/v1beta1/text:synthesize?${getQueryString(
				transcriptQueries
			)}`,
			{
				method: 'POST',
				headers: transcriptHeader,
				body: JSON.stringify({
					input: {
						text: inputText,
					},
					voice: {
						languageCode: LANG,
						name: 'en-US-Studio-M',
						ssmlGender: 'MALE',
					},
					audioConfig: {
						audioEncoding: 'MP3',
					},
				}),
			}
		);

		const body = (await res.json()) as IGoogleTextToSpeechResponse;
		return body.audioContent;
	} catch (error) {
		return Promise.reject(error);
	}
}
