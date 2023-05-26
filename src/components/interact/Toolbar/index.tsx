import {
	PainterName,
	PaintingName,
	TitleWrapper,
	ToolbarButton,
	ToolbarWrapper,
} from './style';
import { RxAccessibility, RxMixerVertical } from 'react-icons/rx';
import { useNavigate } from 'react-router-dom';
import { PAINTING_NAME, PAINTER_NAME } from '~/constants/setting';

function Toolbar() {
	const navigate = useNavigate();

	return (
		<ToolbarWrapper>
			<ToolbarButton>
				<RxAccessibility />
			</ToolbarButton>
			<TitleWrapper>
				<PaintingName>{PAINTING_NAME}</PaintingName>
				<PainterName>{PAINTER_NAME}</PainterName>
			</TitleWrapper>
			<ToolbarButton onClick={() => navigate('/setting')}>
				<RxMixerVertical />
			</ToolbarButton>
		</ToolbarWrapper>
	);
}

export default Toolbar;
