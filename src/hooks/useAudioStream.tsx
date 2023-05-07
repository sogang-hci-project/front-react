import { useEffect, useRef, useState } from 'react';
import { SystemStatus } from '../types/common';

const audioContext = new AudioContext();
void audioContext.suspend();
const analyserNode = new AnalyserNode(audioContext);

async function getStream() {
	return navigator.mediaDevices.getUserMedia({ audio: true });
}

function getVolume(node: AnalyserNode) {
	const data = new Uint8Array(node.frequencyBinCount);
	node.getByteFrequencyData(data);
	return Math.floor(Math.max(...data) / 2.55);
}

const VOLUME_ANALYSIS_INTERVAL = 100;
const STREAM_REFRESH_INTERVAL = 1500;

interface UseAudioStreamProps {
	systemStatus: SystemStatus;
}

function useAudioStream({ systemStatus }: UseAudioStreamProps) {
	const volumeIntervalRef = useRef<NodeJS.Timer | null>(null);
	const [volume, setVolume] = useState<number>(0);
	const [stream, setStream] = useState<MediaStream | null>(null);
	const [streamAnchor, setStreamAnchor] = useState<object>({});

	useEffect(() => {
		if (volumeIntervalRef.current) clearInterval(volumeIntervalRef.current);
		volumeIntervalRef.current = setInterval(() => {
			setVolume(getVolume(analyserNode));
		}, VOLUME_ANALYSIS_INTERVAL);
		const anchorInterval = setInterval(() => {
			setStreamAnchor({});
			// clearTimeout(anchorInterval);
		}, STREAM_REFRESH_INTERVAL);
		return () => {
			clearInterval(anchorInterval);
		};
	}, []);

	useEffect(() => {
		if (audioContext.state === 'suspended') void audioContext.resume();
		if ([SystemStatus.HIBERNATE, SystemStatus.SPEAK].includes(systemStatus)) {
			if (stream !== null) {
				stream.getAudioTracks().forEach((track) => {
					track.stop();
					stream.removeTrack(track);
				});
				setStream(null);
			}
			void getStream().then((newStream) => {
				setStream(newStream);
			});
		}
	}, [streamAnchor, systemStatus]);

	useEffect(() => {
		if (stream?.active) {
			const sourceNode = new MediaStreamAudioSourceNode(audioContext, {
				mediaStream: stream,
			});
			sourceNode.connect(analyserNode);
		}
	}, [stream]);

	return { volume, stream };
}

export default useAudioStream;
