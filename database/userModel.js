import  { DataTypes } from 'sequelize'

import sequalize from './connection.js'

const UserModel = sequalize.define('user', {
    id: {
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
        allowNull: false
    },
    username: {
        type: DataTypes.STRING,
        allowNull: false
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
      },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
})

export default UserModel

