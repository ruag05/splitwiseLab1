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

exports.login = async (req, res) => {
  const result = await db.User.findOne({ where: { email: req.body.email } });

  if (!result) {
    return res.status(401).json({ msg: 'User not found' });
  }

  if (bcrypt.compareSync(req.body.password, result.password)) {
    const token = jwt.sign({ userId: result.id, email: result.email }, `${process.env.JWT_SECRET}`, {
      expiresIn: '2h',
    });

    res.cookie('authtkn', token, {
      maxAge: 1000 * 60 * 60 * 12,
      httpOnly: true,
    });

    res.status(200).json({
      msg: 'Logged in successfully',
      userId: result.id
    });
  } else {
    return res.status(403).json({ msg: 'Invalid credentials' });
  }
};

exports.register = async (req, res) => {
  console.log("______Registeration started______");
  const errors = registerCheck(req.body);
  if (errors.length) {
    console.log("______Registration->validation error______");
    res.status(400).json({ msg: 'Validation errors', errors });
  } else {
    console.log("______Registration->validation successful______");
    try {
      const result = await db.User.findOne({
        where: { email: req.body.email },
      }).then(() => { });

      console.log("______Inside db.User.findOne then______");
      if (result) {
        console.log("______Email already exists______");
        return res.status(400).json({ msg: 'Email already exists.' });
      }
      console.log("______User Creating______");
      req.body.password = bcrypt.hashSync(req.body.password, salt);
      req.body.emailToken = uuid();
      const checkCreateUser = db.User.create(req.body);
      console.log("______User Created Successfully______");
      res.status(201).json({
        msg: 'User created successfully.',
      });
    } catch (error) {
      res.status(400).json({ msg: error.message });
    }
  }
};

exports.autoLogin = (req, res) => {
  if (req.user) {
    res.json({ loggedIn: true, role: req.user.role });
  } else {
    res.json({ loggedIn: false, role: '' });
  }
};

exports.updateProfilePic = async (req, res) => {
  try {
    req.body.photo = req.files?.photo[0]?.filename;
    const user = await db.User.findOne({ where: { id: req.user.userId } });
    await user.update({ photo: req.body.photo });
    return res.json({ msg: 'Updated Profile picture', photo: req.body.photo });
  } catch (error) {
    console.log(error.message);
    res.status(400).json({ msg: error.message });
  }
};

exports.updateProfile = async (req, res) => {
  console.log(req.body);
  try {
    const user = await db.User.findByPk(req.user.userId);
    await user.update(
      {
        name: req.body.name,
        phone: req.body.phone,
        currency: req.body.currency,
        timezone: req.body.timezone,
        language: req.body.language,
      },
      { where: { id: req.user.userId } }
    );

    res.json({ user: { ...user.dataValues, password: '' } });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: error.message });
  }
};

exports.getById = async (req, res) => {
  try {
    const user = await db.User.findByPk(req.user.userId);
    return res.json({ ...user, password: '' });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: error.message });
  }
};

exports.getPic = async (req, res) => {
  try {
    const user = await db.User.findByPk(req.user.userId);
    return res.json({ photo: user.photo });
    // return res.sensdFile(process.cwd() + '/uploads' + user.photo);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: error.message });
  }
};

exports.getAllEmails = async (req, res) => {
  try {
    const users = await db.User.findAll();
    const emails = [];
    users.forEach((element) => {
      if (element.id != req.user.userId) emails.push(element.email);
    });
    return res.json({ emails });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: error.message });
  }
};

exports.getAllGroups = async (req, res) => {
  try {
    const user = await db.User.findByPk(req.user.userId);
    // users.forEach((element) => {
    //   if (element.id != req.user.userId) emails.push(element.email);
    // });
    return res.json({ groups: user.groups });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: error.message });
  }
};
