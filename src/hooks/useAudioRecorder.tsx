import { useEffect, useState } from 'react';
import { blobToBase64 } from '../utils/googleTranscript';

const chunks: Blob[] = [];

interface IUseAudioRecorderProps {
	stream: MediaStream | null;
	active: boolean;
}

function useAudioRecorder({ stream, active }: IUseAudioRecorderProps) {
	const [record, setRecord] = useState<string>('');
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
				setRecord(blobBase64);
			};
			setMediaRecorder(newRecorder);
		} else {
			setMediaRecorder(null);
		}
	}, [stream]);

	useEffect(() => {
		if (active && mediaRecorder?.state === 'inactive') {
			chunks.splice(0);
			mediaRecorder.start();
			setRecord('');
		} else if (!active && mediaRecorder?.state === 'recording') {
			mediaRecorder.stop();
			chunks.splice(0);
		}
	}, [active]);

	return { record };
}

export default useAudioRecorder;
