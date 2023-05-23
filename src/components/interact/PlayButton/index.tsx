import { Button } from './style';
import { Text } from '@components/atom/Text';
import { RxStop, RxResume } from 'react-icons/rx';
import { SystemStatus } from '~/types/common';

const activeMessage = <RxStop />;
const inactiveMessage = <RxResume />;

interface PlayButtonProps {
	systemStatus: SystemStatus;
	handlePlayButton?: () => void;
}

export default function PlayButton({
	systemStatus,
	handlePlayButton,
}: PlayButtonProps) {
	return (
		<Button onClick={handlePlayButton}>
			<Text size={1.2}>
				{systemStatus === SystemStatus.PAUSE ? activeMessage : inactiveMessage}
			</Text>
		</Button>
	);
}
