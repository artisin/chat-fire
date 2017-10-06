import { combineReducers } from 'redux';
import { reducer as form } from 'redux-form';
import { routerReducer } from 'react-router-redux';
import apolloClient from './index-apollo';
import client from './client/reducer';
import navigation from './navigation/reducer';
import modal from './modal/reducer';


const IndexReducer = combineReducers({
  apollo: apolloClient.reducer(),
  router: routerReducer,
  form,
  navigation,
  client,
  modal,
});

export default IndexReducer;
