const path = require('path');
const fs = require('fs');
const { whenDev } = require('@craco/craco');

module.exports = {
	webpack: {
		alias: {
			'~': path.resolve(__dirname, 'src'),
			'@api': path.resolve(__dirname, 'src/api'),
			'@components': path.resolve(__dirname, 'src/components'),
			'@constants': path.resolve(__dirname, 'src/constants'),
			'@hooks': path.resolve(__dirname, 'src/hooks'),
			'@pages': path.resolve(__dirname, 'src/pages'),
			'@utils': path.resolve(__dirname, 'src/utils'),
			'@states': path.resolve(__dirname, 'src/states'),
		},
	},
	devServer: whenDev(() => ({
		https: true,
	})),
};
