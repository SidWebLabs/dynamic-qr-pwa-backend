const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const commonFields = require("../utils/commonFields");

const RoleMaster = sequelize.define(
    "role_master",
    {
        id: {
            type: DataTypes.BIGINT,
            primaryKey: true,
            autoIncrement: true,
        },

        role_name: {
            type: DataTypes.STRING(100),
            allowNull: false,
        },

        ...commonFields,
    },
    {
        freezeTableName: true,
        timestamps: false,
    }
);

module.exports = RoleMaster;