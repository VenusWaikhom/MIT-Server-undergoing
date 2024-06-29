const validator = require("validator");
const apiResponse = require("../utils/apiResponse");

// Check required field for validation is present
const signupVaildator = (req, res, next) => {
	const { email, username, password, accountType } = req.body;

	if (!email || !username || !password || !accountType) {
		return res.status(400).send(
			apiResponse(null, {
				code: "MISSING_AUTHENTICATION_INFO",
				message: "credential required",
			}),
		);
	}

	next();
};

// const FieldValidator = (err, ...fields) => {
// 	return (req, res, next) => {
// 		for (let field of fields) {
// 			if (!field) {
// 				return res.status(400).send(apiResponse(null, err));
// 			}
// 		}
// 		next();
// 	};
// };

// Check Req contain the given key
const ReqFieldValidator = (err, fields) => {
	return (req, res, next) => {
		for (let { location, keys, values, validatorCb, error } of fields) {
			if (!location || !keys)
				throw new Error("location and keys should be present");
			// Check fields present
			let field = req[location];
			for (let key of keys) {
				if (!(key in field)) {
					return res.status(400).json(
						apiResponse(null, {
							code: "REQ_FIELD_VALIDATION_ERROR",
							message: error === undefined ? err : error,
						}),
					);
				}
				field = field[key];
			}
			// Check allow values
			if (values && values.filter((d) => d === field).length === 0) {
				return res.status(400).json(
					apiResponse(null, {
						code: "REQ_FIELD_VALIDATION_ERROR",
						message: `invalid value for location: ${location.toString()} and key: ${keys.join(
							".",
						)}`,
					}),
				);
			}
			// Check Validator callback
			if (validatorCb && validatorCb(field)) {
				return res.status(400).json(
					apiResponse(null, {
						code: "REQ_FIELD_VALIDATION_ERROR",
						message: `validation faled for location: ${location.toString()} and key: ${keys.join(
							".",
						)}`,
					}),
				);
			}
		}
		next();
	};
};

// Check header contain the given key
const HeaderFieldValidator =
	(...headerKeys) =>
	(req, res, next) => {
		for (let headerKey of headerKeys) {
			if (!req.header(headerKey)) {
				return res.status(400).send(
					apiResponse(null, {
						code: "MISSING HEADER FIELD",
						message: `${headerKey} header key required`,
					}),
				);
			}
		}
		next();
	};

module.exports = {
	ReqFieldValidator,
	HeaderFieldValidator,
};
