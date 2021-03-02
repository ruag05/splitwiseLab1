const db = require('../models');

exports.createGroup = async (req, res) => {
  try {
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
    return res.json({ msg: 'New group created', group: { id: data.id, photo: data.photo } });
  } catch (error) {
    // console.log(error);
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
    const user = await db.User.findOne({ where: { id: req.body.userId } });
    if (!user) {
      return res.status(400).json({ errors: ['User not found!'] });
    }
    const group = await db.Group.findOne({ where: { id: req.body.groupId } });
    if (!group) {
      return res.status(400).json({ errors: ['Group not found!'] });
    }

    console.log(user.groups.filter((g) => g.id == group.id));
    console.log(group.members.filter((g) => g.id == user.id));
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
