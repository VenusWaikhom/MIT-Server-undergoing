const express = require("express");

const {
	HeaderFieldValidator,
	ReqFieldValidator,
} = require("../middleware/SignUpValidator");
const JWTAuthentication = require("../middleware/JWTAuthentication");
const Authorization = require("../middleware/Authorization");

const {
	getAccountsGet,
	getAccountFilterGet,
	accountSearchGet,
	accountPatch,
	accountDelete,
	accountDetailGet,
} = require("../controllers/adminController");
const { default: mongoose } = require("mongoose");

const router = new express.Router();

router.get(
	"/getaccounts",
	HeaderFieldValidator("Authorization"),
	JWTAuthentication,
	Authorization(["admin"], ["active"]),
	getAccountsGet,
);

router.get(
	"/getaccounts/filter",
	HeaderFieldValidator("Authorization"),
	JWTAuthentication,
	Authorization(["admin"], ["pending"]),
	ReqFieldValidator(
		{
			code: "MISSING_QUERY_PARAMS",
			message: "accountType and status param should be present in query",
		},
		[
			{
				location: "query",
				keys: ["accountType"],
				values: ["admin", "faculty", ""],
			},
			{
				location: "query",
				keys: ["status"],
				values: ["active", "inactive", "pending", "reject", ""],
			},
		],
	),
	getAccountFilterGet,
);

router.get("/account/search", accountSearchGet);

// TODO: Send mail to user when their account status get updated
// Controller will update account status, for faculty account
//  a new perm token will be generated everytime account sttaus is updated
router.patch(
	"/account/",
	HeaderFieldValidator("Authorization"),
	JWTAuthentication,
	Authorization(["admin"], ["active"]),
	ReqFieldValidator(
		{
			code: "MISSING_FORM_FIELD",
			message: "req field is not complete",
		},
		[
			{
				location: "body",
				keys: ["accountId"],
				validatorCb: (val) => mongoose.Types.ObjectId.isValid(val.toString()),
			},
			{
				location: "body",
				keys: ["status"],
				values: ["active", "inactive", "pending", "reject"],
			},
		],
	),
	accountPatch,
);

router.delete(
	"/account/",
	HeaderFieldValidator("Authorization"),
	JWTAuthentication,
	Authorization(["admin"], ["active"]),
	ReqFieldValidator(
		{
			code: "MISSING_FORM_FIELD",
			message: "req field is not complete",
		},
		[
			{
				location: "body",
				keys: ["accountId"],
				validatorCb: (val) => mongoose.Types.ObjectId.isValid(val.toString()),
			},
		],
	),
	accountDelete,
);

router.get(
	"/account/detail/:accountId",
	HeaderFieldValidator("Authorization"),
	JWTAuthentication,
	Authorization(["admin"], ["active"]),
	ReqFieldValidator(
		{
			code: "MISSING_FORM_FIELD",
			message: "req field is not complete",
		},
		[
			{
				location: "params",
				keys: ["accountId"],
				validatorCb: (val) => mongoose.Types.ObjectId.isValid(val.toString()),
			},
		],
	),
	accountDetailGet,
);

// TODO: add route for user to regenerate their perm token
module.exports = router;
