import styled from '@emotion/styled';

export const Container = styled('div')`
	min-height: 100vh;
	min-width: 100vw;
	display: flex;
	justify-content: center;
	align-items: center;
	background-color: whitesmoke;
`;

export const Viewport = styled('div')`
	min-height: 100vh;
	max-width: calc(100vh * 0.66);
	width: 100%;
	box-shadow: 0px 0px 20px 10px rgba(0, 0, 0, 0.2);
	position: relative;
	background-color: white;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: flex-start;
`;
