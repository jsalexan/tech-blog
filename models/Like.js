const { Model, DataTypes } = require("sequelize");
const sequelize = require("../config/connection");

class Like extends Model {}

Like.init(
    {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      like: {
        type: DataTypes.BOOLEAN
      },
      post_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: "post",
            key: "id",
        },
      },
    },
    {
        sequelize, 
        freezeTableName: true, 
        underscored: true, 
        modelName: "like",
    }
);

module.exports = Like;