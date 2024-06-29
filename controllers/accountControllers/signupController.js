const mongoose = require("mongoose");

const Account = require("../../model/account");

const apiResponse = require("../../utils/apiResponse");

const signupPostHandler = async (req, res) => {
	const session = await mongoose.startSession();
	session.startTransaction();
	try {
		// Check username already exist with the same role
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

		await session.commitTransaction();
		session.endSession();
		// Send jwt token
		const token = await nAccount.generateAuthToken();
		res.status(201).send(apiResponse({ account: nAccount, token }));
	} catch (err) {
		await session.abortTransaction();
		session.endSession();

		res
			.status(500)
			.json(
				apiResponse(null, { code: "SIGNUP_ERROR", message: err.toString() }),
			);
	}
};

module.exports = { signupPostHandler };
