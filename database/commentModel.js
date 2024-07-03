import  { DataTypes } from 'sequelize'
import sequalize from './connection.js'
import UserModel from "./userModel.js";
import PostModel from "./postModel.js";
import postModel from "./postModel.js";
const CommentModel = sequalize.define('comment', {
    id: {
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
        allowNull: false
    },
    content: {
        type: DataTypes.STRING,
        allowNull: false
      },
})

CommentModel.belongsTo(UserModel, {
    onDelete: "CASCADE",
    onUpdate: "CASCADE"
});

UserModel.hasMany(CommentModel, {
    onDelete: "CASCADE",
    onUpdate: "CASCADE"
});

CommentModel.belongsTo(PostModel, {
    onDelete: "CASCADE",
    onUpdate: "CASCADE"
});

postModel.hasMany(CommentModel, {
    onDelete: "CASCADE",
    onUpdate: "CASCADE"
});

export default CommentModel