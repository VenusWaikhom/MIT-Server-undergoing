const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const PermTokenSchema = new Schema(
	{
		accountID: {
			type: Schema.Types.ObjectId,
			ref: "Account",
			required: true,
			unique: true,
		},
		token: {
			type: String,
			required: true,
		},
	},
	{ timestamps: true },
);

module.exports = mongoose.model("PermToken", PermTokenSchema);
