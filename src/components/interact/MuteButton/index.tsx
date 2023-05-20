import { Button } from './style';
import { Text } from '@components/atom/Text';
import { RxEyeOpen, RxEyeClosed } from 'react-icons/rx';
import { SystemStatus } from '~/types/common';

const activeMessage = <RxEyeOpen />;
const inactiveMessage = <RxEyeClosed />;

interface MuteButtonProps {
	systemStatus: SystemStatus;
	handleMuteButton?: () => void;
}

export default function MuteButton({
	systemStatus,
	handleMuteButton,
}: MuteButtonProps) {
	return (
		<Button onClick={handleMuteButton}>
			<Text size={1.2}>
				{systemStatus === SystemStatus.MUTE ? inactiveMessage : activeMessage}
			</Text>
		</Button>
	);
}
