import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

interface ISessionState {
	paintingNameKR: string;
	paintingNameEN: string;
	painterNameKR: string;
	painterNameEN: string;
	stage: string;
	id: string;
}

const initialState: ISessionState = {
	paintingNameKR: '게르니카',
	paintingNameEN: 'Guernica',
	painterNameKR: '파블로 피카소',
	painterNameEN: 'Pablo Picasso',
	stage: '',
	id: '',
};

const sessionSlice = createSlice({
	name: 'setting',
	initialState,
	reducers: {
		setStage: (state, action: PayloadAction<string>) => {
			state.stage = action.payload;
		},
		setId: (state, action: PayloadAction<string>) => {
			state.id = action.payload;
		},
	},
});

export const { setStage, setId } = sessionSlice.actions;

export default sessionSlice.reducer;
