const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");
const validator = require("validator");

const Schema = mongoose.Schema;

const AccountSchema = new Schema(
	{
		email: {
			type: String,
			trim: true,
			required: true,
			unique: true,
			lowercase: true,
			validate: function (val) {
				if (!validator.isEmail(val)) throw new Error("Invalid Email");
			},
		},
		username: {
			type: String,
			trim: true,
			required: true,
			unique: true,
			lowercase: true,
		},
		password: {
			type: String,
			required: true,
			minLength: 7,
			validate: function (val) {
				if (val.toLowerCase().includes("password")) {
					throw new Error("password musn't contain password");
				}

				// password should contain min 1 uppercase, 1 lowercase, 1 special character, 1 num
				const res = validator.isStrongPassword(val, {
					minNumbers: 1,
					minLowercase: 1,
					minUppercase: 1,
					minSymbols: 1,
					minLength: 7,
				});
				if (!res)
					throw new Error(
						"password should contain min 1 uppercase, 1 lowercase, 1 special character, 1 num",
					);
			},
		},
		status: {
			type: String,
			required: true,
			enum: ["active", "pending", "reject"],
			default: "pending",
		},
		accountType: {
			type: String,
			required: true,
			enum: ["faculty", "admin"],
			default: "faculty",
		},
	},
	{
		timestamps: true,
	},
);

// Hash Password
AccountSchema.pre("save", async function (next) {
	if (this.isModified("password")) {
		const salt = 8;
		const hashPassword = await bcrypt.hash(this.password, salt);
		console.log(
			"password before and after hash: ",
			this.password,
			hashPassword,
		);
		this.password = hashPassword;
	}
	next();
});

// Generate JWT Token
AccountSchema.methods.generateAuthToken = function () {
	const token = jwt.sign(
		{
			id: this._id.toString(),
		},
		process.env.JWT_SECRET,
		{ algorithm: "HS256", expiresIn: 5 },
	);
	return token;
};

// check account credential is valid
AccountSchema.statics.checkCredential = async (email, password) => {
	const user = await this.findOne({ email });
	if (!user) throw new Error("email doesnt exist"); // Email doesnt exist
	const match = await bcrypt.compare(password, user.password); // compare password hash
	if (!match) {
		// password doesnt exist
		throw new Error("password doesnt match");
	}
	return user;
};

module.exports = mongoose.model("Account", AccountSchema);
