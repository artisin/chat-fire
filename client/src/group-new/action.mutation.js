import { graphql } from 'react-apollo';
import { CREATE_GROUP_MUTATION } from '../graphql/group.mutation';
import { USER_QUERY } from '../graphql/user.query';

const isDuplicate = (next, existing) => {
  return next.id !== null && existing.some(val => next.id === val.id);
};

export const createGroupMutation = graphql(CREATE_GROUP_MUTATION, {
  /**
   * @param  {obj} options.ownProps -> the components current props
   * @param  {fnk} options.mutate   -> fnk to pass variables to gl mutation
   */
  props: ({ ownProps, mutate }) => {
    return {
      createGroup: ({name, description, userId, userIds = []}) => {
        return mutate({
          variables: { name, description, userId, userIds },
          update: (store, {data: {createGroup: _createGroup}}) => {
            //get data from current cahce query
            const data = store.readQuery({
              query: USER_QUERY,
              variables: {
                userId,
              }
            });
            //check for dup message in case of race condition
            if (isDuplicate(_createGroup, data.user.groups)) {
              return data;
            }
            //add group and write to cache
            data.user.groups.push(_createGroup);
            store.writeQuery({
              query: USER_QUERY,
              variables: {
                userId,
              },
              data,
            });
          },
        });
      }
    };
  }
});
