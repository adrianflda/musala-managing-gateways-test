const GatewayModel = require("../../models/Gateway");

const resolvers = {
  Query: {
    // queries
    getGateways: () => {
      const gateways = GatewayModel.find().exec();
      if (!gateways) {
        throw new Error("Error");
      }
      return gateways;
    },
    getGateway: async (_, { serial }) => {
      const gatewayDetails = await GatewayModel.findOne({ serial }).exec();
      if (!gatewayDetails) {
        throw new Error("Error");
      }
      return gatewayDetails;
    },
  },
  Mutation: {
    // mutations
    addGateway: async (_, params) => {
      const gatewayModel = new GatewayModel(params);
      const newGateway = await gatewayModel.save();
      if (!newGateway) {
        throw new Error("Error");
      }
      return newGateway;
    },
    updateGateway: async (_, { serial, name, address, peripherals }) => {
      let doc = await GatewayModel.findOne({ serial }).exec();
      doc.serial = serial || doc.serial;
      doc.name = name || doc.name;
      doc.address = address || doc.address;
      doc.peripherals = peripherals || doc.peripherals;
      try {
        return await doc.save();
      } catch (error) {
        throw new Error(error);
      }
    },
    addPeripheralToGateway: async (_, { serial, peripheralId }) => {
      let doc = await GatewayModel.findOne({ serial }).exec();
      if (!doc) {
        throw new Error("No gateway with this serial.");
      }
      if (doc.peripherals.find((p) => p === peripheralId)) {
        return doc;
      }
      doc.peripherals = doc.peripherals.push(peripheralId);
      try {
        return await doc.save();
      } catch (error) {
        throw new Error(error);
      }
    },
    removePeripheralFromGateway: async (_, { serial, peripheralId }) => {
      let doc = await GatewayModel.findOne({ serial }).exec();
      doc.peripherals = doc.peripherals.filter((p) => peripheralId !== p);
      try {
        return await doc.save();
      } catch (error) {
        throw new Error(error);
      }
    },
    removeGateway: async (_, { serial }) => {
      const remGateway = await GatewayModel.findOneAndDelete({ serial }).exec();
      if (!remGateway) {
        throw new Error("Error");
      }
      return remGateway;
    },
  },
};

module.exports = resolvers;
