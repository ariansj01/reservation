const { EmptySans, Event } = require('../models');

// Get all empty sans with all relations
const GetAllEmptySans = async (req, res) => {
    try {
        const emptySans = await EmptySans.findAll({
            include: [
                {
                    model: Event,
                    as: 'event'
                }
            ]
        });
        res.status(200).json({ message: 'Empty sans fetched successfully', data: emptySans });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching empty sans', error: error.message });
    }
};

// Get empty sans by ID with all relations
const GetEmptySansById = async (req, res) => {
    try {
        const { id } = req.params;
        const emptySans = await EmptySans.findByPk(id, {
            include: [
                {
                    model: Event,
                    as: 'event'
                }
            ]
        });

        if (!emptySans) {
            return res.status(404).json({ message: 'Empty sans not found' });
        }

        res.status(200).json({ message: 'Empty sans fetched successfully', data: emptySans });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching empty sans', error: error.message });
    }
};

// Create new empty sans
const CreateEmptySans = async (req, res) => {
    try {
        // Convert openTime to boolean more precisely
        let openTimeValue = false;
        if (req.body.openTime === true || req.body.openTime === 'true' || req.body.openTime === 1 || req.body.openTime === '1') {
            openTimeValue = true;
        }

        const data = {
            ...req.body,
            openTime: openTimeValue
        };

        console.log('Data being sent to database:', data); // برای دیباگ

        const emptySans = await EmptySans.create(data);
        res.status(201).json({ message: 'Empty sans created successfully', data: emptySans });
    } catch (error) {
        console.error('Error details:', error);
        res.status(500).json({ message: 'Error creating empty sans', error: error.message });
    }
};

// Update empty sans
const UpdateEmptySans = async (req, res) => {
    try {
        const { id } = req.params;
        const [updated] = await EmptySans.update(req.body, {
            where: { id }
        });

        if (!updated) {
            return res.status(404).json({ message: 'Empty sans not found' });
        }

        const updatedEmptySans = await EmptySans.findByPk(id);
        res.status(200).json({ message: 'Empty sans updated successfully', data: updatedEmptySans });
    } catch (error) {
        res.status(500).json({ message: 'Error updating empty sans', error: error.message });
    }
};

// Delete empty sans
const DeleteEmptySans = async (req, res) => {
    try {
        const { id } = req.params;
        const deleted = await EmptySans.destroy({
            where: { id }
        });

        if (!deleted) {
            return res.status(404).json({ message: 'Empty sans not found' });
        }

        res.status(200).json({ message: 'Empty sans deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting empty sans', error: error.message });
    }
};

module.exports = {
    GetAllEmptySans,
    GetEmptySansById,
    CreateEmptySans,
    UpdateEmptySans,
    DeleteEmptySans
}; 