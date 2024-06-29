const {
	accountDelete,
	accountPatch,
} = require("./adminControllers/accountController");
const {
	accountDetailGet,
} = require("./adminControllers/accountDetailController");
const {
	accountSearchGet,
} = require("./adminControllers/accountSearchController");
const { getAccountsGet } = require("./adminControllers/getAccountController");
const {
	getAccountFilterGet,
} = require("./adminControllers/getAccountFilterController");

module.exports = {
	accountDelete,
	accountPatch,
	accountDetailGet,
	accountSearchGet,
	getAccountFilterGet,
	getAccountsGet,
};
