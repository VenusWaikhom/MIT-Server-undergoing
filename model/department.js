const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const DepartmentSchema = new Schema({
	name: {
		type: String,
		requires: true,
		lowercase: true,
		maxLength: 100,
	},
});

module.exports = mongoose.model("Department", DepartmentSchema);
