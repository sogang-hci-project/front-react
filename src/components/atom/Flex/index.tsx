import { ReactNode } from 'react';
import styled from '@emotion/styled';

interface IProps {
	children: ReactNode;
	direction?: string;
	justify?: string;
	string?: string;
	align?: string;
	height?: string;
}

const FlexBase = styled('div')<{
	direction?: string;
	justify?: string;
	align?: string;
	height?: string;
}>`
	display: flex;
	width: 100%;
	flex-direction: ${({ direction }) => direction};
	justify-content: ${({ justify }) => justify};
	align-items: ${({ align }) => align};
`;

export function Flex({
	children,
	direction = 'column',
	justify = 'center',
	align = 'center',
	...rest
}: IProps) {
	return (
		<FlexBase direction={direction} justify={justify} align={align} {...rest}>
			{children}
		</FlexBase>
	);
}
