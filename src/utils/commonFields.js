const { DataTypes } = require("sequelize");

module.exports = {
    created_by: {
        type: DataTypes.INTEGER,
        allowNull: true
    },

    modified_by: {
        type: DataTypes.INTEGER,
        allowNull: true
    },

    created_on: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
        allowNull: true
    },

    modified_on: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
        allowNull: true
    },

    is_active: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },
};