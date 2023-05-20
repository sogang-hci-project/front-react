import React from 'react';
import { SystemStatus } from '~/types/common';
import { getGoogleTextToSpeech } from '@api/googlecloud';
import {
	ACTIVATION_VOLUME,
	DEACTIVATION_VOLUME,
	VOICE_DEACTIVATION_TIME,
} from '~/constants/setting';

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

export const checkMute =
	(newStatus: SystemStatus) => (status: SystemStatus) => {
		if (status === SystemStatus.MUTE) return status;
		else return newStatus;
	};

interface IToggleVoiceArguments {
	voiceVolume: number;
	systemStatus: SystemStatus;
	setSystemStatus: React.Dispatch<React.SetStateAction<SystemStatus>>;
}

export function toggleSystemStatusOnVolume({
	voiceVolume,
	systemStatus,
	setSystemStatus,
}: IToggleVoiceArguments) {
	if (
		voiceVolume > ACTIVATION_VOLUME &&
		systemStatus === SystemStatus.HIBERNATE
	) {
		setSystemStatus(checkMute(SystemStatus.LISTEN));
		stopAudio();
	} else if (
		voiceVolume < DEACTIVATION_VOLUME &&
		systemStatus === SystemStatus.LISTEN &&
		timeoutRef.current === null
	) {
		timeoutRef.current = setTimeout(() => {
			setSystemStatus(checkMute(SystemStatus.TRANSCRIBE));
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

export function base64ToAudioBlob(audioString: string) {
	const binaryString = atob(audioString);

	const arrayBuffer = new ArrayBuffer(binaryString.length);
	const uint8Array = new Uint8Array(arrayBuffer);
	for (let i = 0; i < binaryString.length; i++) {
		uint8Array[i] = binaryString.charCodeAt(i);
	}

	const blob = new Blob([uint8Array], { type: 'audio/mpeg' });
	const url = URL.createObjectURL(blob);

	return url;
}

export async function playTextToAudio(text: string) {
	const audioString = await getGoogleTextToSpeech(text);
	const audioBlob = base64ToAudioBlob(audioString);
	await playAudio(audioBlob);
	return;
}
