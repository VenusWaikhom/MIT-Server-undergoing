const express = require("express");
const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");
const otpGen = require("otp-generator");

const Account = require("../model/account");
const OTPToken = require("../model/otpToken");

const {
	ReqFieldValidator,
	HeaderFieldValidator,
} = require("../middleware/SignUpValidator");
const ValidateSignupField = require("../middleware/ValidateSignupField");
const ValidateLoginField = require("../middleware/ValidateLoginField");
const Authorization = require("../middleware/Authorization");
const OTPInterval = require("../middleware/OTPInterval");

const apiResponse = require("../utils/apiResponse");
const { sendMail } = require("../utils/mailSender");
const htmlMailOTPTemplate = require("../template/mailOTPTemplate");

const router = new express.Router();

router.post(
	"/login",
	ReqFieldValidator(
		{
			code: "MISSING_AUTHENTICATION_INFO",
			message: "credential required",
		},
		[
			{ location: "body", keys: ["email"] },
			{ location: "body", keys: ["password"] },
			{ location: "body", keys: ["accountType"] },
		],
	),
	ValidateLoginField,
	async (req, res) => {
		try {
			const account = await Account.findAndCheckCredential(
				req.body.email,
				req.body.password,
				req.body.accountType,
			);
			console.log(account);

			// Generate JWT token
			const token = await account.generateAuthToken();

			res.status(202).send(apiResponse({ jwtToken: token }));
		} catch (err) {
			console.error(err);
			res.status(400).send(
				apiResponse(null, {
					code: "AUTHETICATION_FAILURE",
					message: "invalid credential",
				}),
			);
		}
	},
);

router.post(
	"/signup",
	ReqFieldValidator(
		{
			code: "MISSING_AUTHENTICATION_INFO",
			message: "credential required",
		},
		[
			{ location: "body", keys: ["email"] },
			{ location: "body", keys: ["username"] },
			{ location: "body", keys: ["password"] },
			{ location: "body", keys: ["accountType"] },
		],
	),
	ValidateSignupField,
	async (req, res) => {
		// TODO: Change this to a transaction to avoid race condition
		try {
			// Check username already exist with the same role
			// const session = mongoose.startSession()

			let account = await Account.findOne({
				username: req.body.username,
				accountType: req.body.accountType,
			});
			if (account) {
				return res.status(400).send(
					apiResponse(null, {
						code: "INVALID_ACCOUNT_INFO",
						message: "username already exist",
					}),
				);
			}
			// Check Email already exist with the same role
			account = await Account.findOne({
				email: req.body.email,
				accountType: req.body.accountType,
			});
			if (account) {
				return res.status(400).send(
					apiResponse(null, {
						code: "INVALID_ACCOUNT_INFO",
						message: "email already exist",
					}),
				);
			}

			// Add account to DB
			const nAccount = new Account({ ...req.body, status: "inactive" });

			nAccount.save();

			// Send jwt token
			const token = await nAccount.generateAuthToken();
			res.status(201).send(apiResponse({ account: nAccount, token }));
		} catch (err) {
			res
				.status(500)
				.json(
					apiResponse(null, { code: "SIGNUP_ERROR", message: err.toString() }),
				);
		}
	},
);

router.get(
	"/verify/email",
	HeaderFieldValidator("Authorization"),
	Authorization,
	OTPInterval(1, "mailVerification"),
	async (req, res) => {
		// TODO: OTP can only be generated in `X` minutes intervals
		const otpReqInterval = 1; // 1 minute

		const { id } = res.locals.decodedToken;
		console.log("ID from res: ", id);

		const otpTokenDuration = 30; // in minutes
		const otpTokenStr = otpGen.generate(8, { specialChars: false });

		try {
			const _otpToken = await OTPToken.findOneAndUpdate(
				{ accountID: id },
				{
					accountID: id,
					token: await bcrypt.hash(otpTokenStr, 8),
					validDuration: otpTokenDuration,
					verificationType: "mailVerification",
				},
				{
					new: true,
					upsert: true,
				},
			).populate("accountID");

			// Send OTP EMail
			await sendMail(
				_otpToken.accountID.email,
				"Email Verification",
				htmlMailOTPTemplate({
					otpToken: otpTokenStr,
					otpTokenDuration: `${otpTokenDuration} minutes`,
				}),
			);

			res.status(201).json(
				apiResponse({
					message: `OTP send to ${_otpToken.accountID.email} successfully`,
				}),
			);
		} catch (err) {
			console.error(err, "error in sending OTP");
			res.status(400).json(
				apiResponse(null, {
					code: "OTP_SERVICE_ERROR",
					message: err.toString(),
				}),
			);
		}
	},
);

router.post(
	"/verify/email",
	HeaderFieldValidator("Authorization"),
	Authorization,
	ReqFieldValidator(
		{
			code: "MISSING_AUTHENTICATION_INFO",
			message: "OTP code missing",
		},
		[{ location: "body", keys: ["mailOTPCode"] }],
	),
	async (req, res) => {
		// TODO: Since, we'll be using OTP verification frequently, why dont we write it as a middleware
		// Get otp from DB

		const _otp = await OTPToken.findOne({
			accountID: res.locals.decodedToken.id,
			verificationType: "mailVerification",
		});
		// Check otp token entry in DB
		if (!_otp) {
			res.status(401).json(
				apiResponse(nil, {
					code: "OTP_SERVICE_ERROR",
					message: "OTP token not found in DB",
				}),
			);
		}
		try {
			// Check OTP is valid
			await _otp.verifyToken(req.body.mailOTPCode);
			// change account status to pending
			await Account.findOneAndUpdate(
				{ _id: res.locals.decodedToken.id },
				{
					status: "pending",
				},
			);
			// Remove token from DB
			await OTPToken.deleteOne({ _id: _otp._id });

			res
				.status(201)
				.json(apiResponse({ message: "OTP successfully verified" }));
		} catch (err) {
			res.status(401).json(
				apiResponse(null, {
					code: "OTP_SERVICE_ERROR",
					message: err.toString(),
				}),
			);
		}
	},
);

module.exports = router;
