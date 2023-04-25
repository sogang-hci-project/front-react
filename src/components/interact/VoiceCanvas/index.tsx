/* eslint-disable react/no-unknown-property */
// [#14] 이슈: eslint-react와 three.js간 호환성
import React from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { Vector3 } from 'three';
import { useControls } from 'leva';
import * as THREE from 'three';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import CircularMesh from './CircularMesh';
import MainSphere from './MainSphere';
import ActionSphere from './ActionSphere';

interface RigProps {
	voiceActive: boolean;
	voiceVolume: number;
}

function Rig({ voiceActive, voiceVolume }: RigProps) {
	return useFrame(({ camera }) => {
		const nz = voiceActive ? 3.5 - voiceVolume / 100 : 4;
		const vec = new Vector3(0, 0, nz);
		camera.position.lerp(vec, 0.125);
		camera.lookAt(0, 0, 0);
	});
}

interface LightGroupProps {
	voiceActive: boolean;
	voiceVolume: number;
}

function LightGroup({ voiceActive, voiceVolume }: LightGroupProps) {
	const lightIntensity = voiceActive ? 1 : 0.5;
	return (
		<group>
			<ambientLight intensity={lightIntensity} />
		</group>
	);
}

interface VoiceCanvasProps {
	voiceActive: boolean;
	voiceVolume: number;
}

function VoiceCanvas({ voiceActive, voiceVolume }: VoiceCanvasProps) {
	return (
		<Canvas shadows camera={{ position: [0, 0, 3], fov: 50 }}>
			{/* <CircularMesh /> */}
			<Rig voiceActive={voiceActive} voiceVolume={voiceVolume} />
			<LightGroup voiceActive={voiceActive} voiceVolume={voiceVolume} />
			<MainSphere voiceActive={voiceActive} voiceVolume={voiceVolume} />
			<group>
				<ActionSphere
					speed={1}
					color={new THREE.Color('rgb(255, 255, 0)')}
					position={new Vector3(-0.1, -0.1, 0)}
					radius={0.4}
					voiceActive={voiceActive}
				/>
				<ActionSphere
					speed={2}
					color={new THREE.Color('rgb(255, 0, 255)')}
					position={new Vector3(0.1, 0.1, 0)}
					radius={0.4}
					voiceActive={voiceActive}
				/>
				<ActionSphere
					speed={3}
					color={new THREE.Color('rgb(0, 255, 255)')}
					position={new Vector3(-0.1, 0.1, 0)}
					radius={0.4}
					voiceActive={voiceActive}
				/>
			</group>

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
