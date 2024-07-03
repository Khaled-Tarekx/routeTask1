import CommentModel from "../../../database/commentModel.js";


export const getComments = async (req, res) => {
    const comments = await CommentModel.findAndCountAll()

    res.status(200).json({data: comments })
}

export const createComment = async (req, res) => {

    const comment = await CommentModel.create(req.body)

    res.status(200).json({message: 'comment created Successfully', data: comment})
}

export const getCommentByID = async (req, res) => {
    const {id} = req.params
    const comment = await CommentModel.findByPk(id)
    if (!comment) {
        return res.status(400).json('comment doesnt exist')
    }

    res.status(200).json({data: comment})
}

export const updateComment = async (req, res) => {
    const {id} = req.params
    const { content } = req.body
    const comment = await CommentModel.update({ content }, { where: {  id }})
    if (!comment) {
        return res.status(400).json('post doesnt exist')
    }

    res.status(200).json({message: 'comment updated successfully', data: comment})
}

export const deleteComment = async (req, res) => {
    const {id} = req.params
    const comment = await CommentModel.destroy({
  where: {
    id
  }})

    if (!comment) {
        return res.status(400).json('comment doesnt exist')
    }
    res.status(200).json({message: 'comment deleted successfully', data: comment })
}
