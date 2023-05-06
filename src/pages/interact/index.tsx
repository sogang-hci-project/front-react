/* eslint-disable @typescript-eslint/ban-ts-comment */
import React, {
	useState,
	Dispatch,
	SetStateAction,
	useEffect,
	useRef,
} from 'react';
import { Container, Viewport } from '../../components/common';
import {
	Toolbar,
	ToolbarButton,
	Body,
	MessageContainer,
	Message,
	MessageCover,
	ButtonContainer,
	MessageContent,
	Divider,
} from './style';
import { VoiceCanvas, MuteButtonWrapper } from '../../components/interact';
import { RxTokens, RxAccessibility, RxShadow } from 'react-icons/rx';
import { LANG } from '../../constants/setting';
import { requestChatCompletion } from '../../utils/openai';
import useAudioStream from '../../hooks/useAudioStream';
import useGoogleRecognition from '../../hooks/useGoogleRecognition';
import useRecognition from '../../hooks/useRecognition';
import { base64ToBlob, getGoogleTextToSpeech } from '../../utils/googlecloud';
import { playAudio, stopAudio, toggleVoice } from '../../utils/audio';
import { SystemStatus } from '../../types/common';

const dummyTitle = 'american gothics';

async function replyAnAnswer(question: string) {
	const res = await requestChatCompletion(question);
	const content = res?.choices[0].message.content || '';
	console.log('openai answer: ', content);
	if (content.length > 100) {
		// console.log('length limit reached');
		// return;
	}
	const audioString = await getGoogleTextToSpeech(content);
	const audioBlob = base64ToBlob(audioString);
	playAudio(audioBlob);
}

function Interact() {
	const [message, setMessage] = useState<string>('');
	const [systemStatus, setSystemStatus] = useState<SystemStatus>(
		SystemStatus.MUTE
	);
	const { volume: voiceVolume, stream: voiceStream } = useAudioStream({
		systemStatus,
	});
	const { transcript: googleTranscript } = useGoogleRecognition({
		stream: voiceStream,
		systemStatus,
	});
	const { transcript: localTranscript } = useRecognition({
		systemStatus,
	});

	useEffect(() => {
		if (googleTranscript) {
			setMessage(googleTranscript);
			void replyAnAnswer(googleTranscript);
		}
	}, [googleTranscript]);

	useEffect(() => {
		setMessage(localTranscript);
	}, [localTranscript]);

	useEffect(() => {
		toggleVoice({ voiceVolume, systemStatus, setSystemStatus });
	}, [voiceVolume]);

	const handleMuteButton = () => {
		if (systemStatus === SystemStatus.MUTE)
			setSystemStatus(SystemStatus.HIBERNATE);
		else setSystemStatus(SystemStatus.MUTE);
	};

	return (
		<Container>
			<Viewport>
				<Toolbar>
					<ToolbarButton>
						<RxAccessibility />
					</ToolbarButton>
					<div>{dummyTitle}</div>
					<ToolbarButton>
						<RxTokens />
					</ToolbarButton>
				</Toolbar>
				<Body>
					<VoiceCanvas
						systemStatus={systemStatus}
						voiceVolume={voiceVolume}
					></VoiceCanvas>
				</Body>
				<Divider></Divider>
				<MessageContainer>
					<MessageCover></MessageCover>
					<MessageContent>
						<Message>{message}</Message>
					</MessageContent>
				</MessageContainer>
				<ButtonContainer>
					<MuteButtonWrapper
						systemStatus={systemStatus}
						handleMuteButton={handleMuteButton}
					/>
				</ButtonContainer>
			</Viewport>
		</Container>
	);
}

export default Interact;
