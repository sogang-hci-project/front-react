import {
	Dot,
	DotContainer,
	Message,
	MessageContent,
	UserMessageWrapper,
} from './style';
import { SystemStatus } from '~/types/common';

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

interface IUserMessageProps {
	message: string;
	systemStatus: SystemStatus;
}

function UserMessage({ message, systemStatus }: IUserMessageProps) {
	return (
		<UserMessageWrapper>
			<MessageContent>{renderMessage(message, systemStatus)}</MessageContent>
		</UserMessageWrapper>
	);
}

export default UserMessage;
