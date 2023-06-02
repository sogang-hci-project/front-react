const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = (app) => {
	app.use(
		'/naver',
		createProxyMiddleware({
			target: 'https://naveropenapi.apigw.ntruss.com',
			changeOrigin: true,
			pathRewrite: {
				'^/naver': '/',
			},
		})
	);
	app.use(
		'/openai',
		createProxyMiddleware({
			target: 'https://api.openai.com',
			changeOrigin: true,
			pathRewrite: {
				'^/openai': '/',
			},
		})
	);
};
