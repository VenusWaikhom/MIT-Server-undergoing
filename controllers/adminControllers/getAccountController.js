const account = require("../../model/account");

const apiResponse = require("../../utils/apiResponse");

const getAccountsGet = async (req, res) => {
	const accounts = await account.find().sort("createdAt").select("-password");
	return res.status(201).json(apiResponse(accounts));
};

module.exports = { getAccountsGet };
