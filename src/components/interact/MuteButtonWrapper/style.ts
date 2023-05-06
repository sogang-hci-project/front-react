import styled from '@emotion/styled';

export const MuteButton = styled('button')`
	width: 12rem;
	height: 4rem;
	background-color: white;
	border: 1px solid black;
	font-size: 1rem;
	border-radius: 2rem;
	display: flex;
	align-items: center;
	justify-content: center;

	-webkit-transition-duration: 0.4s;
	transition-duration: 0.4s;
	:active {
		background-color: rgba(220, 220, 220, 1);
	}
`;
