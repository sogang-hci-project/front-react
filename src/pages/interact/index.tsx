import React from 'react';
import { Container, Viewport } from '../../components/common';
import {
	Toolbar,
	ToolbarButton,
	Body,
	CharacterContainer,
	MessageContainer,
	Message,
	MessageCover,
	CharacterCell,
	CharacterImage,
	CharacterName,
} from './style';
import { RxTokens, RxAccessibility } from 'react-icons/rx';

const dummy =
	'Lorem ipsum dolor sit amet consectetur adipisicing elit. Maxime iste eveniet aut inventore, esse alias consequuntur labore, doloribus, voluptates id consequatur. Corporis consectetur impedit harum alias a asperiores repellat sapiente?';

interface CharacterActor {
	id: number;
	image: string;
	name: string;
	gender: string;
}

const dummyCharacterList = new Array<CharacterActor>(
	{
		id: 0,
		image: '/image/byron-mckeeby.png',
		name: 'Byron Mckeeby',
		gender: 'male',
	},
	{
		id: 1,
		image: '/image/grant-wood.jpg',
		name: 'Grand Wood',
		gender: 'male',
	},
	{
		id: 2,
		image: '/image/nan-graham.png',
		name: 'Nan Graham',
		gender: 'female',
	}
);

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
				<MessageContainer>
					<Message>{dummy}</Message>
				</MessageContainer>
				<CharacterContainer>
					{dummyCharacterList.map((character, i) => {
						return (
							<CharacterCell key={i}>
								<CharacterImage
									src={process.env.PUBLIC_URL + character.image}
								/>
								<CharacterName>{character.name}</CharacterName>
							</CharacterCell>
						);
					})}
				</CharacterContainer>
			</Viewport>
		</Container>
	);
}

export default Interact;
