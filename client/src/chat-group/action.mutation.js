import { graphql } from 'react-apollo';
import { ITEMS_PER_PAGE } from './constants';
import { CREATE_MESSAGE_MUTATION } from '../graphql/message.mutation';
import { GROUP_QUERY } from '../graphql/group.query';

const isDupMessage = (nMsg, eMsg) => {
  return nMsg.id !== null && eMsg.some(val => nMsg.id === val.id);
};


export const createMessage = graphql(CREATE_MESSAGE_MUTATION, {
  /**
   * @param  {obj} options.ownProps -> the components current props
   * @param  {fnk} options.mutate   -> fnk to pass variables to gl mutation
   */
  props: ({ ownProps, mutate }) => {
    return {
      createMessage: ({id: groupId, userId, text}) => {
        return mutate({
          variables: { text, userId, groupId },
          optimisticResponse: {
            __typename: 'Mutation',
            createMessage: {
              __typename: 'Message',
              //marked id
              id: -1,
              text,
              createdAt: new Date().toISOString(),
              from: {
                __typename: 'User',
                id: 1,
                username: 'Sheridan_Streich',
              },
              to: {
                __typename: 'Group',
                id: groupId,
              }
            }
          },
          update: (store, {data: { createMessage: _createMessage }}) => {
            //check fata from cache of query
            const data = store.readQuery({
              query: GROUP_QUERY,
              variables: {
                groupId,
                offset: 0,
                limit: ITEMS_PER_PAGE
              }
            });

            //check for dup message in case of race condition
            if (isDupMessage(_createMessage, data.group.messages)) {
              return data;
            }

            //adds the message from the mutations to end
            data.group.messages.unshift(_createMessage);

            //writes data back to cache
            store.writeQuery({
              query: GROUP_QUERY,
              variables: {
                groupId,
                offset: 0,
                limit: ITEMS_PER_PAGE,
              },
              data,
            });
          }
        });
      }
    };
  }
});
