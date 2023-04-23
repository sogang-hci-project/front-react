/* eslint-disable react/no-unknown-property */
import React, { useState, useTransition } from 'react';
import { Canvas } from '@react-three/fiber';
import {
	RandomizedLight,
	Center,
	Environment,
	OrbitControls,
} from '@react-three/drei';
import { Color, Vector3 } from 'three';

function Sphere() {
	const roughness = 0.8;
	return (
		<Center>
			<mesh castShadow>
				<sphereGeometry args={[1, 64, 64]} />
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
		<Canvas shadows camera={{ position: [0, 0, 3], fov: 50 }}>
			<group position={new Vector3(0, 0, 0)}>
				<Sphere />
				<spotLight
					intensity={1}
					angle={0.2}
					penumbra={1}
					position={[0, 0, 10]}
					color={new Color(0, 0, 1)}
				/>
				<spotLight
					intensity={1}
					angle={0.2}
					penumbra={1}
					position={[10, 10, 10]}
					color={new Color(0, 1, 0)}
				/>
				<spotLight
					intensity={1}
					angle={0.2}
					penumbra={1}
					position={[-10, 10, 10]}
					color={new Color(1, 0, 0)}
				/>
				<ambientLight intensity={0.3} />
			</group>
			{/* <Env /> */}
			<OrbitControls />
		</Canvas>
	);
}

export default VoiceCanvas;
