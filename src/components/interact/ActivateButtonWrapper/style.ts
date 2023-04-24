import styled from '@emotion/styled';

export const ActivateButton = styled('button')`
	width: 100%;
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

export const Dot = styled('p')`
	/* display: inline; */
	height: 100%;
	margin: 5px;
	height: 5px;
	width: 5px;
	border-radius: 10px;
	opacity: 0;
	animation: showHideDot 1s ease-in-out infinite;
	background-color: black;
	&.one {
		animation-delay: 0s;
	}
	&.two {
		animation-delay: 0.1s;
	}
	&.three {
		animation-delay: 0.2s;
	}
	&.four {
		animation-delay: 0.3s;
	}
	&.five {
		animation-delay: 0.4s;
	}

	@keyframes showHideDot {
		0% {
			opacity: 0;
		}
		40% {
			opacity: 1;
		}
		60% {
			opacity: 1;
		}
		100% {
			opacity: 0;
		}
	}
`;
