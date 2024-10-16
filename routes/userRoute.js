const express = require('express');
const { createUser, loginUser, logoutUser, getDashboardPage } = require('../controllers/authController');

const router = express.Router();

router.route('/signup').post(createUser);
router.route('/login').post(loginUser);
router.route('/logout').get(logoutUser);
router.route('/dashboard').get(getDashboardPage);

module.exports = router;
