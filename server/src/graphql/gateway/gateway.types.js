const gatewayType = `
  type Gateway {
    id: ID!
    serial: String!
    name: String!
    address: String!
    peripherals: [String]
  }
`;

module.exports = gatewayType;
