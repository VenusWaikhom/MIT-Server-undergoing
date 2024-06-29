const Account = require("../model/account");
const apiResponse = require("../utils/apiResponse");

/**
 * Middleware to check wether the account has accessed to resource | api route
 * Check account role and status
 * @param {Array<string>} accountType - "admin"|"faculty"
 * @param {Array<string>} accountStatus - "active"|"pending"|"inactive"|"rejected"
 */
const Authorization =
	(accountTypes, accountStatuses) => async (req, res, next) => {
		const accountID = res.locals.decodedToken.id;
		const account = await Account.findOne({ _id: accountID });
		// If id not present
		if (!account) {
			return res.status(401).json(
				apiResponse(null, {
					code: "TOKEN_VERIFICATION_FAILED",
					message: "token id is not VALID",
				}),
			);
		}
		// Check account type
		if (accountTypes.filter((d) => d === account.accountType).length === 0) {
			return res.status(401).json(
				apiResponse(null, {
					code: "TOKEN_VERIFICATION_FAILED",
					message: `this API is for ${accountTypes.toString()} account only`,
				}),
			);
		}
		// Check account status
		if (accountStatuses.filter((d) => d === account.status).length === 0) {
			return res.status(401).json({
				code: "TOKEN_VERIFICATION_FAILED",
				message: `this API is for ${accountStatuses.toString()} account status only`,
			});
		}
		next();
	};

module.exports = Authorization;
