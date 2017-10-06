import { graphql } from 'react-apollo';
import { USER_QUERY } from '../graphql/user.query';


export const userQuery = graphql(USER_QUERY, {
  options: (ownProps) => {
    return {
      //checks for new message previes every minute
      pollInterval: 60000,
      variables: {
        id: ownProps.client.userId
      }
    };
  },
  //shape the data
  props: ({ data: { loading, user } }) => ({
    loading, user,
  }),
});

