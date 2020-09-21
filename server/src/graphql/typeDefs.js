// The GraphQL schema
const GatewayType = require("./gateway/gateway.types");
const GatewayQueryType = require("./gateway/gateway.query.types");
const GatewayMutationType = require("./gateway/gateway.mutation.types");
const PeripheralType = require("./peripheral/peripheral.types");
const PeripheralQueryType = require("./peripheral/peripheral.query.types");
const PeripheralMutationType = require("./peripheral/peripheral.mutation.types");
const HelloworldType = require("./helloworld/helloworld.types");
const HelloworldQuery = require("./helloworld/helloworld.query.types");

const Mutation = `
  type Mutation {
    ${GatewayMutationType}
    ${PeripheralMutationType}
  }
`;

const Query = `
  type Query {
    ${HelloworldQuery}
    ${GatewayQueryType}
    ${PeripheralQueryType}
  }
`;

module.exports = [HelloworldType, GatewayType, PeripheralType, Mutation, Query];
