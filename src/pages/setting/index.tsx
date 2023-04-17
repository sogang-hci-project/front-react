import React from 'react';

import styled from '@emotion/styled';

export const CustomComponent = styled('div')`
	background-color: 'yellow';
	font-size: '100px';
`;

function Setting() {
	return (
		<CustomComponent>
			{/* <CustomComponent style={{ backgroundColor: 'yellow', fontSize: '100px' }}> */}
			setting
		</CustomComponent>
		// <CustomComponent>setting</CustomComponent>
	);
}

export default Setting;
