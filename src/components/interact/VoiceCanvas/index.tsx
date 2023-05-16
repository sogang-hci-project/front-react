/* eslint-disable react/no-unknown-property */
// [#14] 이슈: eslint-react와 three.js간 호환성

import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { AmbientLight, Vector3 } from 'three';

import { EffectComposer, Bloom } from '@react-three/postprocessing';

import MainSphere from './MainSphere';
import { SystemStatus } from '~/types/common';
import ActionSphereGroup from './ActionSphereGroup';
import { useRef } from 'react';

interface RigProps {
	systemStatus: SystemStatus;
	voiceVolume: number;
}

function Rig({ systemStatus, voiceVolume }: RigProps) {
	return useFrame(({ camera, clock }) => {
		const timeIncrement = 0.1 * Math.sin(3 * clock.elapsedTime);
		const nz =
			SystemStatus.LISTEN === systemStatus ? 3.5 - voiceVolume / 100 : 4;
		const ny = systemStatus === SystemStatus.GENERATE ? timeIncrement : 0;
		const vec = new Vector3(0, 0, nz);
		camera.position.lerp(vec, 0.125);
		camera.lookAt(0, ny, 0);
	});
}

interface LightGroupProps {
	systemStatus: SystemStatus;
	voiceVolume: number;
}

function LightGroup({ systemStatus }: LightGroupProps) {
	const ambientLightRef = useRef<AmbientLight | null>(null);

	const targetIntensity = (() => {
		if ([SystemStatus.LISTEN, SystemStatus.SPEAK].includes(systemStatus))
			return 1;
		else if (systemStatus === SystemStatus.GENERATE) return 2;
		else return 0.5;
	})();

	useFrame(() => {
		if (!ambientLightRef.current) return;
		if (ambientLightRef.current?.intensity - targetIntensity > 0.01) {
			ambientLightRef.current.intensity -= 0.01;
		} else if (ambientLightRef.current?.intensity - targetIntensity < 0.01) {
			ambientLightRef.current.intensity += 0.01;
		}
	});

	return (
		<group>
			<ambientLight ref={ambientLightRef} />
		</group>
	);
}

interface VoiceCanvasProps {
	systemStatus: SystemStatus;
	voiceVolume: number;
}

function VoiceCanvas({ systemStatus, voiceVolume }: VoiceCanvasProps) {
	return (
		<Canvas shadows camera={{ position: [0, 0, 3], fov: 50 }}>
			{/* <CircularMesh /> */}
			<Rig systemStatus={systemStatus} voiceVolume={voiceVolume} />
			<LightGroup systemStatus={systemStatus} voiceVolume={voiceVolume} />
			<MainSphere systemStatus={systemStatus} voiceVolume={voiceVolume} />
			<ActionSphereGroup systemStatus={systemStatus} />
			{/** 시각적 도움을 받기 위해 축을 생성합니다 */}
			{/* <primitive object={new THREE.AxesHelper(10)} /> */}
			<OrbitControls />
			<EffectComposer>
				<Bloom luminanceThreshold={0} luminanceSmoothing={0.9} height={300} />
			</EffectComposer>
		</Canvas>
	);
}

export default VoiceCanvas;
