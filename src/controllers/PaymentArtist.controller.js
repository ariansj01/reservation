const { PaymentArtist, User } = require('../models');

// Get all artist payments with all relations
const GetAllArtistPayments = async (req, res) => {
    try {
        const payments = await PaymentArtist.findAll({
            include: [
                {
                    model: User,
                    as: 'artist'
                }
            ]
        });
        res.status(200).json({ message: 'Artist payments fetched successfully', data: payments });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching artist payments', error: error.message });
    }
};

// Get artist payment by ID with all relations
const GetArtistPaymentById = async (req, res) => {
    try {
        const { id } = req.params;
        const payment = await PaymentArtist.findByPk(id, {
            include: [
                {
                    model: User,
                    as: 'artist'
                }
            ]
        });

        if (!payment) {
            return res.status(404).json({ message: 'Artist payment not found' });
        }

        res.status(200).json({ message: 'Artist payment fetched successfully', data: payment });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching artist payment', error: error.message });
    }
};

// Create new artist payment
const CreateArtistPayment = async (req, res) => {
    try {
        const payment = await PaymentArtist.create(req.body);
        res.status(201).json({ message: 'Artist payment created successfully', data: payment });
    } catch (error) {
        res.status(500).json({ message: 'Error creating artist payment', error: error.message });
    }
};

// Update artist payment
const UpdateArtistPayment = async (req, res) => {
    try {
        const { id } = req.params;
        const [updated] = await PaymentArtist.update(req.body, {
            where: { id }
        });

        if (!updated) {
            return res.status(404).json({ message: 'Artist payment not found' });
        }

        const updatedPayment = await PaymentArtist.findByPk(id);
        res.status(200).json({ message: 'Artist payment updated successfully', data: updatedPayment });
    } catch (error) {
        res.status(500).json({ message: 'Error updating artist payment', error: error.message });
    }
};

// Delete artist payment
const DeleteArtistPayment = async (req, res) => {
    try {
        const { id } = req.params;
        const deleted = await PaymentArtist.destroy({
            where: { id }
        });

        if (!deleted) {
            return res.status(404).json({ message: 'Artist payment not found' });
        }

        res.status(200).json({ message: 'Artist payment deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting artist payment', error: error.message });
    }
};

module.exports = {
    GetAllArtistPayments,
    GetArtistPaymentById,
    CreateArtistPayment,
    UpdateArtistPayment,
    DeleteArtistPayment
}; 