const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = (app) => {
	app.use(
		'/naver/tts',
		createProxyMiddleware({
			// target: 'https://naveropenapi.apigw.ntruss.com/tts-premium/v1/tts',
			target: 'https://naveropenapi.apigw.ntruss.com',
			changeOrigin: true,
			pathRewrite: {
				'^/naver/tts': '/tts-premium/v1/tts',
			},
		})
	);
};
