import { graphql } from 'react-apollo';
import {
  UPDATE_GROUP_MUTATION,
  DELETE_GROUP_MUTATION,
} from '../graphql/group.mutation';
import { USER_QUERY } from '../graphql/user.query';


export const updateGroupMutation = graphql(UPDATE_GROUP_MUTATION, {
  /**
   * @param  {obj} options.ownProps -> the components current props
   * @param  {fnk} options.mutate   -> fnk to pass variables to gl mutation
   */
  props: ({ ownProps, mutate }) => {
    return {
      updateGroup: ({id, name, description, userId, userIds}) => {
        return mutate({
          variables: { id, name, description, userIds },
        });
      }
    };
  }
});

export const deleteGroupMutation = graphql(DELETE_GROUP_MUTATION, {
  /**
   * @param  {obj} options.ownProps -> the components current props
   * @param  {fnk} options.mutate   -> fnk to pass variables to gl mutation
   */
  props: ({ ownProps, mutate }) => {
    return {
      deleteGroup: ({id, userId}) => {
        return mutate({
          variables: { id },
          update: (store) => {
            //get current cache from query
            const data = store.readQuery({
              query: USER_QUERY,
              variables: {
                userId,
              }
            });
            //remove group
            const index = data.user.groups.findIndex(val => val.id === id);
            if (index > -1) {
              data.user.groups.splice(index, 1);
            }
            //write updated cache
            store.writeQuery({
              query: USER_QUERY,
              variables: {
                userId,
              },
              data,
            });
          }
        });
      }
    };
  }
});
