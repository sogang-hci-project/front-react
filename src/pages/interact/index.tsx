/* eslint-disable @typescript-eslint/ban-ts-comment */
import React, { useState, Dispatch, SetStateAction, useEffect } from 'react';
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
import { VoiceCanvas, ActivateButtonWrapper } from '../../components/interact';
import { RxTokens, RxAccessibility, RxShadow } from 'react-icons/rx';
import { LANG } from '../../constants/setting';
import { requestChatCompletion } from '../../utils/openai';
import useAudioStream from '../../hooks/useAudioStream';
import useGoogleRecognition from '../../hooks/useGoogleRecognition';
import { getGoogleTranscript } from '../../utils/googleTranscript';
import useRecognition from '../../hooks/useRecognition';

const dummyTitle = 'american gothics';

async function triggerQuestion(question: string) {
	const res = await requestChatCompletion(question);
	console.log(res);
}

function Interact() {
	const [voiceActive, setVoiceActive] = useState<boolean>(false);
	const [message, setMessage] = useState<string>('');
	const { volume: voiceVolume, stream: voiceStream } = useAudioStream({
		active: voiceActive,
	});
	const { transcript: googleTranscript } = useGoogleRecognition({
		stream: voiceStream,
		active: voiceActive,
	});
	const { transcript: localTranscript } = useRecognition({
		voiceActive,
	});

	useEffect(() => {
		if (googleTranscript) {
			setMessage(googleTranscript);
		}
	}, [googleTranscript]);

	useEffect(() => {
		setMessage(localTranscript);
	}, [localTranscript]);

	const handleActivateButton = () => {
		if (voiceActive) {
			setVoiceActive(false);
		} else {
			setVoiceActive(true);
		}
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
						voiceActive={voiceActive}
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
					<ActivateButtonWrapper
						voiceActive={voiceActive}
						handleActivateButton={handleActivateButton}
					/>
				</ButtonContainer>
			</Viewport>
		</Container>
	);
}

export default Interact;
