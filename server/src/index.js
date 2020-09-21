const { ApolloServer } = require("apollo-server");
const { typeDefs, resolvers } = require("./graphql/schema");
const mongoose = require("mongoose");

mongoose
  .connect("mongodb://db/node-graphql", {
    promiseLibrary: require("bluebird"),
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("connection successful"))
  .catch((err) => console.error(err));

const server = new ApolloServer({ typeDefs, resolvers });
// The `listen` method launches a web server.
server.listen({ port: 3000 }).then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});
