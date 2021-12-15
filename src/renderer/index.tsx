import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { persistor, store } from '../store/store';
import '../styles/main.scss';
import App from './App';

declare global {
  const electron: {
    notificationApi: {
      sendNotification(message: string): void;
    };
    screenshotAPI: {
      takeScreenshot(): void;
    };
    scheduleAPI: {
      schedule(): void;
    };
  };
}

render(
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <App />
    </PersistGate>
  </Provider>,
  document.getElementById('root')
);
