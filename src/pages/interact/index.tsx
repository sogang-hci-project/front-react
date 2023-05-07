/* eslint-disable @typescript-eslint/ban-ts-comment */
import React, { useState, useEffect } from 'react';
import { Container, Viewport } from '@components/common';
import {
	Toolbar,
	ToolbarButton,
	Body,
	MessageContainer,
	ButtonContainer,
	Divider,
} from './style';
import {
	VoiceCanvas,
	MuteButtonWrapper,
	MessageWrapper,
} from '@components/interact';
import { RxTokens, RxAccessibility, RxShadow } from 'react-icons/rx';
import { requestChatCompletion } from '@api/openai';
import useAudioStream from '@hooks/useAudioStream';
import useGoogleRecognition from '@hooks/useGoogleRecognition';
import useRecognition from '@hooks/useRecognition';
import {
	checkMute,
	playTextToAudio,
	stopAudio,
	toggleSystemStatusOnVolume,
} from '@utils/audio';
import { SystemStatus } from '~/types/common';

const dummyTitle = 'american gothics';

async function generateAnswer(question: string) {
	const res = await requestChatCompletion(question);
	const content = res?.choices[0].message.content || '';
	console.log('openai answer: ', content);
	return content;
}

async function answerQuestion(
	question: string,
	systemStatus: SystemStatus,
	setSystemState: React.Dispatch<React.SetStateAction<SystemStatus>>
) {
	if (systemStatus !== SystemStatus.TRANSCRIBE) return;
	setSystemState(checkMute(SystemStatus.GENERATE));
	const answer = await generateAnswer(question);
	setSystemState(checkMute(SystemStatus.SPEAK));
	await playTextToAudio(answer);
	setSystemState(checkMute(SystemStatus.HIBERNATE));
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
		setSystemStatus,
	});
	const { transcript: localTranscript } = useRecognition({
		systemStatus,
	});

	useEffect(() => {
		setMessage(googleTranscript);
		if (googleTranscript !== '')
			void answerQuestion(googleTranscript, systemStatus, setSystemStatus);
	}, [googleTranscript]);

	useEffect(() => {
		setMessage(localTranscript);
	}, [localTranscript]);

	useEffect(() => {
		toggleSystemStatusOnVolume({
			voiceVolume,
			systemStatus,
			setSystemStatus,
		});
	}, [voiceVolume]);

	const handleMuteButton = () => {
		if (systemStatus === SystemStatus.MUTE) {
			setSystemStatus(SystemStatus.HIBERNATE);
		} else {
			setSystemStatus(SystemStatus.MUTE);
			stopAudio();
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
						systemStatus={systemStatus}
						voiceVolume={voiceVolume}
					></VoiceCanvas>
				</Body>
				<Divider></Divider>
				<MessageContainer>
					<MessageWrapper message={message} systemStatus={systemStatus} />
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
