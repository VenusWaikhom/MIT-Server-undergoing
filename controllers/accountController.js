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
};
