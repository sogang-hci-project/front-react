import styled from '@emotion/styled';

// export const MessageCover = styled('div')`
// 	width: 100%;
// 	height: 8rem;
// 	position: sticky;
// 	top: 0;
// 	left: 0;
// 	/* background-color: rgba(0, 0, 0, 0.1); */
// 	box-shadow: inset 0 0 30px 30px rgba(255, 255, 255, 1);
// 	pointer-events: none;
// 	z-index: 1;
// `;

export const MessageContent = styled('div')`
	width: 100%;
	height: 100%;

	overflow-y: scroll;
	::-webkit-scrollbar {
		display: none;
	}
`;

export const Message = styled('p')`
	width: 100%;
	/* line-height: 100%; */
	text-align: left;
	font-size: 1.1rem;
`;

export const UserMessageWrapper = styled('div')`
	width: 100%;
	height: 100%;

	background-color: white;
	border-radius: 2rem;
	border: 1px solid rgba(0, 0, 0, 0.3);
	padding: 1.5rem;

	display: flex;
	align-items: center;
	box-shadow: 0 0px 2px 1px rgba(0, 0, 0, 0.1);
`;

export const DotContainer = styled('div')`
	width: 100%;
	display: flex;
	justify-content: center;
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
