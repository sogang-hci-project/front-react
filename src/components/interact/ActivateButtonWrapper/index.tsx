import React, { useState, Dispatch, SetStateAction } from 'react';
import { ActivateButton, Dot } from './style';
import { Text } from '../../atom/Text';

const inactiveMessage = 'activate';
const activeMessage = (
	<>
		<Dot className="one" />
		<Dot className="two" />
		<Dot className="three" />
		<Dot className="four" />
		<Dot className="five" />
	</>
);

interface ActivateButtonWrapperProps {
	voiceActive: boolean;
	handleActivateButton: () => void;
}

export default function ActivateButtonWrapper({
	voiceActive,
	handleActivateButton,
}: ActivateButtonWrapperProps) {
	return (
		<ActivateButton onClick={handleActivateButton}>
			<Text>{voiceActive ? activeMessage : inactiveMessage}</Text>
		</ActivateButton>
	);
}
