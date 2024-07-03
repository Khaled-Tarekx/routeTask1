import UserModel from "../../../database/userModel.js";
import { genSalt, hash , compare} from "bcrypt"
export const register = async (req, res) => {
    const { username, email, password} = req.body
    const userExists = await UserModel.findOne( { where : { email: email } })
    if (userExists) {
        res.status(400).json({ message: `a user already exists with the given email` })
    }
    const salt = await genSalt(10)
    const hashedPassword = await hash(password, salt)
    const user = await UserModel.create({ username, email, password: hashedPassword })

    res.status(201).json({ data: user })
}

export const login = async (req, res) => {
    const { email, password } = req.body
    const correctEmail = await UserModel.findOne( { where : { email: email } })
    if (!correctEmail) {
        return res.status(400).json({ message: `email or password is incorrect` })
    }
    const correctPassword = await compare(password, correctEmail.password)
     if (!correctPassword) {
        return res.status(400).json({ message: `email or password is incorrect` })
    }

     res.status(200).json({ message: `user logged in successfully` })

}