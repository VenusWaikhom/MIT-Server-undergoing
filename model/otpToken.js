const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const otpGen = require("otp-generator");

const permToken = require("./permToken");
// const mailSender = require();

const Schema = mongoose.Schema;

const OTPTokenSchema = new Schema(
	{
		accountID: {
			type: Schema.Types.ObjectId,
			ref: "Account",
			required: true,
			expires: "60s",
			index: true,
		},
		token: {
			type: String,
			required: true,
			expires: "60s",
		},
		validDuration: {
			type: Number, // in minutes
			required: true,
		},
		verified: { type: Boolean, default: false, required: true },
		verificationType: {
			type: String,
			required: true,
			enum: ["mailVerification", "forgotPassword"],
			default: "mailVerification",
		},
		expiredAt: {
			type: Date,
			default: Date.now() + 1 * 60 * 1000, // expires in 1 minutes
			expireAfterSeconds: 10,
			index: true,
		},
	},
	{
		timestamps: true,
	},
);

OTPTokenSchema.methods.verifyToken = async function (otpTokenStr) {
	const tokenDuration = this.validDuration * 1000 * 60; // in minutes
	const tokenIssue = new Date(this.updatedAt).getTime();

	// Check OTP expiry
	if (Date.now() > tokenDuration + tokenIssue) {
		throw new Error("OTP Token expired");
	}
	// comparre token Str
	const tokenCompare = await bcrypt.compare(otpTokenStr, this.token);
	if (!tokenCompare) {
		throw new Error("Incorrect OTP Token");
	}
	return true;
};

module.exports = mongoose.model("OTPToken", OTPTokenSchema);
