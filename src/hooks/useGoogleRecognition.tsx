import { useEffect, useState, useRef } from 'react';
import { getGoogleTranscript } from '../api/googlecloud';
import { SystemStatus } from '../types/common';
import { blobToAudioBase64, checkMute } from '../utils/audio';

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
	const mediaRecorder = useRef<MediaRecorder | null>(null);

	useEffect(() => {
		if (mediaRecorder.current?.state === 'recording')
			mediaRecorder.current.stop();
		mediaRecorder.current = null;
		chunks.splice(0);
		if (stream?.active) {
			const newRecorder = new MediaRecorder(stream);
			newRecorder.ondataavailable = (event) => {
				chunks.push(event.data);
			};
			newRecorder.start();
			mediaRecorder.current = newRecorder;
		}
	}, [stream]);

	useEffect(() => {
		if (systemStatus === SystemStatus.TRANSCRIBE && mediaRecorder.current) {
			mediaRecorder.current.onstop = async () => {
				const blob = new Blob(chunks, { type: 'audio/webm;codecs=opus' });
				const blobBase64 = await blobToAudioBase64(blob);
				const script = await getGoogleTranscript(blobBase64);
				setTranscript(script);
			};
			if (mediaRecorder.current?.state === 'recording')
				mediaRecorder.current.stop();
			mediaRecorder.current = null;
			chunks.splice(0);
		}
	}, [systemStatus]);

	return { transcript };
}

export default useGoogleRecognition;
