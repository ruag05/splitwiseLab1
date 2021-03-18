const db = require('../models');
const { getCurrencySymbol } = require('../utils/currency');

exports.createGroup = async (req, res) => {
  try {
    console.log(req.user);
    const check = await db.Group.findOne({ where: { name: req.body.name } });
    if (check) {
      return res.status(400).json({ errors: ['Group name already taken'] });
    }
    req.body.photo = req.files?.photo[0]?.filename;
    const data = await db.Group.create({
      name: req.body.name,
      photo: req.body.photo,
      author: req.user.userId,
    });

    console.log('Testing' + req.user.userId);

    //add author to the group created
    const group = await db.Group.findOne({ where: { id: data.id } });
    await group.update({ members: [...group.members, data.author] });

    //add group as one of author's groups
    const user = await db.User.findOne({ where: { id: data.author } });

    console.log('User id is' + user.id);
    console.log('User groups is' + user.groups.length);

    console.log('req user id ' + req.user.userId);
    console.log('req group id ' + req.user.groupId);
    console.log(' group id ' + group.id);
    await user.update({ groups: [...user.groups, group.id] });

    return res.json({ msg: 'New group created', group: { id: data.id, photo: data.photo } });
  } catch (error) {
    let errors = [];
    if (error.error) {
      error.errors.map((e) => {
        console.log(e.message);
        errors.push(e.message);
      });
      return res.status(500).json({ errors });
    } else {
      return res.status(500).json({ errors: [error.message] });
    }
  }
};

exports.inviteMember = async (req, res) => {
  try {
    const user = await db.User.findOne({ where: { email: req.body.email } });
    if (!user) {
      return res.status(400).json({ errors: ['User not found!'] });
    }
    const group = await db.Group.findOne({ where: { name: req.body.name } });
    if (!group) {
      return res.status(400).json({ errors: ['Group not found!'] });
    }

    // check if invitation already exists
    const invite = await db.Invite.findOne({
      where: {
        userId: user.id,
        groupId: group.id,
      },
    });
    if (invite) {
      return res.status(400).json({ errors: ['Already invited the user to group!'] });
    }

    // check if user is already member of group
    if (group.members.includes(user.id)) {
      return res.status(400).json({ errors: ['Already member of the group!'] });
    }

    // add new invite
    await db.Invite.create({
      userId: user.id,
      groupId: group.id,
    });
    return res.json({ msg: 'Invite Sent!!' });
  } catch (error) {
    let errors = [];
    if (error.error) {
      error.errors.map((e) => {
        console.log(e.message);
        errors.push(e.message);
      });
      return res.status(500).json({ errors });
    } else {
      return res.status(500).json({ errors: [error.message] });
    }
  }
};

exports.acceptInvite = async (req, res) => {
  try {
    const invite = await db.Invite.findOne({
      where: {
        id: req.body.inviteId,
      },
    });
    if (!invite) {
      return res.status(400).json({ errors: ['Invitation not found'] });
    }
    const user = await db.User.findOne({ where: { id: invite.userId } });
    if (!user) {
      return res.status(400).json({ errors: ['User not found!'] });
    }
    const group = await db.Group.findOne({ where: { id: invite.groupId } });
    if (!group) {
      return res.status(400).json({ errors: ['Group not found!'] });
    }
    // check if already in group
    if (group.members.includes(req.body.userId)) {
      return res.status(400).json({ errors: ['Already accepted the invite!'] });
    }

    console.log(user.groups);
    console.log(group.members);

    await user.update({ groups: [...user.groups, group.id] });
    await group.update({ members: [...group.members, user.id] });
    await invite.destroy();
    return res.json({ msg: 'Invitation Accepted' });
  } catch (error) {
    let errors = [];
    if (error.error) {
      error.errors.map((e) => {
        console.log(e.message);
        errors.push(e.message);
      });
      return res.status(500).json({ errors });
    } else {
      return res.status(500).json({ errors: [error.message] });
    }
  }
};

exports.allUserIvites = async (req, res) => {
  try {
    const invites = await db.Invite.findAll({ where: { userId: req.user.userId } });
    return res.json({ invites });
  } catch (error) {
    return res.json({ errors: [error.message] });
  }
};

