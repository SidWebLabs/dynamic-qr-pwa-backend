const swaggerJsDoc = require("swagger-jsdoc");

const options = {
	definition: {
		openapi: "3.0.0",

		info: {
			title: "QR Pay Generator API",
			version: "1.0.0",
			description: "QR Pay Generator Backend APIs",
		},

		servers: [
			{
				url: "http://localhost:8080",
			},
		],

		components: {
			securitySchemes: {
				bearerAuth: {
					type: "http",
					scheme: "bearer",
					bearerFormat: "JWT",
				},
			},
		},

		security: [
			{
				bearerAuth: [],
			},
		],
	},

	apis: ["./src/routes/*.js"],
};

const swaggerSpec = swaggerJsDoc(options);

module.exports = swaggerSpec;