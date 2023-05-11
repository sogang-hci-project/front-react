import { useEffect, useRef, useState } from 'react';
import { SystemStatus } from '~/types/common';

const audioContext = new AudioContext();
void audioContext.suspend();
const analyserNode = new AnalyserNode(audioContext);

async function getStream() {
	const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
	const sourceNode = new MediaStreamAudioSourceNode(audioContext, {
		mediaStream: stream,
	});
	sourceNode.connect(analyserNode);
	return stream;
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

	useEffect(() => {
		void getStream().then((newStream) => {
			setStream(newStream);
		});
		if (volumeIntervalRef.current) clearInterval(volumeIntervalRef.current);
		volumeIntervalRef.current = setInterval(() => {
			setVolume(getVolume(analyserNode));
		}, VOLUME_ANALYSIS_INTERVAL);
		return () => {
			if (volumeIntervalRef.current) clearInterval(volumeIntervalRef.current);
			if (stream !== null) {
				stream.getAudioTracks().forEach((track) => {
					track.stop();
					stream.removeTrack(track);
				});
				setStream(null);
			}
		};
	}, []);

	useEffect(() => {
		if (audioContext.state === 'suspended') void audioContext.resume();
	}, [stream]);

	// useEffect(() => {
	// 	if (audioContext.state === 'suspended') void audioContext.resume();
	// 	if ([SystemStatus.HIBERNATE, SystemStatus.SPEAK].includes(systemStatus)) {
	// 		if (stream !== null) {
	// 			stream.getAudioTracks().forEach((track) => {
	// 				track.stop();
	// 				stream.removeTrack(track);
	// 			});
	// 			setStream(null);
	// 		}
	// 		void getStream().then((newStream) => {
	// 			setStream(newStream);
	// 		});
	// 	}
	// }, [, systemStatus]);

	// useEffect(() => {
	// 	if (stream?.active) {
	// 		const sourceNode = new MediaStreamAudioSourceNode(audioContext, {
	// 			mediaStream: stream,
	// 		});
	// 		sourceNode.connect(analyserNode);
	// 	}
	// }, [stream]);

	return { volume, stream };
}

export default useAudioStream;
