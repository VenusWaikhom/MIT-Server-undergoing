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
			unique: true,
		},
		token: {
			type: String,
			required: true,
		},
		validDuration: {
			type: Number, // in minutes
			required: true,
		},
		verificationType: {
			type: String,
			required: true,
			enum: ["mailVerification", "changePassword"],
			default: "mailVerification",
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

OTPTokenSchema.post(
	"deleteOne",
	{ document: true, query: false },
	async function (doc) {
		console.log(doc);
		try {
			await new permToken({
				accountID: doc.accountID,
				token: otpGen.generate(16),
			}).save();
		} catch (err) {
			console.error(err.toString());
			throw new Error(err);
		}
	},
);

module.exports = mongoose.model("OTPToken", OTPTokenSchema);
