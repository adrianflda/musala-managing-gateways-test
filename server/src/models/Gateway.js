var mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");

const validateIPaddressV4 = (ipaddress) =>
  /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/.test(
    ipaddress
  );

const validLength = (array) => array.length <= 10;

var GatewaySchema = new mongoose.Schema({
  id: { type: String, default: uuidv4() },
  serial: { type: String, index: { unique: true } },
  name: String,
  address: {
    type: String,
    validate: validateIPaddressV4,
    index: { unique: true },
  },
  peripherals: { type: [String], validate: validLength },
});

module.exports = mongoose.model("Gateway", GatewaySchema);
