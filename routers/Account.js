const express = require("express");
const mongoose = require("mongoose");
const Authorization = require("../middleware/Authorization");

const Account = require("../model/account");
const apiResponse = require("../utils/apiResponse");
const {
	ReqFieldValidator,
	HeaderFieldValidator,
} = require("../middleware/SignUpValidator");
const ValidateSignupField = require("../middleware/ValidateSignupField");
const ValidateLoginField = require("../middleware/ValidateLoginField");

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

router.post(
	"/verify/email",
	HeaderFieldValidator("Authorization"),
	Authorization,
	(req, res) => {
		console.log(req.header("Authorization"));
		res.status(201).send({ l: true, tok: req.token });
	},
);

module.exports = router;

// _FieldValidator(
// 	{ code: "MISSING_TOKEN", message: "authentication token not present" },
// 	[{location: , keys: [header, ]}]
// ),
