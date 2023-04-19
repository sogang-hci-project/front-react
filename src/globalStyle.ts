import { css } from '@emotion/react';

const globalStyle = css`
	/** font style */
	body {
		font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto',
			'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans',
			'Helvetica Neue', sans-serif;
		-webkit-font-smoothing: antialiased;
		-moz-osx-font-smoothing: grayscale;
	}
	code {
		font-family: source-code-pro, Menlo, Monaco, Consolas, 'Courier New',
			monospace;
	}

	/** default style */
	div,
	p,
	button,
	span,
	image,
	body,
	code {
		box-sizing: border-box;
		display: inline-block;
		margin: 0;
		padding: 0;
	}

	/** button override */
	button {
		padding: 0;
		border: none;
		background: none;
		width: auto;
		height: auto;
		margin: 0;
		vertical-align: middle;
		color: inherit;
		cursor: pointer;
		outline: none;
	}
`;

export default globalStyle;
