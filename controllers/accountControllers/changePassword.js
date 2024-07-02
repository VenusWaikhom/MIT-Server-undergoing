const bcrypt = require("bcryptjs");
const account = require("../../model/account");
const apiResponse = require("../../utils/apiResponse");

const changePasswordPost = async (req, res) => {
	try {
		// Compare old password
		const isMatch = await bcrypt.compare(
			req.body.oldPassword,
			res.locals.acc.password,
		);

		if (!isMatch)
			return res.status(401).json(
				apiResponse(null, {
					code: "PASSWORD_NOT_CHANGED",
					message: "old password doesnt match",
				}),
			);

		// update password
		await account.updateOne(
			{ _id: res.locals.decodedToken.id },
			{
				password: await bcrypt.hash(req.body.newPassword, +process.env.SALT),
			},
		);

		res.status(201).json(
			apiResponse({
				message: `Password successfully changed for ${res.locals.acc.email}`,
			}),
		);
	} catch (err) {
		console.error(err);
		res.status(401).json(
			apiResponse(null, {
				code: "PASSWORD_NOT_CHANGED",
				message: err.toString(),
			}),
		);
	}
};

module.exports = { changePasswordPost };
