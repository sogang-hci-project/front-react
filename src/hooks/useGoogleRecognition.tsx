import { useEffect, useState } from 'react';
import { blobToBase64, getGoogleTranscript } from '../utils/googlecloud';
import { SystemStatus } from '../types/common';

const chunks: Blob[] = [];

interface IUseGoogleRecognitionProps {
	stream: MediaStream | null;
	systemStatus: SystemStatus;
}

function useGoogleRecognition({
	stream,
	systemStatus,
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
				const blob = new Blob(chunks, { type: 'audio/webm;codecs=opus' });
				const blobBase64 = await blobToBase64(blob);
				const script = await getGoogleTranscript(blobBase64);
				setTranscript(script);
			};
			setMediaRecorder(newRecorder);
		} else {
			setMediaRecorder(null);
		}
	}, [stream]);

	useEffect(() => {
		if (
			systemStatus === SystemStatus.LISTEN &&
			mediaRecorder?.state === 'inactive'
		) {
			chunks.splice(0);
			mediaRecorder.start();
			setTranscript('');
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
