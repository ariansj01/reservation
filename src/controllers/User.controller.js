const { User, Comments, PaymentUser, Ticket, Cheirs } = require('../models');
const bcrypt = require('bcryptjs');

const GetUser = async(req,res) => {
    try {
        const users = await User.findAll({
            include: [
                {
                    model: Comments,
                    as: 'userComments'
                },
                {
                    model: PaymentUser,
                    as: 'userPayments'
                },
                {
                    model: Ticket,
                    as: 'tickets'
                },
                {
                    model: Cheirs,
                    as: 'cheirs'
                }
            ]
        })
        res.status(200).json({message : 'Users fetched successfully', data : users})
    } catch (error) {
        res.status(500).json({message : 'Error fetching users', error : error.message})
    }
}

const CreateUser = async(req,res) => {
    try {
        const {name , email , phone , password , role} = req.body
        const hashedPassword = await bcrypt.hash(password, 10)
        const user = await User.create({name , email , phone , password: hashedPassword , role})
        res.status(201).json({message : 'User created successfully', data : user})
    } catch (error) {
        res.status(500).json({message : 'Error creating user', error : error.message})
    }
}

const UpdateUser = async(req,res) => {
    try {
        const id = req.params.id
        const {name , email , phone , password , role} = req.body
        const passwordHash = await bcrypt.hash(password, 10)
        const [updated] = await User.update({name , email , phone , passwordHash , role} , {where : {id}})

        if (!updated) {
            return res.status(404).json({ message: 'User not found' });
        }

        const updatedUser = await User.findByPk(id, {
            include: [
                {
                    model: Comments,
                    as: 'userComments'
                },
                {
                    model: PaymentUser,
                    as: 'userPayments'
                },
                {
                    model: Ticket,
                    as: 'tickets'
                },
                {
                    model: Cheirs,
                    as: 'cheirs'
                }
            ]
        });
        res.status(200).json({message : 'User updated successfully', data : updatedUser})
    } catch (error) {
        res.status(400).json({message : 'Error updating user', error : error.message})
    }
}

const DeleteUser = async(req,res) => {
    try {
        const id = req.params.id
        const deleted = await User.destroy({where : {id}})

        if (!deleted) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json({message : 'User deleted successfully'})
    } catch (error) {
        res.status(500).json({message : 'Error deleting user', error : error.message})
    }
}

const GetUserByEmail = async(req,res) => {
    try {
        const email = req.params.email
        const user = await User.findOne({
            where: {email},
            include: [
                {
                    model: Comments,
                    as: 'userComments'
                },
                {
                    model: PaymentUser,
                    as: 'userPayments'
                },
                {
                    model: Ticket,
                    as: 'tickets'
                },
                {
                    model: Cheirs,
                    as: 'cheirs'
                }
            ]
        })
        if(!user){
            return res.status(404).json({message : 'User not found'})
        }
        res.status(200).json({message : 'User fetched successfully', data : user})
    } catch (error) {
        res.status(500).json({message : 'Error fetching user', error : error.message})
    }
}

module.exports = {
    GetUser,
    CreateUser,
    UpdateUser,
    DeleteUser,
    GetUserByEmail
}