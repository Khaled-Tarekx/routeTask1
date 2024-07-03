import PostModel from '../../../database/postModel.js'
import CommentModel from "../../../database/commentModel.js";
import UserModel from "../../../database/userModel.js";


export const getPosts = async (req, res) => {
    const posts = await PostModel.findAndCountAll()

    res.status(200).json({data: posts })
}


export const createPost = async (req, res) => {
    const { userId, title, content } = req.body
    const post = await PostModel.create({ title, content, userId  })

    res.status(200).json({message: 'post created Successfully', data: post})
}

export const getPostByID = async (req, res) => {
    const {id} = req.params
    const post = await PostModel.findByPk(id)
    if (!post) {
        return res.status(400).json('post doesnt exist')
    }
    res.status(200).json({data: post})
}

export const updatePost = async (req, res) => {
    const {id} = req.params
    const { content, title } = req.body
    const post = await PostModel.update({ content, title }, { where: { id }})
    if (!post) {
        return res.status(400).json('post doesnt exist')
    }

    res.status(200).json({message: 'post updated successfully', data: post})
}


export const deletePost = async (req, res) => {
    const {id} = req.params
    const post = await PostModel.destroy({
  where: {
    id
  }})

    if (!post) {
        return res.status(400).json('user doesnt exist')
    }
    res.status(200).json({message: 'post deleted successfully', data: post })
}

export const getPostDetailsWithUser = async (req, res) => {
     const {id, userId} = req.params
    const post = await PostModel.findOne({ where: {
        id, userId
        }, include:
            CommentModel
        })

    if (!post) {
        return res.status(400).json('post doesnt exist')
    }
    res.status(200).json({data: post})
}

export const getPostWithUserDetails = async (req, res) => {
      const { id } = req.params
    const post = await PostModel.findOne({ where: {
        id: id
        }, include:
            UserModel
        })

    if (!post) {
        return res.status(400).json('post doesnt exist')
    }
    res.status(200).json({ data: post })
}
