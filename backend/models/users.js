'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
    }
  }
  User.init(
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      phone: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      photo: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      currency: {
        type: DataTypes.STRING,
        defaultValue: 'USD',
      },
      timezone: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: '',
      },
      language: {
        type: DataTypes.STRING,
        defaultValue: 'EN',
      },
      groups: {
        type: DataTypes.TEXT,
        defaultValue: JSON.stringify([]),
        get: function () {
          return JSON.parse(this.getDataValue('groups'));
        },
        set: function (val) {
          return this.setDataValue('groups', JSON.stringify(val));
        },
      },
    },
    {
      sequelize,
      modelName: 'User',
    }
  );
  return User;
};
