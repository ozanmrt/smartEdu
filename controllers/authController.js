const bcrypt = require('bcrypt');
const User = require('../models/User');
const Category = require('../models/Category');
const Course = require('../models/Course');


exports.createUser = async (req, res) => {
  try {
    const user = await User.create(req.body);
    res.status(201).redirect('/login');
  } catch (error) {
    res.status(400).json({
      status: 'Fail',
      error,
    });
  }
};

exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).send('kullanici yok');
    } else {
      const same = await bcrypt.compare(password, user.password);
      if (same) {
        // SESSİON
        req.session.userID = user._id;

        return res.status(200).redirect('/users/dashboard');
      } else {
        return res.status(400).send('Kullanıcı Adı veya Şifre Yanlış');
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
  const user = await User.findById({ _id: req.session.userID }).populate('courses');
  const categories = await Category.find();
  const courses = await Course.find({user: req.session.userID});

  res.status(200).render('dashboard', {
    page_name: 'dashboard',
    user,
    categories,
    courses
  });
};
