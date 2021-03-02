const express = require('express');
const {
    register,
    login,
    autoLogin,
    getById,
} = require('../controllers/users');
const { checkAuth } = require('../utils/auth');
const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/autoLogin', checkAuth, autoLogin);
router.post('/logout', (req, res) => {
    res.clearCookie('authtkn');
    res.json({ message: 'Logged Out' });
});
router.get('/', checkAuth, getById);

module.exports = router;