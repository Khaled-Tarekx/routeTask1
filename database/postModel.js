import  { DataTypes } from 'sequelize'

import sequalize from './connection.js'
import UserModel from "./userModel.js";

const PostModel = sequalize.define('post', {
    id: {
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
        allowNull: false
    },
    title: {
        type: DataTypes.STRING,
      },
      content: {
        type: DataTypes.STRING,
        allowNull: false,
      }
})
PostModel.belongsTo(UserModel, {
    onDelete: "CASCADE",
    onUpdate: "CASCADE"
});
UserModel.hasMany(PostModel, {
    onDelete: "CASCADE",
    onUpdate: "CASCADE"
});

export default PostModel

