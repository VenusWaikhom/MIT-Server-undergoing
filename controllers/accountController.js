const { changePasswordPost } = require("./accountControllers/changePassword");
const {
	forgotPasswordGet,
	forgotPasswordOTPPost,
	forgotPasswordPermTokenPost,
	forgotPasswordVerifyOTPPost,
} = require("./accountControllers/forgotPasswordController");
const { loginPostHandler } = require("./accountControllers/loginController");
const { signupPostHandler } = require("./accountControllers/signupController");
const {
	verifyEmailGet,
	verifyEmailPost,
} = require("./accountControllers/verifyEmailController");

module.exports = {
	loginPostHandler,
	signupPostHandler,
	verifyEmailGet,
	verifyEmailPost,
	forgotPasswordGet,
	forgotPasswordPermTokenPost,
	forgotPasswordOTPPost,
	forgotPasswordVerifyOTPPost,
	changePasswordPost,
};
