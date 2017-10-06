import gql from 'graphql-tag';
import { GROUP_FRAGMENT } from './group.fragment.js';

export const CREATE_GROUP_MUTATION = gql`
  mutation createGroup(
    $name: String!,
    $description: String!,
    $userIds: [Int],
    $userId: Int!
  ) {
    createGroup(
      name: $name,
      description: $description,
      userIds: $userIds,
      userId: $userId
    ) {
      ...GroupFragment
    }
  }
  ${GROUP_FRAGMENT}
`;

export const UPDATE_GROUP_MUTATION = gql`
  mutation updateGroup(
    $id: Int!,
    $name: String!,
    $description: String!,
    $userIds: [Int]
  ) {
    updateGroup(
      id: $id,
      name: $name,
      description: $description,
      userIds: $userIds
    ) {
      ...GroupFragment
    }
  }
  ${GROUP_FRAGMENT}
`;

export const DELETE_GROUP_MUTATION = gql`
  mutation deleteGroup(
    $id: Int!
  ) {
    deleteGroup(
      id: $id
    ) {
      id
    }
  }
`;

