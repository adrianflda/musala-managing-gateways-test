const gatewayMutationType = `
  #add new Gateway
  addGateway(
    serial: String!
    name: String!
    address: String!
  ): Gateway

  #update a Gateway
  updateGateway(
    serial: String!
    name: String
    address: String
    peripherals: [String]
  ): Gateway

  #add new peripheral(s) to Gateway
  addPeripheralToGateway(
    serial: String!
    peripheralId: String!
  ): Gateway

  #remove peripheral(s) to Gateway
  removePeripheralFromGateway(
    serial: String!
    peripheralId: String!
  ): Gateway

  #remove a Gateway
  removeGateway(
    serial: String!
  ): Gateway

`;

module.exports = gatewayMutationType;
