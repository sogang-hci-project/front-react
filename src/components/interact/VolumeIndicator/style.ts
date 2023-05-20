import styled from '@emotion/styled';

interface IVolumeIndicatorWrapper {
	volume: number;
}

export const VolumeIndicatorWrapper = styled('div')<IVolumeIndicatorWrapper>`
	width: 4rem;
	height: 4rem;
	background-color: white;
	font-size: 1rem;
	border-radius: 2rem;
	display: flex;
	align-items: center;
	justify-content: center;
	box-shadow: 0 0px 2px 1px rgba(0, 0, 0, 0.1);

	-webkit-transition-duration: 0.4s;
	transition-duration: 0.4s;

	background: ${(props) =>
		`radial-gradient(rgba(0, 0, 0, 0.5), rgba(255, 255, 255, 0) ${props.volume}%)`};
`;

export const ThresholdContainer = styled('div')`
	width: 4rem;
	height: 4rem;
	display: flex;
	align-items: center;
	justify-content: center;
`;

interface IThresholdIndicator {
	threshold: number;
}

export const ThresholdIndicator = styled('div')<IThresholdIndicator>`
	width: ${({ threshold }) => `${threshold}%`};
	height: ${({ threshold }) => `${threshold}%`};
	border-radius: 20rem;
	border: solid rgba(0, 0, 0, 0.3);
	-webkit-transition-duration: 0.4s;
	transition-duration: 0.4s;
`;
