const { Artist, Event, Comments, PaymentArtist } = require('../models');
const bcrypt = require('bcryptjs');

// Get all artists with all relations
const GetAllArtists = async (req, res) => {
    try {
        const artists = await Artist.findAll({
            where: { role: 'artist' },
            include: [
                {
                    model: Event,
                    as: 'events'
                },
                {
                    model: Comments,
                    as: 'artistComments'
                },
                {
                    model: PaymentArtist,
                    as: 'artistPayments'
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
            where: { role: 'artist' },
            include: [
                {
                    model: Event,
                    as: 'events'
                },
                {
                    model: Comments,
                    as: 'artistComments'
                },
                {
                    model: PaymentArtist,
                    as: 'artistPayments'
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
        const {email , password , name, phone} = req.body;
        console.log(password)
        const hashedPassword = await bcrypt.hash(password, 10)
        console.log(hashedPassword)
        const artist = await Artist.create({email , password: hashedPassword , name, phone});
        console.log(artist)
        res.status(201).json({ message: 'Artist created successfully', data: artist });
    } catch (error) {
        res.status(500).json({ message: 'Error creating artist', error: error.message });
        console.log(error.message)
    }
};

// Update artist
const UpdateArtist = async (req, res) => {
    try {
        const { id } = req.params;
        const [updated] = await Artist.update(req.body, {
            where: { id, role: 'artist' }
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
            where: { id, role: 'artist' }
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
