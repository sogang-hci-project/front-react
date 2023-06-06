import { Title, TitleWrapper, ToolbarButton, ToolbarWrapper } from './style';
import { RxMixerVertical, RxReset } from 'react-icons/rx';
import useAppNavigate from '~/hooks/useAppNavigate';
import { setUserMesasge } from '~/states/slice/dialogueSlice';
import { setStage } from '~/states/slice/sessionSlice';
import { useAppDispatch } from '~/states/store';
import { SystemStatus } from '~/types/common';
import { setValueOnLanguage } from '~/utils/common';

function Toolbar() {
	const navigate = useAppNavigate();
	const dispatch = useAppDispatch();
	const title = setValueOnLanguage('프로브 모드', 'Probe Mode', 'Probe Mode');

	function handleNavigate() {
		dispatch(setStage(SystemStatus.READY));
		dispatch(setUserMesasge(''));
		navigate('/interact');
	}

	return (
		<ToolbarWrapper>
			<ToolbarButton>
				<RxReset onClick={handleNavigate} />
			</ToolbarButton>
			<TitleWrapper>
				<Title>{title}</Title>
			</TitleWrapper>
			<ToolbarButton onClick={() => navigate('/setting')}>
				<RxMixerVertical />
			</ToolbarButton>
		</ToolbarWrapper>
	);
}

export default Toolbar;
