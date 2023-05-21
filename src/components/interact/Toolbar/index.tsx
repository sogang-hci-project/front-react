import {
	PainterName,
	PaintingName,
	TitleWrapper,
	ToolbarButton,
	ToolbarWrapper,
} from './style';
import { RxAccessibility, RxTokens } from 'react-icons/rx';
import { PAINTING_NAME, PAINTER_NAME, LANG } from '~/constants/setting';
import { SystemStatus } from '~/types/common';

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
				<RxTokens />
			</ToolbarButton>
		</ToolbarWrapper>
	);
}

export default Toolbar;
