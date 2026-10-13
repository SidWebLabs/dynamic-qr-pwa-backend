const { DataTypes } = require("sequelize");

const sequelize = require("../config/database");
const commonFields = require("../utils/commonFields");
const UserSplitPaymentMaster = require("./UserSplitPaymentMaster");

const UserSplitPaymentItemMaster = sequelize.define(
    "user_split_payment_item_master",
    {
        id: {
            type: DataTypes.BIGINT,
            primaryKey: true,
            autoIncrement: true,
        },

        split_payment_id: {
            type: DataTypes.BIGINT,
            allowNull: false,
            references: {
                model: UserSplitPaymentMaster,
                key: "id",
            },
            onUpdate: "CASCADE",
            onDelete: "CASCADE",
        },

        sequence_no: {
            type: DataTypes.INTEGER,
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

UserSplitPaymentItemMaster.belongsTo(UserSplitPaymentMaster, {
    foreignKey: "split_payment_id",
    as: "split_payment",
});
UserSplitPaymentMaster.hasMany(UserSplitPaymentItemMaster, {
    foreignKey: "split_payment_id",
    as: "items",
});

module.exports = UserSplitPaymentItemMaster;
