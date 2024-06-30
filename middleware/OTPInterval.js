const mongoose = require("mongoose");
const OTPToken = require("../model/otpToken");
const apiResponse = require("../utils/apiResponse");

const OTPInterval = (interval, verificationType) => async (req, res, next) => {
	const _otpToken = await OTPToken.findOne({
		accountID: res.locals.decodedToken.id,
		verificationType,
	});
	// First entry
	if (!_otpToken) return next();

	// check for interval
	const isUnderInterval =
		Date.now() < new Date(_otpToken.updatedAt).getTime() + interval * 60 * 1000;

	if (isUnderInterval) {
		return res.status(401).json(
			apiResponse(null, {
				code: "OTP_SERVICE_ERROR",
				message: `OTP can be request in ${interval} minute interval`,
			}),
		);
	}
	next();
};

module.exports = OTPInterval;
