import { Message, MessageContent, AgentMessageWrapper } from './style';
import { SystemStatus } from '~/types/common';

interface IAgentMessageProps {
	message: string;
	systemStatus: SystemStatus;
}

function AgentMessage({ message, systemStatus }: IAgentMessageProps) {
	return (
		<AgentMessageWrapper systemStatus={systemStatus}>
			<MessageContent>
				<Message>{message}</Message>
			</MessageContent>
		</AgentMessageWrapper>
	);
}

export default AgentMessage;
