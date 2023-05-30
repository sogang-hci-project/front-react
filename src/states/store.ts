import { configureStore } from '@reduxjs/toolkit';
import { useDispatch, useSelector } from 'react-redux';
import type { TypedUseSelectorHook } from 'react-redux';
import dialogueSlice, {
	setStatus,
	setStatusBypassPause,
} from '~/states/slice/dialogueSlice';
import { SystemStatus } from '~/types/common';
import settingSlice from './slice/settingSlice';
import sessionSlice, { setStage } from './slice/sessionSlice';

export const store = configureStore({
	reducer: {
		dialogue: dialogueSlice,
		setting: settingSlice,
		session: sessionSlice,
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
export const setSeesionStage = (stage: string) => {
	store.dispatch(setStage(stage));
};
export const getDialogueStatus = () => store.getState().dialogue.status;
export const getSettingState = () => store.getState().setting;
export const getSessionStage = () => store.getState().session.stage;
