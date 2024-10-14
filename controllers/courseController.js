const Category = require('../models/Category');
const Course = require('../models/Course');

exports.createCourse = async (req, res) => {
  try {
    const course = await Course.create(req.body);
    res.status(201).json({
      status: 'Success',
      course,
    });
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

    const courses = await Course.find(filter);
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
    const course = await Course.findOne({ slug: req.params.slug });

    res.status(200).render('course', { course, page_name: 'courses' });
  } catch (error) {
    res.status(400).json({
      status: 'Fail',
      error,
    });
  }
};
