import { MuteButton } from './style';
import { Text } from '../../atom/Text';
import { RxEyeOpen, RxEyeClosed } from 'react-icons/rx';
import { SystemStatus } from '../../../types/common';

const activeMessage = <RxEyeOpen />;
const inactiveMessage = <RxEyeClosed />;

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
			<Text size={1.2}>
				{systemStatus === SystemStatus.MUTE ? inactiveMessage : activeMessage}
			</Text>
		</MuteButton>
	);
}
