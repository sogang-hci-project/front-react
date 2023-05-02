import { useEffect, useState } from 'react';
import { LANG } from '../constants/setting';

const SpeechRecognition = window.SpeechRecognition || webkitSpeechRecognition;
const recognition = new SpeechRecognition();
recognition.lang = LANG;
recognition.interimResults = true;
recognition.continuous = true;

interface IUseRecognitionProps {
	voiceActive: boolean;
}

function useRecognition({ voiceActive }: IUseRecognitionProps) {
	const [transcript, setTranscript] = useState<string>('');

	recognition.onresult = (event) => {
		const [[{ transcript: result }]] = event.results;
		setTranscript(result);
	};

	useEffect(() => {
		if (voiceActive) recognition.start();
		else recognition.stop();
	}, [voiceActive]);

	return { transcript };
}

export default useRecognition;
