import { MODAL } from './constants';

export const modalAction = function modalAction ({...args}) {
  return {
    type: MODAL,
    ...args,
  };
};
