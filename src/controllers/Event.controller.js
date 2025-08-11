const { Event, Comments, PaymentUser, Ticket, Cheirs, EmptySans, User, Artist } = require('../models');

// Get all events with all relations
const GetAllEvents = async (req, res) => {
    try {
        const events = await Event.findAll({
            include: [
                {
                    model: User,
                    as: 'artist'
                },
                {
                    model: Comments,
                    as: 'eventComments',
                    include: [{
                        model: User,
                        as: 'user'
                    }]
                },
                {
                    model: PaymentUser,
                    as: 'eventPayments'
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
                    model: User,
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
                    as: 'eventPayments'
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
                    model: User,
                    as: 'artist'
                },
                {
                    model: Comments,
                    as: 'eventComments',
                    include: [{
                        model: User,
                        as: 'user'
                    }]
                },
                {
                    model: PaymentUser,
                    as: 'eventPayments'
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
        const { artistId, emptySansId, ...eventData } = req.body;
        
        console.log('Creating event with data:', { ...eventData, artistId, emptySansId });

        // const artist = await Artist.findAll();
        // console.log('Artist found:', artist);
        
        
        // Check if artist exists
        if (artistId) {
            const artist = await Artist.findByPk(artistId);
            if (!artist) {
                return res.status(404).json({ message: 'Artist not found' });
            }
            console.log('Artist found:', artist.id);
        }
        
        // Check if emptySans exists
        if (emptySansId) {
            const emptySans = await EmptySans.findByPk(emptySansId);
            if (!emptySans) {
                return res.status(404).json({ message: 'EmptySans not found' });
            }
            console.log('EmptySans found:', emptySans.id);
        }
        
        console.log('Creating event with final data:', { ...eventData, artistId, emptySansId });
        const event = await Event.create({
            ...eventData,
            artistId,
            emptySansId
        });
        
        console.log('Event created successfully:', event.id);
        res.status(201).json({ message: 'Event created successfully', data: event });
    } catch (error) {
        console.error('Error creating event:', error);
        
        // Handle specific database errors
        if (error.name === 'SequelizeForeignKeyConstraintError') {
            return res.status(400).json({
                message: 'Foreign key constraint failed',
                error: 'Referenced record not found',
                details: error.message
            });
        }
        
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

// Test route to check database state
const TestDatabaseState = async (req, res) => {
    try {
        // Check if Artists exist
        const artists = await Artist.findAll();
        console.log('Artists in database:', artists.length);
        
        // Check if EmptySans exist
        const emptySans = await EmptySans.findAll();
        console.log('EmptySans in database:', emptySans.length);
        
        // Check Event model structure
        const eventAttributes = Object.keys(Event.rawAttributes);
        console.log('Event attributes:', eventAttributes);
        
        res.status(200).json({
            message: 'Database state checked',
            data: {
                artistsCount: artists.length,
                emptySansCount: emptySans.length,
                eventAttributes: eventAttributes
            }
        });
    } catch (error) {
        console.error('Error checking database state:', error);
        res.status(500).json({ message: 'Error checking database state', error: error.message });
    }
};

// Helper function to create sample data if needed
const CreateSampleData = async (req, res) => {
    try {
        // Check if we have any artists
        let artist = await Artist.findOne();
        if (!artist) {
            artist = await Artist.create({
                name: 'Sample Artist',
                email: 'artist@example.com',
                password: 'password123',
                phone: '09123456789'
            });
            console.log('Created sample artist:', artist.id);
        }
        
        // Check if we have any emptySans
        let emptySans = await EmptySans.findOne();
        if (!emptySans) {
            emptySans = await EmptySans.create({
                name: 'Sample Salon',
                description: 'Sample salon description',
                openTime: true,
                address: 'Sample Address',
                capacity: 100
            });
            console.log('Created sample emptySans:', emptySans.id);
        }
        
        res.status(200).json({
            message: 'Sample data created/checked',
            data: {
                artist: { id: artist.id, name: artist.name },
                emptySans: { id: emptySans.id, name: emptySans.name }
            }
        });
    } catch (error) {
        console.error('Error creating sample data:', error);
        res.status(500).json({ message: 'Error creating sample data', error: error.message });
    }
};

// Test function to create a sample event
const CreateTestEvent = async (req, res) => {
    try {
        // Get the first artist and emptySans
        const artist = await Artist.findOne();
        const emptySans = await EmptySans.findOne();
        
        if (!artist || !emptySans) {
            return res.status(400).json({
                message: 'Please create sample data first',
                error: 'Artist or EmptySans not found'
            });
        }
        
        const testEventData = {
            title: 'Test Event',
            description: 'This is a test event',
            startDate: '2024-12-25T18:00:00',
            endDate: '2024-12-25T22:00:00',
            artistId: artist.id,
            vipPrice: '100',
            normalPrice: '50',
            closeBuyTicket: '2024-12-24T23:59:59',
            openBuyTicket: '2024-12-01T00:00:00',
            emptySansId: emptySans.id
        };
        
        console.log('Creating test event with data:', testEventData);
        
        const event = await Event.create(testEventData);
        
        console.log('Test event created successfully:', event.id);
        res.status(201).json({
            message: 'Test event created successfully',
            data: event
        });
    } catch (error) {
        console.error('Error creating test event:', error);
        res.status(500).json({
            message: 'Error creating test event',
            error: error.message
        });
    }
};

module.exports = {
    GetAllEvents,
    GetEventById,
    GetEventsByArtistId,
    CreateEvent,
    UpdateEvent,
    DeleteEvent,
    TestDatabaseState,
    CreateSampleData,
    CreateTestEvent
};
