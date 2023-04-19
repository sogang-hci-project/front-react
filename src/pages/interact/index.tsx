import React from 'react';
import { Container, Viewport } from '../../components/common';
import {
	Toolbar,
	ToolbarButton,
	Body,
	MessageContainer,
	Message,
	MessageCover,
	ButtonContainer,
	ActivateButton,
	MessageContent,
	Divider,
} from './style';
import { VoiceCanvas } from '../../components/interact';
import { RxTokens, RxAccessibility, RxShadow } from 'react-icons/rx';

const dummy =
	'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Iusto odio eum sit, obcaecati tempora distinctio consequuntur, quisquam vitae a expedita omnis placeat. Accusantium id a eum unde vel voluptatem nemo odio, illo perferendis quaerat reiciendis distinctio accusamus ducimus ex eligendi impedit excepturi nisi qui est autem reprehenderit atque aliquid esse.';

const dummyTitle = 'american gothics';

function Interact() {
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
					<VoiceCanvas></VoiceCanvas>
				</Body>
				<Divider></Divider>
				<MessageContainer>
					<MessageCover></MessageCover>
					<MessageContent>
						<Message>{dummy}</Message>
					</MessageContent>
				</MessageContainer>

				<ButtonContainer>
					<ActivateButton>engage</ActivateButton>
				</ButtonContainer>
			</Viewport>
		</Container>
	);
}

export default Interact;
