const mongoose = require("mongoose");
const { Schema } = mongoose;

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
    required: true, 
    unique: true, 
    minlength: 10
  },
  date: {
    type: Date,
    default: Date.now(),
  },
});

module.exports = mongoose.model("Farmers", farmerSchema);