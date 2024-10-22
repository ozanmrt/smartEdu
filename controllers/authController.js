const bcrypt = require('bcrypt');
const User = require('../models/User');
const Category = require('../models/Category');
const Course = require('../models/Course');
const { validationResult } = require('express-validator');

exports.createUser = async (req, res) => {
  try {
    const user = await User.create(req.body);
    res.status(201).redirect('/login');
  } catch (error) {
    const errors = validationResult(req);
    for (let i = 0; i < errors.array().length; i++) {
      req.flash('error', ` ${errors.array()[i].msg}`);
    }
    res.status(404).redirect('/register');
  }
};

exports.deleteUser = async (req, res) => {
  try {

    const deletedCourses = await Course.find({ user: req.params.id });


    await User.findByIdAndDelete(req.params.id);
    await Course.deleteMany({user: req.params.id});
    
    const deletedCourseIds = deletedCourses.map(course => course._id);
    
    await User.updateMany(
      { courses: { $in: deletedCourseIds } }, // Silinen kursları içeren kullanıcıları bul
      { $pull: { courses: { $in: deletedCourseIds } } } // Silinen kursları courses array'inden çıkar
    );

    res.status(200).redirect('/users/dashboard');

  } catch (error) {
    res.status(400).json({
      status: 'fail',
      error,
    });
  }
};

exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      req.flash('error', 'User is not found!');
      return res.status(400).redirect('/login');
    } else {
      const same = await bcrypt.compare(password, user.password);
      if (same) {
        // SESSİON
        req.session.userID = user._id;

        return res.status(200).redirect('/users/dashboard');
      } else {
        req.flash('error', 'Your password is not correct!');
        return res.status(400).redirect('/login');
      }
    }

    /*res.status(201).json({
      status: 'Success',
      user,
    });*/
  } catch (error) {
    res.status(400).json({
      status: 'Fail',
      error,
    });
  }
};

exports.logoutUser = async (req, res) => {
  req.session.destroy(() => {
    res.redirect('/');
  });
};

exports.getDashboardPage = async (req, res) => {
  const user = await User.findById({ _id: req.session.userID }).populate(
    'courses'
  );
  const categories = await Category.find();
  const courses = await Course.find({ user: req.session.userID });
  const users = await User.find();

  res.status(200).render('dashboard', {
    page_name: 'dashboard',
    user,
    categories,
    courses,
    users
  });
};
