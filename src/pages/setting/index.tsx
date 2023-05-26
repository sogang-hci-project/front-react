import { Container, Viewport } from '~/components/common';
import {
	TitleWrapper,
	ToolbarButton,
	ToolbarContainer,
	ToolbarWrapper,
	SettingContainer,
	SettingItem,
	SettingItemTitle,
	SettingItemBody,
	SettingItemValue,
	SettingDropdownSelect,
	SettingDropdownOption,
	SettingSliderInput,
	SettingTextInput,
} from './style';
import { RxCaretLeft } from 'react-icons/rx';
import { setValueOnLanguage } from '~/utils/common';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { LANGUAGE } from '~/constants/setting';

const toolBarName = setValueOnLanguage('설정', 'Setting', 'Setting');

function Setting() {
	const [language, setLanguage] = useState<LANGUAGE>(LANGUAGE.KR);
	const [activation, setActivation] = useState<number>(60);
	const [deactivation, setDeactivation] = useState<number>(60);
	const [actInterval, setActInterval] = useState<number>(0);

	const navigate = useNavigate();
	return (
		<Container>
			<Viewport>
				<ToolbarContainer>
					<ToolbarWrapper>
						<ToolbarButton
							onClick={() => {
								navigate('/interact');
							}}
						>
							<RxCaretLeft />
						</ToolbarButton>
						<TitleWrapper>{toolBarName}</TitleWrapper>
						<ToolbarButton></ToolbarButton>
					</ToolbarWrapper>
				</ToolbarContainer>
				<SettingContainer>
					<SettingItem>
						<SettingItemTitle>언어</SettingItemTitle>
						<SettingItemValue>
							<SettingDropdownSelect>
								<SettingDropdownOption value="영어">영어</SettingDropdownOption>
								<SettingDropdownOption value="한국어">
									한국어
								</SettingDropdownOption>
							</SettingDropdownSelect>
						</SettingItemValue>
					</SettingItem>
					<SettingItem>
						<SettingItemTitle>음성 활성화 민감도</SettingItemTitle>
						<SettingItemValue>
							<SettingTextInput />
						</SettingItemValue>
						<SettingItemBody>
							<SettingSliderInput
								type="range"
								min="1"
								max="100"
								// value="50"
							/>
						</SettingItemBody>
					</SettingItem>
					<SettingItem>
						<SettingItemTitle>음성 비활성화 민감도</SettingItemTitle>
						<SettingItemValue>
							<SettingTextInput />
						</SettingItemValue>
						<SettingItemBody>
							<SettingSliderInput
								type="range"
								min="1"
								max="100"
								// value="50"
							/>
						</SettingItemBody>
					</SettingItem>
					<SettingItem>
						<SettingItemTitle>음성 활성화 간격</SettingItemTitle>
						<SettingItemValue>
							<SettingTextInput />
						</SettingItemValue>
						<SettingItemBody>
							<SettingSliderInput
								type="range"
								min="1"
								max="100"
								// value="50"
							/>
						</SettingItemBody>
					</SettingItem>
				</SettingContainer>
			</Viewport>
		</Container>
	);
}

export default Setting;
