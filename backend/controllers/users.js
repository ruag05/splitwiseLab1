const Validator = require('fastest-validator');
const bcrypt = require('bcryptjs');
const db = require('../models');
const jwt = require('jsonwebtoken');
const { v4: uuid } = require('uuid');

const salt = bcrypt.genSaltSync(10);

const v = new Validator();

const registerSchema = {
  name: { type: 'string', nullable: false },
  email: { type: 'email', nullable: false },
  password: { type: 'string', min: 6, nullable: false },
  cpassword: { type: 'equal', field: 'password' },
};

const registerCheck = v.compile(registerSchema);

exports.register = async (req, res) => {
    const errors = registerCheck(req.body);
    console.log("registerCheck returned" + errors);
    if (errors.length) {
      res.status(400).json({ msg: 'Validation errors', errors });
    } else {
      try {
        const result = await db.User.findOne({
          where: { email: req.body.email },
        });
        console.log(result);
        if (result) {
          return res.status(400).json({ msg: 'Email already exists.' });
        }
        req.body.password = bcrypt.hashSync(req.body.password, salt);
        req.body.emailToken = uuid();
        await db.User.create(req.body);
  
        res.status(201).json({
          msg: 'User created successfully.',
        });
      } catch (error) {
        res.status(400).json({ msg: error.message });
      }
    }
  };