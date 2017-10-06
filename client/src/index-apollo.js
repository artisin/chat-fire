import ApolloClient, { createNetworkInterface } from 'apollo-client';
import { SubscriptionClient, addGraphQLSubscriptions } from 'subscriptions-transport-ws';

const GRAPHQL_PORT = 5000;


/**
 * Apollo config
 */
export const networkInterface = createNetworkInterface({
  uri: `http://localhost:${GRAPHQL_PORT}/graphql`
});


/**
 * Setup/create WebSocket Client
 */
const wsClient = new SubscriptionClient(`ws://localhost:${GRAPHQL_PORT}/subscriptions`, {
  reconnect: true,
  connectionParams: {
    //initialization arguments
  }
});

/**
 * Extend the network interface with WebSocket
 */
const networkInterfaceWithSubscriptions = addGraphQLSubscriptions(
  networkInterface,
  wsClient,
);

export const apolloClient = new ApolloClient({
  networkInterface: networkInterfaceWithSubscriptions,
});


export default apolloClient;
