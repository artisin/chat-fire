import gql from 'graphql-tag';
import { MESSAGE_FRAGMENT } from './message.fragment.js';

export const CREATE_MESSAGE_MUTATION = gql`
  mutation createMessage($text: String!, $userId: Int!, $groupId: Int!) {
    createMessage(text: $text, userId: $userId, groupId: $groupId) {
      ...MessageFragment
    }
  }
  ${MESSAGE_FRAGMENT}
`;
