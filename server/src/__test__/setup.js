const { createTestClient } = require("apollo-server-testing");
const { ApolloServer } = require("apollo-server-express");
const mongoose = require("mongoose");

const { typeDefs, resolvers } = require("../graphql/schema");

const GatewayModel = require("../models/Gateway");
const PeripheralModel = require("../models/Peripheral");

const connectToDb = async () => {
  await mongoose
    .connect("mongodb://db/node-graphql", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .catch((error) => console.error(error));
};

const dropTestDb = async () => {
  await mongoose.connection.db
    .dropDatabase()
    .catch((error) => console.error(error));
};

const closeDbConnection = async () => {
  await mongoose.connection.close().catch((error) => console.error(error));
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req, res }) => ({
    req,
    res,
    GatewayModel,
    PeripheralModel,
  }),
});

const gen = (top = 10) => Math.trunc(Math.random() * top);
const mockAddress = () => `${gen(100)}.${gen(100)}.${gen(100)}.${gen(100)}`;

module.exports = {
  testClient: createTestClient(server),
  connectToDb,
  closeDbConnection,
  dropTestDb,
  mockAddress,
  gen,
};
