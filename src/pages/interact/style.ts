import styled from '@emotion/styled';

export const Toolbar = styled('div')`
	width: 100%;
	height: 6rem;
	background-color: white;
	display: flex;
	flex-direction: row;
	align-items: center;
	justify-content: space-between;
`;

export const ToolbarButton = styled('button')`
	display: flex;
	align-items: center;
	justify-content: center;

	width: 6rem;
	height: 6rem;
	font-size: 2rem;
	color: #000;
`;

export const Body = styled('div')`
	display: flex;
	align-items: center;
	justify-content: center;

	width: 100%;
	height: calc(100vh - 20rem);

	background-color: black;
`;

export const MessageContainer = styled('div')`
	width: 100%;
	height: 6rem;
	background-color: yellow;
`;

export const CharacterContainer = styled('div')`
	width: 100%;
	height: 8rem;
	background-color: blue;
`;