exports.getById = async (req, res) => {
  try {
    const g = await db.Group.findByPk(req.params.id);
    return res.json({ group: g });
  } catch (error) {
    return res.json({ errors: [error.message] });
  }
};

exports.leaveGroup = async (req, res) => {
  try {
    // TODO:: MAKE SURE TO CHECK FOR ANY DUE BALANCE BEFORE LEAVING THE GROUP
    const user = await db.User.findOne({ where: { id: req.user.userId } });
    if (!user) {
      return res.status(400).json({ errors: ['User not found!'] });
    }
    const group = await db.Group.findOne({ where: { id: req.body.groupId } });
    if (!group) {
      return res.status(400).json({ errors: ['Group not found!'] });
    }

    const ts = await db.Transaction.findAll({
      where: { borrowerId: req.user.userId, groupId: req.body.groupId, settled: false },
    });

    console.log(ts);

    if (ts.length > 0) {
      return res.status(400).json({
        errors: [
          'You have some unsettled transactions to be settle. Please do that before leaving the group',
        ],
      });
    }

    // console.log(user.groups.filter((g) => g.id == group.id));
    // console.log(group.members.filter((g) => g.id == user.id));
    await group.update({ members: [...group.members.filter((id) => id != user.id)] });
    await user.update({ groups: [...user.groups.filter((id) => id != group.id)] });
    return res.json({ msg: 'Group left' });
  } catch (error) {
    let errors = [];
    if (error.error) {
      error.errors.map((e) => {
        console.log(e.message);
        errors.push(e.message);
      });
      return res.status(500).json({ errors });
    } else {
      return res.status(500).json({ errors: [error.message] });
    }
  }
};

exports.addExpense = async (req, res) => {
  const exp = {
    amount: req.body.amount,
    title: req.body.title,
    author: req.user.userId,
    groupId: req.body.gid,
  };
  try {
    const user = await db.User.findOne({ where: { id: req.user.userId } });
    const g = await db.Group.findByPk(req.body.gid);
    let l = g.members.length < 1 ? 1 : g.members.length;
    exp.amount = (req.body.amount / l).toFixed(2);
    exp.currency = user.currency;
    g.members.map(async (mem) => {
      // if (mem == req.user.userId) {
      //   try {
      //     const u = await db.User.findByPk(mem);
      //     await db.Transaction.create({
      //       ...exp,
      //       borrowerId: mem,
      //       authorName: user.name,
      //       borrowerName: u.name,
      //     });
      //   } catch (error) {
      //     console.log(error);
      //     // return res.status(500).json({ errors: [error.message] });
      //   }
      // }
      try {
        const u = await db.User.findByPk(mem);
        await db.Transaction.create({
          ...exp,
          borrowerId: mem,
          authorName: user.name,
          borrowerName: u.name,
        });
      } catch (error) {
        console.log(error);
        // return res.status(500).json({ errors: [error.message] });
      }
    });
    await db.History.create({
      author: req.user.userId,
      authorName: user.name,
      groupName: g.name,
      groupId: req.body.gid,
      title: `${user.name} added "${req.body.title}" of ${getCurrencySymbol(user.currency)}${
        req.body.amount
      }.`,
      amount: req.body.amount,
    });
    res.json({ msg: 'Success' });
  } catch (error) {
    return res.status(500).json({ errors: [error.message] });
  }
};

