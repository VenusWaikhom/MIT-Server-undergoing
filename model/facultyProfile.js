const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const FacultyProfileSchema = new Schema(
	{
		accountId: { type: Schema.Types.ObjectId, ref: "Account", required: true },
		photoId: { type: String, required: true },
		email: { type: String, required: true },
		phoneNumber: { type: String, required: true },
		namePrefix: { type: String },
		firstName: { type: String, required: true },
		lastName: { type: String, required: true },
		sex: {
			type: String,
			required: true,
			enum: ["male", "female", "other", "prefer not to say"],
			default: "prefer not to say",
		},
		startDate: { type: Date, required: true },
		departmentId: {
			type: Schema.Types.ObjectId,
			ref: "Department",
			required: true,
		},
		highestDegree: { type: String, required: true },
		expertFields: { type: [{ type: String }], required: true },
		bios: { type: String, required: false },
		roles: {
			type: [
				{
					type: String,
					enum: [
						"principal",
						"chairman",
						"professor",
						"guest professor",
						"associate professor",
						"guest lecturer",
						"teaching assistant",
						"male warden",
						"female warden",
						"dean",
						"lab technician",
						"administrative assistant",
						"registrar",
						"librarian",
						"vice chancellor",
					],
				},
			],
			required: true,
		},
	},
	{ timestamps: true },
);

// TODO: only one chairman, one principal implement in the business logic

module.exports = mongoose.model("FacultyProfile", FacultyProfileSchema);
