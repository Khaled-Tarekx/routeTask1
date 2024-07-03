import express from 'express'

const router = express.Router()
import {getCommentByID, getComments, createComment, updateComment, deleteComment} from './controllers.js'

router.route('/').get(getComments).post(createComment)

router.route('/:id').get(getCommentByID).delete(deleteComment).patch(updateComment)

export default router