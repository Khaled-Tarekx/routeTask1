import UserModel from '../../../database/userModel.js'
import {where} from "sequelize";


export const getUsers = async (req, res) => {
    const users = await UserModel.findAndCountAll()

    res.status(200).json({ data: users })
}


export const createUser = async (req, res) => {

    const user = await UserModel.create(req.body)

    res.status(200).json({message: 'user createdSuccesfully', data: user})
}

export const getUserByID = async (req, res) => {
    const {id} = req.params
    const user = await UserModel.findByPk(id)
    if (!user) {
        return res.status(400).json('user doesnt exist')
    }
    res.status(200).json({data: user})
}

export const updateUser = async (req, res) => {
    const {id} = req.params
    const {email, name} = req.body
    const user = await UserModel.update({ email, name }, { where: { id }})
    if (!user) {
        return res.status(400).json('user doesnt exist')
    }

    res.status(200).json({message: 'user updated successfully', data: user})
}


export const deleteUser = async (req, res) => {
    const {id} = req.params
    const user = await UserModel.destroy({ where: { id }})
    if (!user) {
        return res.status(400).json('user doesnt exist')
    }
    res.status(200).json({message: 'user deleted successfully', data: user})
}

