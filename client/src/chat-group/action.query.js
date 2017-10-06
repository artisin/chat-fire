import { graphql } from 'react-apollo';
import update from 'immutability-helper';
import { ITEMS_PER_PAGE } from './constants';
import { GROUP_QUERY } from '../graphql/group.query';
import { MESSAGE_ADDED_SUBSCRIPTION } from '../graphql/message-added.subscription';

const isDupMessage = (nMsg, eMsg) => {
  return nMsg.id !== null && eMsg.some(val => nMsg.id === val.id);
};


export const groupQuery = graphql(GROUP_QUERY, {
  options: ({ location: { pathname } }) => {
    const group = pathname.replace('/chat/group-', '');
    const groupId = Number.parseFloat(group);
    return {
      variables: {
        groupId,
        offset: 0,
        limit: ITEMS_PER_PAGE,
      }
    };
  },
  props: ({data: {loading, group, fetchMore, subscribeToMore}}) => ({
    loading,
    group,

    /**
     * Fetches more messages if any
     * docs -> http://dev.apollodata.com/react/pagination.html#fetch-more
     */
    fetchMoreMessages() {
      return fetchMore({
        // query: ... (you can specify a different query. FEED_QUERY is used by default)
        variables: {
          //offset should match current length of messages
          offset: group.messages.length,
        },
        updateQuery: (previousResult, { fetchMoreResult }) => {
          if (!fetchMoreResult) { return previousResult; }
          //update query by adding fetched messages
          const updatedRes = update(previousResult, {
            group: {
              messages: {
                $push: fetchMoreResult.group.messages
              }
            }
          });
          return updatedRes;
        }
      });
    },

    /**
     * ws message added subscription that fires anytime a new message is added
     * @param  {obj} nextProps -> component next props
     */
    subscribeToNewMessages(nextProps) {
      return subscribeToMore({
        document: MESSAGE_ADDED_SUBSCRIPTION,
        variables: {groupIds: [nextProps.group.id]},
        updateQuery: (prvResult, { subscriptionData }) => {
          const newMessage = subscriptionData.data.messageAdded;
          if (isDupMessage(newMessage, prvResult.group.messages)) {
            return prvResult;
          }
          return update(prvResult, {
            group: {
              messages: {
                $unshift: [newMessage]
              }
            }
          });
        }
      });
    }
  })
});
