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

	-webkit-transition-duration: 0.4s;
	transition-duration: 0.4s;

	:active {
		filter: drop-shadow(0 0 6px rgba(0, 0, 0, 0.2));
	}
`;

export const Body = styled('div')`
	display: flex;
	align-items: center;
	justify-content: center;

	width: 100%;
	height: calc(100vh - 22rem);

	background-color: white;
`;

export const MessageContainer = styled('div')`
	width: 100%;
	height: 8rem;
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

export const ButtonContainer = styled('p')`
	height: 8rem;
	width: 100%;
	padding: 2rem;
`;

export const ActivateButton = styled('button')`
	width: 100%;
	height: 4rem;
	background-color: white;
	border: 1px solid black;
	font-size: 1rem;

	-webkit-transition-duration: 0.4s;
	transition-duration: 0.4s;
	:active {
		background-color: rgba(220, 220, 220, 1);
	}
`;
