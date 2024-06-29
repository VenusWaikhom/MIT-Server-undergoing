const apiResponse = require("../../utils/apiResponse");

const accountSearchGet = (req, res) =>
	res.status(404).json(apiResponse("nothing"));

module.exports = { accountSearchGet };
