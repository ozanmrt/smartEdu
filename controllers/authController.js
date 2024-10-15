const User = require('../models/User');
const bcrypt = require('bcrypt');

exports.createUser = async (req, res) => {
  try {
    const user = await User.create(req.body);

    res.status(201).json({
      status: 'Success',
      user,
    });
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

        return res.status(200).redirect('/');
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

exports.logoutUser = async (req,res)=>{

  req.session.destroy(()=>{
    res.redirect('/');
  });
  

}