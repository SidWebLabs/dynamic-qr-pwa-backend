const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const commonFields = require("../utils/commonFields");

const UserMaster = sequelize.define(
    "user_master",
    {
        id: {
            type: DataTypes.BIGINT,
            primaryKey: true,
            autoIncrement: true,
        },

        name: {
            type: DataTypes.STRING(100),
            allowNull: false,
        },

        mobile_no: {
            type: DataTypes.STRING(20),
            allowNull: false,
            unique: true,
        },

        pin: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },

        ...commonFields,
    },
    {
        freezeTableName: true,
        timestamps: false,
    }
);

module.exports = UserMaster;