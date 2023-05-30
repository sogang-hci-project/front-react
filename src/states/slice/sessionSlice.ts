import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { LANGUAGE, SystemStatus } from '~/types/common';

interface ISessionState {
	paintingNameKR: string;
	paintingNameEN: string;
	painterNameKR: string;
	painterNameEN: string;
}

const initialState: ISessionState = {
	paintingNameKR: '게르니카',
	paintingNameEN: 'Guernica',
	painterNameKR: '파블로 피카소',
	painterNameEN: 'Pablo Picasso',
};

const sessionSlice = createSlice({
	name: 'setting',
	initialState,
	reducers: {},
});

// export const {} = sessionSlice.actions;

export default sessionSlice.reducer;
