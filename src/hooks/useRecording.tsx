import React, { useCallback, useEffect, useState, useRef } from 'react';

async function getStream() {
	return navigator.mediaDevices.getUserMedia({ audio: true });
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
	const chunks: Blob[] = [];

	const onFrame = useCallback((analyserNode: AnalyserNode) => {
		const data = new Uint8Array(analyserNode.frequencyBinCount);
		analyserNode.getByteFrequencyData(data);
		const newVolume = Math.floor(Math.max(...data) / 2.55);
		setVolume(newVolume);
		console.log(newVolume);
	}, []);

	useEffect(() => {
		void getStream().then((newStream) => {
			if (active) {
				// analysis part
				const context = new AudioContext();
				const sourceNode = context.createMediaStreamSource(newStream);
				const analyserNode = context.createAnalyser();
				sourceNode.connect(analyserNode);

				volumeIntervalRef.current = setInterval(
					() => onFrame(analyserNode),
					100
				);

				// recording part
				const newMediaRecorder = new MediaRecorder(newStream);
				newMediaRecorder.ondataavailable = (event) => {
					// chunks.push(event.data);
				};
				newMediaRecorder.onstop = (event) => {
					const blob = new Blob(chunks, { type: 'audio/ogg; codecs=opus' });
					const url = URL.createObjectURL(blob);
				};
				setMediaRecorder(newMediaRecorder);
			} else {
				setMediaRecorder(null);
				if (volumeIntervalRef.current) {
					clearInterval(volumeIntervalRef.current);
					volumeIntervalRef.current = null;
				}
			}
		});
	}, [active]);

	return { volume };
}

export default useRecording;
