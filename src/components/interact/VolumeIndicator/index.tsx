import {
	ThresholdContainer,
	ThresholdIndicator,
	VolumeIndicatorWrapper,
} from './style';
import { Text } from '@components/atom/Text';
import { RxKeyboard, RxDotFilled } from 'react-icons/rx';
import { ACTIVATION_VOLUME } from '~/constants/setting';
import { SystemStatus } from '~/types/common';

interface VolumeIndicatorProps {
	systemStatus: SystemStatus;
	volume: number;
}

export default function VolumeIndicator({
	systemStatus,
	volume,
}: VolumeIndicatorProps) {
	return (
		<VolumeIndicatorWrapper volume={volume}>
			<ThresholdContainer>
				<ThresholdIndicator threshold={ACTIVATION_VOLUME} />
			</ThresholdContainer>
			{/* <Text size={1.2}></Text> */}
		</VolumeIndicatorWrapper>
	);
}
