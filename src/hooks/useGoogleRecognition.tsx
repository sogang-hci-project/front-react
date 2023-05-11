import { useEffect, useState, useRef } from 'react';
import { getGoogleTranscript } from '@api/googlecloud';
import { SystemStatus } from '~/types/common';
import { blobToAudioBase64, checkMute } from '@utils/audio';

const chunks: Blob[] = [];
const INTERVAL = 2000;

interface IUseGoogleRecognitionProps {
	stream: MediaStream | null;
	systemStatus: SystemStatus;
	setSystemStatus: React.Dispatch<React.SetStateAction<SystemStatus>>;
}

function useGoogleRecognition({
	stream,
	systemStatus,
	setSystemStatus,
}: IUseGoogleRecognitionProps) {
	const [transcript, setTranscript] = useState<string>('');
	const [timerObject, setTimerObject] = useState<object>({});
	const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
	const mediaRecorder = useRef<MediaRecorder | null>(null);
	const timerIntervalRef = useRef<NodeJS.Timer | null>(null);

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
	}, [timerObject]);

	useEffect(() => {
		if (systemStatus === SystemStatus.TRANSCRIBE)
			void (async () => {
				if (audioBlob === null) return;
				const blobBase64 = await blobToAudioBase64(audioBlob);
				const script = await getGoogleTranscript(blobBase64);
				setTranscript(script);
				setSystemStatus(checkMute(SystemStatus.GENERATE));
			})();
	}, [audioBlob]);

	return { transcript };
}

export default useGoogleRecognition;
