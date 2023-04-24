import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Line } from '@react-three/drei';
import { Vector3 } from 'three';
import * as THREE from 'three';

// Idea source: https://github.com/Domenicobrz/Blurry/blob/master/libs/scenes/codrops-article/v2.js

export default function CircularMesh() {
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
