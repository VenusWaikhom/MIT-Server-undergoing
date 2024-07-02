const validator = require("validator");

const passwordValidator = (val) =>
	!val.toLowerCase().includes("password") &&
	validator.isStrongPassword(val, {
		minNumbers: 1,
		minLowercase: 1,
		minUppercase: 1,
		minSymbols: 1,
		minLength: 7,
	});

module.exports = { passwordValidator };
