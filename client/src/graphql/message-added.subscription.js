import gql from 'graphql-tag';
import { MESSAGE_FRAGMENT } from './message.fragment.js';

export const MESSAGE_ADDED_SUBSCRIPTION = gql`
  subscription onMessageAdded($groupIds: [Int]) {
    messageAdded(groupIds: $groupIds) {
      ...MessageFragment
    }
  }
  ${MESSAGE_FRAGMENT}
`;
