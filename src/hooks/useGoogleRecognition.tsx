import { useEffect, useState, useRef } from 'react';
import { getGoogleTranscript } from '@api/googlecloud';
import { SystemStatus } from '~/types/common';
import { blobToAudioBase64 } from '@utils/audio';
import {
	useAppDispatch,
	useAppSelector,
	setDialogueStateBypassPause,
} from '~/states/store';

const chunks: Blob[] = [];
const INTERVAL = 2000;

interface IUseGoogleRecognitionProps {
	stream: MediaStream | null;
}

function useGoogleRecognition({ stream }: IUseGoogleRecognitionProps) {
	const [transcript, setTranscript] = useState<string>('');
	const [timerObject, setTimerObject] = useState<object>({});
	const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
	const mediaRecorder = useRef<MediaRecorder | null>(null);
	const timerIntervalRef = useRef<NodeJS.Timer | null>(null);

	const systemStatus = useAppSelector((state) => state.dialogue.status);
	const dispatch = useAppDispatch();

	useEffect(() => {
		timerIntervalRef.current = setInterval(() => {
			setTimerObject({});
		}, INTERVAL);
		return () => {
			if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
		};
	}, []);

	useEffect(() => {
		if (!stream?.active) return;
		if (systemStatus === SystemStatus.LISTEN) return;
		if (mediaRecorder.current?.state === 'recording')
			mediaRecorder.current.stop();
		if ([SystemStatus.READY, SystemStatus.WAIT].includes(systemStatus)) {
			mediaRecorder.current = new MediaRecorder(stream);
			mediaRecorder.current.onstop = () => {
				const blob = new Blob(chunks, { type: 'audio/webm;codecs=opus' });
				chunks.splice(0);
				setAudioBlob(blob);
			};
			mediaRecorder.current.ondataavailable = (event) => {
				chunks.push(event.data);
			};
			mediaRecorder.current.start();
		}
	}, [timerObject]);

	useEffect(() => {
		if (systemStatus === SystemStatus.TRANSCRIBE) mediaRecorder.current?.stop();
	}, [systemStatus]);

	useEffect(() => {
		if (systemStatus === SystemStatus.TRANSCRIBE)
			void (async () => {
				if (audioBlob === null) return;
				const blobBase64 = await blobToAudioBase64(audioBlob);
				const script = await getGoogleTranscript(blobBase64);
				setTranscript(script);
				dispatch(setDialogueStateBypassPause(SystemStatus.GENERATE));
			})();
	}, [audioBlob]);

	return { transcript };
}

export default useGoogleRecognition;
