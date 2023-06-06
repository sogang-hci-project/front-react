import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { LANGUAGE } from '~/types/common';

interface ISettingState {
	language: LANGUAGE;
	voiceActivationVolume: number;
	voiceDeactivationVolume: number;
	voiceDeacitvationInterval: number;
	voiceSpeed: number;
}

const initialState: ISettingState = {
	language: LANGUAGE.KR,
	voiceActivationVolume: 70,
	voiceDeactivationVolume: 70,
	voiceDeacitvationInterval: 3000,
	voiceSpeed: 1,
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
		setVoiceSpeed: (state, action: PayloadAction<number>) => {
			state.voiceSpeed = action.payload;
		},
	},
});

export const {
	setLanguage,
	setVoiceActivationVolume,
	setVoiceDeactivationVolume,
	setVoiceDeactivationInterval,
	setVoiceSpeed,
} = settingSlice.actions;

export default settingSlice.reducer;
