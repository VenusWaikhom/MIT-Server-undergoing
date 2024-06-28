const validator = require("validator");
const apiResponse = require("../utils/apiResponse");

const ValidateSignupField = (req, res, next) => {
	if (!validator.isAlphanumeric(req.body.username)) {
		return res.status(400).json(
			apiResponse(null, {
				code: "INVALID_FORM_FIELD",
				message: "Invalid Username, should contain only AlphaNumeric character",
			}),
		);
	}

	if (!validator.isEmail(req.body.email)) {
		return res.status(400).json(
			apiResponse(null, {
				code: "INVALID_FORM_FIELD",
				message: "Invalid Email",
			}),
		);
	}

	if (req.body.password.toLowerCase().includes("password")) {
		return res.status(400).json(
			apiResponse(null, {
				code: "INVALID_FORM_FIELD",
				message: "password musn't contain password",
			}),
		);
	}

	// password should contain min 1 uppercase, 1 lowercase, 1 special character, 1 num
	const isStrong = validator.isStrongPassword(req.body.password, {
		minNumbers: 1,
		minLowercase: 1,
		minUppercase: 1,
		minSymbols: 1,
		minLength: 7,
	});
	if (!isStrong) {
		return res.status(400).json(
			apiResponse(null, {
				code: "INVALID_FORM_FIELD",
				message:
					"password should contain min 1 uppercase, 1 lowercase, 1 special character, 1 num and min length of 7",
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

module.exports = ValidateSignupField;
