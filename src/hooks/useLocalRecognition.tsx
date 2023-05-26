import { useEffect, useState } from 'react';
import { LANG } from '@constants/setting';
import { ServiceType, SystemStatus } from '~/types/common';
import { handleError } from '@utils/error';
import {
	setDialogueStateBypassPause,
	useAppDispatch,
	useAppSelector,
} from '~/states/store';

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
recognition.onerror = (error) =>
	handleError({
		message: 'Local Recognition' + error.message,
		origin: ServiceType.LOCAL_STT,
	});

function useLocalRecognition() {
	const [transcript, setTranscript] = useState<string>('');
	const systemStatus = useAppSelector((state) => state.dialogue.status);
	const dispatch = useAppDispatch();

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
			dispatch(setDialogueStateBypassPause(SystemStatus.GENERATE));
		} else if ([SystemStatus.READY, SystemStatus.WAIT].includes(systemStatus)) {
			recognition.abort();
			recognition.startAsync();
			setTranscript('');
		}
	}, [systemStatus]);

	return { transcript };
}

export default useLocalRecognition;
