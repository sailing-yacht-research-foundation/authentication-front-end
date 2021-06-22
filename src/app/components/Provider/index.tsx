import React from 'react';
import { Provider } from 'react-redux';
import { configureAppStore } from 'store/configureStore';

const store = configureAppStore();

export default function MyProvider(props) {
    const { children, customStore } = props;
  
    return (
      <Provider store={customStore || store}>
        {children}
      </Provider>
    );
  }