import styled from '@emotion/styled';

interface IModalWrapper {
	showInputPopup: boolean;
}

export const ModalWrapper = styled('div')<IModalWrapper>`
	visibility: ${({ showInputPopup }) =>
		showInputPopup ? 'visible' : 'hidden'};
	opacity: ${({ showInputPopup }) => (showInputPopup ? 1 : 0)};
	/* display: ${({ showInputPopup }) =>
		showInputPopup ? 'inline' : 'none'}; */

	position: fixed;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	background-color: rgba(255, 255, 255, 0.5);
	display: flex;
	justify-content: center;
	align-items: center;
	backdrop-filter: blur(8px);
	z-index: 3;

	-webkit-transition-duration: 0.4s;
	transition-duration: 0.4s;
`;

export const InputModal = styled('div')`
	height: 40%;
	width: 100%;
	max-width: calc(100vh * 0.66);
	margin: 2rem;

	border-radius: 2rem;
	background-color: white;

	border: 1px solid rgba(0, 0, 0, 0.3);
	box-shadow: 0 0px 2px 1px rgba(0, 0, 0, 0.1);

	padding: 2rem;
	padding-bottom: 1rem;
	display: flex;
	flex-direction: column;
	justify-content: space-between;
	align-items: center;
	gap: 1rem;
`;

export const ModalTextarea = styled('textarea')`
	width: 100%;
	height: 90%;
	resize: none;
	border: none;
	outline: none;
	line-height: 1.5;
`;

export const ModalButtonWrapper = styled('div')`
	width: 100%;
	height: 10%;
	display: flex;
	justify-content: center;
	align-items: flex-end;
`;

export const ModalButton = styled('button')`
	width: 50%;
	height: 100%;

	-webkit-transition-duration: 0.4s;
	transition-duration: 0.4s;
	:active {
		text-shadow: 1px 1px 10px rgba(0, 0, 0, 0.5);
	}
	:hover {
		text-shadow: 1px 1px 10px rgba(0, 0, 0, 0.5);
	}
`;
