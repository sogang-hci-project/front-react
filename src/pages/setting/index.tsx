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
	SettingButtonContainer,
	SettingButton,
	SettingThresholdIndicator,
	SettingThresholdContainer,
} from './style';
import { RxCaretLeft, RxEnter } from 'react-icons/rx';
import { setValueOnLanguage } from '~/utils/common';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { LANGUAGE } from '~/types/common';
import { useAppDispatch, useAppSelector } from '~/states/store';
import {
	setLanguage,
	setVoiceActivationVolume,
	setVoiceDeactivationInterval,
	setVoiceDeactivationVolume,
	setVoiceSpeed,
} from '~/states/slice/settingSlice';

function Setting() {
	const dispatch = useAppDispatch();
	const [language, vs, va, vd, vdi] = useAppSelector((state) => [
		state.setting.language,
		state.setting.voiceSpeed,
		state.setting.voiceActivationVolume,
		state.setting.voiceDeactivationVolume,
		state.setting.voiceDeacitvationInterval,
	]);
	const navigate = useNavigate();

	const [activation, setActivation] = useState<number>(va);
	const [deactivation, setDeactivation] = useState<number>(vd);
	const [actInterval, setActInterval] = useState<number>(vdi);
	const [speed, setSpeed] = useState<number>(vs);
	const toolBarName = setValueOnLanguage('설정', 'Setting', 'Setting');
	const settingName = {
		langaugeCode: setValueOnLanguage('언어', 'Language', 'Language'),
		english: setValueOnLanguage('영어', 'English', 'English'),
		korean: setValueOnLanguage('한국어', 'Korean', 'Korean'),
		speed: setValueOnLanguage('속도', 'Speed', 'Speed'),
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

	function handleSetActivationChange(e: React.ChangeEvent<HTMLInputElement>) {
		const newThreshold = parseInt(e.target.value);
		if (newThreshold >= deactivation) {
			setActivation(newThreshold);
		}
	}

	function handleSetDeactivationChange(e: React.ChangeEvent<HTMLInputElement>) {
		const newThreshold = parseInt(e.target.value);
		if (newThreshold <= activation) {
			setDeactivation(newThreshold);
		}
	}

	function handleSetVoiceSpeed(e: React.ChangeEvent<HTMLInputElement>) {
		const newSpeed = parseInt(e.target.value);
		if (newSpeed <= 5 && 0.1 < newSpeed) setSpeed(newSpeed);
	}

	const handleApplySetting = () => {
		dispatch(setVoiceActivationVolume(activation));
		dispatch(setVoiceDeactivationVolume(deactivation));
		dispatch(setVoiceDeactivationInterval(actInterval));
		dispatch(setVoiceSpeed(speed));
		navigate(-1);
	};

	return (
		<Container>
			<Viewport>
				<ToolbarContainer>
					<ToolbarWrapper>
						<ToolbarButton onClick={handleApplySetting}>
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
						<SettingItemTitle>{settingName.speed}</SettingItemTitle>
						<SettingItemValue>
							<SettingTextInput value={speed} onChange={handleSetVoiceSpeed} />
						</SettingItemValue>
					</SettingItem>
					<SettingItem>
						<SettingItemTitle>{settingName.activation}</SettingItemTitle>
						<SettingItemValue>
							<SettingTextInput value={activation} disabled />
						</SettingItemValue>
						<SettingItemBody>
							<SettingThresholdContainer>
								<SettingThresholdIndicator boundary={deactivation} />
							</SettingThresholdContainer>
							<SettingSliderInput
								type="range"
								min="1"
								max="100"
								value={activation}
								onChange={handleSetActivationChange}
							/>
						</SettingItemBody>
					</SettingItem>
					<SettingItem>
						<SettingItemTitle>{settingName.deactivation}</SettingItemTitle>
						<SettingItemValue>
							<SettingTextInput value={deactivation} disabled />
						</SettingItemValue>
						<SettingItemBody>
							<SettingThresholdContainer>
								<SettingThresholdIndicator boundary={activation} />
							</SettingThresholdContainer>
							<SettingSliderInput
								type="range"
								min="1"
								max="100"
								value={deactivation}
								onChange={handleSetDeactivationChange}
							/>
						</SettingItemBody>
					</SettingItem>
					<SettingItem>
						<SettingItemTitle>{settingName.interval}</SettingItemTitle>
						<SettingItemValue>
							<SettingTextInput value={actInterval} disabled />
						</SettingItemValue>
						<SettingItemBody>
							<SettingSliderInput
								type="range"
								min="1000"
								max="5000"
								value={actInterval}
								onChange={(e) => {
									setActInterval(parseInt(e.target.value));
								}}
							/>
						</SettingItemBody>
					</SettingItem>
				</SettingContainer>
				<SettingButtonContainer>
					<SettingButton onClick={handleApplySetting}>
						<RxEnter />
					</SettingButton>
				</SettingButtonContainer>
			</Viewport>
		</Container>
	);
}

export default Setting;
