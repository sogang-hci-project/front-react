/* eslint-disable react/no-unknown-property */
// [#14] 이슈: eslint-react와 three.js간 호환성
import React, { useRef } from 'react';
import { useFrame, Object3DNode } from '@react-three/fiber';
import { Vector3 } from 'three';
import * as THREE from 'three';
import { SystemStatus } from '~/types/common';

interface ActionSphereProps {
	speed: number;
	color: THREE.Color;
	position: Vector3;
	radius: number;
	systemStatus: SystemStatus;
}

export default function ActionSphere({
	speed,
	color,
	position,
	radius,
	systemStatus,
}: ActionSphereProps) {
	const meshRef =
		useRef<THREE.Mesh<THREE.BufferGeometry, THREE.Material | THREE.Material[]>>(
			null
		);
	const speedSlope = systemStatus === SystemStatus.LISTEN ? 1 : 0.2;

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
