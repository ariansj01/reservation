const { DataTypes } = require('sequelize');
const sequelize = require('../config/db.config');

const PaymentArtist = sequelize.define('PaymentArtist', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    price: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    eventId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    artistId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Artists',
            key: 'id'
        }
    },
});

module.exports = PaymentArtist;
