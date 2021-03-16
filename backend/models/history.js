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
      title: {
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
