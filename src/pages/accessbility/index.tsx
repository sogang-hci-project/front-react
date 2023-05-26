import { Container, Viewport } from '~/components/common';
import {
	ToolbarContainer,
	ToolbarWrapper,
	ToolbarButton,
	TitleWrapper,
} from './style';
import { setValueOnLanguage } from '~/utils/common';
import { RxCaretLeft } from 'react-icons/rx';

const toolBarName = setValueOnLanguage(
	'접근성',
	'Accessibility',
	'Accessibility'
);

function Accessibility() {
	return (
		<Container>
			<Viewport>
				<ToolbarContainer>
					<ToolbarWrapper>
						<ToolbarButton>
							<RxCaretLeft />
						</ToolbarButton>
						<TitleWrapper>{toolBarName}</TitleWrapper>
						<ToolbarButton></ToolbarButton>
					</ToolbarWrapper>
				</ToolbarContainer>
			</Viewport>
		</Container>
	);
}

export default Accessibility;
