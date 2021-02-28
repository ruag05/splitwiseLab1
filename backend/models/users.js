'use strict';

const {Model, DATE} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
        class User extends Model{}

        User.init({
            name:{
                type:DataTypes.STRING(100),
                allowNull:false,
            },
            email:{
                type:DataTypes.STRING(100),
                allowNull:false,
            },
            password:{
                type:DataTypes.STRING(100),
                allowNull:false,
            },
            phone:{
                type:DataTypes.STRING,
                //allowNUll is by default true
            },
            photo:{
                type:DataTypes.STRING,                
            },
            currency:{
                type:DataTypes.STRING,
                defaultValue:'USD',
            },
            language:{
                type:DataTypes.STRING, 
                defaultValue:'EN',           
            },
            timezone:{
                type:DataTypes.STRING,
            },
            groups:{
                type:DataTypes.TEXT,
                defaultValue:JSON.stringify([]),
                get:()=>{
                    return JSON.parse(this.getDataValue(groups));
                },
                set: (val)=>{
                    return this.setDataValue('groups', JSON.stringify(val));
                }
            }
        },
        {
            sequelize,
            modelName:'User',
        });
};