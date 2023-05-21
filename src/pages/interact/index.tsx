/* eslint-disable @typescript-eslint/ban-ts-comment */
import React, { useState, useEffect } from 'react';
import { Container, Viewport } from '@components/common';
import {
	AgentContainer,
	MessageContainer,
	ButtonContainer,
	ToolbarContainer,
	Divider,
} from './style';
import {
	AgentCanvas,
	PlayButton,
	UserMessage,
	KeyboardButton,
	AgentMessage,
	Toolbar,
	KeyboardInputModal,
	MuteButton,
} from '@components/interact';
import { requestChatCompletion } from '@api/openai';
import useAudioStream from '@hooks/useAudioStream';
import useGoogleRecognition from '@hooks/useGoogleRecognition';
import useLocalRecognition from '~/hooks/useLocalRecognition';
import {
	checkPause,
	playTextToAudio,
	stopAudio,
	toggleSystemStatusOnVolume,
} from '@utils/audio';
import { SystemStatus } from '~/types/common';
import { isChrome, isSafari } from '~/utils/common';

const clickSound = new Audio('/sound/toggle.mp3');

async function generateAnswer(question: string) {
	const res = await requestChatCompletion(question);
	const content = res?.choices[0].message.content || '';
	console.log('openai answer: ', content);
	return content;
}

async function answerQuestion(
	question: string,
	systemStatus: SystemStatus,
	setSystemState: React.Dispatch<React.SetStateAction<SystemStatus>>,
	setAgentMessage: React.Dispatch<React.SetStateAction<string>>
) {
	console.log('user question: ', question);
	if (systemStatus !== SystemStatus.GENERATE || question.length === 0) return;
	const answer = await generateAnswer(question);
	setAgentMessage(answer);
	setSystemState(checkPause(SystemStatus.SPEAK));
	await playTextToAudio(answer);
	setSystemState(checkPause(SystemStatus.WAIT));
}

function useRecognition() {
	if (isChrome) return useGoogleRecognition;
	else if (isSafari) return useLocalRecognition;
	else
		return () => {
			return { transcript: 'browser not supported' };
		};
}

function Interact() {
	const [userMessage, setUserMessage] = useState<string>('');
	const [agentMessage, setAgentMessage] = useState<string>('');
	const [systemStatus, setSystemStatus] = useState<SystemStatus>(
		SystemStatus.PAUSE
	);
	const [showInputPopup, setShowInputPopup] = useState<boolean>(false);
	const [isMute, setIsMute] = useState<boolean>(false);
	const { volume: voiceVolume, stream: voiceStream } = useAudioStream();

	const { transcript } = useRecognition()({
		stream: voiceStream,
		systemStatus,
		setSystemStatus,
	});

	function handleKeyboardSubmit(text: string) {
		setUserMessage(text);
		setSystemStatus(SystemStatus.GENERATE);
	}

	const handlePlayButton = () => {
		void clickSound.play();
		if (systemStatus === SystemStatus.PAUSE) {
			setSystemStatus(SystemStatus.READY);
		} else {
			setSystemStatus(SystemStatus.PAUSE);
			stopAudio();
		}
	};

	useEffect(() => {
		if (transcript.length === 0) return;
		setUserMessage(transcript);
	}, [transcript]);

	useEffect(() => {
		console.log(userMessage, systemStatus);
		if (systemStatus === SystemStatus.GENERATE)
			void answerQuestion(
				userMessage,
				systemStatus,
				setSystemStatus,
				setAgentMessage
			);
	}, [userMessage]);

	useEffect(() => {
		toggleSystemStatusOnVolume({
			isMute,
			voiceVolume,
			systemStatus,
			setSystemStatus,
		});
	}, [voiceVolume]);

	return (
		<Container>
			<Viewport>
				<KeyboardInputModal
					showInputPopup={showInputPopup}
					setShowInputPopup={setShowInputPopup}
					handleKeyboardSubmit={handleKeyboardSubmit}
				/>
				<ToolbarContainer>
					<Toolbar />
				</ToolbarContainer>
				<AgentContainer>
					<AgentMessage message={agentMessage} systemStatus={systemStatus} />
					<AgentCanvas
						systemStatus={systemStatus}
						voiceVolume={voiceVolume}
					></AgentCanvas>
				</AgentContainer>
				<Divider></Divider>
				<MessageContainer>
					<UserMessage message={userMessage} systemStatus={systemStatus} />
				</MessageContainer>
				<ButtonContainer>
					<MuteButton
						isMute={isMute}
						setIsMute={setIsMute}
						volume={voiceVolume}
					/>
					<PlayButton
						systemStatus={systemStatus}
						handlePlayButton={handlePlayButton}
					/>
					<KeyboardButton
						handleKeyboardButton={() => {
							if (
								[SystemStatus.READY, SystemStatus.WAIT].includes(systemStatus)
							)
								setShowInputPopup(true);
						}}
					/>
				</ButtonContainer>
			</Viewport>
		</Container>
	);
}

export default Interact;
