require("dotenv").config({ path: "config/dev.env" });

const express = require("express");
const logger = require("morgan");
const cors = require("cors");

const mongoose = require("./db/mongoose");

const loginRouter = require("./routers/Account");
const apiResponse = require("./utils/apiResponse");

const app = express();

app.use(logger("dev"));
app.use(cors());
app.use(express.json());

app.use("/api/account", loginRouter);

// 404 Handler
app.use((req, res, next) => {
	res.status(404).json(
		apiResponse(null, {
			code: "NOT FOUND",
			message: "invalid API route",
		}),
	);
});

// General Error handler
app.use((err, req, res, next) => {
	// set locals, only providing error in development
	// res.locals.message = err.message;
	// res.locals.error = req.app.get("env") === "development" ? err : {};
	console.error(err.stack);
	res.status(500).send(
		apiResponse(null, {
			code: "INTERNAL_SERVER_ERROR",
			message: err.toString(),
		}),
	);

	// render the error page
	res.status(err.status || 500);
});

app.listen(process.env.PORT, () =>
	console.log(`Listening on port: ${process.env.PORT}...`),
);
