const mongoose = require("mongoose");
// const mailSender = require();

const Schema = mongoose.Schema;

const OTPTokenSchema = new Schema({
	name: {
		type: String,
		requires: true,
		lowercase: true,
		maxLength: 100,
	},
});

module.exports = mongoose.model("OTPToken", OTPTokenSchema);
