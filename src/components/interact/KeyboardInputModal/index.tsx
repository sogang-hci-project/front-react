import React, { useEffect, useRef, useState } from 'react';
import {
	ModalButtonWrapper,
	ModalTextarea,
	ModalWrapper,
	InputModal,
	ModalButton,
} from './style';
import { LANG, LANGUAGE } from '~/constants/setting';

interface IKeyboardInputModal {
	showInputPopup: boolean;
	setShowInputPopup: React.Dispatch<React.SetStateAction<boolean>>;
	handleKeyboardSubmit: (text: string) => void;
}

const cancelText = LANG === LANGUAGE.KR ? '취소하기' : 'cancel';
const sendText = LANG === LANGUAGE.KR ? '보내기' : 'send';

function KeyboardInputModal({
	showInputPopup,
	setShowInputPopup,
	handleKeyboardSubmit,
}: IKeyboardInputModal) {
	const [modalText, setModalText] = useState<string>('');
	const modalTextareaRef = useRef<HTMLTextAreaElement | null>(null);

	function handleSendClick() {
		handleKeyboardSubmit(modalText);
		setModalText('');
		setShowInputPopup(false);
	}

	function handleTextChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
		setModalText(e.target.value);
	}

	function handleCancelClick() {
		setModalText('');
		setShowInputPopup(false);
	}

	useEffect(() => {
		modalTextareaRef.current?.focus();
	}, []);

	return (
		<ModalWrapper showInputPopup={showInputPopup}>
			<InputModal>
				<ModalTextarea
					value={modalText}
					onChange={handleTextChange}
					ref={modalTextareaRef}
				></ModalTextarea>
				<ModalButtonWrapper>
					<ModalButton onClick={handleCancelClick}>{cancelText}</ModalButton>
					<ModalButton onClick={handleSendClick}>{sendText}</ModalButton>
				</ModalButtonWrapper>
			</InputModal>
		</ModalWrapper>
	);
}

export default KeyboardInputModal;
