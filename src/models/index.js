const db = require('../config/db.config')
const Artist = require('./Artist.model')
const Cheirs = require('./Cheirs.model')
const Comments = require('./Comments.model')
const Event = require('./Event.model')
const PaymentArtist = require('./PaymentArtist.model')
const PaymentUser = require('./PaymentUser.model')
const Ticket = require('./ticket.model')
const EmptySans = require('./EmptySans.model')
const User = require('./User.model')

// User has many Comments
User.hasMany(Comments , {
    foreignKey : 'userId',
    as: 'comments'
})
Comments.belongsTo(User , {
    foreignKey : 'userId',
    as: 'user'
})

// User has many PaymentUser
User.hasMany(PaymentUser , {
    foreignKey : 'userId',
    as: 'payments'
})
PaymentUser.belongsTo(User , {
    foreignKey : 'userId',
    as: 'user'
})

// User has many Ticket
User.hasMany(Ticket , {
    foreignKey : 'userId',
    as: 'tickets'
})
Ticket.belongsTo(User , {
    foreignKey : 'userId',
    as: 'user'
})

// Ticket has one Cheirs
Ticket.hasOne(Cheirs , {
    foreignKey : 'cheireId',
    as: 'cheir'
})
Cheirs.belongsTo(Ticket , {
    foreignKey : 'cheireId',
    as: 'ticket'
})

// Event has many Comments
Event.hasMany(Comments , {
    foreignKey : 'eventId',
    as: 'comments'
})
Comments.belongsTo(Event , {
    foreignKey : 'eventId',
    as: 'event'
})

// Event has many PaymentUser
Event.hasMany(PaymentUser, {
    foreignKey : 'eventId',
    as: 'payments'
})
PaymentUser.belongsTo(Event , {
    foreignKey : 'eventId',
    as: 'event'
})

// Cheirs has one PaymentUser
Cheirs.hasOne(PaymentUser , {
    foreignKey : 'cheireId',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
    as: 'payment'
})
PaymentUser.belongsTo(Cheirs , {
    foreignKey : 'cheireId',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
    as: 'cheir'
})

// User has many Cheirs
User.hasMany(Cheirs , {
    foreignKey : 'userId',
    as: 'cheirs'
})
Cheirs.belongsTo(User , {
    foreignKey : 'userId',
    as: 'user'
})

// Artist has many Event
Artist.hasMany(Event, {
    foreignKey: 'artistId',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
    as: 'events'
})
Event.belongsTo(Artist, {
    foreignKey: 'artistId',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
    as: 'artist'
})

// Artist has many PaymentArtist
Artist.hasMany(PaymentArtist , {
    foreignKey : 'artistId',
    as: 'payments'
})
PaymentArtist.belongsTo(Artist , {
    foreignKey : 'artistId',
    as: 'artist'
})

// Artist has many Comments
Artist.hasMany(Comments , {
    foreignKey : 'artistId',
    as: 'comments'
})
Comments.belongsTo(Artist , {
    foreignKey : 'artistId',
    as: 'artist'
})

// Event has many Ticket
Event.hasMany(Ticket , {
    foreignKey : 'eventId',
    as: 'tickets'
})
Ticket.belongsTo(Event , {
    foreignKey : 'eventId',
    as: 'event'
})

// Event has many Cheirs
Event.hasMany(Cheirs , {
    foreignKey : 'eventId',
    as: 'cheirs'
})
Cheirs.belongsTo(Event , {
    foreignKey : 'eventId',
    as: 'event'
})

// EmptySans has one Event
EmptySans.hasOne(Event, {
    foreignKey: 'emptySansId',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
    as: 'event'
})
Event.belongsTo(EmptySans, {
    foreignKey: 'emptySansId',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
    as: 'emptySans'
})

db
.sync({alter: true})
.then(() => console.log('models sync successfuly'))
.catch((error) => console.log('error to sync' , error))

module.exports = {
    Artist,
    Cheirs,
    Comments,
    Event,
    PaymentArtist,
    PaymentUser,
    Ticket,
    EmptySans,
    User
};