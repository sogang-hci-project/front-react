import { useMemo } from 'react';
import {
	Dot,
	DotContainer,
	Message,
	MessageContent,
	PlaceHolder,
	UserMessageWrapper,
} from './style';
import { SystemStatus } from '~/types/common';
import { LANG, LANGUAGE } from '~/constants/setting';

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
	const placeHolderMessage = useMemo(() => {
		if (LANG === LANGUAGE.KR) {
			if (systemStatus === SystemStatus.READY) {
				return '이야기에 참여하세요';
			} else if (systemStatus === SystemStatus.WAIT) {
				return '질문에 대해 대답하세요';
			}
		} else if (LANG === LANGUAGE.US) {
			if (systemStatus === SystemStatus.READY) {
				return 'Engage in conversation';
			} else if (systemStatus === SystemStatus.WAIT) {
				return 'Make a response';
			}
		}
	}, [systemStatus]);

	return (
		<UserMessageWrapper>
			{message ? (
				<MessageContent>{renderMessage(message, systemStatus)}</MessageContent>
			) : (
				<PlaceHolder>{placeHolderMessage}</PlaceHolder>
			)}
		</UserMessageWrapper>
	);
}

export default UserMessage;
