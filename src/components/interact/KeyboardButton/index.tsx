import { Button } from './style';
import { Text } from '@components/atom/Text';
import { RxKeyboard } from 'react-icons/rx';
import { SystemStatus } from '~/types/common';

interface KeyboardButtonProps {
	handleKeyboardButton?: () => void;
}

export default function KeyboardButton({
	handleKeyboardButton,
}: KeyboardButtonProps) {
	return (
		<Button onClick={handleKeyboardButton}>
			<Text size={1.2}>
				<RxKeyboard />
			</Text>
		</Button>
	);
}
