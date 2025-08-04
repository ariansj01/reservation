const { DataTypes } = require('sequelize');
const sequelize = require('../config/db.config');

const Ticket = sequelize.define('Ticket', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    eventId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    cheireId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
});

module.exports = Ticket;
