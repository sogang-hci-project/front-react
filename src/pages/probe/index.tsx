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
	KeyboardInputModal,
	MuteButton,
} from '@components/interact';

import useAudioStream from '@hooks/useAudioStream';
import { stopAudio, toggleSystemStatusOnVolume } from '@utils/audio';
import { SystemStatus } from '~/types/common';
import { answerUserDialogue, startProbeDialogue } from '@utils/dialogue';
import {
	useAppDispatch,
	useAppSelector,
	setDialogueState,
} from '@states/store';
import useWhisperRecognition from '~/hooks/useWhisperRecognition';
import { setUserMesasge } from '~/states/slice/dialogueSlice';
import { ProbeToolbar } from '~/components/probe';

const clickSound = new Audio('/sound/toggle.mp3');

function Probe() {
	const [agentMessage, setAgentMessage] = useState<string>('');
	const [showInputPopup, setShowInputPopup] = useState<boolean>(false);
	const [isMute, setIsMute] = useState<boolean>(true);
	const { volume: voiceVolume, stream: voiceStream } = useAudioStream();
	useWhisperRecognition({ stream: voiceStream });

	const [systemStatus, userMessage] = useAppSelector((state) => [
		state.dialogue.status,
		state.dialogue.userMessage,
	]);
	const dispatch = useAppDispatch();

	function handleKeyboardSubmit(text: string) {
		dispatch(setUserMesasge(text));
		dispatch(setDialogueState(SystemStatus.GENERATE));
	}

	function handlePlayButton() {
		void clickSound.play();
		if (systemStatus === SystemStatus.PAUSE) {
			void startProbeDialogue(setAgentMessage);
		} else {
			dispatch(setUserMesasge(''));
			dispatch(setDialogueState(SystemStatus.PAUSE));
			stopAudio();
		}
	}
	useEffect(() => {
		console.log('[Message]: ', userMessage, '[Status]: ', systemStatus);
		if (systemStatus === SystemStatus.GENERATE)
			void answerUserDialogue(userMessage, setAgentMessage);
	}, [systemStatus]);

	useEffect(() => {
		toggleSystemStatusOnVolume({
			isMute,
			voiceVolume,
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
					<ProbeToolbar />
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

export default Probe;
