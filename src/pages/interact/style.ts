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
	height: calc(100vh - 22rem);

	background-color: black;
`;

export const MessageContainer = styled('div')`
	width: 100%;
	height: 6rem;
	padding: 0 2rem;
	position: relative;

	background-color: white;

	overflow-y: scroll;
	::-webkit-scrollbar {
		display: none;
	}

	::after {
		width: 100%;
		height: 100%;
		content: '';
		position: absolute;
		/* position: sticky; */
		top: 0;
		left: 0;
		box-shadow: inset 0 0 30px 30px rgba(255, 255, 255, 1);
		background-color: rgba(0, 0, 0, 0);
	}
`;

export const MessageCover = styled('div')`
	width: 100%;
	height: 6rem;
	position: sticky;
	background-color: white;
`;

export const Message = styled('p')`
	font-size: 1.2rem;
	width: 100%;
	/* line-height: 100%; */
	padding: 0;
	margin: 0;
	text-align: center;
`;

export const CharacterContainer = styled('div')`
	width: 100%;
	height: 10rem;
	padding-left: 2rem;
	padding-right: 2rem;
	padding-bottom: 2rem;

	display: flex;
	flex-direction: row;
	align-items: flex-end;
	justify-content: space-between;
	gap: 1rem;
`;

export const CharacterCell = styled('div')`
	width: 7rem;
	height: 7rem;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
`;

export const CharacterName = styled('div')`
	margin-top: 0.3rem;
	height: 1rem;
	font-size: 0.8rem;
`;

export const CharacterImage = styled('img')`
	width: 5rem;
	height: 5rem;
	object-fit: cover;
	border-radius: 50%;
	overflow: hidden;
`;
