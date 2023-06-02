import styled from '@emotion/styled';

export const Button = styled('button')`
	width: 4rem;
	height: 4rem;
	background-color: white;
	border: 1px solid black;
	font-size: 1rem;
	border-radius: 2rem;
	display: flex;
	align-items: center;
	justify-content: center;
	border: 1px solid rgba(0, 0, 0, 0.3);
	box-shadow: 0 0px 2px 1px rgba(0, 0, 0, 0.1);

	-webkit-transition-duration: 0.4s;
	transition-duration: 0.4s;
	:active {
		background-color: rgba(220, 220, 220, 1);
	}
`;
