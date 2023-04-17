import React from 'react';
import { Container, Viewport } from '../../components/common';
import {
	Toolbar,
	ToolbarButton,
	Body,
	CharacterContainer,
	MessageContainer,
} from './style';
import { RxTokens, RxAccessibility } from 'react-icons/rx';

function Interact() {
	return (
		<Container>
			<Viewport>
				<Toolbar>
					<ToolbarButton>
						<RxAccessibility />
					</ToolbarButton>
					<div>dorian-gray</div>
					<ToolbarButton>
						<RxTokens />
					</ToolbarButton>
				</Toolbar>
				<Body>
					<canvas></canvas>
				</Body>
				<MessageContainer></MessageContainer>
				<CharacterContainer></CharacterContainer>
			</Viewport>
		</Container>
	);
}

export default Interact;
