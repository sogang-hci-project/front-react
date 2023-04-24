/* eslint-disable react/no-unknown-property */
import React, { useState, useTransition, useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import {
	Center,
	OrbitControls,
	MeshTransmissionMaterial,
	Line,
} from '@react-three/drei';
import { Vector3, SphereGeometry } from 'three';
import { useControls } from 'leva';
import * as THREE from 'three';
import { EffectComposer, Bloom } from '@react-three/postprocessing';

interface ActionSphereProps {
	speed: number;
	color: THREE.Color;
	position: Vector3;
	radius: number;
	voiceActive: boolean;
}

function ActionSphere({
	speed,
	color,
	position,
	radius,
	voiceActive,
}: ActionSphereProps) {
	const meshRef =
		useRef<THREE.Mesh<THREE.BufferGeometry, THREE.Material | THREE.Material[]>>(
			null
		);
	const speedSlope = voiceActive ? 1 : 0.2;

	useFrame((state, delta) => {
		const timeIncrement = state.clock.elapsedTime * speed * speedSlope;
		if (meshRef.current) {
			const cx = position.x + 0.3 * Math.cos(timeIncrement);
			const cy = position.y + 0.3 * Math.sin(timeIncrement);
			const cz = position.z + 0.3 * Math.sin(timeIncrement);
			meshRef.current.position.set(cx, cy, cz);
		}
	});

	return (
		<mesh ref={meshRef}>
			<sphereGeometry args={[radius, 32, 32]} />
			<meshStandardMaterial color={color} />
		</mesh>
	);
}

interface MainSphereProps {
	voiceActive: boolean;
	voiceLevel: number;
}

function MainSphere({ voiceActive, voiceLevel }: MainSphereProps) {
	const geometryRef = useRef<SphereGeometry | null>(null);

	// [Codeblock for parameter tuning]
	// const transmissionConfigControl = useControls({
	// 	meshPhysicalMaterial: false,
	// 	transmissionSampler: false,
	// 	backside: false,
	// 	samples: { value: 10, min: 1, max: 32, step: 1 },
	// 	resolution: { value: 2048, min: 256, max: 2048, step: 256 },
	// 	transmission: { value: 1, min: 0, max: 1 },
	// 	roughness: { value: 0.0, min: 0, max: 1, step: 0.01 },
	// 	thickness: { value: 3.5, min: 0, max: 10, step: 0.01 },
	// 	ior: { value: 1.5, min: 1, max: 5, step: 0.01 },
	// 	chromaticAberration: { value: 0.8, min: 0, max: 1 },
	// 	anisotropy: { value: 0.5, min: 0, max: 1, step: 0.01 },
	// 	distortion: { value: 0.5, min: 0, max: 1, step: 0.01 },
	// 	distortionScale: { value: 0.3, min: 0.01, max: 1, step: 0.01 },
	// 	temporalDistortion: { value: 0.6, min: 0, max: 1, step: 0.01 },
	// 	clearcoat: { value: 1, min: 0, max: 1 },
	// 	attenuationDistance: { value: 0.5, min: 0, max: 10, step: 0.01 },
	// 	attenuationColor: '#ffffff',
	// 	color: '#ffffff',
	// 	bg: '#ffffff',
	// });

	const variableDistortion = voiceActive ? 0.5 : 0;

	const transmissionCofig = {
		meshPhysicalMaterial: false,
		transmissionSampler: false,
		backside: false,
		samples: 10,
		resolution: 512,
		transmission: 1,
		roughness: 0,
		thickness: 3.5,
		ior: 1.5,
		chromaticAberration: 0.8,
		anisotropy: 0.5,
		distortion: variableDistortion,
		distortionScale: 0.3,
		temporalDistortion: 0.6,
		clearcoat: 1,
		attenuationDIstance: 0.5,
		attenuationColor: '#ffffff',
		color: '#ffffff',
		bg: '#ffffff',
	};

	useFrame((state, delta) => {
		// shape morphing
		// texture morphing
	});

	return (
		<Center>
			<group position={new Vector3(0, 0, 0)}>
				<mesh castShadow>
					<sphereGeometry ref={geometryRef} args={[1, 64, 64]} />
					<MeshTransmissionMaterial {...transmissionCofig} />
				</mesh>
			</group>
		</Center>
	);
}

// Idea source: https://github.com/Domenicobrz/Blurry/blob/master/libs/scenes/codrops-article/v2.js

function CircularMesh() {
	const groupRef = useRef<THREE.Group>(null);
	const rotationEuler = new THREE.Euler(0, 0, 0);
	const rotationSpeed = 0.05;

	useFrame((state, delta) => {
		const timeIncrement = state.clock.elapsedTime * rotationSpeed;
		rotationEuler.x = 1.5708 * timeIncrement;
		rotationEuler.y = 1.5708;
		rotationEuler.z = 1.5708 * timeIncrement;
		groupRef.current?.setRotationFromEuler(rotationEuler);
	});

	const lineArray = useMemo(() => {
		const lines = [];
		const r1 = 35;
		const r2 = 17;
		let keyId = 0;

		for (let j = 0; j < r2; j++) {
			for (let i = 0; i < r1; i++) {
				keyId++;
				const phi1 = ((j + i * 0.075) / r2) * Math.PI * 2;
				const theta1 = (i / r1) * Math.PI - Math.PI * 0.5;

				const phi2 = ((j + (i + 1) * 0.075) / r2) * Math.PI * 2;
				const theta2 = ((i + 1) / r1) * Math.PI - Math.PI * 0.5;

				const x1 = Math.sin(phi1) * Math.cos(theta1);
				const y1 = Math.sin(theta1);
				const z1 = Math.cos(phi1) * Math.cos(theta1);

				const x2 = Math.sin(phi2) * Math.cos(theta2);
				const y2 = Math.sin(theta2);
				const z2 = Math.cos(phi2) * Math.cos(theta2);

				const v1 = new Vector3(x1, z1, y1).multiplyScalar(0.5);
				const v2 = new Vector3(x2, z2, y2).multiplyScalar(0.5);

				lines.push(<Line key={keyId} points={[v1, v2]} color="white" />);
			}
		}
		return lines;
	}, []);

	return <group ref={groupRef}>{lineArray}</group>;
}

interface RigProps {
	voiceActive: boolean;
}

function Rig({ voiceActive }: RigProps) {
	return useFrame(({ camera }) => {
		const nz = voiceActive ? 3 : 4;
		const vec = new Vector3(0, 0, nz);
		camera.position.lerp(vec, 0.125);
		camera.lookAt(0, 0, 0);
	});
}

interface LightGroupProps {
	voiceActive: boolean;
	voiceLevel: number;
}

function LightGroup({ voiceActive, voiceLevel }: LightGroupProps) {
	const lightIntensity = voiceActive ? 1 : 0.5;
	return (
		<group>
			<ambientLight intensity={lightIntensity} />
		</group>
	);
}

interface VoiceCanvasProps {
	voiceActive: boolean;
}

function VoiceCanvas({ voiceActive }: VoiceCanvasProps) {
	const voiceLevel = 0;

	return (
		<Canvas shadows camera={{ position: [0, 0, 3], fov: 50 }}>
			<CircularMesh />
			<Rig voiceActive={voiceActive} />
			<LightGroup voiceActive={voiceActive} voiceLevel={voiceLevel} />
			<MainSphere voiceActive={voiceActive} voiceLevel={voiceLevel} />
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
			{/* <primitive object={new THREE.AxesHelper(10)} /> */}
			{/* <Environment
				files="https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/1k/dancing_hall_1k.hdr"
				blur={1}
			/> */}
			<OrbitControls />
			<EffectComposer>
				<Bloom luminanceThreshold={0} luminanceSmoothing={0.9} height={300} />
			</EffectComposer>
		</Canvas>
	);
}

export default VoiceCanvas;
