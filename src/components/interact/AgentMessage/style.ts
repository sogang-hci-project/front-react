import styled from '@emotion/styled';
import { SystemStatus } from '~/types/common';

interface IAgentMessageWrapperProps {
	systemStatus: SystemStatus;
}

export const AgentMessageWrapper = styled('div')<IAgentMessageWrapperProps>`
	width: 100%;
	height: 100%;

	opacity: ${({ systemStatus }) =>
		systemStatus === SystemStatus.SPEAK ? '1' : '0'};

	position: relative;
	z-index: 1;

	background-color: white;
	border-radius: 2rem;
	border: 1px solid rgba(0, 0, 0, 0.3);
	padding: 1.5rem;

	display: flex;
	align-items: flex-start;
	box-shadow: 0 0px 2px 1px rgba(0, 0, 0, 0.1);

	-webkit-transition-duration: 0.4s;
	transition-duration: 0.4s;
`;

export const MessageContent = styled('div')`
	width: 100%;
	height: 77%;

	overflow-y: scroll;
	::-webkit-scrollbar {
		display: none;
	}
`;

export const Message = styled('p')`
	width: 100%;
	/* line-height: 100%; */
	text-align: left;
	font-size: 1.1rem;
`;
