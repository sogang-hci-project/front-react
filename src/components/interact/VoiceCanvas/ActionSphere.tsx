/* eslint-disable react/no-unknown-property */
// [#14] 이슈: eslint-react와 three.js간 호환성
import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Vector3 } from 'three';
import * as THREE from 'three';
import { SystemStatus } from '~/types/common';

interface ActionSphereProps {
	speed: number;
	color: THREE.Color;
	position: Vector3;
	radius: number;
	angle: number;
	systemStatus: SystemStatus;
}

export default function ActionSphere({
	speed,
	color,
	position,
	radius,
	angle,
	systemStatus,
}: ActionSphereProps) {
	const meshRef =
		useRef<THREE.Mesh<THREE.BufferGeometry, THREE.Material | THREE.Material[]>>(
			null
		);

	const speedSlope = (() => {
		if (systemStatus === SystemStatus.LISTEN) return 1;
		else if (systemStatus === SystemStatus.GENERATE) return 2;
		else return 0.2;
	})();

	useFrame((state) => {
		const timeIncrement = state.clock.elapsedTime * speed * speedSlope;
		if (meshRef.current) {
			const cx = position.x + 0.3 * Math.cos(timeIncrement + angle);
			const cy = position.y + 0.3 * Math.sin(timeIncrement + angle);
			const cz = position.z - 0.3 * Math.sin(timeIncrement);
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
