const express = require("express");
const validator = require("validator");

const {
	ReqFieldValidator,
	HeaderFieldValidator,
} = require("../middleware/SignUpValidator");
const ValidateSignupField = require("../middleware/ValidateSignupField");
const ValidateLoginField = require("../middleware/ValidateLoginField");
const JWTAuthentication = require("../middleware/JWTAuthentication");
const OTPInterval = require("../middleware/OTPInterval");

const {
	loginPostHandler,
	signupPostHandler,
	verifyEmailGet,
	verifyEmailPost,
	forgotPasswordGet,
	forgotPasswordPost,
} = require("../controllers/accountController");

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
	loginPostHandler,
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
	signupPostHandler,
);

router.get(
	"/verify/email",
	HeaderFieldValidator("Authorization"),
	JWTAuthentication,
	OTPInterval(1, "mailVerification"),
	verifyEmailGet,
);

router.post(
	"/verify/email",
	HeaderFieldValidator("Authorization"),
	JWTAuthentication,
	ReqFieldValidator(
		{
			code: "MISSING_AUTHENTICATION_INFO",
			message: "OTP code missing",
		},
		[{ location: "body", keys: ["mailOTPCode"] }],
	),
	verifyEmailPost,
);

// TODO: Implement controller
router.get(
	"/forgotpassword/",
	ReqFieldValidator(
		{
			code: "MISSING_REQ_FIELD",
			message: "invalid req field",
		},
		[
			{
				location: "body",
				keys: ["email"],
				validatorCb: (val) => validator.isEmail(val),
			},
		],
	),
	forgotPasswordGet,
);

router.post("/forgotpassword/", forgotPasswordPost);

module.exports = router;
