const { Artist, Event, Comments, PaymentArtist } = require('../models');

// Get all artists with all relations
const GetAllArtists = async (req, res) => {
    try {
        const artists = await Artist.findAll({
            include: [
                {
                    model: Event,
                    as: 'events'
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
                    model: PaymentArtist,
                    as: 'payments'
                }
            ]
        });
        res.status(200).json({ message: 'Artists fetched successfully', data: artists });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching artists', error: error.message });
    }
};

// Get artist by ID with all relations
const GetArtistById = async (req, res) => {
    try {
        const { id } = req.params;
        const artist = await Artist.findByPk(id, {
            include: [
                {
                    model: Event,
                    as: 'events'
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
                    model: PaymentArtist,
                    as: 'payments'
                }
            ]
        });

        if (!artist) {
            return res.status(404).json({ message: 'Artist not found' });
        }

        res.status(200).json({ message: 'Artist fetched successfully', data: artist });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching artist', error: error.message });
    }
};

// Create new artist
const CreateArtist = async (req, res) => {
    try {
        const artist = await Artist.create(req.body);
        res.status(201).json({ message: 'Artist created successfully', data: artist });
    } catch (error) {
        res.status(500).json({ message: 'Error creating artist', error: error.message });
    }
};

// Update artist
const UpdateArtist = async (req, res) => {
    try {
        const { id } = req.params;
        const [updated] = await Artist.update(req.body, {
            where: { id }
        });

        if (!updated) {
            return res.status(404).json({ message: 'Artist not found' });
        }

        const updatedArtist = await Artist.findByPk(id);
        res.status(200).json({ message: 'Artist updated successfully', data: updatedArtist });
    } catch (error) {
        res.status(500).json({ message: 'Error updating artist', error: error.message });
    }
};

// Delete artist
const DeleteArtist = async (req, res) => {
    try {
        const { id } = req.params;
        const deleted = await Artist.destroy({
            where: { id }
        });

        if (!deleted) {
            return res.status(404).json({ message: 'Artist not found' });
        }

        res.status(200).json({ message: 'Artist deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting artist', error: error.message });
    }
};

module.exports = {
    GetAllArtists,
    GetArtistById,
    CreateArtist,
    UpdateArtist,
    DeleteArtist
};
