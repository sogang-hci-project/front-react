/* eslint-disable react/no-unknown-property */
// [#14] 이슈: eslint-react와 three.js간 호환성
import { useRef } from 'react';
import { Center, MeshTransmissionMaterial } from '@react-three/drei';
import { Vector3, SphereGeometry } from 'three';
import { SystemStatus } from '~/types/common';

interface MainSphereProps {
	systemStatus: SystemStatus;
	voiceVolume: number;
}

export default function MainSphere({
	systemStatus,
	voiceVolume,
}: MainSphereProps) {
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

	const variableDistortion =
		systemStatus === SystemStatus.LISTEN ? voiceVolume / 100 : 0;

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

	// useFrame((state, delta) => {
	// shape morphing
	// texture morphing
	// });

	return (
		<Center>
			<group position={new Vector3(0, 0, 0)}>
				<mesh>
					<sphereGeometry ref={geometryRef} args={[1, 64, 64]} />
					<MeshTransmissionMaterial {...transmissionCofig} />
				</mesh>
			</group>
		</Center>
	);
}
