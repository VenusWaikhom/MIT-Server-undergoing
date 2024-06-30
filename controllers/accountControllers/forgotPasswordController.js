const otpGen = require("otp-generator");
const bcrypt = require("bcryptjs");

const account = require("../../model/account");
const otpToken = require("../../model/otpToken");

const { sendMail } = require("../../utils/mailSender");
const apiResponse = require("../../utils/apiResponse");
const htmlMailVerifyOTPTemplate = require("../../template/mailVerifyOTPTemplate");
const OTPInterval = require("../../middleware/OTPInterval");

const forgotPasswordGet = async (req, res) => {
	const { email } = req.body;

	try {
		// Check email exist in account collection
		const _acc = await account.findOne({ email });
		if (!_acc) {
			return res.status(401).json(
				apiResponse(null, {
					code: "INVALID_REQ_FIELD",
					message: "email doesnt exist",
				}),
			);
		}
		// Check OTP interval
		res.locals.decodedToken = { id: _acc._id.toString() };
		const isValid = await OTPInterval(1, "forgotPassword")(req, res, () => {});
		if (!isValid) return;

		// Generate OTP token and store in DB
		const otpTokenStr = otpGen.generate(+process.env.OTP_TOKEN_LEN, {
			specialChars: false,
		});

		const _otpToken = await otpToken.findOneAndUpdate(
			{ accountID: _acc._id, verificationType: "forgotPassword" },
			{
				token: await bcrypt.hash(otpTokenStr, +process.env.SALT),
				validDuration: process.env.OTP_TOKEN_DURATION,
			},
			{
				new: true,
				upsert: true,
			},
		);

		// Send OTP to registered email
		await sendMail(
			_acc.email,
			"Forgot Password",
			htmlMailVerifyOTPTemplate({
				otpToken: otpTokenStr,
				otpTokenDuration: `${process.env.OTP_TOKEN_DURATION} minutes`,
			}),
		);
		if (process.env.ENV === "dev") {
			console.log("OTP token: ", otpTokenStr);
			console.log(
				htmlMailVerifyOTPTemplate({
					otpToken: otpTokenStr,
					otpTokenDuration: `${process.env.OTP_TOKEN_DURATION} minutes`,
				}),
			);
		}

		res.status(201).json(
			apiResponse({
				message: `OTP send to ${_acc.email} successfully`,
			}),
		);
	} catch (err) {
		console.error(err);
		res.status(401).json(
			apiResponse(null, {
				code: "SERVER_ERROR",
				message: err.toString(),
			}),
		);
	}
};

const forgotPasswordPost = async (req, res) => {};

module.exports = { forgotPasswordGet, forgotPasswordPost };
