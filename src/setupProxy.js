const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = (app) => {
	app.use(
		'/naver/tts',
		createProxyMiddleware({
			target: 'https://naveropenapi.apigw.ntruss.com',
			changeOrigin: true,
			pathRewrite: {
				'^/naver/tts': '/tts-premium/v1/tts',
			},
		})
	);
	app.use(
		'/naver/translation',
		createProxyMiddleware({
			target: 'https://naveropenapi.apigw.ntruss.com',
			changeOrigin: true,
			pathRewrite: {
				'^/naver/translation': '/nmt/v1/translation',
			},
		})
	);
};
