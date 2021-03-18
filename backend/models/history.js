'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class History extends Model {
    static associate(models) {}
  }
  History.init(
    {
      author: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },

      groupId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      groupName: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: 'Default Group Name',
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      authorName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      amount: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: 'History',
    }
  );
  return History;
};
