import { useEffect } from 'react';

const audio = new Audio();

export function playAudio(src: string) {
	audio.src = src;
	void audio.play();
}

export function stopAudio() {
	audio.src = '';
	if (!audio.paused) void audio.pause();
}
