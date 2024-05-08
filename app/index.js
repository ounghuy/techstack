import { AppRegistry } from 'react-native';

import { name as appName } from './app.json';
import App from './src';
import './bootstrap';
import configureStore from '@cambo/store';
import { Provider } from 'react-redux';
import { useNotifications } from '@cambo/hooks';

const NotificationHandler = () => {
  // INFO: TO use notification onBackground, it needs to run immediately in index.js file, so that we use this component to call useNotification hook
  useNotifications();
  return null;
};

function Main() {
  const { store } = configureStore();

  return (
    <Provider store={store}>
      <App />
      <NotificationHandler />
    </Provider>
  );
}

AppRegistry.registerComponent(appName, () => Main);
