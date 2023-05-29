import { useNavigate } from 'react-router-dom';
import { setStatus } from '~/states/slice/dialogueSlice';
import { useAppDispatch } from '~/states/store';
import { SystemStatus } from '~/types/common';
import { stopAudio } from '~/utils/audio';

function useAppNavigate() {
	const navigate = useNavigate();
	const dispatch = useAppDispatch();

	const appNavigate = (url: string) => {
		dispatch(setStatus(SystemStatus.PAUSE));
		stopAudio();
		navigate(url);
	};

	return appNavigate;
}

export default useAppNavigate;
