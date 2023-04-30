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
import useRecording from '../../hooks/useRecording';

const dummyTitle = 'american gothics';

const SpeechRecognition = window.SpeechRecognition || webkitSpeechRecognition;
const recognition = new SpeechRecognition();
recognition.lang = 'en-US';
recognition.interimResults = true;

function Interact() {
	const [voiceActive, setVoiceActive] = useState<boolean>(false);
	const [transcript, setTranscript] = useState<string>('');
	const { volume: voiceVolume, transcript: voiceTranscript } = useRecording({
		active: voiceActive,
	});

	// recognition.continuous = true;

	recognition.onresult = (event) => {
		const [[{ transcript: recognitionResult }]] = event.results;
		setTranscript(recognitionResult);
	};

	useEffect(() => {
		setTranscript(voiceTranscript);
	}, [voiceTranscript]);

	// useEffect(() => {}, [volume]);

	const handleActivateButton = () => {
		if (voiceActive) {
			console.log('recognition deactivate');
			recognition.stop();
			setVoiceActive(false);
		} else {
			console.log('recognition activate');
			recognition.start();
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
						<Message>{transcript}</Message>
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
