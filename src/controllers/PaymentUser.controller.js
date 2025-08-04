const { PaymentUser, User, Event, Cheirs } = require('../models');

// Get all user payments with all relations
const GetAllUserPayments = async (req, res) => {
    try {
        const payments = await PaymentUser.findAll({
            include: [
                {
                    model: User,
                    as: 'user'
                },
                {
                    model: Event,
                    as: 'event'
                },
                {
                    model: Cheirs,
                    as: 'cheir'
                }
            ]
        });
        res.status(200).json({ message: 'User payments fetched successfully', data: payments });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching user payments', error: error.message });
    }
};

// Get user payment by ID with all relations
const GetUserPaymentById = async (req, res) => {
    try {
        const { id } = req.params;
        const payment = await PaymentUser.findByPk(id, {
            include: [
                {
                    model: User,
                    as: 'user'
                },
                {
                    model: Event,
                    as: 'event'
                },
                {
                    model: Cheirs,
                    as: 'cheir'
                }
            ]
        });

        if (!payment) {
            return res.status(404).json({ message: 'User payment not found' });
        }

        res.status(200).json({ message: 'User payment fetched successfully', data: payment });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching user payment', error: error.message });
    }
};

// Create new user payment
const CreateUserPayment = async (req, res) => {
    try {
        const payment = await PaymentUser.create(req.body);
        res.status(201).json({ message: 'User payment created successfully', data: payment });
    } catch (error) {
        res.status(500).json({ message: 'Error creating user payment', error: error.message });
    }
};

// Update user payment
const UpdateUserPayment = async (req, res) => {
    try {
        const { id } = req.params;
        const [updated] = await PaymentUser.update(req.body, {
            where: { id }
        });

        if (!updated) {
            return res.status(404).json({ message: 'User payment not found' });
        }

        const updatedPayment = await PaymentUser.findByPk(id);
        res.status(200).json({ message: 'User payment updated successfully', data: updatedPayment });
    } catch (error) {
        res.status(500).json({ message: 'Error updating user payment', error: error.message });
    }
};

// Delete user payment
const DeleteUserPayment = async (req, res) => {
    try {
        const { id } = req.params;
        const deleted = await PaymentUser.destroy({
            where: { id }
        });

        if (!deleted) {
            return res.status(404).json({ message: 'User payment not found' });
        }

        res.status(200).json({ message: 'User payment deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting user payment', error: error.message });
    }
};

module.exports = {
    GetAllUserPayments,
    GetUserPaymentById,
    CreateUserPayment,
    UpdateUserPayment,
    DeleteUserPayment
};
