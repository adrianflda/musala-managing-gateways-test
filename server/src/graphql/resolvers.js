const { GraphQLScalarType } = require("graphql");
const { Kind } = require("graphql/language");

const GatewayResolvers = require("./gateway/gateway.resolvers");
const PeripheralResolvers = require("./peripheral/peripheral.resolvers");

const Mutation = {
  ...GatewayResolvers.Mutation,
  ...PeripheralResolvers.Mutation,
};

const Query = {
  ...GatewayResolvers.Query,
  ...PeripheralResolvers.Query,
};

module.exports = {
  Query,
  Mutation,
  Date: new GraphQLScalarType({
    name: "Date",
    description: "Date custom scalar type",
    parseValue(value) {
      return new Date(value); // value from the client
    },
    serialize(value) {
      return value.getTime(); // value sent to the client
    },
    parseLiteral(ast) {
      if (ast.kind === Kind.INT) {
        return parseInt(ast.value, 10); // ast value is always in string format
      }
      return null;
    },
  }),
};
