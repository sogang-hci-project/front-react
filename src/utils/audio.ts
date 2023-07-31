import { SystemStatus, LANGUAGE } from '~/types/common';
import { getGoogleTextToSpeech } from '@api/googlecloud';
import { postNaverTextToSpeech } from '~/api/clova';
import {
	getVoiceSpeed,
	getDialogueStatus,
	getSettingState,
	setDialogueStateBypassPause,
} from '~/states/store';
import { postBackendTextToSpeech } from '~/api/backend';

interface ITimeoutRef {
	current: null | NodeJS.Timeout;
}

const audio = new Audio();
audio.volume = 0;
const timeoutRef: ITimeoutRef = { current: null };

export function playAudio(src: string) {
	if (src.length === 0) return;
	audio.src = src;
	const audioSpeed = getVoiceSpeed();
	return new Promise<void>((resolve) => {
		const playButton = document.createElement('button');
		playButton.onclick = () => {
			void audio.play();
		};
		audio.volume = 0.5;
		audio.playbackRate = audioSpeed;
		audio.onended = () => resolve();
		playButton.click();
	});
}

export function stopAudio() {
	audio.src = '';
	if (!audio.paused) void audio.pause();
}

interface IToggleVoiceArguments {
	voiceVolume: number;
	isMute: boolean;
}

export function toggleSystemStatusOnVolume({
	voiceVolume,
	isMute,
}: IToggleVoiceArguments) {
	if (isMute) return;
	const systemStatus = getDialogueStatus();
	const settingState = getSettingState();
	const [ACTIVATION_VOLUME, DEACTIVATION_VOLUME, VOICE_DEACTIVATION_TIME] = [
		settingState.voiceActivationVolume,
		settingState.voiceDeactivationVolume,
		settingState.voiceDeacitvationInterval,
	];
	if (
		voiceVolume > ACTIVATION_VOLUME &&
		[SystemStatus.READY, SystemStatus.WAIT].includes(systemStatus)
	) {
		setDialogueStateBypassPause(SystemStatus.LISTEN);
		stopAudio();
	} else if (
		voiceVolume < DEACTIVATION_VOLUME &&
		systemStatus === SystemStatus.LISTEN &&
		timeoutRef.current === null
	) {
		timeoutRef.current = setTimeout(() => {
			setDialogueStateBypassPause(SystemStatus.TRANSCRIBE);
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
	const language = getSettingState().language;
	if (language === LANGUAGE.KR) {
		const data = await postBackendTextToSpeech(text);
		await playAudio(data);
	} else if (language === LANGUAGE.US) {
		const audioString = await getGoogleTextToSpeech(text);
		const audioBlobUrl = base64ToAudioBlob(audioString);
		await playAudio(audioBlobUrl);
	}
	return;
}

export function blobToBinary(blob: Blob) {
	return new Promise<Uint8Array>((resolve, reject) => {
		const reader = new FileReader();
		reader.onloadend = () => {
			if (reader.readyState === FileReader.DONE) {
				const data = new Uint8Array(reader.result as ArrayBuffer);
				resolve(data);
			} else {
				reject(new Uint8Array());
			}
		};
		reader.readAsArrayBuffer(blob);
	});
}
