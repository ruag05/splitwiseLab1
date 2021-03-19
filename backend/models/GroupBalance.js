"use strict";
const Sequelize = require('sequelize');
const db = require('./index.js');
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class GroupBalance extends Model {
        static associate(models) {
        }
    }
    GroupBalance.init(
        {
            id: {
                type: Sequelize.BIGINT,
                autoIncrement: true,
                allowNull: false,
                primaryKey: true,
            },
            balance: {
                type: Sequelize.DOUBLE,
                allowNull: false,
                defaultValue: 0,
            },
            createdAt: {
                type: Sequelize.DATE,
                allowNull: true,
                defaultValue: Sequelize.fn("now"),
            },
            updatedAt: {
                type: Sequelize.DATE,
                allowNull: true,
                defaultValue: Sequelize.fn("now"),
            },
            groupId: {
                type: Sequelize.BIGINT,
                allowNull:true,
            },
            userId: {
                type: Sequelize.BIGINT,
                allowNull:true,
            },
        },
        {
            sequelize,
            modelName: 'GroupBalance',
        });
    return GroupBalance;
};
