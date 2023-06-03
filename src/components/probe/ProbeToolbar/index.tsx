import { Title, TitleWrapper, ToolbarButton, ToolbarWrapper } from './style';
import { RxMixerVertical, RxReset } from 'react-icons/rx';
import useAppNavigate from '~/hooks/useAppNavigate';
import { setValueOnLanguage } from '~/utils/common';

function Toolbar() {
	const navigate = useAppNavigate();
	const title = setValueOnLanguage('프로브 모드', 'Probe Mode', 'Probe Mode');

	return (
		<ToolbarWrapper>
			<ToolbarButton>
				<RxReset onClick={() => navigate('/interact')} />
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
