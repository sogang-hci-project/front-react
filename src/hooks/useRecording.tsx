import React, {
	useCallback,
	useEffect,
	useState,
	useRef,
	Dispatch,
	SetStateAction,
} from 'react';
import { blobToBase64, getGoogleTranscript } from '../utils/googleTranscript';

async function getStream() {
	return navigator.mediaDevices.getUserMedia({ audio: true });
}

function createMediaRecorder(
	stream: MediaStream,
	setTranscript: Dispatch<SetStateAction<string>>
) {
	const newMediaRecorder = new MediaRecorder(stream);
	const chunks: Blob[] = [];

	newMediaRecorder.ondataavailable = (event) => {
		if (event.data.size > 0) {
			chunks.push(event.data);
		}
	};
	newMediaRecorder.onstop = async () => {
		const blob = new Blob(chunks, { type: 'audio/ogg; codecs=opus' });
		const blobBase64 = await blobToBase64(blob);
		const transcript = await getGoogleTranscript(blobBase64);
		setTranscript(transcript);
		// [DEBUG] Download the blob as ogg file
		// const url = URL.createObjectURL(blob);
		// downloadFromBlobUrl(url);
	};
	return newMediaRecorder;
}

interface UseRecordingProps {
	active: boolean;
}

function useRecording({ active }: UseRecordingProps) {
	// const [stream, setStream] = useState<MediaStream | null>(null);
	const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(
		null
	);
	const volumeIntervalRef = useRef<NodeJS.Timer | null>(null);
	const [volume, setVolume] = useState<number>(0);
	const [transcript, setTranscript] = useState<string>('');
	const VOLUME_ANALYSIS_INTERVAL = 100;

	const onFrame = useCallback((analyserNode: AnalyserNode) => {
		const data = new Uint8Array(analyserNode.frequencyBinCount);
		analyserNode.getByteFrequencyData(data);
		const newVolume = Math.floor(Math.max(...data) / 2.55);
		setVolume(newVolume);
	}, []);

	useEffect(() => {
		if (active) {
			void getStream().then((newStream) => {
				// analysis part
				const context = new AudioContext();
				const sourceNode = context.createMediaStreamSource(newStream);
				const analyserNode = context.createAnalyser();
				sourceNode.connect(analyserNode);

				volumeIntervalRef.current = setInterval(
					() => onFrame(analyserNode),
					VOLUME_ANALYSIS_INTERVAL
				);

				// recording part
				const newMediaRecorder = createMediaRecorder(newStream, setTranscript);
				newMediaRecorder.start();
				setMediaRecorder(newMediaRecorder);
			});
		} else {
			mediaRecorder?.stop();
			setMediaRecorder(null);
			if (volumeIntervalRef.current) {
				clearInterval(volumeIntervalRef.current);
				volumeIntervalRef.current = null;
			}
		}
	}, [active]);

	return { volume, transcript };
}

export default useRecording;
