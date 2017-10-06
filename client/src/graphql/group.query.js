import gql from 'graphql-tag';
import { MESSAGE_FRAGMENT } from './message.fragment.js';

export const GROUP_QUERY = gql`
  query group($groupId: Int!, $offset: Int, $limit: Int) {
    group(id: $groupId) {
      id
      name
      users {
        id
        username
      }
      messages(limit: $limit, offset: $offset) {
        ...MessageFragment
      }
    }
  }
  ${MESSAGE_FRAGMENT}
`;

