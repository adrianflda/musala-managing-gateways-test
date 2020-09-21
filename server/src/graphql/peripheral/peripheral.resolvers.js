const PeripheralModel = require("../../models/Peripheral");

const resolvers = {
  Query: {
    // query
    getPeripherals: async () => {
      const peripherals = await PeripheralModel.find().exec();
      if (!peripherals) {
        throw new Error("Error");
      }
      return peripherals;
    },
    getPeripheral: async (_, params) => {
      const peripheralDetails = await PeripheralModel.findById(
        params.id
      ).exec();
      if (!peripheralDetails) {
        throw new Error("Error");
      }
      return peripheralDetails;
    },
  },
  Mutation: {
    // mutation
    addPeripheral: async (_, params) => {
      const peripheralModel = new PeripheralModel(params);
      const newPeripheral = await peripheralModel.save();
      if (!newPeripheral) {
        throw new Error("Error");
      }
      return newPeripheral;
    },
    updatePeripheral: async (_, params) => {
      return PeripheralModel.findByIdAndUpdate(
        params.id,
        { uid, vendor, date_created, status },
        function (err) {
          if (err) return next(err);
        }
      );
    },
    removePeripheral: async (_, params) => {
      const remPeripheral = await PeripheralModel.findByIdAndRemove(
        params.id
      ).exec();
      if (!remPeripheral) {
        throw new Error("Error");
      }
      return remPeripheral;
    },
  },
};

module.exports = resolvers;
