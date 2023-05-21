import { useEffect, useState } from 'react';
import { LANG } from '@constants/setting';
import { SystemStatus } from '~/types/common';
import { checkPause } from '~/utils/audio';
import { handleError } from '~/utils/common';

const SpeechRecognition = window.SpeechRecognition || webkitSpeechRecognition;

class AsyncSpeechRecognition extends SpeechRecognition {
	delay: number;

	ongoing: boolean;

	constructor(delay: number) {
		super();
		this.delay = delay;
		this.ongoing = false;
	}

	startAsync(): void {
		if (this.ongoing) return;
		this.ongoing = true;
		const timer = setTimeout(() => {
			this.start();
			this.ongoing = false;
			clearTimeout(timer);
		}, this.delay);
	}
}

const START_ASYNC_DELAY = 200;
const recognition = new AsyncSpeechRecognition(START_ASYNC_DELAY);
recognition.lang = LANG;
recognition.interimResults = true;
recognition.continuous = true;
recognition.onerror = (error) => handleError(error.message);

interface IUseLocalRecognitionProps {
	systemStatus: SystemStatus;
	setSystemStatus: React.Dispatch<React.SetStateAction<SystemStatus>>;
}

function useLocalRecognition({
	systemStatus,
	setSystemStatus,
}: IUseLocalRecognitionProps) {
	const [transcript, setTranscript] = useState<string>('');

	useEffect(() => {
		if (recognition.onresult === null)
			recognition.onresult = (event) => {
				const [[{ transcript: result }]] = event.results;
				setTranscript(result);
			};
	}, []);

	useEffect(() => {
		if (systemStatus === SystemStatus.PAUSE) {
			recognition.abort();
			setTranscript('');
		} else if (systemStatus === SystemStatus.TRANSCRIBE) {
			recognition.stop();
			setSystemStatus(checkPause(SystemStatus.GENERATE));
		} else if ([SystemStatus.READY, SystemStatus.WAIT].includes(systemStatus)) {
			recognition.abort();
			recognition.startAsync();
			setTranscript('');
		}
	}, [systemStatus]);

	return { transcript };
}

export default useLocalRecognition;
