const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const commonFields = require("../utils/commonFields");

const UserMaster = sequelize.define(
    "user_master",
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },

        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },

        mobile_no: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },

        pin: {
            type: DataTypes.STRING,
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