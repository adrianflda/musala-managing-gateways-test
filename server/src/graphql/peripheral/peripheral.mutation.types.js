const peripheralType = `
  #add new Peripheral
  addPeripheral(
    uid: Int!
    vendor: String!
    date_created: Date!
    status: String!
  ): Peripheral

  #update a Peripheral
  updatePeripheral(
    id:  String!
    uid: Int
    vendor: String
    date_created: Date
    status: String
  ): Peripheral

  #remove a Peripheral
  removePeripheral(
    id: String!
  ): Peripheral
`;

module.exports = peripheralType;
