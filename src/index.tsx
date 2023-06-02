import React from 'react';
import { createRoot } from 'react-dom/client';
import globalStyle from './globalStyle';
import App from './App';
import * as serviceWorkerRegistration from './serviceWorkerRegistration';
import reportWebVitals from './reportWebVitals';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Interact from '@pages/interact';
import Setting from '@pages/setting';
import { Global } from '@emotion/react';
import { Provider } from 'react-redux';
import { store } from '~/states/store';

const root = createRoot(document.getElementById('root') as HTMLElement);

const router = createBrowserRouter([
	{ path: '/', element: <App /> },
	{ path: 'interact/', element: <Interact /> },
	{ path: 'setting/', element: <Setting /> },
]);

root.render(
	<React.StrictMode>
		<Provider store={store}>
			<Global styles={globalStyle} />
			<RouterProvider router={router} />
		</Provider>
	</React.StrictMode>
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://cra.link/PWA
serviceWorkerRegistration.unregister();

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
