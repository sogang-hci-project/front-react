import styled from '@emotion/styled';

export const ToolbarContainer = styled('div')`
	width: 100%;
	height: 6rem;
`;

export const ToolbarWrapper = styled('div')`
	width: 100%;
	height: 100%;
	display: flex;
	flex-direction: row;
	align-items: center;
	justify-content: space-between;
	padding: 0 1rem;
`;

export const ToolbarButton = styled('button')`
	display: flex;
	align-items: center;
	justify-content: center;

	width: 6rem;
	height: 6rem;
	font-size: 2rem;
	color: rgba(0, 0, 0, 0.7);

	-webkit-transition-duration: 0.4s;
	transition-duration: 0.4s;

	:active {
		filter: drop-shadow(0 0 6px rgba(0, 0, 0, 0.4));
	}
	:hover {
		filter: drop-shadow(0 0 6px rgba(0, 0, 0, 0.4));
	}
`;

export const TitleWrapper = styled('div')`
	flex: 1;
	height: 100%;
	width: 100%;

	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	gap: 0.2rem;
`;

export const SettingContainer = styled('div')`
	flex: 1;
	height: 100%;
	width: 100%;

	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: flex-start;

	gap: 1rem;
`;

export const SettingItem = styled('div')`
	width: 100%;
	height: 100%;
	padding: 1rem 3rem;

	display: flex;
	flex-direction: row;
	align-items: center;
	justify-content: space-between;
	flex-wrap: wrap;

	gap: 2rem;
`;

export const SettingItemTitle = styled('div')`
	width: 70%;
`;

export const SettingItemBody = styled('div')`
	width: 100%;
`;

export const SettingItemValue = styled('div')`
	flex: 1;
	display: flex;
	align-items: center;
	justify-content: flex-end;
	width: 20%;
`;

export const SettingDropdownSelect = styled('select')`
	appearance: none;
	padding: 0.5rem 1rem;
	border: 1px solid #ccc;
	box-shadow: 0 0px 2px 1px rgba(0, 0, 0, 0.1);
	text-align: center;
	border-radius: 2rem;
	font-size: 1rem;
	width: 100%;
`;

export const SettingDropdownOption = styled('option')``;

export const SettingSliderInput = styled('input')`
	appearance: none;
	width: 100%;
	height: 0.2rem;
	border-radius: 2rem;
	background: #d3d3d3;
	box-shadow: 0 0px 2px 1px rgba(0, 0, 0, 0.1);
	outline: none;
	opacity: 0.7;
	-webkit-transition: 0.2s;
	transition: opacity 0.2s;
	&::-webkit-slider-thumb {
		-webkit-appearance: none;
		appearance: none;
		box-shadow: 0 0px 4px 1px rgba(0, 0, 0, 0.2);
		border: 1px solid rgba(0, 0, 0, 0.3);
		width: 1.5rem;
		height: 1.5rem;
		border-radius: 50%;
		background: white;
		cursor: pointer;
	}
`;

export const SettingTextInput = styled('input')`
	width: 3rem;
	padding: 0.5rem 1rem;
	border: 1px solid #ccc;
	box-shadow: 0 0px 2px 1px rgba(0, 0, 0, 0.1);
	text-align: center;
	border-radius: 2rem;
	font-size: 1rem;
`;

export const SettingButtonContainer = styled('div')`
	height: 6rem;
	width: 100%;
	padding: 2rem;
	display: flex;
	align-items: center;
	justify-content: center;
	gap: 1rem;
`;

export const SettingButton = styled('button')`
	display: flex;
	align-items: center;
	justify-content: center;
	flex: 1;

	height: 4rem;
	background-color: white;
	border: 1px solid black;
	font-size: 1.2rem;
	border-radius: 2rem;

	border: 1px solid rgba(0, 0, 0, 0.3);
	box-shadow: 0 0px 2px 1px rgba(0, 0, 0, 0.1);

	-webkit-transition-duration: 0.4s;
	transition-duration: 0.4s;
	:active {
		background-color: rgba(220, 220, 220, 1);
	}
`;
