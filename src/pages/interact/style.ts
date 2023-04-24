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
	height: calc(100vh - 24rem);

	background-color: white;
`;

export const Divider = styled('div')`
	height: 2rem;
	width: 100%;
`;

export const MessageContainer = styled('div')`
	width: 100%;
	height: 8rem;
	position: relative;

	background-color: white;

	overflow-y: scroll;
	::-webkit-scrollbar {
		display: none;
	}
	box-shadow: inset 0 0 30px 30px rgba(255, 255, 255, 1);
`;

export const MessageCover = styled('div')`
	width: 100%;
	height: 8rem;
	position: sticky;
	top: 0;
	left: 0;
	/* background-color: rgba(0, 0, 0, 0.1); */
	box-shadow: inset 0 0 30px 30px rgba(255, 255, 255, 1);
	pointer-events: none;
	z-index: 1;
`;

export const MessageContent = styled('div')`
	width: 100%;
	height: 100%;
	padding: 0 2rem;
	position: absolute;
	z-index: 0;
	left: 0;
`;

export const Message = styled('p')`
	font-size: 1.2rem;
	width: 100%;
	/* line-height: 100%; */
	text-align: center;
`;

export const ButtonContainer = styled('p')`
	height: 8rem;
	width: 100%;
	padding: 2rem;
`;
