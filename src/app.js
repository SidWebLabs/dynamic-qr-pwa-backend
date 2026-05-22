const express = require("express");
const cors = require("cors");
const path = require("path");

// const routesV1 = require("./routes");

const app = express();

app.use(
	cors({
		origin: "*",
		exposedHeaders: ["Content-Disposition"],
	})
);

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

app.use(express.static(path.join(__dirname, "../public")));

// app.use("/api/", routesV1);

app.get("/", (req, res) => {
	res.status(200).json({
		message: "Dynamic QR Backend Running",
	});
});

app.use((req, res) => {
	return res.status(404).json({
		success: false,
		message: "Route Not Found",
	});
});

module.exports = app;