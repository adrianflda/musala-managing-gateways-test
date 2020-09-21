const peripheralType = `
  # get all Peripherals
  getPeripherals: [Peripheral]

  # get a Peripheral
  getPeripheral (
    id: String!
  ): Peripheral
`;

module.exports = peripheralType;
