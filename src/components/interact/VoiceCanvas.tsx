/* eslint-disable react/no-unknown-property */
import React, { useState, useTransition, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import {
	RandomizedLight,
	Center,
	Environment,
	OrbitControls,
	MeshTransmissionMaterial,
	AccumulativeShadows,
} from '@react-three/drei';
import { Vector3, SphereGeometry } from 'three';
import { useControls } from 'leva';
import * as THREE from 'three';

interface ActionSphereProps {
	speed: number;
	color: THREE.Color;
	position: Vector3;
	radius: number;
}

function ActionSphere({ speed, color, position, radius }: ActionSphereProps) {
	const meshRef =
		useRef<THREE.Mesh<THREE.BufferGeometry, THREE.Material | THREE.Material[]>>(
			null
		);
	useFrame((state, delta) => {
		const currentTime = state.clock.elapsedTime;
		if (meshRef.current) {
			const cx = position.x + 0.3 * Math.cos(currentTime * speed);
			const cy = position.y + 0.3 * Math.sin(currentTime * speed);
			const cz = position.z;
			meshRef.current.position.set(cx, cy, cz);
		}
	});

	return (
		<Center>
			<mesh ref={meshRef} castShadow>
				<sphereGeometry args={[radius, 32, 32]} />
				<meshStandardMaterial color={color} />
			</mesh>
		</Center>
	);
}

function Sphere() {
	const geometryRef = useRef<SphereGeometry | null>(null);
	const transmissionConfig = useControls({
		meshPhysicalMaterial: false,
		transmissionSampler: false,
		backside: false,
		samples: { value: 10, min: 1, max: 32, step: 1 },
		resolution: { value: 2048, min: 256, max: 2048, step: 256 },
		transmission: { value: 1, min: 0, max: 1 },
		roughness: { value: 0.0, min: 0, max: 1, step: 0.01 },
		thickness: { value: 3.5, min: 0, max: 10, step: 0.01 },
		ior: { value: 1.5, min: 1, max: 5, step: 0.01 },
		chromaticAberration: { value: 0.8, min: 0, max: 1 },
		anisotropy: { value: 0.5, min: 0, max: 1, step: 0.01 },
		distortion: { value: 0.5, min: 0, max: 1, step: 0.01 },
		distortionScale: { value: 0.3, min: 0.01, max: 1, step: 0.01 },
		temporalDistortion: { value: 0.6, min: 0, max: 1, step: 0.01 },
		clearcoat: { value: 1, min: 0, max: 1 },
		attenuationDistance: { value: 0.5, min: 0, max: 10, step: 0.01 },
		attenuationColor: '#ffffff',
		color: '#ffffff',
		bg: '#839681',
	});
	useFrame((state, delta) => {
		// shape morphing
		// texture morphing
	});

	return (
		<Center>
			<mesh castShadow>
				<sphereGeometry ref={geometryRef} args={[1, 64, 64]} />
				<MeshTransmissionMaterial {...transmissionConfig} />
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
			<ambientLight intensity={1} />
			<group position={new Vector3(0, 0, 0)}>
				<Sphere />
			</group>
			<group>
				<ActionSphere
					speed={1}
					color={new THREE.Color('rgb(255, 255, 0)')}
					position={new Vector3(-0.1, -0.1, -0)}
					radius={0.4}
				/>
				<ActionSphere
					speed={1}
					color={new THREE.Color('rgb(255, 0, 255)')}
					position={new Vector3(0.1, 0.1, -0)}
					radius={0.4}
				/>
				<ActionSphere
					speed={1}
					color={new THREE.Color('rgb(0, 255, 255)')}
					position={new Vector3(-0.1, 0.1, -0)}
					radius={0.4}
				/>
			</group>
			{/* <Environment
				files="https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/1k/dancing_hall_1k.hdr"
				blur={1}
			/> */}
			<OrbitControls />
		</Canvas>
	);
}

export default VoiceCanvas;
