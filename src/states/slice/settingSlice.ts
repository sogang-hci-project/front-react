import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { LANGUAGE, MODE } from '~/types/common';

interface ISettingState {
	language: LANGUAGE;
	mode: MODE;
	voiceActivationVolume: number;
	voiceDeactivationVolume: number;
	voiceDeacitvationInterval: number;
	voiceSpeed: number;
}

const initialState: ISettingState = {
	language: LANGUAGE.KR,
	mode: MODE.NORMAL,
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
		setMode: (state, action: PayloadAction<MODE>) => {
			state.mode = action.payload;
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
	setMode,
	setVoiceActivationVolume,
	setVoiceDeactivationVolume,
	setVoiceDeactivationInterval,
	setVoiceSpeed,
} = settingSlice.actions;

export default settingSlice.reducer;
