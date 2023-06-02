import { useMemo } from 'react';
import {
	Dot,
	DotContainer,
	Message,
	MessageContent,
	PlaceHolder,
	UserMessageWrapper,
} from './style';
import { SystemStatus, LANGUAGE } from '~/types/common';
import { useAppSelector } from '~/states/store';

const onGenerateDot = (
	<>
		<Dot className="one" />
		<Dot className="two" />
		<Dot className="three" />
		<Dot className="four" />
		<Dot className="five" />
	</>
);

interface IUserMessageProps {
	message: string;
	systemStatus: SystemStatus;
}

function UserMessage({ message, systemStatus }: IUserMessageProps) {
	const language = useAppSelector((state) => state.setting.language);

	const placeHolderMessage = useMemo(() => {
		if (language === LANGUAGE.KR) {
			if (systemStatus === SystemStatus.READY) {
				return '말하여 이야기에 참여하세요';
			} else if (systemStatus === SystemStatus.WAIT) {
				return '질문에 대해 대답하세요';
			} else if (systemStatus === SystemStatus.PAUSE) {
				return '아래 버튼을 눌러 활성화하세요';
			} else if (systemStatus === SystemStatus.LISTEN) {
				return '청취 중';
			} else if (systemStatus === SystemStatus.TRANSCRIBE) {
				return <DotContainer>{onGenerateDot}</DotContainer>;
			}
			return '에러';
		} else if (language === LANGUAGE.US) {
			if (systemStatus === SystemStatus.READY) {
				return 'Engage in conversation by speaking';
			} else if (systemStatus === SystemStatus.WAIT) {
				return 'Make a response';
			} else if (systemStatus === SystemStatus.PAUSE) {
				return 'Press the button below to activate';
			} else if (systemStatus === SystemStatus.LISTEN) {
				return 'Listening';
			} else if (systemStatus === SystemStatus.TRANSCRIBE) {
				return <DotContainer>{onGenerateDot}</DotContainer>;
			}
			return 'Error';
		}
	}, [systemStatus]);

	return (
		<UserMessageWrapper>
			{message.length === 0 ? (
				<PlaceHolder>{placeHolderMessage}</PlaceHolder>
			) : (
				<MessageContent>
					<Message>{message}</Message>
				</MessageContent>
			)}
		</UserMessageWrapper>
	);
}

export default UserMessage;
