const { DataTypes } = require('sequelize');
const sequelize = require('../config/db.config');

const Event = sequelize.define('Event', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    description: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    startDate: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    endDate: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    artistId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: 'Artists',
            key: 'id'
        }
    },
    vipPrice: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    normalPrice: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    allSellTicketPrice: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    closeBuyTicket: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    openBuyTicket: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    emptySansId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: 'EmptySans',
            key: 'id'
        }
    },
    reserved: {
        type: DataTypes.STRING,
        allowNull: true,
    },
});

module.exports = Event;
