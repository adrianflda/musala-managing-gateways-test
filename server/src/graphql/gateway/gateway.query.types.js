const gatewayQueryType = `
  # get all Gateways
  getGateways : [Gateway]

  # get a Gateway
  getGateway (
    serial: String!
  ): Gateway
`;

module.exports = gatewayQueryType;
