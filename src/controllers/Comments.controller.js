const { Comments, User, Event, Artist } = require('../models');
// Get all comments with all relations
const GetAllComments = async (req, res) => {
    try {
        const comments = await Comments.findAll({
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
                    model: Artist,
                    as: 'artist'
                }
            ]
        });
        res.status(200).json({ message: 'Comments fetched successfully', data: comments });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching comments', error: error.message });
    }
};

// Get comment by ID with all relations
const GetCommentById = async (req, res) => {
    try {
        const { id } = req.params;
        const comment = await Comments.findByPk(id, {
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
                    model: Artist,
                    as: 'artist'
                }
            ]
        });

        if (!comment) {
            return res.status(404).json({ message: 'Comment not found' });
        }

        res.status(200).json({ message: 'Comment fetched successfully', data: comment });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching comment', error: error.message });
    }
};

// Create new comment
const CreateComment = async (req, res) => {
    try {
        const comment = await Comments.create(req.body);
        res.status(201).json({ message: 'Comment created successfully', data: comment });
    } catch (error) {
        res.status(500).json({ message: 'Error creating comment', error: error.message });
    }
};

// Update comment
const UpdateComment = async (req, res) => {
    try {
        const { id } = req.params;
        const [updated] = await Comments.update(req.body, {
            where: { id }
        });

        if (!updated) {
            return res.status(404).json({ message: 'Comment not found' });
        }

        const updatedComment = await Comments.findByPk(id);
        res.status(200).json({ message: 'Comment updated successfully', data: updatedComment });
    } catch (error) {
        res.status(500).json({ message: 'Error updating comment', error: error.message });
    }
};

// Delete comment
const DeleteComment = async (req, res) => {
    try {
        const { id } = req.params;
        const deleted = await Comments.destroy({
            where: { id }
        });

        if (!deleted) {
            return res.status(404).json({ message: 'Comment not found' });
        }

        res.status(200).json({ message: 'Comment deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting comment', error: error.message });
    }
};

module.exports = {
    GetAllComments,
    GetCommentById,
    CreateComment,
    UpdateComment,
    DeleteComment
};
