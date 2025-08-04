const { Ticket, User, Event, Cheirs } = require('../models');

// Get all tickets with all relations
const GetAllTickets = async (req, res) => {
    try {
        const tickets = await Ticket.findAll({
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
        res.status(200).json({ message: 'Tickets fetched successfully', data: tickets });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching tickets', error: error.message });
    }
};

// Get ticket by ID with all relations
const GetTicketById = async (req, res) => {
    try {
        const { id } = req.params;
        const ticket = await Ticket.findByPk(id, {
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

        if (!ticket) {
            return res.status(404).json({ message: 'Ticket not found' });
        }

        res.status(200).json({ message: 'Ticket fetched successfully', data: ticket });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching ticket', error: error.message });
    }
};

// Create new ticket
const CreateTicket = async (req, res) => {
    try {
        const ticket = await Ticket.create(req.body);
        res.status(201).json({ message: 'Ticket created successfully', data: ticket });
    } catch (error) {
        res.status(500).json({ message: 'Error creating ticket', error: error.message });
    }
};

// Update ticket
const UpdateTicket = async (req, res) => {
    try {
        const { id } = req.params;
        const [updated] = await Ticket.update(req.body, {
            where: { id }
        });

        if (!updated) {
            return res.status(404).json({ message: 'Ticket not found' });
        }

        const updatedTicket = await Ticket.findByPk(id);
        res.status(200).json({ message: 'Ticket updated successfully', data: updatedTicket });
    } catch (error) {
        res.status(500).json({ message: 'Error updating ticket', error: error.message });
    }
};

// Delete ticket
const DeleteTicket = async (req, res) => {
    try {
        const { id } = req.params;
        const deleted = await Ticket.destroy({
            where: { id }
        });

        if (!deleted) {
            return res.status(404).json({ message: 'Ticket not found' });
        }

        res.status(200).json({ message: 'Ticket deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting ticket', error: error.message });
    }
};

module.exports = {
    GetAllTickets,
    GetTicketById,
    CreateTicket,
    UpdateTicket,
    DeleteTicket
};
