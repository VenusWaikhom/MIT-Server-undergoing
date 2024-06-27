require("dotenv").config({ path: "config/dev.env" });

const express = require("express");
const logger = require("morgan");

const mongoose = require("./db/mongoose");

const app = express();

app.use(logger("dev"));

// app.use("/api/login", loginRouter);

app.listen(process.env.PORT, () =>
	console.log(`Listening on port: ${process.env.PORT}...`),
);
