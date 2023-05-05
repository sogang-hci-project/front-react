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
import { VoiceCanvas, ActivateButtonWrapper } from '../../components/interact';
import { RxTokens, RxAccessibility, RxShadow } from 'react-icons/rx';
import { LANG } from '../../constants/setting';
import { requestChatCompletion } from '../../utils/openai';
import useAudioStream from '../../hooks/useAudioStream';
import useGoogleRecognition from '../../hooks/useGoogleRecognition';
import useRecognition from '../../hooks/useRecognition';
import { base64ToBlob, getGoogleTextToSpeech } from '../../utils/googlecloud';
import { playAudio, stopAudio } from '../../hooks/useAudio';

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
	const voiceTimeoutRef = useRef<NodeJS.Timeout | null>(null);

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
		// console.log(voiceVolume);
		if (voiceVolume > 80 && voiceActive === false) {
			console.log('activated: ', voiceVolume);
			setVoiceActive(true);
			stopAudio();
		} else if (
			voiceVolume < 20 &&
			voiceActive === true &&
			voiceTimeoutRef.current === null
		) {
			console.log('deactivate-ready: ', voiceVolume);
			voiceTimeoutRef.current = setTimeout(() => {
				setVoiceActive(false);
				if (voiceTimeoutRef.current) {
					console.log('deactivated: ');
					clearTimeout(voiceTimeoutRef.current);
					voiceTimeoutRef.current = null;
				}
			}, 1000);
		} else if (voiceVolume > 20 && voiceActive === true) {
			if (voiceTimeoutRef.current) {
				console.log('deactivation cancelled');
				clearTimeout(voiceTimeoutRef.current);
				voiceTimeoutRef.current = null;
			}
		}
	}, [voiceVolume]);

	// const handleActivateButton = () => {
	// 	if (voiceActive) {
	// 		setVoiceActive(false);
	// 	} else {
	// 		setVoiceActive(true);
	// 		stopAudio();
	// 	}
	// };

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
						// handleActivateButton={handleActivateButton}
					/>
				</ButtonContainer>
			</Viewport>
		</Container>
	);
}

export default Interact;
