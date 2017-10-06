import { makeExecutableSchema } from 'graphql-tools';
// import { Mocks } from './mocks';
import { Resolvers } from './resolvers';

const Schema = [
  `
  # date scalars
  scalar Date

  # a group chat entity
  type Group {
    id: Int! # unique id for the group
    name: String # name of the group
    description: String # description of the group
    users: [User]! # users in the group
    createdAt: Date! # when group was created
    messages(limit: Int, offset: Int): [Message] # messages sent to the group
  }


  # a user entity
  type User {
    id: Int! # unique id for the user
    email: String! # require a unique email per user
    username: String # name to show other users
    messages: [Message] # messages sent by user
    groups: [Group] # groups the user belongs to
    friends: [User] # user's friends/contacts
  }


  # a message sent from a user to a group
  type Message {
    id: Int! # unique id for message
    to: Group! # group message was sent in
    from: User! # user who sent the message
    text: String! # message text
    createdAt: Date! # when message was created
  }


  # query for types
  type Query {
    # Return a user by their email or id
    user(email: String, id: Int): User
    # Return messages sent by a user via userId
    # Return messages sent to a group via groupId
    messages(groupId: Int, userId: Int): [Message]
    # Return a group by its id
    group(id: Int!): Group
  }


  type Subscription {
    # Subscription fires on every message added and
    # for any groups with one of these groupIds
    messageAdded(groupIds: [Int]): Message
    groupAdded(userId: Int): Group
  }


  # alters data
  type Mutation {
    # send message to group
    createMessage(
      text: String!,
      userId: Int!,
      groupId: Int!
    ): Message

    createGroup(
      name: String!,
      description: String!,
      userIds: [Int],
      userId: Int!
    ): Group
    deleteGroup(id: Int!): Group
    leaveGroup(id: Int!, userId: Int!): Group
    updateGroup(
      id: Int!,
      name: String!,
      userIds: [Int],
      description: String!
    ): Group


  }


  schema {
    query: Query
    mutation: Mutation
    subscription: Subscription
  }
  `,
];



const executableSchema = makeExecutableSchema({
  typeDefs: Schema,
  resolvers: Resolvers,
});


module.exports = {
  executableSchema
};
