import React from 'react';
import { SystemStatus } from '../types/common';

const ACTIVATION_VOLUME = 80;
const DEACTIVATION_VOLUME = 40;
const VOICE_DEACTIVATION_TIME = 1000;

interface ITimeoutRef {
	current: null | NodeJS.Timeout;
}

const audio = new Audio();
const timeoutRef: ITimeoutRef = { current: null };

export function playAudio(src: string) {
	audio.src = src;
	void audio.play();
}

export function stopAudio() {
	audio.src = '';
	if (!audio.paused) void audio.pause();
}

interface IToggleVoiceArguments {
	voiceVolume: number;
	systemStatus: SystemStatus;
	setSystemStatus: (value: React.SetStateAction<SystemStatus>) => void;
}

export function toggleVoice({
	voiceVolume,
	systemStatus,
	setSystemStatus,
}: IToggleVoiceArguments) {
	if (voiceVolume > ACTIVATION_VOLUME && systemStatus !== SystemStatus.LISTEN) {
		setSystemStatus(SystemStatus.LISTEN);
		stopAudio();
	} else if (
		voiceVolume < DEACTIVATION_VOLUME &&
		systemStatus === SystemStatus.LISTEN &&
		timeoutRef.current === null
	) {
		timeoutRef.current = setTimeout(() => {
			setSystemStatus(SystemStatus.HIBERNATE);
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
