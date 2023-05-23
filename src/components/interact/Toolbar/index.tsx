import {
	PainterName,
	PaintingName,
	TitleWrapper,
	ToolbarButton,
	ToolbarWrapper,
} from './style';
import { RxAccessibility, RxMixerVertical } from 'react-icons/rx';
import { PAINTING_NAME, PAINTER_NAME } from '~/constants/setting';

function Toolbar() {
	return (
		<ToolbarWrapper>
			<ToolbarButton>
				<RxAccessibility />
			</ToolbarButton>
			<TitleWrapper>
				<PaintingName>{PAINTING_NAME}</PaintingName>
				<PainterName>{PAINTER_NAME}</PainterName>
			</TitleWrapper>
			<ToolbarButton>
				<RxMixerVertical />
			</ToolbarButton>
		</ToolbarWrapper>
	);
}

export default Toolbar;
