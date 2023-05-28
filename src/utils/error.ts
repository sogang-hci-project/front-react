import { ServiceType, SystemStatus } from '~/types/common';
import { setValueOnLanguage } from './common';
import { playTextToAudio } from './audio';
import { setDialogueState } from '~/states/store';

const kAFErrorRegex = /kAFAssistantErrorDomain/;
const errorTextKorean = [
	'미안하지만 한 번 더 말씀해주세요',
	'죄송하지만 다시 말해주실 수 있을까요?',
	'미안하지만 다시 한 번 말씀해 주실 수 있을까요?',
	'죄송하지만 한 번 더 설명해 주실 수 있을까요?',
	'미안하지만 다시 한 번 알려주세요.',
	'죄송하지만 한 번 더 이야기해주실 수 있을까요?',
	'미안하지만 다시 말씀해주세요.',
	'죄송하지만 한 번 더 말해주실 수 있을까요?',
];
const errorTextEnglish = [
	'I apologize, could you please repeat that?',
	"I'm sorry, could you say that again?",
	'Apologies, would you mind repeating what you just said?',
	"I'm sorry, could you clarify what you meant?",
	'My apologies, could you please repeat your statement?',
	'Sorry, could you go over that one more time?',
	"I'm sorry, could you rephrase your question?",
	'Apologies, could you kindly repeat your inquiry?',
	"I'm sorry, could you please restate your comment?",
];

const errorReply = () => {
	const index = Math.floor(Math.random() * 8);
	return setValueOnLanguage(
		errorTextKorean[index],
		errorTextEnglish[index],
		''
	);
};

interface IHandleError {
	message: string;
	origin: ServiceType;
}

export function handleError({ message, origin }: IHandleError) {
	console.log('error toggled');
	if (kAFErrorRegex.test(message)) {
		message += ' Reload the browser to fix issue.';
		alert('System Malfunction: ' + message);
		return;
	}

	switch (origin) {
		case ServiceType.CLOVA_TTS:
		case ServiceType.CLOVA_STT:
		case ServiceType.GCLOUD_STT:
		case ServiceType.GCLOUD_TTS:
		case ServiceType.LOCAL_STT:
		case ServiceType.OPENAI:
		case ServiceType.PAPAGO_TRANS:
			void playTextToAudio(errorReply()).then(() => {
				setDialogueState(SystemStatus.READY);
			});
			break;
		default:
			break;
	}
}
