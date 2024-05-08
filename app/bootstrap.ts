import '@react-native-firebase/crashlytics';
import 'react-native-gesture-handler';
import 'react-native-get-random-values';
import 'react-native-url-polyfill/auto';

import perf, { FirebasePerformanceTypes } from '@react-native-firebase/perf';
import messaging from '@react-native-firebase/messaging';
import { LogBox, Platform } from 'react-native';
import axios, { AxiosRequestConfig } from 'axios';

import { store } from '@cambo/store';
import { isAxiosError } from '@cambo/types';
import { isLiteApp, apiKey } from '@cambo/config';
import { isNewUser } from '@cambo/utils/app';

type PerformaceMetric = {
  httpMetric: FirebasePerformanceTypes.HttpMetric;
};

LogBox.ignoreLogs([
  'Warning: A firebase.perf',
  'ImmutableStateInvariantMiddleware took',
  'Remote debugger is in a background',
  'Setting a timer',
  'Sending...',
  "exported from 'deprecated-react-native-prop-types'.",
  'new NativeEventEmitter',
  "ViewPropTypes will be removed from React Native, along with all other PropTypes. We recommend that you migrate away from PropTypes and switch to a type system like TypeScript. If you need to continue using ViewPropTypes, migrate to the 'deprecated-react-native-prop-types' package",
]);

// TODO: find a better solution for Intl global not available in Android runtime.
if (Platform.OS === 'android') {
  require('intl');
  require('intl/locale-data/jsonp/km-KH');
  require('intl/locale-data/jsonp/en-US');
}

messaging().setBackgroundMessageHandler(async remoteMessage => {
  // TODO: decide if background remoteMessages are a requirement
});

function getHeaderInfo() {
  if (store) {
    const { auth, preferences } = store.getState();
    return {
      token: isNewUser(auth.group) ? undefined : auth.token,
      deviceId: preferences.app.deviceId,
    };
  }
  return {};
}

axios.interceptors.request.use(
  async (config: AxiosRequestConfig & { metadata?: PerformaceMetric }) => {
    const { url, method } = config;

    if (url && method) {
      const httpMetric = perf().newHttpMetric(
        url,
        method.toUpperCase() as FirebasePerformanceTypes.HttpMethod,
      );

      config.metadata = { httpMetric };
      await httpMetric.start();
    }

    const { token, deviceId } = getHeaderInfo();

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    if (deviceId) {
      config.headers.DEVICE_ID = deviceId;
    }
    if (apiKey) {
      config.headers['x-api-key'] = apiKey;
    }

    config.headers['App-Type'] = isLiteApp ? 'Lite' : 'Full';

    if (__DEV__) {
      console.log('******** Axios Request Config ********', config);
    }

    return config;
  },
);

axios.interceptors.response.use(
  async response => {
    // Request was successful, e.g. HTTP code 200

    // @ts-ignore
    const { httpMetric } = response.config.metadata as {
      httpMetric: FirebasePerformanceTypes.HttpMetric;
    };

    httpMetric.setHttpResponseCode(response.status);

    const contentType = response.headers['content-type'];
    if (typeof contentType === 'string') {
      httpMetric.setResponseContentType(contentType);
    }

    await httpMetric.stop();

    if (__DEV__) {
      console.log('******** Axios Response Config ********', response);
    }

    return response;
  },
  async error => {
    // Request failed, e.g. HTTP code 500

    const { httpMetric } = error.config.metadata;

    if (isAxiosError(error) && error.response) {
      httpMetric.setHttpResponseCode(error.response.status);
      httpMetric.setResponseContentType(error.response.headers['content-type']);
    }

    await httpMetric.stop();

    // Ensure failed requests throw after interception
    if (__DEV__) {
      console.log(
        '******** Axios Error Object ********',
        isAxiosError(error) && error.response ? error.response : error,
      );
    }

    return Promise.reject(error);
  },
);
