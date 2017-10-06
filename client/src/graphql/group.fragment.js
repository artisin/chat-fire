import gql from 'graphql-tag';
import { MESSAGE_FRAGMENT } from './message.fragment.js';

export const GROUP_FRAGMENT = gql`
  fragment GroupFragment on Group {
    id
    name
    description
    createdAt
    users {
      id
    }
    messages(limit: 1) {
      ...MessageFragment
    }
  }
  ${MESSAGE_FRAGMENT}
`;
