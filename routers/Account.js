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
	forgotPasswordPermTokenPost,
	forgotPasswordOTPPost,
	forgotPasswordVerifyOTPPost,
	changePasswordPost,
} = require("../controllers/accountController");
const { default: mongoose } = require("mongoose");

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
	"/forgotpassword/otp",
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
			{
				location: "body",
				keys: ["accountType"],
				values: ["admin", "faculty"],
			},
		],
	),
	forgotPasswordGet,
);

router.post(
	"/forgotpassword/otp",
	ReqFieldValidator(
		{
			code: "MISSING_REQ_FIELD",
			message: "invalid req field",
		},
		[
			{
				location: "body",
				keys: ["otpToken"],
			},
			{
				location: "body",
				keys: ["password"],
				validatorCb: (val) =>
					!val.toLowerCase().includes("password") &&
					validator.isStrongPassword(val, {
						minNumbers: 1,
						minLowercase: 1,
						minUppercase: 1,
						minSymbols: 1,
						minLength: 7,
					}),
			},
		],
	),
	forgotPasswordOTPPost,
);

router.post(
	"/forgotpassword/permtoken",
	ReqFieldValidator(
		{
			code: "MISSING_REQ_FIELD",
			message: "invalid req field",
		},
		[
			{
				location: "body",
				keys: ["permToken"],
				validatorCb: (val) => val.length === +process.env.PERM_TOKEN_LEN,
			},
			{
				location: "body",
				keys: ["password"],
				validatorCb: (val) =>
					!val.toLowerCase().includes("password") &&
					validator.isStrongPassword(val, {
						minNumbers: 1,
						minLowercase: 1,
						minUppercase: 1,
						minSymbols: 1,
						minLength: 7,
					}),
			},
		],
	),
	forgotPasswordPermTokenPost,
);

// TODO: Route to validate OTP sent for forgot password
router.post(
	"/forgotpassword/verify/otp",
	ReqFieldValidator(
		{
			code: "MISSING_REQ_FIELD",
			message: "invalid req field",
		},
		[
			{
				location: "body",
				keys: ["otpToken"],
				validatorCb: (val) => val.length === +process.env.OTP_TOKEN_LEN,
			},
			{
				location: "body",
				keys: ["otpId"],
			},
		],
	),
	forgotPasswordVerifyOTPPost,
);

// TODO: Check accountstatus of token
// router.get(
// 	"/status",
// 	HeaderFieldValidator("Authorization"),
// 	JWTAuthentication,
// 	async (req, res) => {},
// );

router.post(
	"/changepassword/",
	HeaderFieldValidator("Authorization"),
	JWTAuthentication,
	ReqFieldValidator(
		{
			code: "MISSING_REQ_FIELD",
			message: "missing req field",
		},
		[
			{
				location: "body",
				keys: ["oldPassword"],
				validatorCb: (val) =>
					!val.toLowerCase().includes("password") &&
					validator.isStrongPassword(val, {
						minNumbers: 1,
						minLowercase: 1,
						minUppercase: 1,
						minSymbols: 1,
						minLength: 7,
					}),
			},
			{
				location: "body",
				keys: ["newPassword"],
				validatorCb: (val) =>
					!val.toLowerCase().includes("password") &&
					validator.isStrongPassword(val, {
						minNumbers: 1,
						minLowercase: 1,
						minUppercase: 1,
						minSymbols: 1,
						minLength: 7,
					}),
			},
		],
	),
	changePasswordPost,
);

module.exports = router;
