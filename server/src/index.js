const express = require('express');
const { graphqlExpress, graphiqlExpress } = require('graphql-server-express');
// const { makeExecutableSchema } = require('graphql-tools');
const bodyParser = require('body-parser');
const cors = require('cors');
const { createServer } = require('http');
const { SubscriptionServer } = require('subscriptions-transport-ws');
const { execute, subscribe } = require('graphql');
const { executableSchema } = require('./data/schema');
const {
  GRAPHQL_PORT,
  GRAPHQL_PATH,
  GRAPHQL_I_PATH,
  SUBSCRIPTIONS_PATH,
  CORS_ORIGIN,
} = require('./constants');



const app = express();

// const schema = makeExecutableSchema({
//   typeDefs: Schema,
//   resolvers: Resolvers,
// });

app.use('*', cors({ origin: CORS_ORIGIN }));

//context must be object when using connnectors
app.use('/graphql', bodyParser.json(), graphqlExpress({
  schema: executableSchema
}));
app.use(GRAPHQL_I_PATH, graphiqlExpress({
  endpointURL: GRAPHQL_PATH,
  subscriptionsEndpoint: `ws://localhost:${GRAPHQL_PORT}${SUBSCRIPTIONS_PATH}`,
}));


// We wrap the express server so that we can attach the WebSocket for subscriptions
const graphServer = createServer(app);

graphServer.listen(GRAPHQL_PORT, () => {
  console.log(`GraphQL Server is now running on http://localhost:${GRAPHQL_PORT}${GRAPHQL_PATH}`);
  console.log(`GraphQL Subscriptions are now running on ws://localhost:${GRAPHQL_PORT}${SUBSCRIPTIONS_PATH}`);
});

const subscriptionServer = SubscriptionServer.create({
  schema: executableSchema,
  execute,
  subscribe,
}, {
  server: graphServer,
  path: SUBSCRIPTIONS_PATH,
});
