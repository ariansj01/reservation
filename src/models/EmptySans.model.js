const { DataTypes } = require('sequelize');
const sequelize = require('../config/db.config');

const EmptySans = sequelize.define('EmptySans', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    description: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    openTime: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
    },
    closeTime: {
        type: DataTypes.DATE,
        allowNull: true,
    },
    price: {
        type: DataTypes.DATE,
        allowNull: true,
    },
});

module.exports = EmptySans;
