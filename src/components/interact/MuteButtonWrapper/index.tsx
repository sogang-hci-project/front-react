import React, { useState, Dispatch, SetStateAction } from 'react';
import { MuteButton, Dot } from './style';
import { Text } from '../../atom/Text';
import { RxEyeOpen, RxEyeClosed } from 'react-icons/rx';
import { SystemStatus } from '../../../types/common';

const activeMessage = <RxEyeOpen />;
const inactiveMessage = <RxEyeClosed />;
// const activeMessage = (
// 	<>
// 		<Dot className="one" />
// 		<Dot className="two" />
// 		<Dot className="three" />
// 		<Dot className="four" />
// 		<Dot className="five" />
// 	</>
// );

interface MuteButtonWrapperProps {
	systemStatus: SystemStatus;
	handleMuteButton?: () => void;
}

export default function MuteButtonWrapper({
	systemStatus,
	handleMuteButton,
}: MuteButtonWrapperProps) {
	return (
		<MuteButton onClick={handleMuteButton}>
			<Text>
				{systemStatus === SystemStatus.MUTE ? inactiveMessage : activeMessage}
			</Text>
		</MuteButton>
	);
}
