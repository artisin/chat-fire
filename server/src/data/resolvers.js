const GraphQLDate = require('graphql-date');
const { Group, User, Message } = require('./connectors');
const { withFilter } = require('graphql-subscriptions');
const winston = require('winston');
const { pubsub } = require('./subscriptions');
const {
  MESSAGE_ADDED_TOPIC,
  GROUP_ADDED_TOPIC,
} = require('../constants');

const activeLogs = [
  'Query',
  'Subscription',
  'Mutation',
  'Group',
  'Message',
  'User',
];
const log = (meth, fnk, ...args) => {
  if (activeLogs.indexOf(meth)) {
    winston.log('info', `Resolvers: ${meth} -> ${fnk}`, {
      ...args
    });
  }
};




const Resolvers = {
  // for custom scalar
  Date: GraphQLDate,
  Query: {
    group: async function group(_, args) {
      log('Query', 'group', args);
      const res = await Group.find({ where: args });
      return res;
    },
    user: async function user(_, args) {
      log('Query', 'user', args);
      const res = await User.findOne({ where: args });
      return res;
    },
    messages: async function messages(_, args) {
      log('Query', 'message', args);
      const res = await Message.findAll({
        where: args,
        order: [['createdAt', 'DESC']],
      });
      return res;
    },
  },
  Subscription: {
    messageAdded: {
      subscribe: withFilter(
        //subscriptiopn payload is the message
        () => {
          return pubsub.asyncIterator(MESSAGE_ADDED_TOPIC);
        },
        //returns true if the groupId of the new message matches one of the
        //groupIds passed into our messageAdded sub
        (payload, args) => {
          log('Subscription', 'messageAdded', args);
          return args.groupIds && args.groupIds.includes(payload.messageAdded.groupId);
        }
      ),
    },
    groupAdded: {
      subscribe: withFilter(
        () => pubsub.asyncIterator(GROUP_ADDED_TOPIC),
        (payload, args) => {
          log('Subscription', 'groupAdded', args);
          // return args.userId && payload.groupAdded.users.map((val) => )
          return true;
        }
      )
    }
  },
  Mutation: {
    createMessage: async function createMessage(_, {text, userId, groupId}) {
      log('Mutation', 'createMessage', text, userId, groupId);
      const message = await Message.create({
        userId,
        text,
        groupId,
      });
      //triggers pubsub to publish the messageAdded event as well as the
      //newly created message. Will also emit event to any clients subscribed to
      //the messageAdded with the new message
      pubsub.publish(MESSAGE_ADDED_TOPIC, { [MESSAGE_ADDED_TOPIC]: message });
      return message;
    },
    createGroup: async function createGroup(_, {name, description, userIds, userId}) {
      log('Mutation', 'createGroup', name, description, userIds, userId);
      const user = await User.findOne({ where: { id: userId } });
      const friends = await user.getFriends({ where: { id: { $in: userIds } } });
      const group = await Group.create({name, description, users: [user, ...friends]});
      await group.addUsers([user, ...friends]);
      //apped the user list to the group object to pass to the pubsub so that we
      //can check the memebers of the group
      group.users = [user, ...friends];
      pubsub.publish(GROUP_ADDED_TOPIC, { [GROUP_ADDED_TOPIC]: group });
      return group;
    },
    deleteGroup: async function deleteGroups(_, { id }) {
      log('Mutation', 'deleteGroup', id);
      const group = await Group.findOne({ where: { id } });
      const users = await group.getUsers();
      await group.removeUsers(users);
      await Message.destroy({ where: { groupId: id } });
      await group.destroy();
      return {id};
    },
    leaveGroup: async function leaveGroup(_, { id, userId }) {
      log('Mutation', 'leaveGroup', id, userId);
      const group = await Group.findOne({ where: { id } });
      await group.removeUser(userId);
      return id;
    },
    updateGroup: async function updateGroup(_, { id, name, description, userIds }) {
      log('Mutation', 'updateGroup', id, name, description, userIds);
      let group = await Group.findOne({ where: { id } });
      group = await group.update({name, description});

      /**
       * Handle user update/removal - there has to be a better way to do this?
       */
      const usersRaw = await group.getUsers({raw: true});
      const currentUsers = usersRaw.map((val) => val.id);
      currentUsers.forEach(async function(val) {
        if (!userIds.includes(val)) {
          await group.removeUser(val);
        }
      });
      await group.addUsers([...userIds]);

      return group;
    },
  },
  Group: {
    users: async function users(group) {
      log('Group', 'users', group.id);
      const res = await group.getUsers();
      return res;
    },
    messages: async function messages(group, {limit, offset}) {
      log('Group', 'messages', group.id);
      const res = await Message.findAll({
        limit,
        offset,
        where: { groupId: group.id },
        order: [['createdAt', 'DESC']],
      });
      return res;
    },
  },
  Message: {
    to: async function to(message) {
      log('Message', 'to', message.id);
      const res = await message.getGroup();
      return res;
    },
    from: async function to(message) {
      log('Message', 'from', message.id);
      const res = await message.getUser();
      return res;
    },
  },
  User: {
    messages: async function messages(user) {
      log('User', 'messages', user.id);
      const res = await Message.findAll({
        where: { userId: user.id },
        order: [['createdAt', 'DESC']],
      });
      return res;
    },
    groups: async function groups(user) {
      log('User', 'groups', user.id);
      const res = await user.getGroups();
      return res;
    },
    friends: async function friends(user) {
      log('User', 'friends', user.id);
      const res = await user.getFriends();
      return res;
    },
  },
};

module.exports = {
  Resolvers
};
