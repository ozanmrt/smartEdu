const Category = require('../models/Category');
const Course = require('../models/Course');
const User = require('../models/User');

exports.createCourse = async (req, res) => {
  try {
    const course = await Course.create({
      ...req.body,
      user: userIN,
    });

    res.status(201).redirect('/courses');
  } catch (error) {
    res.status(400).json({
      status: 'Fail',
      error,
    });
  }
};

exports.getAllCourses = async (req, res) => {
  try {
    const categorySlug = req.query.categories;
    let filter = {};
    if (categorySlug) {
      const category = await Category.findOne({ slug: categorySlug });
      if (category) {
        filter = { category: category._id };
      }
    }

    const courses = await Course.find(filter).sort('-createdAt');
    const categories = await Category.find();

    res
      .status(200)
      .render('courses', { courses, categories, page_name: 'courses' });
  } catch (error) {
    res.status(400).json({
      status: 'Fail',
      error,
    });
  }
};

exports.getCourse = async (req, res) => {
  try {
    const user = await User.findById(req.session.userID);
    const course = await Course.findOne({ slug: req.params.slug }).populate(
      'user'
    );

    res.status(200).render('course', { course, page_name: 'courses', user });
  } catch (error) {
    res.status(400).json({
      status: 'Fail',
      error,
    });
  }
};

exports.enrollCourse = async (req, res) => {
  try {
    const user = await User.findById(userIN);
    const courseId = req.body.course_id;

    if (user.courses.includes(courseId)) {
      return res.status(400).json({
        status: 'fail',
        message: 'You are already enrolled in this course',
      });
    }
    await user.courses.push(courseId);
    await user.save();

    res.status(200).redirect('/users/dashboard');
  } catch (error) {
    res.status(400).json({
      status: 'Fail',
      error,
    });
  }
};

exports.releaseCourse = async (req, res) => {
  try {
    const user = await User.findById(userIN);
    const courseId = req.body.course_id;

    if (user.courses.includes(courseId)) {
      await user.courses.pull(courseId);
      await user.save();
    }

    res.status(200).redirect('/users/dashboard');
  } catch (error) {
    res.status(400).json({
      status: 'Fail',
      error,
    });
  }
};
