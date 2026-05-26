require("dotenv").config();

const logger = require("nirmitee-logger");

logger.setContext("QR-PAY-BACKEND");

const http = require("http");

const app = require("./app");
const sequelize = require("./config/database");

require("./models/UserMaster");
require("./models/RoleMaster");
require("./models/UserAccountMaster");

const PORT = process.env.PORT || 5000;

const server = http.createServer(app);

sequelize
	.authenticate()
	.then(async () => {
		console.log("Database Connected");

		await sequelize.sync({ alter: true });

		console.log("Tables Synced");

		server.listen(PORT, () => {
			console.log(`Server running on ${PORT}`);
		});
	})
	.catch((err) => {
		console.log("Database Error:", err);
	});

process.on("SIGINT", async () => {
	console.log("Closing Server...");

	await sequelize.close();

	process.exit(0);
});