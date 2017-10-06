import React from 'react';
import ReactDOM from 'react-dom';
import { applyMiddleware, createStore, compose } from 'redux';
import { Provider } from 'react-redux';
import createSagaMiddleware from 'redux-saga';
import { AppContainer } from 'react-hot-loader';
import { ConnectedRouter, routerMiddleware } from 'react-router-redux';

/**
 * Saga
 */
import IndexReducer from './index-reducer';
import IndexSagas from './index-sagas';
// saga dev tools
import { DockableSagaView, createSagaMonitor } from 'redux-saga-devtools';

/**
 * Apollo
 */
import { apolloClient } from './index-apollo';
import { ApolloProvider } from 'react-apollo';

/**
 * Application
 */
//react-redux for push state history
import history from './index-history';
// Import all of our components
import App from './App';





/**
 * Setup the middleware to watch between the Reducers and the Actions
 */
const monitor = createSagaMonitor();
const sagaMiddleware = createSagaMiddleware({sagaMonitor: monitor});

/**
 * Redux DevTools - completely optional, but this is necessary for it to
 * work properly with redux saga.
 */
const composeSetup = process.env.NODE_ENV !== 'production' && typeof window === 'object' &&
  window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ ?
  window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ : compose;



/**
 * Build the middleware for intercepting and dispatching navigation actions
 */
const historyMiddleware = routerMiddleware(history);


/**
 * create redux store
 */
const store = createStore(
  IndexReducer,
  // allows redux devtools to watch sagas
  composeSetup(applyMiddleware(
    sagaMiddleware,
    apolloClient.middleware(),
    historyMiddleware,
  ))
);

/**
 * Begin our Index Saga
 */
sagaMiddleware.run(IndexSagas);


/**
 * Setup the top level router component for our React Router
 */
ReactDOM.render(
  <AppContainer>
    <div>
      <ApolloProvider store={store} client={apolloClient}>
        { /* ConnectedRouter will use the store from Provider automatically */ }
        <ConnectedRouter history={history}>
          <App store={store}/>
        </ConnectedRouter>
      </ApolloProvider>
      { /* <DockableSagaView monitor={monitor}  /> */}
    </div>
  </AppContainer>,
  document.getElementById('root')
);

/**
 * Hot Module Replacement API
 */
if (module.hot) {
  module.hot.accept('./App', () => {
    const NextApp = require('./App').default;
    ReactDOM.render(
      <AppContainer>
          <div>
          <ApolloProvider store={store} client={apolloClient}>
            { /* ConnectedRouter will use the store from Provider automatically */ }
            <ConnectedRouter history={history}>
              <NextApp store={store}/>
            </ConnectedRouter>
          </ApolloProvider>
          { /* <DockableSagaView monitor={monitor}  /> */}
        </div>
      </AppContainer>,
      document.getElementById('root')
    );
  });
}
