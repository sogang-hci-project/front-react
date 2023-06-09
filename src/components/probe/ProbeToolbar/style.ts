import styled from '@emotion/styled';

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

export const Title = styled('p')`
	font-size: 1.1rem;
`;
