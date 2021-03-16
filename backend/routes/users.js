const express = require('express');
const {
  register,
  login,
  autoLogin,
  updateProfilePic,
  updateProfile,
  getById,
  getPic,
  getAllEmails,
  getAllGroups,
  settle,
  getAllHistory,
} = require('../controllers/users');
const { checkAuth } = require('../utils/auth');
const { uploadMiddleware } = require('../utils/upload');
const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/autoLogin', checkAuth, autoLogin);
router.post(
  '/updateProfilePic',
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
  updateProfilePic
);
router.post('/update', checkAuth, updateProfile);
router.post('/logout', (req, res) => {
  res.clearCookie('authtkn');
  res.json({ message: 'Logged Out' });
});

router.post('/settle', checkAuth, settle);

router.get('/', checkAuth, getById);
router.get('/getPic', checkAuth, getPic);
router.get('/getAllHistory', checkAuth, getAllHistory);
router.get('/getGroups', checkAuth, getAllGroups);
router.get('/getEmails', checkAuth, getAllEmails);

module.exports = router;
