import { MuteButtonWrapper, ThresholdIndicator } from './style';
import { Text } from '@components/atom/Text';
import { MdMicOff, MdMicNone } from 'react-icons/md';
import { ACTIVATION_VOLUME } from '~/constants/setting';

interface MuteButtonProps {
	isMute: boolean;
	setIsMute: React.Dispatch<React.SetStateAction<boolean>>;
	volume: number;
}

export default function MuteButton({
	isMute,
	setIsMute,
	volume,
}: MuteButtonProps) {
	return (
		<MuteButtonWrapper volume={volume} onClick={() => setIsMute(!isMute)}>
			<ThresholdIndicator threshold={ACTIVATION_VOLUME}>
				<Text size={1.2}>{isMute ? <MdMicOff /> : <MdMicNone />}</Text>
			</ThresholdIndicator>
		</MuteButtonWrapper>
	);
}
