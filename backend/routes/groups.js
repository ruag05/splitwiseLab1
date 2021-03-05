const express = require('express');
const {
  createGroup,
  inviteMember,
  acceptInvite,
  leaveGroup,
  allUserIvites,
  getById,
} = require('../controllers/groups');
const { checkAuth } = require('../utils/auth');
const { uploadMiddleware } = require('../utils/upload');
const router = express.Router();

router.post(
  '/create',
  checkAuth,
  function (req, res, next) {
    try {
      uploadMiddleware([{ name: 'photo' }])(req, res, (err) => {
        if (err) {
          return res.status(400).json({ msg: err.message, errors: [] });
        }
        next();
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        msg: 'Server Error',
        errors: ['Something went wrong while uploading documents. Please try again...'],
      });
    }
  },
  createGroup
);
router.post('/invite', checkAuth, inviteMember);
router.post('/leave', checkAuth, leaveGroup);
router.post('/acceptInvite', checkAuth, acceptInvite);
router.get('/getInvites', checkAuth, allUserIvites);
router.get('/:id', checkAuth, getById);

module.exports = router;