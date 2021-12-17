import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { Todo } from '../store/reducers/todos';
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
      schedule(time: string, todo: Todo | Partial<Todo> | null): void;
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
