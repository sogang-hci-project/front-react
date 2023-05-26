import React from 'react';
import { SystemStatus } from '~/types/common';
import { getGoogleTextToSpeech } from '@api/googlecloud';
import {
	ACTIVATION_VOLUME,
	DEACTIVATION_VOLUME,
	LANG,
	LANGUAGE,
	VOICE_DEACTIVATION_TIME,
} from '~/constants/setting';
import { postNaverTextToSpeech } from '~/api/clova';

interface ITimeoutRef {
	current: null | NodeJS.Timeout;
}

const audio = new Audio();
audio.volume = 0;
const timeoutRef: ITimeoutRef = { current: null };

export function playAudio(src: string) {
	if (src.length === 0) return;
	audio.src = src;
	return new Promise<void>((resolve) => {
		const playButton = document.createElement('button');
		playButton.onclick = () => {
			void audio.play();
		};
		audio.volume = 0.5;
		audio.onended = () => resolve();
		playButton.click();
	});
}

export function stopAudio() {
	audio.src = '';
	if (!audio.paused) void audio.pause();
}

export const checkPause =
	(newStatus: SystemStatus) => (status: SystemStatus) => {
		if (status === SystemStatus.PAUSE) return status;
		else return newStatus;
	};

interface IToggleVoiceArguments {
	voiceVolume: number;
	systemStatus: SystemStatus;
	setSystemStatus: React.Dispatch<React.SetStateAction<SystemStatus>>;
	isMute: boolean;
}

export function toggleSystemStatusOnVolume({
	voiceVolume,
	systemStatus,
	setSystemStatus,
	isMute,
}: IToggleVoiceArguments) {
	if (isMute) return;
	if (
		voiceVolume > ACTIVATION_VOLUME &&
		[SystemStatus.READY, SystemStatus.WAIT].includes(systemStatus)
	) {
		setSystemStatus(checkPause(SystemStatus.LISTEN));
		stopAudio();
	} else if (
		voiceVolume < DEACTIVATION_VOLUME &&
		systemStatus === SystemStatus.LISTEN &&
		timeoutRef.current === null
	) {
		timeoutRef.current = setTimeout(() => {
			setSystemStatus(checkPause(SystemStatus.TRANSCRIBE));
			if (timeoutRef.current) {
				clearTimeout(timeoutRef.current);
				timeoutRef.current = null;
			}
		}, VOICE_DEACTIVATION_TIME);
	} else if (
		voiceVolume > DEACTIVATION_VOLUME &&
		systemStatus === SystemStatus.LISTEN &&
		timeoutRef.current
	) {
		clearTimeout(timeoutRef.current);
		timeoutRef.current = null;
	}
}

export async function blobToAudioBase64(blob: Blob) {
	return new Promise<string>((resolve, reject) => {
		const reader = new FileReader();
		reader.onloadend = () => {
			if (typeof reader.result === 'string') {
				const [, body] = reader.result.split(',');
				resolve(body);
			} else reject();
		};
		reader.readAsDataURL(blob);
	});
}

export function unit8ArrayToUrl(uint8Array: Uint8Array) {
	const blob = new Blob([uint8Array], { type: 'audio/mpeg' });
	const url = URL.createObjectURL(blob);
	return url;
}

export function base64ToAudioBlob(audioString: string) {
	const binaryString = atob(audioString);

	const arrayBuffer = new ArrayBuffer(binaryString.length);
	const uint8Array = new Uint8Array(arrayBuffer);
	for (let i = 0; i < binaryString.length; i++) {
		uint8Array[i] = binaryString.charCodeAt(i);
	}

	return unit8ArrayToUrl(uint8Array);
}

export async function playTextToAudio(text: string) {
	if (LANG === LANGUAGE.KR) {
		const data = (await postNaverTextToSpeech(text)) || new Uint8Array();
		const audioBlobUrl = unit8ArrayToUrl(data);
		void playAudio(audioBlobUrl);
	} else if (LANG === LANGUAGE.US) {
		const audioString = await getGoogleTextToSpeech(text);
		const audioBlobUrl = base64ToAudioBlob(audioString);
		void playAudio(audioBlobUrl);
	}
	return;
}
