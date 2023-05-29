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
import { useState, useEffect } from 'react';
import { LANGUAGE, setting } from '~/constants/setting';
import { useAppDispatch, useAppSelector } from '~/states/store';
import { setLanguage } from '~/states/slice/settingSlice';

function Setting() {
	const [activation, setActivation] = useState<number>(60);
	const [deactivation, setDeactivation] = useState<number>(60);
	const [actInterval, setActInterval] = useState<number>(0);
	const toolBarName = setValueOnLanguage('설정', 'Setting', 'Setting');
	const settingName = {
		langaugeCode: setValueOnLanguage('언어', 'Language', 'Language'),
		english: setValueOnLanguage('영어', 'English', 'English'),
		korean: setValueOnLanguage('한국어', 'Korean', 'Korean'),
		activation: setValueOnLanguage(
			'음성 활성화 기준',
			'Recording Activation Threshold',
			'Recording Activation Threshold'
		),
		deactivation: setValueOnLanguage(
			'음성 비활성화 기준',
			'Recording Deactivation Threshold',
			'Recording Deactivation Threshold'
		),
		interval: setValueOnLanguage(
			'음성 활성화 간격',
			'Recording Activation Interval',
			'Recording Activation Interval'
		),
	};

	const dispatch = useAppDispatch();
	const language = useAppSelector((state) => state.setting.language);

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
						<SettingItemTitle>{settingName.langaugeCode}</SettingItemTitle>
						<SettingItemValue>
							<SettingDropdownSelect
								value={language}
								onChange={(event: React.ChangeEvent<HTMLSelectElement>) => {
									dispatch(setLanguage(event.target.value as LANGUAGE));
								}}
							>
								<SettingDropdownOption value={LANGUAGE.US}>
									{settingName.english}
								</SettingDropdownOption>
								<SettingDropdownOption value={LANGUAGE.KR}>
									{settingName.korean}
								</SettingDropdownOption>
							</SettingDropdownSelect>
						</SettingItemValue>
					</SettingItem>
					<SettingItem>
						<SettingItemTitle>{settingName.activation}</SettingItemTitle>
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
						<SettingItemTitle>{settingName.deactivation}</SettingItemTitle>
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
						<SettingItemTitle>{settingName.interval}</SettingItemTitle>
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
