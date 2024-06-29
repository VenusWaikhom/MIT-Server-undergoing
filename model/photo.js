const mongoose = require("mongoose");

const Schema = new mongoose.Schema();

const PhotoSchema = new Schema(
	{
		fileName: { type: String, required: true },
		caption: { type: String, required: true, maxLength: 100 },
		galleryId: { type: Schema.Types.ObjectId, ref: "Gallery", required: false },
	},
	{ timestamps: true },
);

module.exports = mongoose.model("Photo", PhotoSchema);
