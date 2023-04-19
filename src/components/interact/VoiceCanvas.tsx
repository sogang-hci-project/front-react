/* eslint-disable react/no-unknown-property */
import React, { useState, useTransition } from 'react';
import { Canvas } from '@react-three/fiber';
import {
	AccumulativeShadows,
	RandomizedLight,
	Center,
	Environment,
	OrbitControls,
} from '@react-three/drei';
import { Vector3 } from 'three';

function Sphere() {
	const roughness = 0.8;
	return (
		<Center top>
			<mesh castShadow>
				<sphereGeometry args={[0.75, 64, 64]} />
				<meshStandardMaterial metalness={0.8} roughness={roughness} />
			</mesh>
		</Center>
	);
}

function Env() {
	// const [preset, setPreset] = useState('sunset');
	// You can use the "inTransition" boolean to react to the loading in-between state,
	// For instance by showing a message
	const [inTransition, startTransition] = useTransition();
	const blur = 0.8;
	const preset = 'sunset';
	return <Environment preset={preset} background blur={blur} />;
}

function VoiceCanvas() {
	return (
		<Canvas shadows camera={{ position: [0, 0, 4.5], fov: 50 }}>
			<group position={new Vector3(0, -0.65, 0)}>
				<Sphere />
				<RandomizedLight
					amount={8}
					radius={5}
					ambient={0.5}
					position={[0, 3, 2]}
					bias={0.001}
				/>
			</group>
			<Env />
			<OrbitControls />
		</Canvas>
	);
}

export default VoiceCanvas;
