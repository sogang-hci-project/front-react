import { LANG, LANGUAGE } from '../constants/setting';
import { getQueryString } from '../utils/common';

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

const MAX_TRANS_LENGTH = 300000;

const textToSpeechVoice = (() => {
	if ((LANG as LANGUAGE) === LANGUAGE.KR) {
		return 'ko-KR-Standard-D';
	} else if ((LANG as LANGUAGE) === LANGUAGE.US) {
		return 'en-US-Neural2-J';
	}
	return '';
})();

interface IGoogleTranscriptResponse {
	requestId: string;
	results?: [
		{
			alternatives: [{ confidence: number; transcript: string }];
			languageCode: string;
		}
	];
	totalBilledTIme: string;
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

export async function getGoogleTranscript(blobString: string) {
	if (blobString.length === 0) return '';
	if (blobString.length > MAX_TRANS_LENGTH) {
		alert('maximum speech length reached');
		return '';
	}
	console.log(blobString.length);
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
		const data = (await res.json()) as IGoogleTranscriptResponse;
		const results = data.results;
		const [{ alternatives }] = results ? results : [{ alternatives: null }];
		const [{ transcript }] = alternatives ? alternatives : [{ transcript: '' }];
		return transcript;
	} catch (error) {
		return Promise.reject(error);
	}
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
						name: textToSpeechVoice,
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