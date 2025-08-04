const { Cheirs, User, Event, Ticket, PaymentUser } = require('../models');

// Get all cheirs with all relations
const GetAllCheirs = async (req, res) => {
    try {
        const cheirs = await Cheirs.findAll({
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
                    model: Ticket,
                    as: 'ticket'
                },
                {
                    model: PaymentUser,
                    as: 'payment'
                }
            ]
        });
        res.status(200).json({ message: 'Cheirs fetched successfully', data: cheirs });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching cheirs', error: error.message });
    }
};

// Get cheir by ID with all relations
const GetCheirById = async (req, res) => {
    try {
        const { id } = req.params;
        const cheir = await Cheirs.findByPk(id, {
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
                    model: Ticket,
                    as: 'ticket'
                },
                {
                    model: PaymentUser,
                    as: 'payment'
                }
            ]
        });

        if (!cheir) {
            return res.status(404).json({ message: 'Cheir not found' });
        }

        res.status(200).json({ message: 'Cheir fetched successfully', data: cheir });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching cheir', error: error.message });
    }
};

// Create new cheir
const CreateCheir = async (req, res) => {
    try {
        const cheir = await Cheirs.create(req.body);
        res.status(201).json({ message: 'Cheir created successfully', data: cheir });
    } catch (error) {
        res.status(500).json({ message: 'Error creating cheir', error: error.message });
    }
};

// Update cheir
const UpdateCheir = async (req, res) => {
    try {
        const { id } = req.params;
        const [updated] = await Cheirs.update(req.body, {
            where: { id }
        });

        if (!updated) {
            return res.status(404).json({ message: 'Cheir not found' });
        }

        const updatedCheir = await Cheirs.findByPk(id);
        res.status(200).json({ message: 'Cheir updated successfully', data: updatedCheir });
    } catch (error) {
        res.status(500).json({ message: 'Error updating cheir', error: error.message });
    }
};

// Delete cheir
const DeleteCheir = async (req, res) => {
    try {
        const { id } = req.params;
        const deleted = await Cheirs.destroy({
            where: { id }
        });

        if (!deleted) {
            return res.status(404).json({ message: 'Cheir not found' });
        }

        res.status(200).json({ message: 'Cheir deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting cheir', error: error.message });
    }
};

module.exports = {
    GetAllCheirs,
    GetCheirById,
    CreateCheir,
    UpdateCheir,
    DeleteCheir
};
