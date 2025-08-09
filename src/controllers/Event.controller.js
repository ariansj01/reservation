const { Event, Artist, Comments, PaymentUser, Ticket, Cheirs, EmptySans, User } = require('../models');

// Get all events with all relations
const GetAllEvents = async (req, res) => {
    try {
        const events = await Event.findAll({
            include: [
                {
                    model: Artist,
                    as: 'artist'
                },
                {
                    model: Comments,
                    as: 'comments',
                    include: [{
                        model: User,
                        as: 'user'
                    }]
                },
                {
                    model: PaymentUser,
                    as: 'payments'
                },
                {
                    model: Ticket,
                    as: 'tickets',
                    include: [{
                        model: User,
                        as: 'user'
                    }]
                },
                {
                    model: Cheirs,
                    as: 'cheirs',
                    include: [{
                        model: User,
                        as: 'user'
                    }]
                },
                {
                    model: EmptySans,
                    as: 'emptySans'
                }
            ]
        });
        res.status(200).json({ message: 'Events fetched successfully', data: events });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching events', error: error.message });
    }
};

// Get event by ID with all relations
const GetEventById = async (req, res) => {
    try {
        const { id } = req.params;
        const event = await Event.findByPk(id, {
            include: [
                {
                    model: Artist,
                    as: 'artist'
                },
                {
                    model: Comments,
                    as: 'comments',
                    include: [{
                        model: User,
                        as: 'user'
                    }]
                },
                {
                    model: PaymentUser,
                    as: 'payments'
                },
                {
                    model: Ticket,
                    as: 'tickets',
                    include: [{
                        model: User,
                        as: 'user'
                    }]
                },
                {
                    model: Cheirs,
                    as: 'cheirs',
                    include: [{
                        model: User,
                        as: 'user'
                    }]
                },
                {
                    model: EmptySans,
                    as: 'emptySans'
                }
            ]
        });

        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }

        res.status(200).json({ message: 'Event fetched successfully', data: event });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching event', error: error.message });
    }
};

// Get events by artist ID
const GetEventsByArtistId = async (req, res) => {
    try {
        const { artistId } = req.params;
        const events = await Event.findAll({
            where: { artistId },
            include: [
                {
                    model: Artist,
                    as: 'artist'
                },
                {
                    model: Comments,
                    as: 'comments',
                    include: [{
                        model: User,
                        as: 'user'
                    }]
                },
                {
                    model: PaymentUser,
                    as: 'payments'
                },
                {
                    model: Ticket,
                    as: 'tickets',
                    include: [{
                        model: User,
                        as: 'user'
                    }]
                },
                {
                    model: Cheirs,
                    as: 'cheirs',
                    include: [{
                        model: User,
                        as: 'user'
                    }]
                },
                {
                    model: EmptySans,
                    as: 'emptySans'
                }
            ]
        });

        if (!events || events.length === 0) {
            return res.status(404).json({ message: 'No events found for this artist' });
        }

        res.status(200).json({ message: 'Events fetched successfully', data: events });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching events', error: error.message });
    }
};

// Create new event
const CreateEvent = async (req, res) => {
    try {
        // Check if artist exists
        const artist = await Artist.create(req.body);
        if (!artist) {
            return res.status(404).json({ message: 'Artist not found' });
        }

        const event = await Event.create(req.body);
        res.status(201).json({ message: 'Event created successfully', data: event });
    } catch (error) {
        res.status(500).json({ message: 'Error creating event', error: error.message });
    }
};

// Update event
const UpdateEvent = async (req, res) => {
    try {
        const { id } = req.params;
        
        // If artistId is being updated, check if the new artist exists
        if (req.body.artistId) {
            const artist = await Artist.findByPk(req.body.artistId);
            if (!artist) {
                return res.status(404).json({ message: 'Artist not found' });
            }
        }

        const [updated] = await Event.update(req.body, {
            where: { id }
        });

        if (!updated) {
            return res.status(404).json({ message: 'Event not found' });
        }

        const updatedEvent = await Event.findByPk(id);
        res.status(200).json({ message: 'Event updated successfully', data: updatedEvent });
    } catch (error) {
        res.status(500).json({ message: 'Error updating event', error: error.message });
    }
};

// Delete event
const DeleteEvent = async (req, res) => {
    try {
        const { id } = req.params;
        const deleted = await Event.destroy({
            where: { id }
        });

        if (!deleted) {
            return res.status(404).json({ message: 'Event not found' });
        }

        res.status(200).json({ message: 'Event deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting event', error: error.message });
    }
};

module.exports = {
    GetAllEvents,
    GetEventById,
    GetEventsByArtistId,
    CreateEvent,
    UpdateEvent,
    DeleteEvent
};
