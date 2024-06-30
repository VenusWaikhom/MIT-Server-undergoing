require("dotenv").config({ path: "../config/dev.env" });

const account = require("../model/account");
const mongoose = require("../db/mongoose");

const username = "";
const email = "";

(async () => {
	const accounts = await account.find({
		$or: [
			{ username: { $regex: `${username}.*` } },
			{ email: { $regex: `${email}.*` } },
		],
	});
	console.log(accounts);
})();

console.log(typeof +process.env.SALT);
