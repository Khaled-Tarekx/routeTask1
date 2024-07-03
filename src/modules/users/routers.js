import express from 'express'

const router = express.Router()
import { getUserByID, getUsers, createUser, updateUser, deleteUser } from './controllers.js'

router.route('/').get(getUsers).post(createUser)

router.route('/:id').get(getUserByID).delete(deleteUser).patch(updateUser)

export default router