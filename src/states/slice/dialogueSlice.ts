import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { SystemStatus } from '~/types/common';

interface DialogueState {
	status: SystemStatus;
}

const initialState: DialogueState = {
	status: SystemStatus.PAUSE,
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
	},
});

export const { setStatus, setStatusBypassPause } = dialogueSlice.actions;

export default dialogueSlice.reducer;
