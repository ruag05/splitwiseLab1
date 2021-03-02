'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Group extends Model {
    static associate(models) {
    }
  }
  Group.init(
    {
      author: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      photo: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      members: {
        type: DataTypes.STRING,
        defaultValue: JSON.stringify([]),
        get: function () {
          return JSON.parse(this.getDataValue('members'));
        },
        set: function (val) {
          return this.setDataValue('members', JSON.stringify(val));
        },
      },
    },
    {
      sequelize,
      modelName: 'Group',
    }
  );
  return Group;
};
