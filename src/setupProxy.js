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
	app.use(
		'/naver/stt',
		createProxyMiddleware({
			target: 'https://naveropenapi.apigw.ntruss.com',
			changeOrigin: true,
			pathRewrite: {
				'^/naver/stt': '/recog/v1/stt',
			},
		})
	);
	app.use(
		'/openai/transcription',
		createProxyMiddleware({
			target: 'https://api.openai.com',
			changeOrigin: true,
			pathRewrite: {
				'^/openai/transcription': '/v1/audio/transcriptions',
			},
		})
	);
};
