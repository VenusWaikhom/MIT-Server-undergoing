const {
	accountDelete,
	accountPatch,
} = require("./adminControllers/accountController");
const {
	accountDetailGet,
} = require("./adminControllers/accountDetailController");
const {
	accountSearchEmailGet,
	accountSearchUsernameGet,
} = require("./adminControllers/accountSearchController");
const { getAccountsGet } = require("./adminControllers/getAccountController");
const {
	getAccountFilterGet,
} = require("./adminControllers/getAccountFilterController");

module.exports = {
	accountSearchEmailGet,
	accountSearchUsernameGet,
	accountDelete,
	accountPatch,
	accountDetailGet,
	getAccountFilterGet,
	getAccountsGet,
};
