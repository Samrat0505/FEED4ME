const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const farmerSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  age:{
    type: String,
  },
  location: {
    type: String
  },
  password: {
    type: String,
    required: true,
  },
  mobile: {
    type: String,
  },
  date: {
    type: Date,
    default: Date.now(),
  }
});

module.exports = mongoose.model("Farmer", farmerSchema);