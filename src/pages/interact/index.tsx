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
import useRecognition from '../../hooks/useRecognition';
import { base64ToAudio, getGoogleTextToSpeech } from '../../utils/googlecloud';

const dummyTitle = 'american gothics';

async function replyAnAnswer(question: string) {
	const res = await requestChatCompletion(question);
	const content = res.choices[0].message.content;
	console.log('openai answer: ', content);
	if (content.length > 100) {
		// console.log('length limit reached');
		// return;
	}
	const audioString = await getGoogleTextToSpeech(content);
	const audio = base64ToAudio(audioString);
	await audio.play();
}

function Interact() {
	const [voiceActive, setVoiceActive] = useState<boolean>(false);
	const [message, setMessage] = useState<string>('');
	const [reply, setReply] = useState<string>('');
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
			void replyAnAnswer(googleTranscript);
		}
	}, [googleTranscript]);

	useEffect(() => {
		setMessage(localTranscript);
	}, [localTranscript]);

	const handleActivateButton = () => {
		if (voiceActive) setVoiceActive(false);
		else setVoiceActive(true);
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
