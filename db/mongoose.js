const mongoose = require("mongoose");
// Seed admin account

mongoose
	.connect(process.env.MONGODB_URL)
	.then((_) => console.log("DB Connected"))
	.catch((err) => console.log("DB connection error", err));

module.exports = mongoose;
