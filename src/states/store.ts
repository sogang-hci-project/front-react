import { configureStore } from '@reduxjs/toolkit';
import { useDispatch, useSelector } from 'react-redux';
import type { TypedUseSelectorHook } from 'react-redux';
import dialogueSlice, {
	setStatus,
	setStatusBypassPause,
} from '~/states/slice/dialogueSlice';
import { SystemStatus } from '~/types/common';

export const store = configureStore({
	reducer: {
		dialogue: dialogueSlice,
	},
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export const setDialogueState = (status: SystemStatus) =>
	store.dispatch(setStatus(status));
export const setDialogueStateBypassPause = (status: SystemStatus) =>
	store.dispatch(setStatusBypassPause(status));
export const getDialogueState = () => store.getState().dialogue.status;
