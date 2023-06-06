import {
	PainterName,
	PaintingName,
	TitleWrapper,
	ToolbarButton,
	ToolbarWrapper,
} from './style';
import { RxMixerVertical } from 'react-icons/rx';
import { IoTelescopeOutline } from 'react-icons/io5';
import useAppNavigate from '~/hooks/useAppNavigate';
import { useAppDispatch, useAppSelector } from '~/states/store';
import { LANGUAGE, SystemStatus } from '~/types/common';
import { setStage } from '~/states/slice/sessionSlice';
import { setUserMesasge } from '~/states/slice/dialogueSlice';

function Toolbar() {
	const navigate = useAppNavigate();
	const dispatch = useAppDispatch();

	const [painter, painting] = useAppSelector((state) => {
		if (state.setting.language === LANGUAGE.KR)
			return [
				state.session.painterNameKR + ' 작',
				state.session.paintingNameKR,
			];
		else
			return [
				'by ' + state.session.painterNameEN,
				state.session.paintingNameEN,
			];
	});

	function handleNavigate() {
		dispatch(setStage(SystemStatus.READY));
		dispatch(setUserMesasge(''));
		navigate('/probe');
	}

	return (
		<ToolbarWrapper>
			<ToolbarButton>
				<IoTelescopeOutline onClick={handleNavigate} />
			</ToolbarButton>
			<TitleWrapper>
				<PaintingName>{painting}</PaintingName>
				<PainterName>{painter}</PainterName>
			</TitleWrapper>
			<ToolbarButton onClick={() => navigate('/setting')}>
				<RxMixerVertical />
			</ToolbarButton>
		</ToolbarWrapper>
	);
}

export default Toolbar;
