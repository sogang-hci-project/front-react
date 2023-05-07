import { useEffect, useState } from 'react';
import { LANG } from '../constants/setting';
import { SystemStatus } from '../types/common';

const SpeechRecognition = window.SpeechRecognition || webkitSpeechRecognition;
const recognition = new SpeechRecognition();
recognition.lang = LANG;
recognition.interimResults = true;
recognition.continuous = true;

interface IUseRecognitionProps {
	systemStatus: SystemStatus;
}

function useRecognition({ systemStatus }: IUseRecognitionProps) {
	const [transcript, setTranscript] = useState<string>('');

	recognition.onresult = (event) => {
		const [[{ transcript: result }]] = event.results;
		setTranscript(result);
	};

	useEffect(() => {
		if (systemStatus === SystemStatus.LISTEN) recognition.start();
		else recognition.stop();
	}, [systemStatus]);

	return { transcript };
}

export default useRecognition;
