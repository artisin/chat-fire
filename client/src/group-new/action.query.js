import { graphql } from 'react-apollo';
import { has, get } from 'lodash';
import { USER_QUERY } from '../graphql/user.query';

export const userFriendQuery = graphql(USER_QUERY, {
  options: ({client: {userId}}) => {
    return {variables: {userId}};
  },
  props: (res) => {
    const getVal = (prop) => has(res, `data.user.${prop}`)
      ? get(res, `data.user.${prop}`)
      : [];
    return {
      loading: res.data.loading,
      groups: getVal('groups'),
      friends: getVal('friends')
    };
  }
});
