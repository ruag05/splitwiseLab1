"use strict";
const Sequelize = require('sequelize');
const db = require('./index.js');
const { Model } = require('sequelize');

// const User = require('./users')(sequelize, Sequelize.DataTypes);
// const Group = require('./groups')(sequelize, Sequelize.DataTypes);
module.exports = (sequelize, DataTypes) => {
    class Debt extends Model {
        static associate(models) {
        }
    }
    Debt.init(
        {
            id: {
                type: Sequelize.BIGINT,
                autoIncrement: true,
                allowNull: false,
                primaryKey: true,
            },
            amount: {
                type: Sequelize.DOUBLE,
                allowNull: false,
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
            userId1: {
                type: Sequelize.BIGINT,

                allowNull: false,

            },
            userId2: {
                type: Sequelize.BIGINT,

                allowNull: false,

            },
            groupId: {
                type: Sequelize.BIGINT,
                allowNull: false,

            },
        },
        {
            sequelize,
            modelName: 'Debt',
        });


    // Debt paid by(amount) user fk (User with smaller ID)
    // Debt.belongsTo(db.User, { foreignKey: "userId1" });
    // // Debt paid to(amount) user fk (User with bigger ID)
    // Debt.belongsTo(db.User, { foreignKey: "userId2" });
    // Debt recored in a group fk
    // Debt.belongsTo(db.Group, { foreignKey: "groupId" });

    return Debt;
};
