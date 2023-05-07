import {
	Dot,
	DotContainer,
	Message,
	MessageContent,
	MessageCover,
} from './style';
import { SystemStatus } from '../../../types/common';

const onGenerateMessage = (
	<>
		<Dot className="one" />
		<Dot className="two" />
		<Dot className="three" />
		<Dot className="four" />
		<Dot className="five" />
	</>
);

function renderMessage(message: string, systemStatus: SystemStatus) {
	if (systemStatus === SystemStatus.TRANSCRIBE)
		return <DotContainer>{onGenerateMessage}</DotContainer>;
	else return <Message>{message}</Message>;
}

interface IMessageWrapperProps {
	message: string;
	systemStatus: SystemStatus;
}

function MessageWrapper({ message, systemStatus }: IMessageWrapperProps) {
	return (
		<>
			<MessageCover></MessageCover>
			<MessageContent>{renderMessage(message, systemStatus)}</MessageContent>
		</>
	);
}

export default MessageWrapper;
