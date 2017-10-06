import { NAV_TITLE } from './constants';

const initState = {
  title: 'Chat Fire'
};
const reducer = (state = initState, action) => {
  const handlers = {
    [NAV_TITLE]: () => {
      return action.title ? {title: action.title} : state;
    }
  };
  const handler = handlers[action.type];
  return handler ? handler(action.payload) : state;
};

export default reducer;
