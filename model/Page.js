const mongoose = require("mongoose");

const Schema = new mongoose.Schema();

const PageSchema = new Schema(
	{
		pageName: { type: String, required: true },
		pageHeader: { type: String, required: true },
		pageBody: [
			{
				subHeader: { type: String, required: false },
				body: { type: String, required: false },
			},
		],
	},
	{
		timestamps: true,
	},
);

module.exports = mongoose.model("Page", PageSchema);
