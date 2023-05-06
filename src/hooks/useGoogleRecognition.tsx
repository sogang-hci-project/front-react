import { useEffect, useState } from 'react';
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
	const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(
		null
	);

	useEffect(() => {
		if (stream) {
			const newRecorder = new MediaRecorder(stream);
			newRecorder.ondataavailable = (event) => {
				chunks.push(event.data);
			};
			newRecorder.onstop = async () => {
				setSystemStatus(checkMute(SystemStatus.PROCESS));
				const blob = new Blob(chunks, { type: 'audio/webm;codecs=opus' });
				const blobBase64 = await blobToAudioBase64(blob);
				const script = await getGoogleTranscript(blobBase64);
				setTranscript(script);
			};
			setMediaRecorder(newRecorder);
		} else {
			setMediaRecorder(null);
		}
	}, [stream]);

	useEffect(() => {
		if (systemStatus !== SystemStatus.PROCESS) setTranscript('');
		if (
			systemStatus === SystemStatus.LISTEN &&
			mediaRecorder?.state === 'inactive'
		) {
			chunks.splice(0);
			mediaRecorder.start();
		} else if (
			systemStatus !== SystemStatus.LISTEN &&
			mediaRecorder?.state === 'recording'
		) {
			mediaRecorder.stop();
			chunks.splice(0);
		}
	}, [systemStatus]);

	return { transcript };
}

export default useGoogleRecognition;
