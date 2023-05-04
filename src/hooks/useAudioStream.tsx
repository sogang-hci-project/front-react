import { useEffect, useRef, useState } from 'react';

async function getStream() {
	return navigator.mediaDevices.getUserMedia({ audio: true });
}

function getVolume(node: AnalyserNode) {
	const data = new Uint8Array(node.frequencyBinCount);
	node.getByteFrequencyData(data);
	return Math.floor(Math.max(...data) / 2.55);
}

const VOLUME_ANALYSIS_INTERVAL = 100;
const STREAM_REFRESH_INTERVAL = 1000;

interface UseAudioStreamProps {
	active: boolean;
}

function useAudioStream({ active }: UseAudioStreamProps) {
	const volumeIntervalRef = useRef<NodeJS.Timer | null>(null);
	const [volume, setVolume] = useState<number>(0);
	const [stream, setStream] = useState<MediaStream | null>(null);
	const [anchor, setAnchor] = useState<object>({});

	useEffect(() => {
		if (!active) {
			if (stream !== null) stream.removeTrack(stream.getAudioTracks()[0]);

			void getStream().then((newStream) => {
				const context = new AudioContext();
				const sourceNode = context.createMediaStreamSource(newStream);
				const analyserNode = context.createAnalyser();
				sourceNode.connect(analyserNode);
				setStream(newStream);

				volumeIntervalRef.current = setInterval(
					() => setVolume(getVolume(analyserNode)),
					VOLUME_ANALYSIS_INTERVAL
				);
			});
			const anchorInterval = setTimeout(() => {
				setAnchor({});
				clearTimeout(anchorInterval);
			}, STREAM_REFRESH_INTERVAL);
		}
	}, [anchor, active]);

	return { volume, stream };
}

export default useAudioStream;
