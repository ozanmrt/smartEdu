const express = require('express');
const { createCourse, getAllCourses, getCourse, enrollCourse } = require('../controllers/courseController');
const roleMiddleware = require('../middlewares/roleMiddleware');

const router = express.Router();

router.route('/').post(roleMiddleware(["teacher","admin"]),createCourse);
router.route('/').get(getAllCourses);
router.route('/:slug').get(getCourse);
router.route('/enroll').post(enrollCourse);

module.exports = router;
