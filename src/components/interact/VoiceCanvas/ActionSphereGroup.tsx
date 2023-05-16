import { useRef } from 'react';
import ActionSphere from './ActionSphere';
import { Vector3 } from 'three';
import * as THREE from 'three';
import { SystemStatus } from '~/types/common';
import { useFrame } from '@react-three/fiber';

interface IActionSphereGroup {
	systemStatus: SystemStatus;
}

function ActionSphereGroup({ systemStatus }: IActionSphereGroup) {
	const sphereGroupRef = useRef<THREE.Group | null>(null);
	const [asaV, asbV, ascV] =
		systemStatus === SystemStatus.GENERATE ? [1, 2, 3] : [1, 2, 3];
	const [asaA, asbA, ascA] =
		systemStatus === SystemStatus.GENERATE ? [1, 2, 3] : [0, 0, 0];
	const dist = systemStatus === SystemStatus.GENERATE ? -10 : 0;
	useFrame(() => {
		sphereGroupRef.current?.position.lerp(new Vector3(0, 0, dist), 0.01);
	});

	return (
		<group ref={sphereGroupRef}>
			<ActionSphere
				speed={asaV}
				color={new THREE.Color('rgb(255, 255, 0)')}
				position={new Vector3(-0.1, -0.1, 0)}
				radius={0.4}
				angle={asaA}
				systemStatus={systemStatus}
			/>
			<ActionSphere
				speed={asbV}
				color={new THREE.Color('rgb(255, 0, 255)')}
				position={new Vector3(0.1, 0.1, 0)}
				radius={0.4}
				angle={asbA}
				systemStatus={systemStatus}
			/>
			<ActionSphere
				speed={ascV}
				color={new THREE.Color('rgb(0, 255, 255)')}
				position={new Vector3(-0.1, 0.1, 0)}
				radius={0.4}
				angle={ascA}
				systemStatus={systemStatus}
			/>
		</group>
	);
}

export default ActionSphereGroup;
