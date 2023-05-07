import { useEffect, useState, useRef } from 'react';
import { getGoogleTranscript } from '../api/googlecloud';
import { SystemStatus } from '../types/common';
import { blobToAudioBase64, checkMute } from '../utils/audio';

const chunks: Blob[] = [];

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
	const mediaRecorder = useRef<MediaRecorder | null>(null);

	useEffect(() => {
		if (stream) {
			const newRecorder = new MediaRecorder(stream);
			newRecorder.ondataavailable = (event) => {
				chunks.push(event.data);
			};
			newRecorder.onstop = async () => {
				setSystemStatus(checkMute(SystemStatus.TRANSCRIBE));
				const blob = new Blob(chunks, { type: 'audio/webm;codecs=opus' });
				const blobBase64 = await blobToAudioBase64(blob);
				const script = await getGoogleTranscript(blobBase64);
				setTranscript(script);
			};
			mediaRecorder.current = newRecorder;
		} else {
			mediaRecorder.current = null;
		}
	}, [stream]);

	useEffect(() => {
		if (systemStatus !== SystemStatus.GENERATE) setTranscript('');
		if (
			systemStatus === SystemStatus.LISTEN &&
			mediaRecorder.current?.state === 'inactive'
		) {
			chunks.splice(0);
			mediaRecorder.current.start();
		} else if (
			systemStatus !== SystemStatus.LISTEN &&
			mediaRecorder.current?.state === 'recording'
		) {
			mediaRecorder.current.stop();
			chunks.splice(0);
		}
	}, [systemStatus]);

	return { transcript };
}

export default useGoogleRecognition;
