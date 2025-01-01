"use strict";

const user = require("./users");
const post = require("./posts");

const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Likes extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Likes.init(
    {
      id: {
        allowNull: true,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.BIGINT,
      },
      userId: {
        type: DataTypes.BIGINT,
        allowNull: true,
        references: {
          model: user,
          key: "id",
        },
      },
      postid: {
        type: DataTypes.BIGINT,
        allowNull: true,
        references: {
          model: post,
          key: "id",
        },
      },
      likedAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: "Likes",
    }
  );
  return Likes;
};
