import {
  NAV_TITLE,
} from './constants';

export const changeTitle = function changeTitle (title) {
  return {
    type: NAV_TITLE,
    title
  };
};
