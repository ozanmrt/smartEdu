const express = require('express');
const { createCourse, getAllCourses, getCourse } = require('../controllers/courseController');
const roleMiddleware = require('../middlewares/roleMiddleware');

const router = express.Router();

router.route('/').post(roleMiddleware(["teacher","admin"]),createCourse);
router.route('/').get(getAllCourses);
router.route('/:slug').get(getCourse);

module.exports = router;
