const { DataTypes } = require('sequelize');
const sequelize = require('../config/db.config');

const PaymentUser = sequelize.define('PaymentUser', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    price: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    cardNumber: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    dateCard: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    cvv: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Users',
            key: 'id'
        }
    },
    eventId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Events',
            key: 'id'
        }
    },
    cheireId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Cheirs',
            key: 'id'
        }
    }
});

module.exports = PaymentUser;
