import React from 'react';
import { StatusBar } from 'expo-status-bar';
import NavigationSlack from './Navigation/NavigationSlack';
import { Provider } from 'react-redux';
import { persistor, store } from './redux/store';
import { PersistGate } from 'redux-persist/integration/react';
import 'react-native-gesture-handler'

export default function App() {
  return (
    <>
      <Provider store={store} >
        <PersistGate persistor={persistor}>
          <StatusBar style='light' backgroundColor='#2e2d2d'/>
          <NavigationSlack />
        </PersistGate>
      </Provider>
     
    </>
  );
}
