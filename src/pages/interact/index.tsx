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
import useAudioRecorder from '../../hooks/useAudioRecorder';
import { getGoogleTranscript } from '../../utils/googleTranscript';

const dummyTitle = 'american gothics';

const SpeechRecognition = window.SpeechRecognition || webkitSpeechRecognition;
const recognition = new SpeechRecognition();
recognition.lang = LANG;
recognition.interimResults = true;
recognition.continuous = true;

async function triggerQuestion(question: string) {
	const res = await requestChatCompletion(question);
	console.log(res);
}

function Interact() {
	const [voiceActive, setVoiceActive] = useState<boolean>(false);
	const [transcript, setTranscript] = useState<string>('');
	const { volume: voiceVolume, stream: voiceStream } = useAudioStream({
		active: voiceActive,
	});
	const { record: voiceRecord } = useAudioRecorder({
		stream: voiceStream,
		active: voiceActive,
	});

	recognition.onresult = (event) => {
		const [[{ transcript: recognitionResult }]] = event.results;
		setTranscript(recognitionResult);
	};
	useEffect(() => {
		if (voiceRecord) {
			void getGoogleTranscript(voiceRecord).then((script) =>
				setTranscript(script)
			);
		}
	}, [voiceRecord]);

	const handleActivateButton = () => {
		if (voiceActive) {
			recognition.stop();
			setVoiceActive(false);
		} else {
			recognition.start();
			setVoiceActive(true);
			// void triggerQuestion();
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
