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

export const AgentContainer = styled('div')`
	display: flex;
	align-items: flex-start;
	justify-content: center;
	position: relative;

	width: 100%;
	height: calc(100vh - 29rem);

	background-color: white;
	padding: 0 2rem;
`;

export const Divider = styled('div')`
	height: 1rem;
	width: 100%;
`;

export const MessageContainer = styled('div')`
	width: 100%;
	height: 16rem;
	padding: 0 2rem;
`;

export const ButtonContainer = styled('div')`
	height: 6rem;
	width: 100%;
	padding: 2rem;
	display: flex;
	align-items: center;
	justify-content: center;
	gap: 1rem;
`;
