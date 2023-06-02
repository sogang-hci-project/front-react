import { useEffect, useState } from 'react';
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
recognition.interimResults = true;
recognition.continuous = true;
recognition.onerror = (error) =>
	handleError({
		message: 'Local Recognition' + error.message,
		origin: ServiceType.LOCAL_STT,
	});

function useLocalRecognition() {
	const [transcript, setTranscript] = useState<string>('');
	const [systemStatus, language] = useAppSelector((state) => [
		state.dialogue.status,
		state.setting.language,
	]);

	const dispatch = useAppDispatch();

	useEffect(() => {
		recognition.lang = language;
		if (recognition.onresult === null)
			recognition.onresult = (event) => {
				const [[{ transcript: result }]] = event.results;
				setTranscript(result);
			};
	}, []);

	useEffect(() => {
		if (systemStatus === SystemStatus.PAUSE) {
			recognition.abort();
		} else if (systemStatus === SystemStatus.TRANSCRIBE) {
			dispatch(setDialogueStateBypassPause(SystemStatus.GENERATE));
			recognition.stop();
		} else if ([SystemStatus.READY, SystemStatus.WAIT].includes(systemStatus)) {
			recognition.abort();
			recognition.startAsync();
		}
	}, [systemStatus]);

	return { transcript };
}

export default useLocalRecognition;
