const express = require("express");
const validator = require("validator");

const {
	ReqFieldValidator,
	HeaderFieldValidator,
} = require("../middleware/FieldValidator");
const JWTAuthentication = require("../middleware/JWTAuthentication");
const OTPInterval = require("../middleware/OTPInterval");
const Authorization = require("../middleware/Authorization");

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

const { passwordValidator } = require("../utils/passwordValidator");

const router = new express.Router();

router.post(
	"/login",
	ReqFieldValidator(
		{
			code: "MISSING_AUTHENTICATION_INFO",
			message: "credential required",
		},
		[
			{
				location: "body",
				keys: ["email"],
				validatorCb: (val) => validator.isEmail(val),
			},
			{
				location: "body",
				keys: ["password"],
				validatorCb: (val) => passwordValidator(val),
			},
			{ location: "body", keys: ["accountType"], values: ["faculty", "admin"] },
		],
	),
	// ValidateLoginField,
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
			{
				location: "body",
				keys: ["email"],
				validatorCb: (val) => validator.isEmail(val),
				error: "Invalid Email",
			},
			{
				location: "body",
				keys: ["username"],
				validatorCb: (val) => validator.isAlphanumeric(val),
				error: "Invalid Username, should contain only AlphaNumeric character",
			},
			{
				location: "body",
				keys: ["password"],
				validatorCb: (val) => passwordValidator(val),
				error:
					"password musn't contain password, password should contain min 1 uppercase, 1 lowercase, 1 special character, 1 num and min length of 7",
			},
			{
				location: "body",
				keys: ["accountType"],
				values: ["admin", "faculty"],
				error: "account type should be faculty and admin only",
			},
		],
	),
	// ValidateSignupField,
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
		[
			{
				location: "body",
				keys: ["mailOTPCode"],
				validatorCb: (val) => val.length === +process.env.OTP_TOKEN_LEN,
			},
		],
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
				validatorCb: (val) => passwordValidator(val),
			},
		],
	),
	forgotPasswordOTPPost,
);

router.post(
	"/forgotpassword/permtoken",
	Authorization(["faculty"], ["active"]),
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
				validatorCb: (val) => passwordValidator(val),
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

// TODO: Check permtoken regeneration controller
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
				validatorCb: (val) => passwordValidator(val),
				error:
					"password musn't contain password, password should contain min 1 uppercase, 1 lowercase, 1 special character, 1 num and min length of 7",
			},
			{
				location: "body",
				keys: ["newPassword"],
				validatorCb: (val) => passwordValidator(val),
				error:
					"password musn't contain password, password should contain min 1 uppercase, 1 lowercase, 1 special character, 1 num and min length of 7",
			},
		],
	),
	changePasswordPost,
);

module.exports = router;
