import gql from 'graphql-tag';
import { GROUP_FRAGMENT } from './group.fragment.js';

export const USER_QUERY = gql`
  query user($id: Int) {
    user(id: $id) {
      id
      email
      username
      groups {
        ...GroupFragment
      }
      friends {
        id
        username
      }
    }
  }
  ${GROUP_FRAGMENT}
`;

