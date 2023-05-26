import styled from '@emotion/styled';

export const CustomComponent = styled('div')`
	background-color: 'yellow';
	font-size: '100px';
`;

function Setting() {
	return <CustomComponent>setting</CustomComponent>;
}

export default Setting;
