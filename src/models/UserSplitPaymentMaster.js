const { DataTypes } = require("sequelize");

const sequelize = require("../config/database");
const commonFields = require("../utils/commonFields");

const UserMaster = require("./UserMaster");
const UserAccountMaster = require("./UserAccountMaster");

const UserSplitPaymentMaster = sequelize.define(
    "user_split_payment_master",
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

        total_amount: {
            type: DataTypes.DECIMAL(12, 2),
            allowNull: false,
        },

        note: {
            type: DataTypes.STRING(255),
            allowNull: true,
        },

        split_count: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 3,
        },

        ...commonFields,
    },
    {
        freezeTableName: true,
        timestamps: false,
    }
);

UserSplitPaymentMaster.belongsTo(UserMaster, {
    foreignKey: "user_id",
    as: "user",
});
UserMaster.hasMany(UserSplitPaymentMaster, {
    foreignKey: "user_id",
    as: "split_payments",
});

UserSplitPaymentMaster.belongsTo(UserAccountMaster, {
    foreignKey: "account_id",
    as: "account",
});
UserAccountMaster.hasMany(UserSplitPaymentMaster, {
    foreignKey: "account_id",
    as: "split_payments",
});

module.exports = UserSplitPaymentMaster;
