const validator = require("validator");
const apiResponse = require("../utils/apiResponse");

const ValidateLoginField = (req, res, next) => {
	if (!validator.isEmail(req.body.email)) {
		return res.status(400).json(
			apiResponse(null, {
				code: "INVALID_FORM_FIELD",
				message: "Invalid Email",
			}),
		);
	}

	// Check accountType
	const accountType = req.body.accountType;
	if (accountType !== "faculty" && accountType !== "admin") {
		return res.status(400).json(
			apiResponse(null, {
				code: "INVALID_FORM_FIELD",
				message: "account type should be admin, faculty only",
			}),
		);
	}

	next();
};

module.exports = ValidateLoginField;
