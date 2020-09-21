const peripheralType = `
  scalar Date
  
  type Peripheral {
    id:  String!
    uid: Int!
    vendor: String!
    date_created: Date!
    status: String!
  }
`;

module.exports = peripheralType;
