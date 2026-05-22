const { Sequelize } = require("sequelize");
const pg = require("pg");

require("dotenv").config();

const dbUrl = process.env.DATABASE_URL;

if (!dbUrl) {
    throw new Error("DATABASE_URL is missing in .env");
}

const sequelize = new Sequelize(dbUrl, {
    dialect: "postgres",
    dialectModule: pg,
    protocol: "postgres",
    logging: false,
    dialectOptions: {
        ssl: {
            require: true,
            rejectUnauthorized: false,
        },
    },

    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000,
    },
});

module.exports = sequelize;