const express = require('express');
const { createUser, loginUser, logoutUser, getDashboardPage } = require('../controllers/authController');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

router.route('/signup').post(createUser);
router.route('/login').post(loginUser);
router.route('/logout').get(logoutUser);
router.route('/dashboard').get(authMiddleware,getDashboardPage);

module.exports = router;
