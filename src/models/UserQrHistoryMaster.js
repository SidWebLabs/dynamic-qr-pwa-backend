const { DataTypes } = require("sequelize");

const sequelize = require("../config/database");
const commonFields = require("../utils/commonFields");

const UserMaster = require("./UserMaster");
const UserAccountMaster = require("./UserAccountMaster");

const UserQrHistoryMaster = sequelize.define(
    "user_qr_history_master",
    {
        id: {
            type: DataTypes.BIGINT,
            primaryKey: true,
            autoIncrement: true,
        },

        user_id: {
            type: DataTypes.BIGINT,
            allowNull: false,

            references: {
                model: UserMaster,
                key: "id",
            },

            onUpdate: "CASCADE",
            onDelete: "CASCADE",
        },

        account_id: {
            type: DataTypes.BIGINT,
            allowNull: false,

            references: {
                model: UserAccountMaster,
                key: "id",
            },

            onUpdate: "CASCADE",
            onDelete: "CASCADE",
        },

        owner_name: {
            type: DataTypes.STRING(100),
            allowNull: false,
        },

        owner_upi_id: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },

        amount: {
            type: DataTypes.DECIMAL(12, 2),
            allowNull: false,
        },

        note: {
            type: DataTypes.STRING(255),
            allowNull: true,
        },

        ...commonFields,
    },
    {
        freezeTableName: true,
        timestamps: false,
    }
);

// Associations
UserQrHistoryMaster.belongsTo(UserMaster, { foreignKey: "user_id", as: "user" });
UserMaster.hasMany(UserQrHistoryMaster, { foreignKey: "user_id", as: "qr_history" });

UserQrHistoryMaster.belongsTo(UserAccountMaster, { foreignKey: "account_id", as: "account" });
UserAccountMaster.hasMany(UserQrHistoryMaster, { foreignKey: "account_id", as: "qr_history" });

module.exports = UserQrHistoryMaster;