import React from 'react';
import {
	ModalButtonWrapper,
	ModalField,
	ModalWrapper,
	InputModal,
	ModalButton,
} from './style';

import { RxCircleBackslash, RxCircle } from 'react-icons/rx';

interface IKeyboardInputModal {
	showInputPopup: boolean;
	setShowInputPopup: React.Dispatch<React.SetStateAction<boolean>>;
}

function KeyboardInputModal({
	showInputPopup,
	setShowInputPopup,
}: IKeyboardInputModal) {
	return (
		<ModalWrapper showInputPopup={showInputPopup}>
			<InputModal>
				<ModalField></ModalField>
				<ModalButtonWrapper>
					<ModalButton onClick={() => setShowInputPopup(false)}>
						취소하기
					</ModalButton>
					<ModalButton>보내기</ModalButton>
				</ModalButtonWrapper>
			</InputModal>
		</ModalWrapper>
	);
}

export default KeyboardInputModal;
