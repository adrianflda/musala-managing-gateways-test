var mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");

var PeripheralSchema = new mongoose.Schema({
  id: { type: String, default: uuidv4() },
  uid: { type: Number, index: { unique: true } },
  vendor: String,
  date_created: Date,
  status: { type: String, enum: ["online", "offline"] },
});

module.exports = mongoose.model("Peripheral", PeripheralSchema);
