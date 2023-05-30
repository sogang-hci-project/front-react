import {
	PainterName,
	PaintingName,
	TitleWrapper,
	ToolbarButton,
	ToolbarWrapper,
} from './style';
import { RxAccessibility, RxMixerVertical } from 'react-icons/rx';
import useAppNavigate from '~/hooks/useAppNavigate';
import { useAppSelector } from '~/states/store';
import { LANGUAGE } from '~/types/common';

function Toolbar() {
	const navigate = useAppNavigate();
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

	return (
		<ToolbarWrapper>
			<ToolbarButton>
				<RxAccessibility />
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
