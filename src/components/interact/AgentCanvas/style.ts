import styled from '@emotion/styled';
import { SystemStatus } from '~/types/common';

interface IAgentCanvasWrapperProps {
	systemStatus: SystemStatus;
}

export const AgentCanvasWrapper = styled('div')<IAgentCanvasWrapperProps>`
	width: 100%;
	height: 100%;

	position: absolute;
	bottom: 0;
	right: 0;
	z-index: 2;

	display: flex;
	justify-content: center;

	-webkit-transition-duration: 0.4s;
	transition-duration: 0.4s;
	pointer-events: none;
`;
