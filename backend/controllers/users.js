const Validator = require('fastest-validator');
const bcrypt = require('bcryptjs');
const db = require('../models');
const jwt = require('jsonwebtoken');
const { v4: uuid } = require('uuid');
const { Op } = require('sequelize');
Op;

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
    return res.status(401).json({ msg: 'Account Not Found' });
  }

  if (bcrypt.compareSync(req.body.password, result.password)) {
    const token = jwt.sign(
      { userId: result.id, email: result.email },
      `${process.env.JWT_SECRET}`,
      {
        expiresIn: '2h',
      }
    );

    res.cookie('authtkn', token, {
      maxAge: 1000 * 60 * 60 * 12,
      httpOnly: true,
    });

    res.status(200).json({
      msg: 'Logged in successfully',
      userId: result.id,
    });
  } else {
    return res.status(403).json({ msg: 'Invalid Credentials Entered' });
  }
};

exports.register = async (req, res) => {
  const errors = registerCheck(req.body);
  if (errors.length) {
    res.status(400).json({ msg: 'Validation errors', errors });
  } else {
    try {
      const result = await db.User.findOne({
        where: { email: req.body.email },
      });

      console.log('user exists ', result);

      if (result) {
        return res.status(400).json({ msg: 'Email already exists.' });
      }
      req.body.password = bcrypt.hashSync(req.body.password, salt);
      req.body.emailToken = uuid();
      const checkCreateUser = await db.User.create(req.body);
      const token = jwt.sign(
        { userId: checkCreateUser.id, email: checkCreateUser.email },
        `${process.env.JWT_SECRET}`,
        {
          expiresIn: '2h',
        }
      );

      res.cookie('authtkn', token, {
        maxAge: 1000 * 60 * 60 * 12,
        httpOnly: true,
      });

      res.status(200).json({
        msg: 'Logged in successfully',
        userId: checkCreateUser.id,
      });
    } catch (error) {
      console.log(error);
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
    console.log('__ req.user.userId __ ' + req.user.userId);
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

exports.settle = async (req, res) => {
  try {
    await db.Transaction.update(
      { settled: true },
      { where: { author: req.user.userId, borrowerId: req.body.borrowerId } }
    );
    const ts = await db.Transaction.findAll({
      where: { author: req.user.userId, borrowerId: req.body.borrowerId },
    });
    // console.log(ts);
    // return;
    if (ts) {
      ts.forEach(async (t) => {
        await db.History.create({
          author: t.author,
          groupId: t.groupId,
          title: `User-${t.borrowerId} settled amount of ${t.amount} with User-${t.author}`,
          amount: t.amount,
        });
      });
    }

    return res.json({ msg: 'Settled' });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: error.message });
  }
};

exports.getAllHistory = async (req, res) => {
  try {
    const user = await db.User.findByPk(req.user.userId);
    // let byGrps = [];
    console.log('----------------');
    // user.groups.forEach(async (g) => {
    //   db.History.findAll({ where: { groupId: g } }).then((h) => {
    //     h.map((hh) => byGrps.push(hh));
    //   });
    // });
    const byGrps = await db.History.findAll({
      where: {
        [Op.or]: [...user.groups.map((gid) => ({ groupId: gid }))],
      },
    });
    res.json({ history: byGrps, gids: user.groups });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: error.message });
  }
};
