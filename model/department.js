const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const DepartmentSchema = new Schema({
	name: {
		type: String,
		requires: true,
		lowercase: true,
		maxLength: 100,
	},
	headOfDepartment: {
		type: Schema.Types.ObjectId,
		ref: "Account",
		required: false,
	},
});

module.exports = mongoose.model("Department", DepartmentSchema);
