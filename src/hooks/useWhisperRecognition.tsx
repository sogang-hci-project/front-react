import { useEffect, useState, useRef } from 'react';
import { ServiceType, SystemStatus } from '~/types/common';
import {
	useAppDispatch,
	useAppSelector,
	setDialogueStateBypassPause,
} from '~/states/store';
import { getWhisperTranscript } from '~/api/openai';
import { handleError } from '~/utils/error';
import { setUserMesasge } from '~/states/slice/dialogueSlice';

const chunks: Blob[] = [];
const INTERVAL = 2000;

interface IUseWhisperRecognitionProps {
	stream: MediaStream | null;
}

function useWhisperRecognition({ stream }: IUseWhisperRecognitionProps) {
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
				const blob = new Blob(chunks, { type: 'audio/mpeg-3' });
				chunks.splice(0);
				setAudioBlob(blob);
			};
			mediaRecorder.current.ondataavailable = (event) => {
				chunks.push(event.data);
			};
			mediaRecorder.current.start();
		}
	}, [timerObject, systemStatus]);

	useEffect(() => {
		if (systemStatus === SystemStatus.TRANSCRIBE) {
			if (mediaRecorder.current === null) {
				handleError({
					message: 'recorder not initialized',
					origin: ServiceType.OPENAI,
				});
				return;
			}
			mediaRecorder.current.stop();
		}
	}, [systemStatus]);

	useEffect(() => {
		if (systemStatus === SystemStatus.TRANSCRIBE) {
			if (audioBlob === null) {
				handleError({
					message: 'recorder not initialized',
					origin: ServiceType.OPENAI,
				});
				return;
			}
			const audioFile = new File([audioBlob], 'voice.mp3', {
				type: 'audio/mp3',
			});
			void getWhisperTranscript(audioFile).then((script) => {
				dispatch(setUserMesasge(script));
				dispatch(setDialogueStateBypassPause(SystemStatus.GENERATE));
			});
		}
	}, [audioBlob]);
}

export default useWhisperRecognition;
