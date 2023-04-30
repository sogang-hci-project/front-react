import React, { useCallback, useEffect, useState, useRef } from 'react';

async function getStream() {
	return navigator.mediaDevices.getUserMedia({ audio: true });
}

function downloadFromBlobUrl(url: string) {
	const link = document.createElement('a');
	link.href = url;
	link.download = 'recording.ogg';

	document.body.appendChild(link);

	link.dispatchEvent(
		new MouseEvent('click', {
			bubbles: true,
			cancelable: true,
			view: window,
		})
	);

	document.body.removeChild(link);
}

function createMediaRecorder(stream: MediaStream) {
	const newMediaRecorder = new MediaRecorder(stream);
	const chunks: Blob[] = [];

	newMediaRecorder.ondataavailable = (event) => {
		if (event.data.size > 0) {
			chunks.push(event.data);
		}
	};
	newMediaRecorder.onstop = (event) => {
		const blob = new Blob(chunks, { type: 'audio/ogg; codecs=opus' });
		const url = URL.createObjectURL(blob);
		// [DEBUG] Download the blob as ogg file
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
				const newMediaRecorder = createMediaRecorder(newStream);
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

	return { volume };
}

export default useRecording;
