import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { LANGUAGE, setting } from '~/constants/setting';
import { SystemStatus } from '~/types/common';

interface ISettingState {
	language: LANGUAGE;
	voiceActivationVolume: number;
	voiceDeactivationVolume: number;
	voiceDeacitvationInterval: number;
}

interface ISetSettingRequest {
	key: string;
	value: any;
}

const initialState: ISettingState = {
	language: LANGUAGE.KR,
	voiceActivationVolume: 60,
	voiceDeactivationVolume: 60,
	voiceDeacitvationInterval: 600,
};

const settingSlice = createSlice({
	name: 'setting',
	initialState,
	reducers: {
		setLanguage: (state, action: PayloadAction<LANGUAGE>) => {
			state.language = action.payload;
		},
		setVoiceActivationVolume: (state, action: PayloadAction<number>) => {
			state.voiceActivationVolume = action.payload;
		},
		setVoiceDeactivationVolume: (state, action: PayloadAction<number>) => {
			state.voiceDeactivationVolume = action.payload;
		},
		setVoiceDeactivationInterval: (state, action: PayloadAction<number>) => {
			state.voiceDeacitvationInterval = action.payload;
		},
	},
});

export const {
	setLanguage,
	setVoiceActivationVolume,
	setVoiceDeactivationVolume,
	setVoiceDeactivationInterval,
} = settingSlice.actions;

export default settingSlice.reducer;
