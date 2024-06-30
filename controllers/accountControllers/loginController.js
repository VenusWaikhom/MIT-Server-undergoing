const Account = require("../../model/account");

const apiResponse = require("../../utils/apiResponse");

const loginPostHandler = async (req, res) => {
	try {
		const account = await Account.findAndCheckCredential(
			req.body.email,
			req.body.password,
			req.body.accountType,
		);
		console.log(account);

		// Generate JWT token
		const token = await account.generateAuthToken();

		res.status(202).send(
			apiResponse({
				message: "account login successful",
				account: { _id: account._id, accountType: account.accountType },
				token,
			}),
		);
	} catch (err) {
		console.error(err);
		res.status(400).send(
			apiResponse(null, {
				code: "AUTHETICATION_FAILURE",
				message: "invalid credential",
			}),
		);
	}
};

module.exports = { loginPostHandler };