exports.getTransByGId = async (req, res) => {
  try {
    const g = await db.Transaction.findAll({
      where: { groupId: req.params.gid, settled: false },
    });

    let to = new Map();
    let tb = new Map();
    let users = new Map();
    g.map((t) => {
      if (to.has(t.author)) {
        to.set(t.author, +to.get(t.author) + +t.amount);
      } else {
        users.set(t.author, { name: t.authorName, crr: t.currency });
        to.set(t.author, +t.amount);
      }
    });

    g.map((t) => {
      // console.log(t);
      if (tb.has(t.borrowerId)) {
        tb.set(t.borrowerId, (+tb.get(t.borrowerId) + +t.amount) * -1);
      } else {
        users.set(t.borrowerId, { name: t.borrowerName, crr: t.currency });
        tb.set(t.borrowerId, +t.amount * -1);
      }
    });

    let result = [];

    console.log('to: ' + Array.from(to).length, 'tb: ' + Array.from(tb).length);
    try {
      if (Array.from(to).length >= Array.from(tb).length) {
        to.forEach((val, key) => {
          if (tb.has(key)) {
            let sum = (+val + +tb.get(key)).toFixed(2);
            if (sum > 0) {
              result.push(
                `${users.get(key).name} gets back ${getCurrencySymbol(
                  users.get(key).crr
                )} ${sum}`
              );
            }
            if (sum < 0) {
              result.push(
                `${users.get(key).name} pays ${getCurrencySymbol(
                  users.get(key).crr
                )} ${Math.abs(sum)}`
              );
            }
          } else {
            let sum = (+val).toFixed(2);
            if (sum > 0) {
              result.push(
                `${users.get(key).name} gets back ${getCurrencySymbol(
                  users.get(key).crr
                )} ${sum}`
              );
            }
            if (sum < 0) {
              result.push(
                `${users.get(key).name} pays ${getCurrencySymbol(
                  users.get(key).crr
                )} ${Math.abs(sum)}`
              );
            }
          }
        });
      } else {
        tb.forEach((val, key) => {
          if (to.has(key)) {
            let sum = (+to.get(key) + +val).toFixed(2);
            if (sum > 0) {
              result.push(
                `${users.get(key).name} gets back ${getCurrencySymbol(
                  users.get(key).crr
                )} ${sum}`
              );
            }
            if (sum < 0) {
              result.push(
                `${users.get(key).name} pays ${getCurrencySymbol(
                  users.get(key).crr
                )} ${Math.abs(sum)}`
              );
            }
          } else {
            let sum = (+val).toFixed(2);
            if (sum > 0) {
              result.push(
                `${users.get(key)} gets back ${getCurrencySymbol(users.get(key).crr)} ${sum}`
              );
            }
            if (sum < 0) {
              result.push(
                `${users.get(key).name} pay ${getCurrencySymbol(
                  users.get(key).crr
                )} ${Math.abs(sum)}`
              );
            }
          }
        });
      }
    } catch (error) {
      console.log(error);
    }

    console.log(result);
    // console.log(users);
    // console.log('to: ', to);
    // console.log('tb: ', tb);

    const h = await db.History.findAll({ where: { groupId: req.params.gid } });
    return res.json({ trans: g, history: h.reverse(), result });
  } catch (error) {
    return res.json({ errors: [error.message] });
  }
};

exports.getStats = async (req, res) => {
  try {
    const authored = await db.Transaction.findAll({
      where: { author: req.user.userId, settled: false },
    });
    const borrowed = await db.Transaction.findAll({
      where: { borrowerId: req.user.userId, settled: false },
    });
    let totalOwened = 0;
    authored.map((a) => {
      totalOwened += parseInt(a.amount, 10);
    });
    let totalBorrowed = 0;
    borrowed.map((a) => {
      totalBorrowed += parseInt(a.amount, 10);
    });

    return res.json({ authored, borrowed, totalOwened, totalBorrowed });
  } catch (error) {
    console.log(error);
    return res.json({ errors: [error.message] });
  }
};

exports.getTuser = async (req, res) => {
  try {
    console.log("Hitting getTuser");
    const us = await db.Transaction.findAll({ where: { author: req.user.userId, settled: false } });
    // const us2 = await db.Transaction.findAll({
    //   where: { borrowerId: req.user.userId, settled: false },
    // });

    const authored = await db.Transaction.findAll({
      where: { author: req.user.userId, settled: false },
    });
    
    console.log("*********Authored*********");
    Object.entries(authored).map(author=>{
      console.log(author);
    });

    const borrowed = await db.Transaction.findAll({
      where: { borrowerId: req.user.userId, settled: false },
    });
    
    console.log("*********Borrowed*********");   
    Object.entries(borrowed).map(borrow=>{
      console.log(borrow);
    });
    return res.json({ 
      users: [...us, ...authored, ...borrowed]
    });
  } catch (error) {
    return res.json({ errors: [error.message] });
  }
};

exports.getAllGroupsName = async (req, res) => {
  try {
    const groups = await db.Group.findAll();
    res.json({ groups });
  } catch (error) {
    return res.json({ errors: [error.message] });
  }
};
