import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { SystemStatus } from '~/types/common';

interface DialogueState {
	status: SystemStatus;
	userMessage: string;
}

const initialState: DialogueState = {
	status: SystemStatus.PAUSE,
	userMessage: '',
};

const dialogueSlice = createSlice({
	name: 'dialogue',
	initialState,
	reducers: {
		setStatus: (state, action: PayloadAction<SystemStatus>) => {
			state.status = action.payload;
		},
		setStatusBypassPause: (state, action: PayloadAction<SystemStatus>) => {
			if (state.status !== SystemStatus.PAUSE) state.status = action.payload;
		},
		setUserMesasge: (state, action: PayloadAction<string>) => {
			state.userMessage = action.payload;
		},
	},
});

export const { setStatus, setStatusBypassPause, setUserMesasge } =
	dialogueSlice.actions;

export default dialogueSlice.reducer;
