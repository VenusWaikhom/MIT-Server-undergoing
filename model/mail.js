const mongoose = require("mongoose");

const validator = require("validator");

const mailSchema = new mongoose.Schema({
  name: { type: String, require: true, trim: true, lowercase: true },
  email: {
    type: String,
    require: true,
    trim: true,
    lowercase: true,
    validate(value) {
      if (!validator.isEmail(value)) {
        throw new Error("Email is invalid");
      }
    },
  },
  message: { type: String, require: true, trim: true, lowercase: true },
});

const mail = mongoose.model("Mail", mailSchema);
module.exports = mail;
