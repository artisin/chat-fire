import { MODAL } from './constants';

const initState = {
  modalOpen: false,
  title: 'TITLE',
  icon: 'checkmark',
  content: 'CONTENT CONTENT',
  negButtonShow: true,
  posButtonShow: true,
  negButtonText: 'No',
  posButtonText: 'Yes',
  negButtonFn: null,
  posButtonFn: null,
};
const reducer = (state = initState, action) => {
  const handlers = {
    [MODAL]: () => {
      return Object.assign({}, initState, action);
    }
  };
  const handler = handlers[action.type];
  return handler ? handler(action.payload) : state;
};

export default reducer;
