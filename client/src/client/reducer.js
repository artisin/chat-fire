import { CLIENT_SET, CLIENT_UNSET } from './constants';
// import update from 'immutability-helper';

const initState = {
  userId: window.userId || 1,
  token: null,
  username: 'Sheridan_Streich',
};
const reducer = (state = initState, action) => {

  const handlers = {
    [CLIENT_SET]: () => {
      return {
        userId: action.token.userId,
        token: action.token,
      };
    },
    [CLIENT_UNSET]: () => {
      return {
        userId: null,
        token: null,
      };
    }
  };
  const handler = handlers[action.type];
  return handler ? handler() : state;
};

export default reducer;
