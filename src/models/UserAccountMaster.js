const { DataTypes } = require("sequelize");

const sequelize = require("../config/database");

const commonFields = require("../utils/commonFields");

const UserMaster = require("./UserMaster");

const UserAccountMaster = sequelize.define(
	"user_account_master",
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

		owner_name: {
			type: DataTypes.STRING(100),
			allowNull: false,
		},

		owner_upi_id: {
			type: DataTypes.STRING(255),
			allowNull: false,
			unique: true,
		},

		is_primary: {
			type: DataTypes.BOOLEAN,
			defaultValue: false,
		},

		...commonFields,
	},
	{
		freezeTableName: true,
		timestamps: false,
	}
);

// Associations
UserAccountMaster.belongsTo(UserMaster, {
	foreignKey: "user_id",
	as: "user",
});

UserMaster.hasMany(UserAccountMaster, {
	foreignKey: "user_id",
	as: "accounts",
});

module.exports = UserAccountMaster;