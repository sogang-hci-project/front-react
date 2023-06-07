import { ServiceType, LANGUAGE, LocalPATH } from '~/types/common';
import { getQueryString, setValueOnLanguage } from '../utils/common';
import { handleError } from '@utils/error';
import { getSettingState } from '~/states/store';
const transcriptConfig = {
	encoding: 'WEBM_OPUS',
	sampleRateHertz: 48000,
	audioChannelCount: 1,
	languageCode: LANGUAGE.KR,
	enableWordTimeOffsets: false,
};

const transcriptHeader = {
	'Content-Type': 'application/json',
};

const transcriptQueries = {
	key: process.env.REACT_APP_GCLOUD_API_KEY || '',
};

const MAX_TRANS_LENGTH = 300000;

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
	if (!blobString || blobString.length === 0)
		handleError({
			message: 'Google STT input is empty',
			origin: ServiceType.GCLOUD_STT,
		});

	if (blobString.length > MAX_TRANS_LENGTH)
		handleError({
			message: 'Google STT input exceeds maximum length',
			origin: ServiceType.GCLOUD_STT,
		});

	transcriptConfig.languageCode = getSettingState().language;

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
		if (results === undefined) throw Error('undefined');
		const [{ alternatives }] = results || [{ alternatives: null }];
		const [{ transcript }] = alternatives ? alternatives : [{ transcript: '' }];
		return transcript;
	} catch (error) {
		const message = (error as Error).message;
		const errorMessage =
			'Google cloud: ' + message === 'undefined'
				? 'Unrecognizable Voice'
				: message;
		handleError({ message: errorMessage, origin: ServiceType.GCLOUD_STT });
		return Promise.reject(error);
	}
}

export async function getGoogleTextToSpeech(text: string) {
	if (/^\s*$/.test(text)) {
		handleError({
			message: 'empty tts input',
			origin: ServiceType.GCLOUD_TTS,
		});
		return '';
	}

	const langauge = getSettingState().language;
	const textToSpeechVoice = (() => {
		const location = window.location.href.split('/').pop();
		if (location === LocalPATH.INTERACT) {
			return setValueOnLanguage(
				'ko-KR-Standard-D',
				'en-US-Neural2-J',
				'en-US-Neural2-J'
			);
		} else if (location === LocalPATH.PROBE) {
			return setValueOnLanguage(
				'ko-KR-Standard-A',
				'en-US-Neural2-I',
				'en-US-Neural2-I'
			);
		}
		return setValueOnLanguage(
			'ko-KR-Standard-A',
			'en-US-Neural2-I',
			'en-US-Neural2-I'
		);
	})();

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
						text,
					},
					voice: {
						languageCode: langauge,
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
		handleError({
			message: (error as Error).message,
			origin: ServiceType.GCLOUD_STT,
		});
		return '';
	}
}
