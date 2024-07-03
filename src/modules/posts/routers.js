import express from 'express'
import {
    createPost, deletePost, getPostByID, getPostDetailsWithUser
    , getPosts, getPostWithUserDetails, updatePost
} from './controllers.js'

const router = express.Router()

router.route('/').get(getPosts).post(createPost)

router.route('/:id').get(getPostByID).delete(deletePost).patch(updatePost)
router.route('/:id/users').get(getPostWithUserDetails)
router.route('/:id/users/:userId').get(getPostDetailsWithUser)

export default router