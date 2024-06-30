require("dotenv").config({ path: "config/dev.env" });

const express = require("express");
const logger = require("morgan");
const cors = require("cors");

const mongoose = require("./db/mongoose");

const apiResponse = require("./utils/apiResponse");

const accountRouter = require("./routers/Account");
const adminRouter = require("./routers/Admin");

const app = express();

app.use(logger("dev"));
app.use(cors());
app.use(express.json());

// API Routes
app.use("/api/account", accountRouter);
app.use("/api/admin", adminRouter);
///////////////////////////////////////////

// 404 Handler
app.use((req, res, next) => {
	return res.status(404).json(
		apiResponse(null, {
			code: "NOT FOUND",
			message: "invalid API route",
		}),
	);
});

// General Error handler
app.use((err, req, res, next) => {
	console.error(err.stack);
	return res.status(500).send(
		apiResponse(null, {
			code: "INTERNAL_SERVER_ERROR",
			message: err.toString(),
		}),
	);
});

app.listen(process.env.PORT, () =>
	console.log(`Listening on port: ${process.env.PORT}...`),
);
