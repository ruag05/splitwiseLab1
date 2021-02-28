'use strict';

const { Model, DATE } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class Group extends Model { }

    Group.init({
        author: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
        members: {
            type: DataTypes.STRING,
            defaultValue: JSON.stringify([]),
            get: () => {
                //we need the values in JS object form
                return JSON.parse(this.getDataValue('members'));
            },
            set: (val) => {
                //we need to set value in form of string, so convert object to string
                return this.setDataValue('members', JSON.stringify(val));
            },
        },
        photo: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    }, {
        sequelize,
        modelname: 'Group',
    });
    return Group;
}